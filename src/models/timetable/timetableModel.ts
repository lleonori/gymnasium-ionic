export type TTimetable = {
  id: number;
  startHour: string;
  endHour: string;
};

export type TCreateTimetable = Omit<TTimetable, "id">;

export type TFilterTimetable = {
  weekdayId?: number;
};
