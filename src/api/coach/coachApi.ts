import { TCoach } from "../../models/coach/coachModel";
import { TResponse } from "../../models/commos/responseModel";

export const getCoachs = async (): Promise<TResponse<TCoach>> => {
  const response = await fetch("http://127.0.0.1:3000/api/v1/coach");
  const data = await response.json();
  return data as TResponse<TCoach>;
};
