import { TBooking, TCreateBooking } from "../../models/booking/bookingModel";
import { TResponse } from "../../models/commos/responseModel";

export const getBookings = async (
  mail: string
): Promise<TResponse<TBooking>> => {
  const response = await fetch(
    `http://127.0.0.1:3000/api/v1/booking/${encodeURIComponent(mail)}`
  );
  const data = await response.json();
  return data as TResponse<TBooking>;
};

export const saveBooking = async (
  booking: TCreateBooking
): Promise<TResponse<TBooking>> => {
  const response = await fetch("http://127.0.0.1:3000/api/v1/booking", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(booking),
  });
  const data = await response.json();
  return data as TResponse<TBooking>;
};

export const deleteBooking = async (
  currentBookingId: number
): Promise<TResponse<TBooking>> => {
  const response = await fetch(
    "http://127.0.0.1:3000/api/v1/booking/" + currentBookingId,
    {
      method: "delete",
    }
  );
  const data = await response.json();
  return data as TResponse<TBooking>;
};
