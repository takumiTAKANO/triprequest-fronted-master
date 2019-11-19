import { DayData, TripData } from '../types';

export const TripClasses = ['国内', '国外'];

export const JobTitles = [
  '教授',
  '准教授',
  '専任講師',
  '教諭',
  '管理職職員',
  '非常勤講師（本務が教授相当）',
  '非常勤特任講師',
  '助教',
  '助教諭',
  '非常勤講師',
  'その他',
];

export const CostClasses = ['公的資金','教研費','民間資金'];

export const StayClasses = [
  '日帰り',
  '宿泊(滞在日)',
  '宿泊(出発日)',
  '宿泊(帰着日)',
];

export const Transportations = ['鉄道', '船舶'];

export const InitialDayData = (tripData: TripData, index: number): DayData => {
  const date = new Date(tripData.startDate);
  date.setDate(date.getDate() + index);
  return {
    date: date.toISOString().slice(0, 10),
    schedules: [],
  };
};
