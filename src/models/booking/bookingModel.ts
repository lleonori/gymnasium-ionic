export type TBooking = {
  id: number;
  mail: string;
  day: string;
  hour: string;
};

export type TCreateBooking = Omit<TBooking, "id">;
