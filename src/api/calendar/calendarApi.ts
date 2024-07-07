import { TCalendar } from "../../models/calendar/calendarModel";
import { TResponseError } from "../../models/problems/responseErrorModel";

export const getCalendar = async (): Promise<TCalendar> => {
  const API_BASE_URL = "http://127.0.0.1:3000/api/v1/calendar";

  const response = await fetch(API_BASE_URL);
  const data = await response.json();
  if (!response.ok) {
    throw data as TResponseError;
  }
  return data as TCalendar;
};
