import { TGetAccessTokenSilently } from "../../models/commos/accessTokenSilently";
import { TResponse } from "../../models/commos/responseModel";
import { TResponseError } from "../../models/problems/responseErrorModel";
import { TTimetable } from "../../models/timetable/timetableModel";

export const fetchTimetables = async (
  getAccessTokenSilently: TGetAccessTokenSilently
): Promise<TResponse<TTimetable>> => {
  const API_BASE_URL = "http://127.0.0.1:3000/api/v1/timetable";
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
