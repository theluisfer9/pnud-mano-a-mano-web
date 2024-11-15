import axios from "axios";
const GET_FILE_URL = "http://localhost:5000/getfile";

const getFile = async (filePath: string) => {
  const response = await axios.get(`${GET_FILE_URL}/${filePath}`);
  return response.data;
};

export default getFile;
