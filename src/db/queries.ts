import { Bulletin } from "@/data/bulletins";
import { LifeStory } from "@/data/lifestories";
import { News } from "@/data/news";
import { PressRelease } from "@/data/pressrelease";
import { User } from "@/data/users";
import bcrypt from "bcryptjs";
import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;
const ENV = import.meta.env.VITE_ENV;
const API_URL =
  ENV === "DEV"
    ? "http://64.23.148.189:5000"
    : "https://manoamano.mides.gob.gt/api";
if (!API_KEY) {
  throw new Error("SECRET_KEY is not defined");
}

export const getNews = async () => {
  try {
    const response = await axios.get(`${API_URL}/getNews`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
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
      timesedited: news.timesedited == null ? -1 : news.timesedited,
      publisherid: news.publisherid == null ? -1 : news.publisherid,
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
    const response = await axios.post(
      `${API_URL}/addNews`,
      { news: rest },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
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

export const updateNews = async (news: News) => {
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
    const response = await axios.post(
      `${API_URL}/updateNews`,
      { news_id: id, updates: rest },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
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
    console.error("Error updating news:", error);
    return false;
  }
};

export const deleteNews = async (id: number) => {
  try {
    const response = await axios.post(
      `${API_URL}/deleteNews`,
      { news_id: [id] },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
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
    console.error("Error deleting news:", error);
    return false;
  }
};
export const getLifeStories = async () => {
  try {
    const response = await axios.get(`${API_URL}/getLifeStories`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
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
      additionalImages: lifeStory.additionalimages
        ? JSON.parse(lifeStory.additionalimages.replace(/\\/g, ""))
        : [],
      firstAdditionalBody: lifeStory.firstadditionalbody,
      secondAdditionalBody: lifeStory.secondadditionalbody,
      timesedited: lifeStory.timesedited == null ? -1 : lifeStory.timesedited,
      publisherid: lifeStory.publisherid == null ? -1 : lifeStory.publisherid,
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
      { lifestory: rest },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
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
export const updateLifeStories = async (lifeStory: LifeStory) => {
  try {
    const normalizedLifeStory = Object.fromEntries(
      Object.entries({
        ...lifeStory,
        additionalImages: JSON.stringify(lifeStory.additionalImages),
      }).map(([key, value]) => [key.toLowerCase(), value])
    );
    const { id, ...rest } = normalizedLifeStory;
    const response = await axios.post(
      `${API_URL}/updateLifeStories`,
      { lifestories_id: id, updates: rest },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
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
    console.error("Error updating life stories:", error);
    return false;
  }
};
export const deleteLifeStories = async (id: number) => {
  try {
    const response = await axios.post(
      `${API_URL}/deleteLifeStories`,
      { lifestories_id: [id] },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
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
    console.error("Error deleting life stories:", error);
    return false;
  }
};
export const getPressReleases = async () => {
  try {
    const response = await axios.get(`${API_URL}/getPressReleases`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
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
      timesedited:
        pressRelease.timesedited == null ? -1 : pressRelease.timesedited,
      publisherid:
        pressRelease.publisherid == null ? -1 : pressRelease.publisherid,
      mainImage: pressRelease.mainimage,
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
      { pressrelease: rest },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
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
export const updatePressReleases = async (pressRelease: PressRelease) => {
  try {
    const normalizedPressRelease = Object.fromEntries(
      Object.entries({
        ...pressRelease,
      }).map(([key, value]) => [key.toLowerCase(), value])
    );
    const { id, ...rest } = normalizedPressRelease;
    const response = await axios.post(
      `${API_URL}/updatePressReleases`,
      { pressreleases_id: id, updates: rest },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
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
    console.error("Error updating press releases:", error);
    return false;
  }
};
export const deletePressReleases = async (id: number) => {
  try {
    const response = await axios.post(
      `${API_URL}/deletePressReleases`,
      { pressreleases_id: [id] },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
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
    console.error("Error deleting press releases:", error);
    return false;
  }
};
export const getBulletins = async () => {
  try {
    const response = await axios.get(`${API_URL}/getBulletins`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
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
      additionalImages: JSON.parse(
        bulletin.additionalimages?.toString() || "[]"
      ),
      thirdAdditionalBody: bulletin.thirdadditionalbody,
      tags: JSON.parse(bulletin.tags?.toString() || "[]"),
      state: bulletin.state,
      topics: JSON.parse(bulletin.topics?.toString() || "[]"),
      timesedited: bulletin.timesedited == null ? -1 : bulletin.timesedited,
      publisherid: bulletin.publisherid == null ? -1 : bulletin.publisherid,
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
        const user = {
          id: data.id,
          name: data.name,
          role: data.role,
          pictureUrl: data.profile_picture,
          password: data.password,
          accessFrom: data.access_from,
          accessTo: data.access_to,
          hasChangedPassword: data.has_changed_password,
        };
        // Validations
        if (user.accessFrom && user.accessTo) {
          const currentDate = new Date();
          if (currentDate < user.accessFrom || currentDate > user.accessTo) {
            return null;
          }
        }
        return user;
      }
    }
    return null;
  } catch (error) {
    console.error("Error logging in:", error);
    return null;
  }
};
export const createUser = async (user: User) => {
  try {
    const normalizedUser = Object.fromEntries(
      Object.entries({
        ...user,
        creationApprovalDocument: JSON.stringify(user.creationApprovalDocument),
      }).map(([key, value]) => [
        key.replace(/([A-Z])/g, "_$1").toLowerCase(),
        value,
      ])
    );
    const { id, ...rest } = normalizedUser;
    const response = await axios.post(
      `${API_URL}/createUser`,
      { user: rest },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
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
    console.error("Error creating user:", error);
    return false;
  }
};
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get(`${API_URL}/getUsers`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });
    const { success, message, data } = response.data;
    if (!success) {
      console.error(message);
      return [];
    }
    return data.map((user: any) => ({
      id: user.id,
      dpi: user.dpi,
      name: user.name,
      email: user.email,
      password: user.password,
      profile_picture: user.profile_picture,
      role: user.role,
      institution: user.institution,
      accessFrom: user.access_from,
      accessTo: user.access_to,
      creationApprovalDocument: user.creation_approval_document,
      jobTitle: user.job_title,
      hasChangedPassword: user.has_changed_password,
    }));
  } catch (error) {
    console.error("Error fetching all users:", error);
    return [];
  }
};
export const updateUser = async (userId: number, updates: Partial<User>) => {
  try {
    if (updates.creationApprovalDocument) {
      updates.creationApprovalDocument = JSON.stringify(
        updates.creationApprovalDocument
      );
    }
    const normalizedUser = Object.fromEntries(
      Object.entries({
        ...updates,
      }).map(([key, value]) => [
        key.replace(/([A-Z])/g, "_$1").toLowerCase(),
        value,
      ])
    );
    const { id, ...rest } = normalizedUser;
    const response = await axios.post(
      `${API_URL}/updateUser`,
      { user_id: userId, updates: rest },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
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
    console.error("Error updating user:", error);
    return false;
  }
};
export const deleteUser = async (id: number) => {
  try {
    const response = await axios.post(
      `${API_URL}/deleteUser`,
      { user_id: id },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
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
    console.error("Error deleting user:", error);
    return false;
  }
};
