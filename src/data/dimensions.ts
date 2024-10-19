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
};

const dimensions: dimensionCard[] = [
  {
    id: "01",
    name: "Infraestructura del Hogar",
    image: dimension1,
    details: [
      "Substitución de pisos de tierra",
      "Remozamiento de paredes de las viviendas",
      "Dotación de estufas mejoradas",
    ],
  },
  {
    id: "02",
    name: "Protección Social",
    image: dimension2,
    details: [
      "Incremento de la cobertura de Bono Social",
      "Incremento de la cobertura de Bono Nutrición",
      "Cobertura del Programa Adulto Mayor",
    ],
  },
  {
    id: "03",
    name: "Educación",
    image: dimension3,
    details: [
      "Programa Acompáñame a crecer: creación de Centros Comunitarios de Desarrollo Infantil Integral (CECODII)",
      "Remozamiento de infraestructura educativa",
    ],
  },
  {
    id: "04",
    name: "Salud",
    image: dimension4,
    details: [
      "Mejoramiento de la salud familiar y comunitaria por medio del fortalecimiento del nivel de atención primaria en salud",
    ],
  },
  {
    id: "05",
    name: "Agricultura",
    image: dimension5,
    details: [
      "Aumento de la disponibilidad alimentaria a través del fortalecimiento de la agricultura familiar y campesina",
    ],
  },
  {
    id: "06",
    name: "Activación Económica",
    image: dimension6,
    details: [
      "Acceso a microcrédito y capacitación financiera a mujeres emprendedoras por medio de cooperativas de ahorro",
    ],
  },
  {
    id: "07",
    name: "Servicios básicos",
    image: dimension7,
    details: [
      "Mantenimiento de caminos rurales",
      "Agua y saneamiento: Dotación de letrinas y Dotación de filtros de agua",
    ],
  },
  {
    id: "08",
    name: "Gobernanza",
    image: dimension8,
    details: ["Gobernanza a través de la SESAN en las COMUSANES a nivel local"],
  },
  {
    id: "09",
    name: "Comunicación",
    image: dimension9,
    details: ["Abordaje para el cambio social de  comportamiento"],
  },
];

export default dimensions;
