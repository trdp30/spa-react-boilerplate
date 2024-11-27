/**
 *
 * Notification
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { toast, ToastOptions } from 'react-toastify';

import Content from './Content';
import { NotificationProps, TriggerToastProps } from './types';

export const Notification: React.FC<NotificationProps> = (props) => {
  const { children, variant, message, actions, closeToast } = props;
  return (
    <>
      {children || (
        <Content
          title={message.title}
          summary={message.summary}
          close={closeToast}
          actions={actions}
          variant={variant}
        />
      )}
    </>
  );
};

export const triggerToast = (arg: TriggerToastProps) => {
  const { setting = {}, ...props } = arg;
  const defaultSettings: ToastOptions = {
    theme: 'light',
    icon: false,
    closeButton: false,
    hideProgressBar: true,
    autoClose: 5000,
    ...setting,
    position: 'bottom-right',
  };
  toast(<Notification {...props} />, { ...defaultSettings });
};

triggerToast.propTypes = {
  setting: PropTypes.object,
  type: PropTypes.string,
  variant: PropTypes.oneOf(['success', 'info', 'warning', 'danger', 'default', 'processing']),
  message: PropTypes.shape({
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.node]).isRequired,
    summary: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.node]),
  }).isRequired,
  actions: PropTypes.any,
  isAnimate: PropTypes.bool,
  showBorder: PropTypes.bool,
  closeToast: PropTypes.func,
};

export default memo(Notification);
