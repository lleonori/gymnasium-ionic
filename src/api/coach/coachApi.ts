import axios from "axios";
import { axiosInstance } from "../../hooks/useAuthInterceptor";
import { TCoach, TCreateCoach } from "../../models/coach/coachModel";
import { TResponse } from "../../models/commos/responseModel";
import { TResponseError } from "../../models/problems/responseErrorModel";

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/coach`;

export const getCoaches = async (): Promise<TResponse<TCoach>> => {
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

export const saveCoach = async (
  coach: TCreateCoach,
): Promise<TResponse<TCoach>> => {
  try {
    const response = await axiosInstance.post<TResponse<TCoach>>(
      API_BASE_URL,
      coach,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as TResponseError;
    }
    throw error;
  }
};

export const updateCoach = async (
  currentCoach: TCoach,
): Promise<TResponse<TCoach>> => {
  try {
    const response = await axiosInstance.patch<TResponse<TCoach>>(
      `${API_BASE_URL}/${currentCoach.id}`,
      currentCoach,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as TResponseError;
    }
    throw error;
  }
};

export const deleteCoach = async (
  currentCoachId: number,
): Promise<TResponse<TCoach>> => {
  try {
    const response = await axiosInstance.delete<TResponse<TCoach>>(
      `${API_BASE_URL}/${currentCoachId}`,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as TResponseError;
    }
    throw error;
  }
};
