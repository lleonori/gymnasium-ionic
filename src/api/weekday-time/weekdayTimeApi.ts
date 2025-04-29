import axios from "axios";
import { axiosInstance } from "../../hooks/useAuthInterceptor";
import { TResponse } from "../../models/commos/responseModel";
import { TResponseError } from "../../models/problems/responseErrorModel";
import {
  TCreateWeekdayTimes,
  TWeekdayTime,
} from "../../models/weekday-time/weekdayTimeModel";

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/weekday-time`;

export const getWeekdayTimes = async (): Promise<TResponse<TWeekdayTime>> => {
  try {
    const response =
      await axiosInstance.get<TResponse<TWeekdayTime>>(API_BASE_URL);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as TResponseError;
    }
    throw error;
  }
};

export const saveWeekdayTime = async (
  weekdayTime: TCreateWeekdayTimes,
): Promise<TResponse<TWeekdayTime>> => {
  try {
    const response = await axiosInstance.post<TResponse<TWeekdayTime>>(
      `${API_BASE_URL}`,
      weekdayTime,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as TResponseError;
    }
    throw error;
  }
};
