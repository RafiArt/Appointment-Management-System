import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';

export const isWithinWorkingHours = (date: Date, timezone: string): boolean => {
  const localTime = utcToZonedTime(date, timezone);
  const hours = localTime.getHours();
  return hours >= 9 && hours < 17;
};

export const convertToUserTimezone = (
  date: Date,
  fromTimezone: string,
  toTimezone: string
): Date => {
  const utcDate = zonedTimeToUtc(date, fromTimezone);
  return utcToZonedTime(utcDate, toTimezone);
};