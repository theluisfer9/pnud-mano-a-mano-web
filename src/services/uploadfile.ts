import axios from "axios";

const ENV = import.meta.env.VITE_ENV;
const UPLOAD_FILE_URL =
  ENV === "DEV"
    ? "http://64.23.148.189:5000/upload"
    : ENV === "LOCAL"
    ? "http://localhost:5000/upload"
    : "https://manoamano.mides.gob.gt/api/upload";
const API_KEY = import.meta.env.VITE_API_KEY;
const handleUploadFile = async (file: File, folder: string) => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("folder", folder);
  try {
    const response = await axios.post(UPLOAD_FILE_URL, formData, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.filePath;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export default handleUploadFile;
