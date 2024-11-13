import axios from "axios";
import { axiosInstance } from "../../hooks/useAuthInterceptor";
import { TResponse } from "../../models/commos/responseModel";
import { TResponseError } from "../../models/problems/responseErrorModel";
import { TTimetable } from "../../models/timetable/timetableModel";

const API_BASE_URL = "/timetable";

export const fetchTimetables = async (): Promise<TResponse<TTimetable>> => {
  try {
    const response = await axiosInstance.get<TResponse<TTimetable>>(
      API_BASE_URL
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as TResponseError;
    }
    throw error;
  }
};
