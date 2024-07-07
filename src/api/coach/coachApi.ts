import { TCoach } from "../../models/coach/coachModel";
import { TResponse } from "../../models/commos/responseModel";
import { TResponseError } from "../../models/problems/responseErrorModel";

export const getCoachs = async (): Promise<TResponse<TCoach>> => {
  const API_BASE_URL = "http://127.0.0.1:3000/api/v1/coach";

  const response = await fetch(API_BASE_URL);
  const data = await response.json();
  if (!response.ok) {
    throw data as TResponseError;
  }
  return data as TResponse<TCoach>;
};
