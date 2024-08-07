import { TCalendar } from "../../models/calendar/calendarModel";
import { TGetAccessTokenSilently } from "../../models/commos/accessTokenSilently";
import { TResponseError } from "../../models/problems/responseErrorModel";

const API_BASE_URL = import.meta.env.VITE_API_URL + "/calendar";

export const getCalendar = async (
  getAccessTokenSilently: TGetAccessTokenSilently
): Promise<TCalendar> => {
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
