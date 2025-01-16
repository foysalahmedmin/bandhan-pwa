import URLS from "@/constants/urls";
import Axios from "axios";
import authStorage from "../utils/authStorage";

const api = Axios.create({
  baseURL: URLS?.baseURL,
});

api.interceptors.request.use(
  async (config) => {
    const token = authStorage.getAuthToken();

    if (token !== null) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
