import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "https://hogofilm.pythonanywhere.com/",
  baseURL: "https://hogofilm.pythonanywhere.com/",
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("token::::", token);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);
export default axiosInstance;
