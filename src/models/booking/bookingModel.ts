export type TBooking = {
  id: number;
  mail: string;
  fullname?: string;
  day: string;
  hour: string;
};

export type TCreateBooking = Omit<TBooking, "id">;

export type TFilterBooking = Partial<TCreateBooking> & {
  dateFrom?: string;
  dateTo?: string;
};
