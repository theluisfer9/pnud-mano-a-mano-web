import { ITag } from "@/hooks/useTagInput";
import Sample1 from "@/assets/sample_news/1.png";
import Sample2 from "@/assets/sample_news/2.webp";
import Sample3 from "@/assets/sample_news/3.png";
import Sample4 from "@/assets/sample_news/4.webp";

type News = {
  id: number;
  area: string;
  date: string;
  title: string;
  subtitle: string;
  mainImage: string;
  mainBody: string;
  additionalSections: {
    image: string | null;
    body: string;
  }[];
  tags: ITag[] | null;
  externalLinks: string[] | null;
  state: "PUBLISHED" | "DELETED";
  publisherid?: number;
  timesedited?: number;
};
const sampleNews: News[] = [
  {
    id: 1,
    title: "Nueva iniciativa de salud",
    subtitle:
      "Un esfuerzo conjunto para mejorar la atención médica en comunidades vulnerables.",
    mainBody:
      "El gobierno de Guatemala ha lanzado una nueva iniciativa de salud que busca mejorar la calidad de atención médica en las comunidades más vulnerables del país.El gobierno de Guatemala ha lanzado una nueva iniciativa de salud que busca mejorar la calidad de atención médica en las comunidades más vulnerables del país.El gobierno de Guatemala ha lanzado una nueva iniciativa de salud que busca mejorar la calidad de atención médica en las comunidades más vulnerables del país.El gobierno de Guatemala ha lanzado una nueva iniciativa de salud que busca mejorar la calidad de atención médica en las comunidades más vulnerables del país.El gobierno de Guatemala ha lanzado una nueva iniciativa de salud que busca mejorar la calidad de atención médica en las comunidades más vulnerables del país.El gobierno de Guatemala ha lanzado una nueva iniciativa de salud que busca mejorar la calidad de atención médica en las comunidades más vulnerables del país.",
    area: "Salud",
    mainImage: Sample1,
    additionalSections: [
      {
        body: "La iniciativa, que cuenta con la colaboración de diversas organizaciones no gubernamentales, se enfocará en mejorar los servicios de salud primaria.La iniciativa, que cuenta con la colaboración de diversas organizaciones no gubernamentales, se enfocará en mejorar los servicios de salud primaria.La iniciativa, que cuenta con la colaboración de diversas organizaciones no gubernamentales, se enfocará en mejorar los servicios de salud primaria.La iniciativa, que cuenta con la colaboración de diversas organizaciones no gubernamentales, se enfocará en mejorar los servicios de salud primaria.",
        image:
          "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
      },
    ],
    date: "2021-09-01",
    externalLinks: ["https://www.google.com"],
    tags: [
      { id: "1", tagName: "Salud" },
      { id: "2", tagName: "Iniciativa" },
      { id: "3", tagName: "Atención médica" },
    ],
    state: "PUBLISHED",
  },
  {
    id: 2,
    title: "Educación en  pandemia",
    subtitle:
      "Los desafíos y avances del sistema educativo guatemalteco durante el COVID-19.",
    mainBody:
      "El sistema educativo en Guatemala ha enfrentado grandes desafíos durante la pandemia, pero también ha logrado avances significativos en la implementación de educación a distancia.El sistema educativo en Guatemala ha enfrentado grandes desafíos durante la pandemia, pero también ha logrado avances significativos en la implementación de educación a distancia.El sistema educativo en Guatemala ha enfrentado grandes desafíos durante la pandemia, pero también ha logrado avances significativos en la implementación de educación a distancia.",
    area: "Educación",
    mainImage: Sample2,
    additionalSections: [
      {
        body: "Uno de los principales desafíos ha sido garantizar el acceso a la educación en áreas rurales y comunidades marginadas. Para abordar este problema, el gobierno ha implementado programas de educación a distancia que utilizan la radio y la televisión como herramientas de enseñanza.",
        image:
          "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
      },
    ],
    date: "2021-08-01",
    externalLinks: ["https://www.google.com"],
    tags: [
      { id: "1", tagName: "Educación" },
      { id: "2", tagName: "Pandemia" },
      { id: "3", tagName: "Educación a distancia" },
    ],
    state: "PUBLISHED",
  },
  {
    id: 3,
    title: "Infraestructura vial",
    subtitle:
      "Nuevas carreteras para mejorar la conectividad en áreas rurales.",
    mainBody:
      "El gobierno ha anunciado un ambicioso proyecto de infraestructura vial que pretende conectar las zonas rurales con las urbanas a través de nuevas carreteras pavimentadas.",
    area: "Infraestructura",
    mainImage: Sample3,
    additionalSections: [
      {
        body: "El proyecto contempla la construcción de más de 500 kilómetros de carreteras en áreas rurales que actualmente carecen de una conexión vial adecuada. Se espera que esta iniciativa mejore la calidad de vida de miles de guatemaltecos al facilitar el acceso a servicios básicos como la salud y la educación.",
        image:
          "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
      },
    ],
    date: "2021-07-01",
    externalLinks: ["https://www.google.com"],
    tags: [
      { id: "1", tagName: "Infraestructura" },
      { id: "2", tagName: "Carreteras" },
      { id: "3", tagName: "Conectividad" },
    ],
    state: "PUBLISHED",
  },
  {
    id: 4,
    title: "Alerta por dengue en San Marcos",
    subtitle:
      "El Ministerio de Salud emite alerta por aumento de casos de dengue.",
    mainBody:
      "El Ministerio de Salud ha emitido una alerta por el aumento de casos de dengue en el país. Se recomienda a la población tomar medidas preventivas para evitar la propagación de la enfermedad.",
    area: "Salud",
    mainImage: Sample4,
    additionalSections: [
      {
        body: "El dengue es una enfermedad viral transmitida por mosquitos que se reproduce en aguas estancadas. Para prevenir la propagación del dengue, es importante eliminar los criaderos de mosquitos en los hogares y comunidades.",
        image:
          "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
      },
    ],
    date: "2021-06-01",
    externalLinks: ["https://www.google.com"],
    tags: [
      { id: "1", tagName: "Salud" },
      { id: "2", tagName: "Dengue" },
      { id: "3", tagName: "Prevención" },
    ],
    state: "PUBLISHED",
  },
  {
    id: 5,
    title: "Nueva carretera en Chimaltenango",
    subtitle: "La carretera de Chimaltenango se ha pavimentado",
    area: "Infraestructura",
    mainImage: Sample3,
    date: "2021-06-01",
    externalLinks: ["https://www.google.com"],
    state: "PUBLISHED",
    mainBody: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    additionalSections: [],
    tags: [],
  },
];

export default sampleNews;
export type { News };
