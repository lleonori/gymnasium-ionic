import axios from "axios";
import { TResponseError } from "../../models/problems/responseErrorModel";
import { axiosInstance } from "../../hooks/useAuthInterceptor";
import { TWeekdays } from "../../models/weekday/weekdayModel";
import { TResponse } from "../../models/commos/responseModel";

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/weekdays`;

export const getWeekdays = async (): Promise<TResponse<TWeekdays>> => {
  try {
    const response =
      await axiosInstance.get<TResponse<TWeekdays>>(API_BASE_URL);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as TResponseError;
    }
    throw error;
  }
};
