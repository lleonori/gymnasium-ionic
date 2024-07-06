export type TBooking = {
  id: number;
  mail: string;
  day: Date;
  hour: string;
};

export type TCreateBooking = Omit<TBooking, "id">;

export type TFilterBooking = Partial<{
  day: string;
  hour: string;
}>;
