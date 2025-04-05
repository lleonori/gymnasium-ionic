import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import axios from "axios";
import { callbackUri } from "../Auth.config";
import { Browser } from "@capacitor/browser";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const useAuthInterceptor = function () {
  const { getAccessTokenSilently, logout } = useAuth0();
  useEffect(() => {
    const authInterceptor = axiosInstance.interceptors.request.use(
      async (request) => {
        try {
          const token = await getAccessTokenSilently();

          request.headers["Authorization"] = `Bearer ${token}`;
          return request;
        } catch (error) {
          await logout({
            async openUrl(url) {
              await Browser.open({
                url,
                windowName: "_self",
              });
            },
            logoutParams: {
              returnTo: callbackUri,
            },
          });
          return Promise.reject(error);
        }
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
