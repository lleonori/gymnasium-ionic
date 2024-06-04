import { IBooking } from "../../models/booking/bookingModel";
import { IResponse } from "../../models/commos/responseModel";

export const fetchBookings = async (): Promise<IResponse<IBooking>> => {
  const response = await fetch("http://127.0.0.1:3000/api/v1/booking");
  const data = await response.json();
  return data as IResponse<IBooking>;
};
