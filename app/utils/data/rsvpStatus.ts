import { capitalize, find, get, lowerCase } from 'lodash';
import { faCheck, faXmark, faMinus, faQuestion } from '@fortawesome/pro-light-svg-icons';

export const rsvpStatus = {
  TENTATIVE: 'TENTATIVE',
  ACCEPTED: 'ACCEPTED',
  DECLINED: 'DECLINED',
  INVITED: 'INVITED',
  PROPOSED_NEW_TIME: 'PROPOSED_NEW_TIME',
  DECLINE_PROPOSED_NEW_TIME: 'DECLINE_PROPOSED_NEW_TIME',
  NO_RESPONSE: 'NO_RESPONSE',
} as const;

type RsvpStatusKey = keyof typeof rsvpStatus;

export type Theme = {
  bg: string;
  text: string;
  badgeIcon?: typeof faCheck | typeof faXmark | typeof faMinus | typeof faQuestion;
  badgeBgColor?: string;
};

export type RsvpStatus = {
  type: [string];
  key: (typeof rsvpStatus)[RsvpStatusKey];
  label: string;
  theme: Theme | undefined;
};

export const rsvpStatusTheme: Record<(typeof rsvpStatus)[RsvpStatusKey], Theme | undefined> = {
  [rsvpStatus.TENTATIVE]: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    badgeIcon: faMinus,
    badgeBgColor: 'bg-yellow-700',
  },
  [rsvpStatus.ACCEPTED]: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    badgeIcon: faCheck,
    badgeBgColor: 'bg-green-700',
  },
  [rsvpStatus.DECLINED]: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    badgeIcon: faXmark,
    badgeBgColor: 'bg-red-700',
  },
  [rsvpStatus.NO_RESPONSE]: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    badgeIcon: faMinus,
    badgeBgColor: 'bg-yellow-700',
  },
  [rsvpStatus.INVITED]: {
    bg: 'bg-gray-100',
    text: 'text-gray-500',
  },
  [rsvpStatus.PROPOSED_NEW_TIME]: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    badgeIcon: faQuestion,
    badgeBgColor: 'bg-yellow-700',
  },
  [rsvpStatus.DECLINE_PROPOSED_NEW_TIME]: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    badgeIcon: faXmark,
    badgeBgColor: 'bg-red-700',
  },
};

export const rsvpStatusList: RsvpStatus[] = [
  { type: ['rsvp_status'], key: rsvpStatus.INVITED, label: 'Invited', theme: get(rsvpStatusTheme, rsvpStatus.INVITED) },
  {
    type: ['rsvp_status'],
    key: rsvpStatus.ACCEPTED,
    label: 'Accepted',
    theme: get(rsvpStatusTheme, rsvpStatus.ACCEPTED),
  },
  {
    type: ['rsvp_status'],
    key: rsvpStatus.TENTATIVE,
    label: 'Tentative',
    theme: get(rsvpStatusTheme, rsvpStatus.TENTATIVE),
  },
  {
    type: ['rsvp_status'],
    key: rsvpStatus.NO_RESPONSE,
    label: 'No Response',
    theme: get(rsvpStatusTheme, rsvpStatus.NO_RESPONSE),
  },
  {
    type: ['rsvp_status'],
    key: rsvpStatus.PROPOSED_NEW_TIME,
    label: 'Proposed new time',
    theme: get(rsvpStatusTheme, rsvpStatus.PROPOSED_NEW_TIME),
  },
  {
    type: ['rsvp_status'],
    key: rsvpStatus.DECLINED,
    label: 'Declined',
    theme: get(rsvpStatusTheme, rsvpStatus.DECLINED),
  },
  {
    type: ['rsvp_status'],
    key: rsvpStatus.DECLINE_PROPOSED_NEW_TIME,
    label: 'Declined new time proposed',
    theme: get(rsvpStatusTheme, rsvpStatus.DECLINE_PROPOSED_NEW_TIME),
  },
];

export const getFormattedRsvpStatus = (
  status: string | { rsvp_status?: string; key?: string; theme?: Theme }
): RsvpStatus | { key: string; label: string } | null => {
  if (status && (typeof status === 'string' || Object.keys(status).length)) {
    if (typeof status !== 'string' && status.key && status.theme && status.theme.bg) {
      return status as RsvpStatus;
    }

    const parsedStatus = typeof status === 'string' ? status : status.rsvp_status;
    const variant = find(
      rsvpStatusList,
      (s) =>
        lowerCase(s.key) === lowerCase(parsedStatus?.trim() || '') ||
        lowerCase(s.key) === lowerCase(get(rsvpStatus, parsedStatus?.toUpperCase() as RsvpStatusKey))
    );

    if (variant && variant.label) {
      return variant;
    }

    return parsedStatus ? { key: parsedStatus, label: capitalize(parsedStatus) } : null;
  }
  return null;
};
