import { ITag } from "@/hooks/useTagInput";

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
  state: "published" | "draft";
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
    mainImage:
      "https://s3-alpha-sig.figma.com/img/5179/19a7/4996eb8bd0d68397aca0d8eee6b1b700?Expires=1727654400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=o-BgEC4wVDbv8wkqVSZJikFDsat0Fe1atofv5sGb-yveZEV77y4RbbnT3fJQUb50SooJZ6k95Dgb7c847Rqi~AiDs1Yc~nV4BgBjCFyMsC2yoZcTjKz-n8KOVM4s9HkLEQrhI66qoIPuo4Oh1og3dC26VUohMhyXiXRx0lJ0plquETEg01z6-XZDN~-C0syOAAthrSNnK1GsRTSQ6vhcgS2fsLQ~RGP6nPfdrfP0nbv~REri88cwyfpoiuZGjBEUwVTBLrduo-FKLl3J-A-u~Tq-~jZNjtsClzoKl8VjHm~fBGkNMG4uL4WuBmC3r~xZlLN-MeIcnXUPRmOD7Kuo0g__",
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
    state: "published",
  },
  {
    id: 2,
    title: "Educación en  pandemia",
    subtitle:
      "Los desafíos y avances del sistema educativo guatemalteco durante el COVID-19.",
    mainBody:
      "El sistema educativo en Guatemala ha enfrentado grandes desafíos durante la pandemia, pero también ha logrado avances significativos en la implementación de educación a distancia.El sistema educativo en Guatemala ha enfrentado grandes desafíos durante la pandemia, pero también ha logrado avances significativos en la implementación de educación a distancia.El sistema educativo en Guatemala ha enfrentado grandes desafíos durante la pandemia, pero también ha logrado avances significativos en la implementación de educación a distancia.",
    area: "Educación",
    mainImage:
      "https://s3-alpha-sig.figma.com/img/8089/06dd/b2e0faf96c1b1760c99265974a49a87e?Expires=1727654400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=itp5b6m-vEIG6y3XOynV3unKV35k3SfmfesBseVf1nYevLV-HMDB7g4Mcxv2MGsjXYAe03GthVkTrrQZxuRT7SH~iBLWFrFm0WOwgYTGNEwrtYDwIsbNhIQdwjT8EnWcXbJtY3LGkSEqowkaD0FGw5BF564c1GJEmQKO22Kl7nxqYf-Xn7M3pOUL~V0aql66AH49bxOfd6kgMcE1KnYXssJxoPh0kHExHEhgNqAZHB8AsH3Ze73dq5ERDYx5Vyfkpu-a6gpm1mHQ6nS69C86zEYaxG6A18uKUgvaNfL66AMFNhkbZ6RdYqFxTRsQeUB-MAWFtJnr~TBKepSoYj2MMw__",
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
    state: "published",
  },
  {
    id: 3,
    title: "Infraestructura vial",
    subtitle:
      "Nuevas carreteras para mejorar la conectividad en áreas rurales.",
    mainBody:
      "El gobierno ha anunciado un ambicioso proyecto de infraestructura vial que pretende conectar las zonas rurales con las urbanas a través de nuevas carreteras pavimentadas.",
    area: "Infraestructura",
    mainImage:
      "https://s3-alpha-sig.figma.com/img/b902/fd7d/5db59cc9acdce0d44aa8199de7732fe4?Expires=1727654400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=j3hxPT7sfWjf1Ne42xsNfGmHsjUCt3JCI~xSkf56DmURSOKS6EERf6-n~s3hJPgS5b6DOk6MFCoa1-GELJwWdXbljE2J9AoH5fTWM7h6l6AmqYwAlJvEMJcA9vIo1NfTvqBK9wdwupQkG~AhyWe6AtCxAI3oB7VLVtA1Ff9Hartpg0qnJ-myPbKkSRbH3p1fYoYpiS8NA-tyGguu41naMC1fG-T6gyD7NqrJHohgnOLu39nbUp-o5iCDS2VmD-N~2bsrkYEP6sHwc1SEmwgzaRRQyxVhGyRzKgEZqDsuEBEXCdx8Gt4j5XBIkqwue8Rlg7bo2WJ3So8xdpjYZDUGjQ__",
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
    state: "published",
  },
  {
    id: 4,
    title: "Alerta por dengue en San Marcos",
    subtitle:
      "El Ministerio de Salud emite alerta por aumento de casos de dengue.",
    mainBody:
      "El Ministerio de Salud ha emitido una alerta por el aumento de casos de dengue en el país. Se recomienda a la población tomar medidas preventivas para evitar la propagación de la enfermedad.",
    area: "Salud",
    mainImage:
      "https://s3-alpha-sig.figma.com/img/8089/06dd/b2e0faf96c1b1760c99265974a49a87e?Expires=1727654400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=itp5b6m-vEIG6y3XOynV3unKV35k3SfmfesBseVf1nYevLV-HMDB7g4Mcxv2MGsjXYAe03GthVkTrrQZxuRT7SH~iBLWFrFm0WOwgYTGNEwrtYDwIsbNhIQdwjT8EnWcXbJtY3LGkSEqowkaD0FGw5BF564c1GJEmQKO22Kl7nxqYf-Xn7M3pOUL~V0aql66AH49bxOfd6kgMcE1KnYXssJxoPh0kHExHEhgNqAZHB8AsH3Ze73dq5ERDYx5Vyfkpu-a6gpm1mHQ6nS69C86zEYaxG6A18uKUgvaNfL66AMFNhkbZ6RdYqFxTRsQeUB-MAWFtJnr~TBKepSoYj2MMw__",
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
    state: "published",
  },
];

export default sampleNews;
export type { News };
