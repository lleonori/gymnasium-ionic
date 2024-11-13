import axios from "axios";
import { axiosInstance } from "../../hooks/useAuthInterceptor";
import { TCoach } from "../../models/coach/coachModel";
import { TResponse } from "../../models/commos/responseModel";
import { TResponseError } from "../../models/problems/responseErrorModel";

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/coach`;

export const getCoachs = async (): Promise<TResponse<TCoach>> => {
  try {
    const response = await axiosInstance.get<TResponse<TCoach>>(API_BASE_URL);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as TResponseError;
    }
    throw error;
  }
};
