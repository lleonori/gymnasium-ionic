import { TCalendar } from "../../models/calendar/calendarModel";

export const getCalendar = async (mail: string): Promise<TCalendar> => {
  const API_BASE_URL = "http://127.0.0.1:3000/api/v1/calendar";

  const response = await fetch(API_BASE_URL + `/${encodeURIComponent(mail)}`);
  const data = await response.json();
  return data as TCalendar;
};
