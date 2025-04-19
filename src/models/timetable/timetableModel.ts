export type TTimetable = {
  id: number;
  hour: string;
  isValidOnWeekend: boolean;
};

export type TCreateTimetable = Omit<TTimetable, "id">;
