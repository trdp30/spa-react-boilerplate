import { capitalize, find, lowerCase } from 'lodash';
import { stepTypes } from './stepTypes';

export const meetingStatus = {
  DRAFT: 'DRAFT',
  SCHEDULED: 'SCHEDULED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  NO_SHOW: 'NO_SHOW',
  CANCELLED: 'CANCELLED',
  ONGOING: 'ONGOING',
  CANNOT_ALLOCATE: 'CANNOT_ALLOCATE',
} as const;

type MeetingStatusKey = keyof typeof meetingStatus;

export type Theme = {
  bg: string;
  text: string;
};

export type MeetingStatus = {
  type: [string, (typeof stepTypes)[keyof typeof stepTypes]];
  key: (typeof meetingStatus)[MeetingStatusKey];
  label: string;
  theme: Theme;
};

export const meetingStatusList: MeetingStatus[] = [
  {
    type: ['meeting_status', stepTypes.INTERVIEW],
    key: meetingStatus.SCHEDULED,
    label: 'Scheduled',
    theme: {
      bg: 'bg-purple-50',
      text: 'text-purple-800',
    },
  },
  {
    type: ['meeting_status', stepTypes.INTERVIEW],
    key: meetingStatus.CANCELLED,
    label: 'Cancelled',
    theme: {
      bg: 'bg-red-50',
      text: 'text-red-600',
    },
  },
  {
    type: ['meeting_status', stepTypes.INTERVIEW],
    key: meetingStatus.IN_PROGRESS,
    label: 'In progress',
    theme: {
      bg: 'bg-orange-100',
      text: 'text-orange-700',
    },
  },
  {
    type: ['meeting_status', stepTypes.INTERVIEW],
    key: meetingStatus.DRAFT,
    label: 'Draft',
    theme: {
      bg: 'bg-gray-50',
      text: 'text-gray-900',
    },
  },
  {
    type: ['meeting_status', stepTypes.INTERVIEW],
    key: meetingStatus.NO_SHOW,
    label: 'No show',
    theme: {
      bg: 'bg-orange-50',
      text: 'text-orange-600',
    },
  },
  {
    type: ['meeting_status', stepTypes.INTERVIEW],
    key: meetingStatus.COMPLETED,
    label: 'Completed',
    theme: {
      bg: 'bg-blue-50',
      text: 'text-blue-900',
    },
  },
  {
    type: ['meeting_status', stepTypes.INTERVIEW],
    key: meetingStatus.CANNOT_ALLOCATE,
    label: "Couldn't allocate",
    theme: {
      bg: '',
      text: 'text-red-500',
    },
  },
];

export type MeetingStatusInput =
  | string
  | { meeting_status?: MeetingStatusKey; key?: string; theme?: Theme }
  | undefined;

export const getFormattedMeetingStatus = (
  status: MeetingStatusInput
): MeetingStatus | { key: string; label: string } | null => {
  if (status && (typeof status === 'string' || Object.keys(status).length)) {
    if (typeof status !== 'string' && status.key && status.theme?.bg) {
      return status as MeetingStatus;
    }

    let parsedStatus = typeof status === 'string' ? status : status.meeting_status;
    if (lowerCase(parsedStatus || '') === 'inprogress') {
      parsedStatus = meetingStatus.IN_PROGRESS;
    }
    if (lowerCase(parsedStatus || '') === 'noshow') {
      parsedStatus = meetingStatus.NO_SHOW;
    }

    const variant = find(meetingStatusList, (s) => lowerCase(s.key) === lowerCase((parsedStatus || '').trim()));

    if (variant && variant.label) {
      return variant;
    }

    return parsedStatus ? { key: parsedStatus, label: capitalize(parsedStatus) } : null;
  }
  return null;
};
