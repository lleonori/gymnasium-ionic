import { TCoach } from "../../models/coach/coachModel";
import { TResponse } from "../../models/commos/responseModel";
import { TResponseError } from "../../models/problems/responseErrorModel";
import { useAxiosInstance } from "../common/axiosInstance";

export const getCoachs = async (): Promise<TResponse<TCoach>> => {
  const axiosInstance = useAxiosInstance();
  const API_BASE_URL = "http://127.0.0.1:3000/api/v1/coach";
  const response = await axiosInstance.get(API_BASE_URL);
  if (!response.data) {
    throw response.data as TResponseError;
  }
  return response.data as TResponse<TCoach>;
};
