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
      "Viviendas saludables como cimiento de la salud de los miembros del hogar.",
    ],
    linkUrl:
      "https://drive.google.com/file/d/1F3e8hbN58VgxTjX4Sc2G1IsLZJS_5qda/view",
  },
  {
    id: "02",
    name: "Protección Social",
    image: dimension2,
    details: [
      "Transferencias monetarias para fomentar salud y educación en niñas, niños y apoyo a adultos mayores en pobreza extrema.",
    ],
    linkUrl:
      "https://drive.google.com/file/d/109JklOdggn__sNCNNfBFk5XZkum7QEDm/view",
  },
  {
    id: "03",
    name: "Educación",
    image: dimension3,
    details: [
      "Infraestructura educativa mejorada para estímulo temprano, educación y recreación infantil.",
    ],
    linkUrl:
      "https://drive.google.com/file/d/1tC5BZ8gd4LvrRGXt8_2gwmfds8jUW4Me/view",
  },
  {
    id: "04",
    name: "Salud",
    image: dimension4,
    details: [
      "Acceso a la salud asegurando en especial la atención a niñas, niños y madres.",
    ],
    linkUrl:
      "https://drive.google.com/file/d/1AnFQia-X3qSXcJdiKFtalFXrRCvlzBqV/view",
  },
  {
    id: "05",
    name: "Agricultura",
    image: dimension5,
    details: [
      "Acceso al alimento del patio a su plato por medio de acompañamiento técnico, dotación de insumos y herramientas agrícolas.",
    ],
    linkUrl:
      "https://drive.google.com/file/d/1mRbtBkgyclf4EED9eOTyvKDZq9VMUCg9/view",
  },
  {
    id: "06",
    name: "Activación Económica",
    image: dimension6,
    details: [
      "Creación de redes asociativas para el emprendimiento, acceso a microcrédito, capacitación a la administración financiera enfocada en mujeres.",
    ],
    linkUrl:
      "https://drive.google.com/file/d/11xkG6_Qvho2ju3RsB4pUc_qj2Twgr89E/view",
  },
  {
    id: "07",
    name: "Servicios básicos",
    image: dimension7,
    details: [
      "Saneamiento y acceso a agua segura y mantenimiento de caminos rurales.",
    ],
    linkUrl:
      "https://drive.google.com/file/d/1rrjyJLRTZa4Hr09MPbvysRqxlR62qVAG/view",
  },
  {
    id: "08",
    name: "Gobernanza territorial",
    image: dimension8,
    details: [
      "Fortalecimiento de las instancias locales para la coordinación interinstitucional efectiva.",
    ],
  },
  {
    id: "09",
    name: "Comunicación para cambio social",
    image: dimension9,
    details: [
      "Despliegue de acciones y herramientas para contribuir a hábitos de consumo alimenticio y de higiene saludables.",
    ],
  },
];

export default dimensions;
