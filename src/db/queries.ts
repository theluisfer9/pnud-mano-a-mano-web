import { Bulletin } from "@/data/bulletins";
import { LifeStory } from "@/data/lifestories";
import { News } from "@/data/news";
import { PressRelease } from "@/data/pressrelease";
import { Database } from "@/utils/supabasetypes";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export const getNews = async () => {
  const { data, error } = await supabase
    .from("noticias")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching news:", error);
    return [];
  }
  if (data.length > 0) {
    const newsData: News[] = data.map((news) => ({
      id: news.id,
      area: news.area || "",
      date: news.date || "",
      title: news.title || "",
      subtitle: news.subtitle || "",
      mainImage: news.mainImage || "",
      mainBody: news.mainBody || "",
      additionalSections: JSON.parse(
        news.additionalSections?.toString() || "[]"
      ),
      tags: JSON.parse(news.tags?.toString() || "[]"),
      externalLinks: JSON.parse(news.externalLinks?.toString() || "[]"),
      state: "published",
    }));
    return newsData;
  }
  console.log("No news found");
  return [];
};

export const getNewsById = async (id: number) => {
  const { data, error } = await supabase
    .from("noticias")
    .select("*")
    .eq("id", id);
  if (!data) {
    console.error("No news found");
    return null;
  }
  /* const news: News = {
    id: data[0].id,
    area: data[0].area || "",
    date: data[0].date || "",
    title: data[0].title || "",
    subtitle: data[0].subtitle || "",
    mainImage: data[0].mainImage || "",
    mainBody: data[0].mainBody || "",
    additionalSections: JSON.parse(
      data[0].additionalSections?.toString() || "[]"
    ),
    tags: JSON.parse(data[0].tags?.toString() || "[]"),
    externalLinks: JSON.parse(data[0].externalLinks?.toString() || "[]"),
    state: "published",
  }; */
  if (error) {
    console.error("Error fetching news by id:", error);
    return null;
  }
  return data;
};

export const addNews = async (news: News) => {
  const { error } = await supabase.from("noticias").insert({
    area: news.area,
    date: news.date,
    title: news.title,
    subtitle: news.subtitle,
    mainImage: news.mainImage,
    mainBody: news.mainBody,
    additionalSections: JSON.stringify(news.additionalSections),
    tags: JSON.stringify(news.tags),
    externalLinks: JSON.stringify(news.externalLinks),
    state: "published",
  });
  if (error) {
    console.error("Error adding news:", error);
    return false;
  }
  return true;
};

export const getLifeStories = async () => {
  const { data, error } = await supabase.from("historias_de_vida").select("*");
  if (error) {
    console.error("Error fetching life stories:", error);
    return [];
  }
  if (!data) {
    console.error("No life stories found");
    return [];
  }
  return data;
};
export const addLifeStories = async (lifeStory: LifeStory) => {
  const { error } = await supabase.from("historias_de_vida").insert({
    additionalImages: JSON.stringify(lifeStory.additionalImages),
    body: lifeStory.body,
    firstAdditionalBody: lifeStory.firstAdditionalBody,
    headerImage: lifeStory.headerImage,
    secondAdditionalBody: lifeStory.secondAdditionalBody,
    title: lifeStory.title,
    videoUrl: lifeStory.videoUrl,
    date: lifeStory.date,
    program: lifeStory.program,
  });
  if (error) {
    console.error("Error adding life stories:", error);
    return false;
  }
  return true;
};
export const getPressReleases = async () => {
  const { data, error } = await supabase
    .from("comunicados_de_prensa")
    .select("*");
  if (error) {
    console.error("Error fetching press releases:", error);
    return [];
  }
  if (!data) {
    console.error("No press releases found");
    return [];
  }
  return data;
};
export const addPressReleases = async (pressRelease: PressRelease) => {
  const { error } = await supabase.from("comunicados_de_prensa").insert({
    body: pressRelease.body,
    category: pressRelease.category,
    date: pressRelease.date,
    title: pressRelease.title,
    pdfSource: pressRelease.pdfSource,
  });
  if (error) {
    console.error("Error adding press releases:", error);
    return false;
  }
  return true;
};
export const getBulletins = async () => {
  const { data, error } = await supabase.from("bulletins").select("*");
  if (error) {
    console.error("Error fetching bulletins:", error);
    return [];
  }
  if (!data) {
    console.error("No bulletins found");
    return [];
  }
  return data;
};
export const addBulletins = async (bulletin: Bulletin) => {
  const { error } = await supabase.from("bulletins").insert({
    additionalImages: JSON.stringify(bulletin.additionalImages),
    body: bulletin.body,
    date: bulletin.date,
    title: bulletin.title,
    firstAdditionalBody: bulletin.firstAdditionalBody,
    mainSecondaryImage: bulletin.mainSecondaryImage,
    secondAdditionalBody: bulletin.secondAdditionalBody,
    thirdAdditionalBody: bulletin.thirdAdditionalBody,
    tags: JSON.stringify(bulletin.tags),
    topics: JSON.stringify(bulletin.topics),
  });
  if (error) {
    console.error("Error adding bulletins:", error);
    return false;
  }
  return true;
};
export const login = async (dpi: string, password: string) => {
  const { data, error } = await supabase
    .from("web_user")
    .select("password, name, profile_picture, role")
    .eq("dpi", dpi);
  if (error) {
    return null;
  }
  if (data.length > 0) {
    if (data[0].password) {
      const isMatch = await bcrypt.compare(password, data[0].password);
      if (isMatch) {
        return data[0];
      }
    }
    return null;
  }
  return null;
};

export default supabase;
