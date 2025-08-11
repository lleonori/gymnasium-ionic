import axios from "axios";
import { axiosInstance } from "../../hooks/useAuthInterceptor";
import { TBooking } from "../../models/booking/bookingModel";
import { TResponse } from "../../models/commos/responseModel";
import { TResponseError } from "../../models/problems/responseErrorModel";

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/profile`;

export const deleteProfile = async (
  userId?: string
): Promise<TResponse<TBooking>> => {
  try {
    const response = await axiosInstance.delete<TResponse<TBooking>>(
      `${API_BASE_URL}/${userId}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as TResponseError;
    }
    throw error;
  }
};
