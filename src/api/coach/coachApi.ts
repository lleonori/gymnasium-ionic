import { ICoach } from "../../models/coach/coachModel";
import { IResponse } from "../../models/commos/responseModel";

export const fetchCoachs = async (): Promise<IResponse<ICoach>> => {
  const response = await fetch("http://127.0.0.1:3000/api/v1/coach");
  const data = await response.json();
  return data as IResponse<ICoach>;
};
