export type TBooking = {
  id: number;
  mail: string;
  fullname?: string;
  day: string;
  timetableId: number;
  startHour: string;
  endHour: string;
};

export type TCreateBooking = Omit<TBooking, "id" | "startHour" | "endHour">;

export type TFilterBooking = Partial<TCreateBooking> & {
  dateFrom?: string;
  dateTo?: string;
};
