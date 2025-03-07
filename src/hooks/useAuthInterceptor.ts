import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import axios from "axios";

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
        const token = await getAccessTokenSilently();

        request.headers["Authorization"] = `Bearer ${token}`;
        return request;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // clean up function
    return () => {
      axiosInstance.interceptors.request.eject(authInterceptor);
    };
  }, [getAccessTokenSilently]);
};
