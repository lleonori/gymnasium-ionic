export type TBooking = {
  id: number;
  mail: string;
  day: Date;
  hour: string;
};

export type TCreateBooking = Omit<TBooking, "id">;
