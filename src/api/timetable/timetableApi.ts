import { IResponse } from "../../models/commos/responseModel";
import { ITimetable } from "../../models/timetable/timetableModel";

export const fetchTimetables = async (): Promise<IResponse<ITimetable>> => {
  const response = await fetch("http://0.0.0.0:3000/api/v1/timetable");
  const data = await response.json();
  return data as IResponse<ITimetable>;
};
