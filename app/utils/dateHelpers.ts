import { DateTime } from 'luxon';

export const parseDateTime = (date: string) => (date && DateTime.fromISO(date).isValid ? DateTime.fromISO(date) : null);

export const parseJSDateTime = (date: Date) =>
  date && DateTime.fromJSDate(date).isValid ? DateTime.fromJSDate(date) : null;

export const getCurrentDate = (): DateTime => {
  const testDate = '2022-12-07T12:00:00+05:30';
  const env = process.env.NODE_ENV;

  if (env === 'test' || process.env.STORYBOOK_APP_ENV === 'storybook') {
    return parseDateTime(testDate) || DateTime.now();
  }

  return DateTime.now();
};

export const formatDate = (dateString: string): string => {
  const date = parseDateTime(dateString);
  if (!date) return 'Invalid date (formatDate)';
  const day = date.day;
  const month = date.monthLong;
  const weekday = date.weekdayLong;
  // const month = date.toFormat('MMMM'); // Full month name (e.g., "January")
  // const weekday = date.toFormat('cccc'); // Full weekday name (e.g., "Saturday")

  return `${day} ${month}, ${weekday}`;
};

export const formatIsoDateToLongDate = (isoDate: string): string => {
  const date = parseDateTime(isoDate);
  if (!date) return 'Invalid ISO Date';
  return date.toFormat('d MMMM yyyy');
};

export const formatTimeRangeInIST = (startDate: string, endDate: string): string => {
  const start = parseDateTime(startDate);
  const end = parseDateTime(endDate);

  if (!start || !end) {
    return 'Invalid date range';
  }

  const startTime = start.toFormat('h:mm a');
  const endTime = end.toFormat('h:mm a');
  const zone = start.toFormat('ZZZZ');

  return `${startTime} - ${endTime} ${getMappedGmtTimezoneToShortName(zone)}`;
};

export function getMappedGmtTimezoneToShortName(zone: string) {
  if (zone === 'GMT+5:30' || zone === 'Asia/Kolkata' || zone === 'Asia/Calcutta') {
    return 'IST';
  }
  return zone;
}

export const formatTimeframe = (timeframe: string | null) => {
  if (!timeframe) return null;

  const parts = timeframe.split(':');
  if (parts?.length === 3) {
    const hours = parts[0];

    return `${hours} hour${hours === '1' ? '' : 's'}`;
  }

  return timeframe;
};

export const getCurrentTimeInUnit = (unit: 'seconds' | 'milliseconds' | 'minutes' | 'hours' = 'seconds'): number => {
  const now = DateTime.now().toMillis(); // Get current time in milliseconds

  switch (unit) {
    case 'milliseconds':
      return now; // Already in milliseconds
    case 'minutes':
      return Math.floor(now / (60 * 1000)); // Convert milliseconds to minutes
    case 'hours':
      return Math.floor(now / (60 * 60 * 1000)); // Convert milliseconds to hours
    case 'seconds':
    default:
      return Math.floor(now / 1000); // Convert milliseconds to seconds
  }
};

export const systemTimezone = DateTime.now().zoneName;

export function formatCustomLongDateWithEndTime(dateString: string, timeZone?: string): string {
  const date = parseDateTime(dateString)?.setZone(timeZone || systemTimezone);

  if (!date) {
    return 'Invalid Date';
  }

  // Format the date to "DD Month YYYY at H:mm AM/PM"
  return `${date.toFormat("dd LLLL yyyy 'at' h:mm a")} ${getMappedGmtTimezoneToShortName(timeZone || systemTimezone)}`;
}
