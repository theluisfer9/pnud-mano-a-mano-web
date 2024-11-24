import { Bulletin } from "@/data/bulletins";
import { LifeStory } from "@/data/lifestories";
import { News } from "@/data/news";
import { PressRelease } from "@/data/pressrelease";
import bcrypt from "bcryptjs";
import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = "http://52.42.202.42:5000";
if (!API_KEY) {
  throw new Error("SECRET_KEY is not defined");
}
export const getNews = async () => {
  try {
    const response = await axios.get(`${API_URL}/getNews`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Access-Control-Allow-Origin": "*",
      },
    });
    const { success, message, data } = response.data;
    if (!success) {
      console.error(message);
      return [];
    }
    const newsData: News[] = data.map((news: any) => ({
      id: news.id,
      area: news.area || "",
      date: news.date || "",
      title: news.title || "",
      subtitle: news.subtitle || "",
      mainImage: news.mainimage || "",
      mainBody: news.mainbody || "",
      additionalSections: JSON.parse(
        news.additionalsections?.toString() || "[]"
      ),
      tags: JSON.parse(news.tags?.toString() || "[]"),
      externalLinks: JSON.parse(news.externallinks?.toString() || "[]"),
      state: "published",
    }));
    return newsData;
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
};

export const addNews = async (news: News) => {
  try {
    const normalizedNews = Object.fromEntries(
      Object.entries({
        ...news,
        additionalSections: JSON.stringify(news.additionalSections),
        tags: JSON.stringify(news.tags),
        externalLinks: JSON.stringify(news.externalLinks),
      }).map(([key, value]) => [key.toLowerCase(), value])
    );
    const { id, ...rest } = normalizedNews;
    console.log(rest);
    const response = await axios.post(
      `${API_URL}/addNews`,
      { news: rest },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
    const { success, message } = response.data;
    if (!success) {
      console.error(message);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error adding news:", error);
    return false;
  }
};

export const getLifeStories = async () => {
  try {
    const response = await axios.get(`${API_URL}/getLifeStories`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Access-Control-Allow-Origin": "*",
      },
    });
    const { success, message, data } = response.data;
    if (!success) {
      console.error(message);
      return [];
    }
    const lifeStoriesData: LifeStory[] = data.map((lifeStory: any) => ({
      id: lifeStory.id,
      title: lifeStory.title,
      date: lifeStory.date,
      program: lifeStory.program,
      videoUrl: lifeStory.videourl,
      body: lifeStory.body,
      headerImage: lifeStory.headerimage,
      additionalImages: JSON.parse(lifeStory.additionalimages || "[]"),
      firstAdditionalBody: lifeStory.firstadditionalbody,
      secondAdditionalBody: lifeStory.secondadditionalbody,
    }));
    return lifeStoriesData;
  } catch (error) {
    console.error("Error fetching life stories:", error);
    return [];
  }
};
export const addLifeStories = async (lifeStory: LifeStory) => {
  try {
    const normalizedLifeStory = Object.fromEntries(
      Object.entries({
        ...lifeStory,
        additionalImages: JSON.stringify(lifeStory.additionalImages),
      }).map(([key, value]) => [key.toLowerCase(), value])
    );
    const { id, ...rest } = normalizedLifeStory;
    const response = await axios.post(
      `${API_URL}/addLifeStories`,
      { lifeStory: rest },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
    const { success, message } = response.data;
    if (!success) {
      console.error(message);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error adding life stories:", error);
    return false;
  }
};
export const getPressReleases = async () => {
  try {
    const response = await axios.get(`${API_URL}/getPressReleases`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Access-Control-Allow-Origin": "*",
      },
    });
    const { success, message, data } = response.data;
    if (!success) {
      console.error(message);
      return [];
    }
    const pressReleasesData: PressRelease[] = data.map((pressRelease: any) => ({
      id: pressRelease.id,
      body: pressRelease.body,
      category: pressRelease.category,
      date: pressRelease.date,
      title: pressRelease.title,
      pdfSource: pressRelease.pdfsource,
    }));
    return pressReleasesData;
  } catch (error) {
    console.error("Error fetching press releases:", error);
    return [];
  }
};
export const addPressReleases = async (pressRelease: PressRelease) => {
  try {
    const normalizedPressRelease = Object.fromEntries(
      Object.entries({
        ...pressRelease,
      }).map(([key, value]) => [key.toLowerCase(), value])
    );
    const { id, ...rest } = normalizedPressRelease;
    const response = await axios.post(
      `${API_URL}/addPressReleases`,
      { pressRelease: rest },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
    const { success, message } = response.data;
    if (!success) {
      console.error(message);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error adding press releases:", error);
    return false;
  }
};
export const getBulletins = async () => {
  try {
    const response = await axios.get(`${API_URL}/getBulletins`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Access-Control-Allow-Origin": "*",
      },
    });
    const { success, message, data } = response.data;
    if (!success) {
      console.error(message);
      return [];
    }
    const bulletinsData: Bulletin[] = data.map((bulletin: any) => ({
      id: bulletin.id,
      body: bulletin.body,
      date: bulletin.date,
      title: bulletin.title,
      firstAdditionalBody: bulletin.firstadditionalbody,
      mainSecondaryImage: bulletin.mainsecondaryimage,
      secondAdditionalBody: bulletin.secondadditionalbody,
      additionalImages: JSON.parse(bulletin.additionalimages || "[]"),
      thirdAdditionalBody: bulletin.thirdadditionalbody,
      tags: JSON.parse(bulletin.tags?.toString() || "[]"),
      topics: JSON.parse(bulletin.topics?.toString() || "[]"),
    }));
    return bulletinsData;
  } catch (error) {
    console.error("Error fetching bulletins:", error);
    return [];
  }
};
export const addBulletins = async (bulletin: Bulletin) => {
  try {
    const normalizedBulletin = Object.fromEntries(
      Object.entries({
        ...bulletin,
        additionalImages: JSON.stringify(bulletin.additionalImages),
        tags: JSON.stringify(bulletin.tags),
        topics: JSON.stringify(bulletin.topics),
      }).map(([key, value]) => [key.toLowerCase(), value])
    );
    const { id, ...rest } = normalizedBulletin;
    const response = await axios.post(
      `${API_URL}/addBulletins`,
      { bulletin: rest },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
    const { success, message } = response.data;
    if (!success) {
      console.error(message);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error adding bulletins:", error);
    return false;
  }
};
export const login = async (dpi: string, password: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/findUserByDpi`,
      { dpi },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
    const { success, message, data } = response.data;
    if (!success) {
      console.error(message);
      return null;
    }
    if (data) {
      const isMatch = await bcrypt.compare(password, data.password);
      if (isMatch) {
        return {
          name: data.name,
          role: data.role,
          pictureUrl: data.profile_picture,
        };
      }
    }
    return null;
  } catch (error) {
    console.error("Error logging in:", error);
    return null;
  }
};
