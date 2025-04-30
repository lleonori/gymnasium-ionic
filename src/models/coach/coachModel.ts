export type TCoach = {
  id: number;
  name: string;
  surname: string;
  notes: string;
};

export type TCreateCoach = Omit<TCoach, "id">;
