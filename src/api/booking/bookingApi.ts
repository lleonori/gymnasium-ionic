import axios from "axios";
import { axiosInstance } from "../../hooks/useAuthInterceptor";
import {
  TBooking,
  TCreateBooking,
  TFilterBooking,
} from "../../models/booking/bookingModel";
import { TResponse } from "../../models/commos/responseModel";
import { TResponseError } from "../../models/problems/responseErrorModel";
import { buildQueryStringFilters } from "../../utils/functions";

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/booking`;

export const getBookings = async (
  filterBooking: TFilterBooking | undefined,
): Promise<TResponse<TBooking>> => {
  const filters = buildQueryStringFilters(filterBooking ?? {});

  // Unisci i parametri in modo sicuro
  const params = [filters].filter(Boolean).join("&");
  const queryString = params ? `?${params}` : "";
  try {
    const response = await axiosInstance.get<TResponse<TBooking>>(
      `${API_BASE_URL}${queryString}`,
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
