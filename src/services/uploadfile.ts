import axios from "axios";
const UPLOAD_FILE_URL = "http://52.42.202.42:5000/upload";
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
        "Access-Control-Allow-Origin": "*",
      },
    });
    return response.data.filePath;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export default handleUploadFile;
