import { News } from "@/data/news";
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
