import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://hogofilm.pythonanywhere.com/",
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

export default axiosInstance;
