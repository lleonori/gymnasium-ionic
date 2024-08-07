import {
  TBooking,
  TCreateBooking,
  TFilterBooking,
} from "../../models/booking/bookingModel";
import { TGetAccessTokenSilently } from "../../models/commos/accessTokenSilently";
import { TResponse } from "../../models/commos/responseModel";
import { TResponseError } from "../../models/problems/responseErrorModel";

const API_BASE_URL = import.meta.env.VITE_API_URL + "/booking";

export const getBookings = async (
  mail: string,
  getAccessTokenSilently: TGetAccessTokenSilently
): Promise<TResponse<TBooking>> => {
  const token = await getAccessTokenSilently();
  const response = await fetch(API_BASE_URL + `/${encodeURIComponent(mail)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data as TResponse<TBooking>;
};

export const getAllBookings = async (
  filterBooking: TFilterBooking,
  getAccessTokenSilently: TGetAccessTokenSilently
): Promise<TResponse<TBooking>> => {
  const queryString = new URLSearchParams(
    filterBooking as Record<string, string>
  ).toString();
  const token = await getAccessTokenSilently();
  const response = await fetch(`${API_BASE_URL}?${queryString}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw data as TResponseError;
  }
  return data as TResponse<TBooking>;
};

export const saveBooking = async (
  booking: TCreateBooking,
  getAccessTokenSilently: TGetAccessTokenSilently
): Promise<TResponse<TBooking>> => {
  const token = await getAccessTokenSilently();
  const response = await fetch(API_BASE_URL, {
    method: "post",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(booking),
  });
  const data = await response.json();
  if (!response.ok) {
    throw data as TResponseError;
  }
  return data as TResponse<TBooking>;
};

export const deleteBooking = async (
  currentBookingId: number,
  getAccessTokenSilently: TGetAccessTokenSilently
): Promise<TResponse<TBooking>> => {
  const token = await getAccessTokenSilently();
  const response = await fetch(API_BASE_URL + `/${currentBookingId}`, {
    method: "delete",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw data as TResponseError;
  }
  return data as TResponse<TBooking>;
};
