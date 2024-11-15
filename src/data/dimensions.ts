import dimension1 from "@/assets/dimension_1.jpg";
import dimension2 from "@/assets/dimension_2.jpg";
import dimension3 from "@/assets/dimension_3.webp";
import dimension4 from "@/assets/dimension_4.jpg";
import dimension5 from "@/assets/dimension_5.jpeg";
import dimension6 from "@/assets/dimension_6.png";
import dimension7 from "@/assets/dimension_7.jpeg";
import dimension8 from "@/assets/dimension_8.jpg";
import dimension9 from "@/assets/dimension_9.jpeg";
type dimensionCard = {
  id: string;
  name: string;
  image: string;
  details: string[];
  linkUrl?: string;
};

const dimensions: dimensionCard[] = [
  {
    id: "01",
    name: "Vivienda",
    image: dimension1,
    details: [
      "Sustitución de pisos de tierra",
      "Remozamiento de paredes de las viviendas",
      "Dotación de estufas mejoradas",
    ],
    linkUrl:
      "https://drive.google.com/file/d/1F3e8hbN58VgxTjX4Sc2G1IsLZJS_5qda/view",
  },
  {
    id: "02",
    name: "Protección Social",
    image: dimension2,
    details: [
      "Incremento de la cobertura de Bono Social",
      "Cobertura del Programa Adulto Mayor",
    ],
    linkUrl:
      "https://drive.google.com/file/d/109JklOdggn__sNCNNfBFk5XZkum7QEDm/view",
  },
  {
    id: "03",
    name: "Educación",
    image: dimension3,
    details: [
      "Programa Acompáñame a crecer: creación de Centros Comunitarios de Desarrollo Infantil Integral (CECODII)",
      "Remozamiento de infraestructura educativa",
    ],
    linkUrl:
      "https://drive.google.com/file/d/1tC5BZ8gd4LvrRGXt8_2gwmfds8jUW4Me/view",
  },
  {
    id: "04",
    name: "Salud",
    image: dimension4,
    details: [
      "Mejoramiento de la salud familiar y comunitaria por medio del fortalecimiento del nivel de atención primaria en salud",
    ],
    linkUrl:
      "https://drive.google.com/file/d/1AnFQia-X3qSXcJdiKFtalFXrRCvlzBqV/view",
  },
  {
    id: "05",
    name: "Agricultura",
    image: dimension5,
    details: [
      "Aumento de la disponibilidad alimentaria a través del fortalecimiento de la agricultura familiar y campesina",
    ],
    linkUrl:
      "https://drive.google.com/file/d/1mRbtBkgyclf4EED9eOTyvKDZq9VMUCg9/view",
  },
  {
    id: "06",
    name: "Activación Económica",
    image: dimension6,
    details: [
      "Acceso a microcrédito y capacitación financiera a mujeres emprendedoras por medio de cooperativas de ahorro",
    ],
    linkUrl:
      "https://drive.google.com/file/d/11xkG6_Qvho2ju3RsB4pUc_qj2Twgr89E/view",
  },
  {
    id: "07",
    name: "Servicios básicos",
    image: dimension7,
    details: [
      "Mantenimiento de caminos rurales",
      "Agua y saneamiento: Dotación de letrinas y Dotación de filtros de agua",
    ],
    linkUrl:
      "https://drive.google.com/file/d/1wi5Y5F0wOhOneRxl5UNoJj1sHJPlZLuZ/view",
  },
  {
    id: "08",
    name: "Gobernanza territorial",
    image: dimension8,
    details: ["Gobernanza a través de la SESAN en las COMUSANES a nivel local"],
  },
  {
    id: "09",
    name: "Comunicación para cambio social",
    image: dimension9,
    details: ["Abordaje para el cambio social de  comportamiento"],
  },
];

export default dimensions;
