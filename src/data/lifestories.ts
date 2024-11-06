import video from "@/assets/home_video.mp4";
export type LifeStory = {
  id: number;
  title: string;
  date: string;
  program: string;
  videoUrl: string;
  firstAdditionalBody?: string;
  body: string;
  headerImage: string;
  secondAdditionalBody?: string;
  additionalImages?: string[];
};

const sampleImageLink =
  "https://t4.ftcdn.net/jpg/01/97/33/95/360_F_197339591_jHrBXbuE9PavJfSkVeaZsEry25KTGvDq.jpg";

export const sampleLifeStories: LifeStory[] = [
  {
    id: 1,
    title: "Historia de vida 1",
    date: "2021-01-01",
    program: "Programa 1",
    videoUrl: video,
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nec orci purus. Duis vel orci non purus pretium efficitur. Praesent suscipit tellus in lectus commodo euismod. Donec sed enim odio. Nunc lectus nisl, iaculis ullamcorper erat ac, aliquam sagittis ex.",
    headerImage: sampleImageLink,
  },
  {
    id: 2,
    title: "Historia de vida 2",
    date: "2021-01-01",
    program: "Programa 2",
    videoUrl: video,
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nec orci purus. Duis vel orci non purus pretium efficitur. Praesent suscipit tellus in lectus commodo euismod. Donec sed enim odio. Nunc lectus nisl, iaculis ullamcorper erat ac, aliquam sagittis ex.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nec orci purus. Duis vel orci non purus pretium efficitur. Praesent suscipit tellus in lectus commodo euismod. Donec sed enim odio. Nunc lectus nisl, iaculis ullamcorper erat ac, aliquam sagittis ex.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nec orci purus. Duis vel orci non purus pretium efficitur. Praesent suscipit tellus in lectus commodo euismod. Donec sed enim odio. Nunc lectus nisl, iaculis ullamcorper erat ac, aliquam sagittis ex.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nec orci purus. Duis vel orci non purus pretium efficitur. Praesent suscipit tellus in lectus commodo euismod. Donec sed enim odio. Nunc lectus nisl, iaculis ullamcorper erat ac, aliquam sagittis ex.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nec orci purus. Duis vel orci non purus pretium efficitur. Praesent suscipit tellus in lectus commodo euismod. Donec sed enim odio. Nunc lectus nisl, iaculis ullamcorper erat ac, aliquam sagittis ex.",
    headerImage: sampleImageLink,
    firstAdditionalBody:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nec orci purus. Duis vel orci non purus pretium efficitur. Praesent suscipit tellus in lectus commodo euismod. Donec sed enim odio. Nunc lectus nisl, iaculis ullamcorper erat ac, aliquam sagittis ex.",
    secondAdditionalBody:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nec orci purus. Duis vel orci non purus pretium efficitur. Praesent suscipit tellus in lectus commodo euismod. Donec sed enim odio. Nunc lectus nisl, iaculis ullamcorper erat ac, aliquam sagittis ex.",
    additionalImages: [sampleImageLink, sampleImageLink, sampleImageLink],
  },
  {
    id: 3,
    title: "Historia de vida 3",
    date: "2021-01-01",
    program: "Programa 3",
    videoUrl: video,
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nec orci purus. Duis vel orci non purus pretium efficitur. Praesent suscipit tellus in lectus commodo euismod. Donec sed enim odio. Nunc lectus nisl, iaculis ullamcorper erat ac, aliquam sagittis ex.",
    headerImage: sampleImageLink,
    additionalImages: [sampleImageLink, sampleImageLink, sampleImageLink],
  },
];
