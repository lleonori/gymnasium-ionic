import axios from "axios";

import { axiosInstance } from "../../hooks/useAuthInterceptor";
import { TResponse } from "../../models/commos/responseModel";
import { TResponseError } from "../../models/problems/responseErrorModel";
import {
  TCreateTimetable,
  TFilterTimetable,
  TTimetable,
} from "../../models/timetable/timetableModel";
import {
  buildQueryStringFilters,
  buildQueryStringSort,
} from "../../utils/functions";
import { TSortBy } from "../../models/sort/sortModel";

const API_BASE_URL = "/timetable";

export const getTimetables = async (
  filterTimetable: TFilterTimetable | undefined,
  sort: TSortBy<TTimetable>
): Promise<TResponse<TTimetable>> => {
  try {
    const filters = buildQueryStringFilters(filterTimetable ?? {});
    const sortString = buildQueryStringSort(sort);

    // Unisci i parametri in modo sicuro
    const params = [filters, sortString].filter(Boolean).join("&");
    const queryString = params ? `?${params}` : "";

    const response = await axiosInstance.get<TResponse<TTimetable>>(
      `${API_BASE_URL}${queryString}`
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const axiosError = error.response.data as TResponseError;
      throw new Error(axiosError.message);
    }
    throw error;
  }
};

export const saveTimetable = async (
  timetable: TCreateTimetable
): Promise<TResponse<TTimetable>> => {
  try {
    const response = await axiosInstance.post<TResponse<TTimetable>>(
      API_BASE_URL,
      timetable
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const axiosError = error.response.data as TResponseError;
      throw new Error(axiosError.message);
    }
    throw error;
  }
};

export const updateTimetable = async (
  currentTimetable: TTimetable
): Promise<TResponse<TTimetable>> => {
  try {
    const response = await axiosInstance.patch<TResponse<TTimetable>>(
      `${API_BASE_URL}/${currentTimetable.id}`,
      currentTimetable
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const axiosError = error.response.data as TResponseError;
      throw new Error(axiosError.message);
    }
    throw error;
  }
};

export const deleteTimetable = async (
  currentTimetableId: number
): Promise<TResponse<TTimetable>> => {
  try {
    const response = await axiosInstance.delete<TResponse<TTimetable>>(
      `${API_BASE_URL}/${currentTimetableId}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const axiosError = error.response.data as TResponseError;
      throw new Error(axiosError.message);
    }
    throw error;
  }
};
