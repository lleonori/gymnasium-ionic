import axios from "axios";
import { axiosInstance } from "../../hooks/useAuthInterceptor";
import {
  TBooking,
  TCreateBooking,
  TFilterBooking,
} from "../../models/booking/bookingModel";
import { TResponse } from "../../models/commos/responseModel";
import { TResponseError } from "../../models/problems/responseErrorModel";

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/booking`;

export const getBookings = async (
  mail: string,
): Promise<TResponse<TBooking>> => {
  try {
    const response = await axiosInstance.get<TResponse<TBooking>>(
      `${API_BASE_URL}/${encodeURIComponent(mail)}`,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as TResponseError;
    }
    throw error;
  }
};

export const getAllBookings = async (
  filterBooking: TFilterBooking,
): Promise<TResponse<TBooking>> => {
  const queryString = new URLSearchParams(
    filterBooking as Record<string, string>,
  ).toString();

  try {
    const response = await axiosInstance.get<TResponse<TBooking>>(
      `${API_BASE_URL}?${queryString}`,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as TResponseError;
    }
    throw error;
  }
};

export const saveBooking = async (
  booking: TCreateBooking,
): Promise<TResponse<TBooking>> => {
  try {
    const response = await axiosInstance.post<TResponse<TBooking>>(
      API_BASE_URL,
      booking,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as TResponseError;
    }
    throw error;
  }
};

export const deleteBooking = async (
  currentBookingId: number,
): Promise<TResponse<TBooking>> => {
  try {
    const response = await axiosInstance.delete<TResponse<TBooking>>(
      `${API_BASE_URL}/${currentBookingId}`,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as TResponseError;
    }
    throw error;
  }
};
