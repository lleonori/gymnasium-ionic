export type TTimetable = {
  id: number;
  hour: string;
};

export type TCreateTimetable = Omit<TTimetable, "id">;

export type TFilterTimetable = Partial<TCreateTimetable> & {
  weekdayId?: number;
};
