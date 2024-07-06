import {
  TBooking,
  TCreateBooking,
  TFilterBooking,
} from "../../models/booking/bookingModel";
import { TResponse } from "../../models/commos/responseModel";
import { TResponseError } from "../../models/problems/responseErrorModel";

const API_BASE_URL = "http://127.0.0.1:3000/api/v1/booking";

export const getBookings = async (
  mail: string
): Promise<TResponse<TBooking>> => {
  const response = await fetch(API_BASE_URL + `/${encodeURIComponent(mail)}`);
  const data = await response.json();
  return data as TResponse<TBooking>;
};

export const getAllBookings = async (
  filterBooking: TFilterBooking
): Promise<TResponse<TBooking>> => {
  const queryString = new URLSearchParams(
    filterBooking as Record<string, string>
  ).toString();
  const response = await fetch(`${API_BASE_URL}?${queryString}`);
  const data = await response.json();
  return data as TResponse<TBooking>;
};

export const saveBooking = async (
  booking: TCreateBooking
): Promise<TResponse<TBooking>> => {
  const response = await fetch(API_BASE_URL, {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(booking),
  });
  const data = await response.json();
  if (!response.ok) {
    throw data as TResponseError;
  }
  return data as TResponse<TBooking>;
};

export const deleteBooking = async (
  currentBookingId: number
): Promise<TResponse<TBooking>> => {
  const response = await fetch(API_BASE_URL + `/${currentBookingId}`, {
    method: "delete",
  });
  const data = await response.json();
  return data as TResponse<TBooking>;
};
