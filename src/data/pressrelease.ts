export type PressRelease = {
  id: number;
  date: string;
  category: string;
  title: string;
  body: string;
  pdfSource: string;
  state?: string;
  publisherid?: number;
  timesedited?: number;
};

const samplePdfSource = "https://mag.wcoomd.org/uploads/2018/05/blank.pdf";

export const pressReleases: PressRelease[] = [
  {
    id: 1,
    date: "2024-01-01",
    category: "Comunicados de prensa",
    title: "Convenio para la promoción de la industria de la moda",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nec orci purus. Duis vel orci non purus pretium efficitur. Praesent suscipit tellus in lectus commodo euismod. Donec sed enim odio. Nunc lectus nisl, iaculis ullamcorper erat ac, aliquam sagittis ex.",
    pdfSource: samplePdfSource,
  },
  {
    id: 2,
    date: "2024-01-01",
    category: "Comunicados de prensa",
    title: "Apoyo a los más vulnerables",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nec orci purus. Duis vel orci non purus pretium efficitur. Praesent suscipit tellus in lectus commodo euismod. Donec sed enim odio. Nunc lectus nisl, iaculis ullamcorper erat ac, aliquam sagittis ex.",
    pdfSource: samplePdfSource,
  },
  {
    id: 3,
    date: "2024-01-01",
    category: "Comunicados de prensa",
    title: "Salida de la 109ª sesión de la CCI",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nec orci purus. Duis vel orci non purus pretium efficitur. Praesent suscipit tellus in lectus commodo euismod. Donec sed enim odio. Nunc lectus nisl, iaculis ullamcorper erat ac, aliquam sagittis ex.",
    pdfSource: samplePdfSource,
  },
  {
    id: 4,
    date: "2024-01-01",
    category: "Comunicados de prensa",
    title: "Verificación de la calidad de los productos textiles",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nec orci purus. Duis vel orci non purus pretium efficitur. Praesent suscipit tellus in lectus commodo euismod. Donec sed enim odio. Nunc lectus nisl, iaculis ullamcorper erat ac, aliquam sagittis ex.",
    pdfSource: samplePdfSource,
  },
  {
    id: 5,
    date: "2024-01-01",
    category: "Comunicados de prensa",
    title: "Ganado vacuno, ganado porcino y productos lácteos",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nec orci purus. Duis vel orci non purus pretium efficitur. Praesent suscipit tellus in lectus commodo euismod. Donec sed enim odio. Nunc lectus nisl, iaculis ullamcorper erat ac, aliquam sagittis ex.",
    pdfSource: samplePdfSource,
  },
  {
    id: 6,
    date: "2024-01-01",
    category: "Comunicados de prensa",
    title: "Fin a la pandemia",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nec orci purus. Duis vel orci non purus pretium efficitur. Praesent suscipit tellus in lectus commodo euismod. Donec sed enim odio. Nunc lectus nisl, iaculis ullamcorper erat ac, aliquam sagittis ex.",
    pdfSource: samplePdfSource,
  },
  {
    id: 7,
    date: "2024-01-01",
    category: "Comunicados de prensa",
    title: "Convención de la OIT sobre trabajo infantil",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nec orci purus. Duis vel orci non purus pretium efficitur. Praesent suscipit tellus in lectus commodo euismod. Donec sed enim odio. Nunc lectus nisl, iaculis ullamcorper erat ac, aliquam sagittis ex.",
    pdfSource: samplePdfSource,
  },
  {
    id: 8,
    date: "2024-01-01",
    category: "Comunicados de prensa",
    title: "Felicidades a la CCI de Corea",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nec orci purus. Duis vel orci non purus pretium efficitur. Praesent suscipit tellus in lectus commodo euismod. Donec sed enim odio. Nunc lectus nisl, iaculis ullamcorper erat ac, aliquam sagittis ex.",
    pdfSource: samplePdfSource,
  },
];
