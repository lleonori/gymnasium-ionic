import { TGetAccessTokenSilently } from "../../models/commos/accessTokenSilently";
import { TResponse } from "../../models/commos/responseModel";
import { TResponseError } from "../../models/problems/responseErrorModel";
import { TTimetable } from "../../models/timetable/timetableModel";

const API_BASE_URL = import.meta.env.VITE_API_URL + "/timetable";

export const fetchTimetables = async (
  getAccessTokenSilently: TGetAccessTokenSilently
): Promise<TResponse<TTimetable>> => {
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
  return data as TResponse<TTimetable>;
};
