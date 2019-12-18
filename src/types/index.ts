export type TripData = {
  jobTitle: string;
  tripClass: string;
  costClass: string;
  startDate: string;
  endDate: string;
  destination: string;
  maxDistance: number;
};

export type DayData = {
  date: string;
  schedules: Array<ScheduleData>;
  accommodationAmount?: number;
  accommodationIsReasonStatementNecessary?: boolean;
  accommodationDescription?: string;
  dailyAllowanceAmount?: number;
  dailyAllowanceDescription?: string;
  
};

export type AccommodationData = {
  tripClass: string;
  date: string;
  jobTitle: string;
  destination: string;
  isOnMove: boolean;
  isOnBusiness: boolean;
  isInFlightNight: boolean;
  oneWayDistance: number;
  stayClass: string; //そもそも宿泊が発生しているかどうか確認するため
  accommodationAmount?: number;
  accommodationIsReasonStatementNecessary?: boolean;
  accommodationDescription?: string;
};

export type DailyAllowanceData = {
  tripClass: string;
  date: string;
  jobTitle: string;
  destination: string;
  isOnMove: boolean;
  isOnBusiness: boolean;
  stayClass: string;
  transportation: string;
  roundTripDistance: number;
  departureHour: number;
  returnHour: number;
  dailyAllowanceAmount?: number;
  dailyAllowanceDescription?: string;
};

export type TrainData = {
  tripClass: string;
  isWayToNaritaAirport: boolean;
  oneWayDistance: number;
  distanceForTheSameTrainSection: number;
  hasOnlyReservedSeats: boolean;
  isShinkansen: boolean;
  trainAvailableSeats?: string[];
}

export type ScheduleData = BusinessScheduleData | MoveScheduleData;

export type BusinessScheduleData = {
  type: 'business';
  text: string;
};

export type MoveScheduleData = {
  type: 'move';
  text: string;
  fare: number;
  distance: number;
  startHour: number;
  endHour: number;
};

export type TeikiData = {
  text: string;
  fare: number;
  distance: number;
  startHour: number;
  endHour: number;
}
