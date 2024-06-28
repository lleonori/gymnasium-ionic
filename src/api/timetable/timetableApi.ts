import { TResponse } from "../../models/commos/responseModel";
import { TTimetable } from "../../models/timetable/timetableModel";

export const fetchTimetables = async (): Promise<TResponse<TTimetable>> => {
  const API_BASE_URL = "http://127.0.0.1:3000/api/v1/timetable";

  const response = await fetch(API_BASE_URL);
  const data = await response.json();
  return data as TResponse<TTimetable>;
};
