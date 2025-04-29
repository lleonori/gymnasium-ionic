export type TTimetable = {
  id: number;
  hour: string;
};

export type TCreateTimetable = Omit<TTimetable, "id">;
