import axios from "axios";
//const ENV = import.meta.env.VITE_ENV;
const API_KEY = import.meta.env.VITE_API_KEY;

const ENV = import.meta.env.VITE_ENV;

const PARSE_CSV_URL =
  ENV === "DEV"
    ? "https://mamtest.mides.gob.gt/api/parseCSV"
    : ENV === "LOCAL"
    ? "http://localhost:5000/parseCSV"
    : "https://manoamano.mides.gob.gt/api/parseCSV";

const parseCSV = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post(PARSE_CSV_URL, formData, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });
    if (response.status === 200) {
      return response.data.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error parsing CSV:", error);
    return null;
  }
};

export default parseCSV;
