import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import axios from "axios";
import SessionCache from "../utils/sessionCache";

const cache = new SessionCache();

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const useAuthInterceptor = function () {
  const { getAccessTokenSilently } = useAuth0();
  useEffect(() => {
    const authInterceptor = axiosInstance.interceptors.request.use(
      async (request) => {
        let token = cache.get("access_token");

        if (!token) {
          token = await getAccessTokenSilently();
          cache.set("access_token", token);
        }

        request.headers["Authorization"] = `Bearer ${token}`;
        return request;
      },
      (error) => {
        cache.remove("access_token");
        return Promise.reject(error);
      }
    );

    // clean up function
    return () => {
      cache.remove("access_token");
      axiosInstance.interceptors.request.eject(authInterceptor);
    };
  }, [getAccessTokenSilently]);
};
