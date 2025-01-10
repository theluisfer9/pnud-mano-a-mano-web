import axios from "axios";
//const ENV = import.meta.env.VITE_ENV;
const API_KEY = import.meta.env.VITE_API_KEY;

const INTERVENTIONS_URL = "http://localhost:5000/bulk_insert_interventions";
const GOALS_URL = "http://localhost:5000/bulk_insert_goals";
const EXECUTIONS_URL = "http://localhost:5000/bulk_insert_executions";

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
