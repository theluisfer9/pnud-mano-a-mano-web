import axios from "axios";
const UPLOAD_FILE_URL = "http://localhost:3000/upload";
const handleUploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await axios.post(UPLOAD_FILE_URL, formData, {
      headers: {
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
