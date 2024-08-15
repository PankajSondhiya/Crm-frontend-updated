import axios from "axios";
import { BASE_URL, TIME_OUT } from "../Constans";

axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["Accept"] = "application/json";

export const AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
});

AxiosInstance.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["x-access-token"] = token;
  }

  return config;
});
