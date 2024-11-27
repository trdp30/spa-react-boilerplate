import type { ReactNode, ReactElement } from 'react';
import type { ToastOptions } from 'react-toastify';

export type NotificationVariant = 'success' | 'info' | 'warning' | 'danger' | 'default' | 'processing';

export interface NotificationMessage {
  title: string | Element | ReactNode;
  summary?: string | Element | ReactNode | ReactElement<never, string | JSXElementConstructor<never>>;
}

export interface NotificationAction {
  label: string;
  onClick: (e: MouseEvent<T>) => void;
  variant: NotificationVariant;
}

export type NotificationCloseToast = () => void;

export interface NotificationProps {
  children?: ReactNode | ReactElement;
  variant: NotificationVariant;
  message: NotificationMessage;
  actions?: NotificationAction[];
  closeToast?: NotificationCloseToast;
}

export interface TriggerToastProps {
  setting?: ToastOptions;
  variant: NotificationVariant;
  message: NotificationMessage;
  actions?: NotificationAction[];
  isAnimate?: boolean;
  showBorder?: boolean;
  closeToast?: NotificationCloseToast;
}

export interface NotificationContentProps {
  title: string | Element | ReactNode;
  summary?: string | Element | ReactNode | ReactElement<never, string | JSXElementConstructor<never>>;
  close?: NotificationCloseToast;
  actions?: NotificationAction[];
  variant?: NotificationVariant;
}
