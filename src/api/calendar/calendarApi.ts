import { TCalendar } from "../../models/calendar/calendarModel";

export const getCalendar = async (): Promise<TCalendar> => {
  const response = await fetch("http://127.0.0.1:3000/api/v1/calendar");
  const data = await response.json();
  return data as TCalendar;
};
