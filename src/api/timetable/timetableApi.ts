import axios from "axios";
import { axiosInstance } from "../../hooks/useAuthInterceptor";
import { TResponse } from "../../models/commos/responseModel";
import { TResponseError } from "../../models/problems/responseErrorModel";
import {
  TCreateTimetable,
  TTimetable,
} from "../../models/timetable/timetableModel";

const API_BASE_URL = "/timetable";

export const getTimetables = async (): Promise<TResponse<TTimetable>> => {
  try {
    const response = await axiosInstance.get<TResponse<TTimetable>>(
      `${API_BASE_URL}`,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as TResponseError;
    }
    throw error;
  }
};

export const getTimetablesByDay = async (
  selectedDay: string,
): Promise<TResponse<TTimetable>> => {
  try {
    const response = await axiosInstance.get<TResponse<TTimetable>>(
      `${API_BASE_URL}/${selectedDay}`,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as TResponseError;
    }
    throw error;
  }
};

export const saveTimetable = async (
  timetable: TCreateTimetable,
): Promise<TResponse<TTimetable>> => {
  try {
    const response = await axiosInstance.post<TResponse<TTimetable>>(
      API_BASE_URL,
      timetable,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as TResponseError;
    }
    throw error;
  }
};

export const updateTimetable = async (
  currentTimetable: TTimetable,
): Promise<TResponse<TTimetable>> => {
  try {
    const response = await axiosInstance.patch<TResponse<TTimetable>>(
      `${API_BASE_URL}/${currentTimetable.id}`,
      currentTimetable,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as TResponseError;
    }
    throw error;
  }
};

export const deleteTimetable = async (
  currentTimetableId: number,
): Promise<TResponse<TTimetable>> => {
  try {
    const response = await axiosInstance.delete<TResponse<TTimetable>>(
      `${API_BASE_URL}/${currentTimetableId}`,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as TResponseError;
    }
    throw error;
  }
};
