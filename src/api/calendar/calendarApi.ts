import { TCalendar } from "../../models/calendar/calendarModel";
import { TGetAccessTokenSilently } from "../../models/commos/accessTokenSilently";
import { TResponseError } from "../../models/problems/responseErrorModel";

export const getCalendar = async (
  getAccessTokenSilently: TGetAccessTokenSilently
): Promise<TCalendar> => {
  const API_BASE_URL = "http://127.0.0.1:3000/api/v1/calendar";
  const token = await getAccessTokenSilently();
  const response = await fetch(API_BASE_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw data as TResponseError;
  }
  return data as TCalendar;
};
