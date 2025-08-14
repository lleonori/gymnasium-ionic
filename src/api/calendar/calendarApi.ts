import axios from "axios";

import { TCalendar } from "../../models/calendar/calendarModel";
import { TResponseError } from "../../models/problems/responseErrorModel";
import { axiosInstance } from "../../hooks/useAuthInterceptor";

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/calendar`;

export const getCalendar = async (): Promise<TCalendar> => {
  try {
    const response = await axiosInstance.get<TCalendar>(API_BASE_URL);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const axiosError = error.response.data as TResponseError;
      throw new Error(axiosError.message);
    }
    throw error;
  }
};
