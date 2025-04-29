export type TCreateWeekdayTimes = {
  weekdayId: number;
  timetableId: number[];
};

export type TWeekdayTimesHour = {
  id: number;
  hour: string;
};

export type TWeekdayTime = {
  weekdayId: number;
  weekdayName: string;
  hour: TWeekdayTimesHour[];
};
