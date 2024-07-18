import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

export const useAxiosInstance = () => {
  const { getAccessTokenSilently } = useAuth0();

  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });

  axiosInstance.interceptors.request.use(
    async (config) => {
      try {
        const token = await getAccessTokenSilently();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Error getting access token: ", error);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};
