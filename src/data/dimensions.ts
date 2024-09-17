type dimensionCard = {
  id: string;
  name: string;
  details: string[];
};

const dimensions: dimensionCard[] = [
  {
    id: "01",
    name: "Infraestructura del Hogar",
    details: ["Vivienda", "Servicios básicos", "Equipamiento"],
  },
  {
    id: "02",
    name: "Protección Social",
    details: ["Salud", "Educación", "Seguridad social"],
  },
  {
    id: "03",
    name: "Educación",
    details: ["Educación básica", "Educación media", "Educación superior"],
  },
  {
    id: "04",
    name: "Salud",
    details: ["Salud preventiva", "Salud curativa", "Salud pública"],
  },
  {
    id: "05",
    name: "Agricultura",
    details: ["Producción agrícola", "Producción pecuaria", "Pesca"],
  },
  {
    id: "06",
    name: "Activación Económica",
    details: ["Empleo", "Emprendimiento", "Innovación"],
  },
  {
    id: "07",
    name: "Governanza institucional",
    details: ["Gobierno", "Sociedad civil", "Sector privado"],
  },
];

export default dimensions;
