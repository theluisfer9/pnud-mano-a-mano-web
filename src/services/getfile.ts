const GET_FILE_URL = "http://localhost:5000/getfile";
const API_KEY = import.meta.env.VITE_API_KEY;

const getFile = async (filePath: string) => {
  try {
    const response = await fetch(GET_FILE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`, // Include the JWT token
      },
      body: JSON.stringify({ filename: filePath }),
    });
    const blob = await response.blob();
    const objectURL = URL.createObjectURL(blob);
    return objectURL;
  } catch (error) {
    console.error("Error getting file:", error);
    return "";
  }
};

export default getFile;
