import { parseDateTime } from '@utils/dateHelpers';

export function convertTimeToMinutes(timeStr: string): number | null {
  if (!timeStr) return null;
  const [hours, minutes, seconds] = timeStr.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
    throw new Error('Invalid time format. Expected HH:MM:SS');
  }
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  return totalSeconds / 60;
}

export function convertTimeToSeconds(timeStr: string): number | null {
  if (!timeStr) return null;
  const [hours, minutes, seconds] = timeStr.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
    throw new Error('Invalid time format. Expected HH:MM:SS');
  }
  return hours * 3600 + minutes * 60 + seconds;
}

export function formatDuration(duration: string) {
  if (!duration || typeof duration !== 'string') {
    return '';
  }
  const [hours, minutes, seconds] = duration.split(':').map(Number);

  const formattedHours = hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''}` : '';
  const formattedMinutes = minutes > 0 ? `${minutes} minute${minutes > 1 ? 's' : ''}` : '';
  const formattedSeconds = seconds > 0 ? `${seconds} second${seconds > 1 ? 's' : ''}` : '';

  // Filter out empty parts and join them with a space
  return [formattedHours, formattedMinutes, formattedSeconds].filter(Boolean).join(' ');
}

export function formatDateRange(start_date: string, end_date: string): string {
  // Create DateTime objects from ISO date strings
  const startDate = parseDateTime(start_date);
  const endDate = parseDateTime(end_date);

  // Check if both dates are valid
  if (!startDate || !endDate) {
    return '';
  }

  // Format both dates
  const startDateFormatted = startDate.toFormat('d MMM yyyy');
  const endDateFormatted = endDate.toFormat('d MMM yyyy');

  // Return the formatted date range
  return `${startDateFormatted} - ${endDateFormatted}`;
}

export const SUPPORT_TICKET_URL = '#';

export const isSafari = () => {
  const ua = navigator.userAgent;
  return /^((?!chrome|android).)*safari/i.test(ua);
};

export const isIOS = () => {
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) && !('MSStream' in window);
};
