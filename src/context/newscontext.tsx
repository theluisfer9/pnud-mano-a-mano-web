// NewsContext.tsx
import { createContext, useState, ReactNode } from "react";
import sampleNews, { News } from "../data/news";

interface NewsContextType {
  newsData: News[];
  addNewsItem: (newsItem: News) => void;
  publishNews: (newsItemId: number) => void;
}
interface NewsProviderProps {
  children: ReactNode;
}
export const NewsContext = createContext<NewsContextType | undefined>(
  undefined,
);

export const NewsProvider = ({ children }: NewsProviderProps) => {
  const [newsData, setNewsData] = useState<News[]>(sampleNews);

  const addNewsItem = (newsItem: News) => {
    setNewsData((prevNews) => [...prevNews, newsItem]);
  };

  const publishNews = (newsItemId: number) => {
    // Update the state
    setNewsData((prevNews) =>
      prevNews.map((newsItem) =>
        newsItem.id === newsItemId
          ? { ...newsItem, state: "published" }
          : newsItem,
      ),
    );
  };

  return (
    <NewsContext.Provider value={{ newsData, addNewsItem, publishNews }}>
      {children}
    </NewsContext.Provider>
  );
};
