import { ICalendar } from "../../models/calendar/calendarModel";

export const fetchCalendar = async (): Promise<ICalendar> => {
  const response = await fetch("http://127.0.0.1:3000/api/v1/calendar");
  const data = await response.json();
  return data as ICalendar;
};
