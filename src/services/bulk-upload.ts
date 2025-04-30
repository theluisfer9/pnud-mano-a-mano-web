import axios from "axios";
//const ENV = import.meta.env.VITE_ENV;
const API_KEY = import.meta.env.VITE_API_KEY;

const ENV = import.meta.env.VITE_ENV;

const INTERVENTIONS_URL =
  ENV === "DEV"
    ? "https://mamtest.mides.gob.gt/api/bulk_insert_interventions"
    : ENV === "LOCAL"
    ? "http://localhost:5000/bulk_insert_interventions"
    : "https://manoamano.mides.gob.gt/api/bulk_insert_interventions";
const GOALS_URL =
  ENV === "DEV"
    ? "https://mamtest.mides.gob.gt/api/bulk_insert_goals"
    : ENV === "LOCAL"
    ? "http://localhost:5000/bulk_insert_goals"
    : "https://manoamano.mides.gob.gt/api/bulk_insert_goals";
const EXECUTIONS_URL =
  ENV === "DEV"
    ? "https://mamtest.mides.gob.gt/api/bulk_insert_executions"
    : ENV === "LOCAL"
    ? "http://localhost:5000/bulk_insert_executions"
    : "https://manoamano.mides.gob.gt/api/bulk_insert_executions";

const handleBulkUpload = async (
  file: File,
  uploadType: "interventions" | "goals" | "executions"
) => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    if (uploadType === "interventions") {
      return await axios.post(INTERVENTIONS_URL, formData, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      });
    } else if (uploadType === "goals") {
      return await axios.post(GOALS_URL, formData, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      });
    } else if (uploadType === "executions") {
      return await axios.post(EXECUTIONS_URL, formData, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      });
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    return undefined;
  }
};

export default handleBulkUpload;
