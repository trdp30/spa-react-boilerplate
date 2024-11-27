import { triggerToast } from '@components/base/Notification';
// import * as Sentry from '@sentry/react';
import { User } from '@containers/Auth/types';

interface CatchErrorArgs {
  title: string;
  error: Error;
  extraScope?: { key: string; value: string };
  skipToast?: boolean;
}

const timeoutToastContent = {
  title: 'Timeout Error',
  summary: 'The request took too long to process. Please refresh the screen to try again.',
};
export const catchError = (props: CatchErrorArgs) => {
  const isTimeOutError =
    typeof props?.error?.message === 'string' ? props?.error?.message.toLowerCase().includes('timeout') : false;
  console.error(`${props?.title} error: `, props?.error?.message);
  if (!props.skipToast) {
    triggerToast({
      message: {
        title: isTimeOutError ? timeoutToastContent.title : props?.title,
        summary: isTimeOutError ? timeoutToastContent.summary : props?.error?.message,
      },
      variant: 'danger',
    });
  }
  if (props.extraScope && props.extraScope.key && props.extraScope.value) {
    // Sentry.withScope((scope) => {
    //   if (props.extraScope) {
    //     const { key, value } = props.extraScope;
    //     if (key && value) {
    //       scope.setTag(key, value);
    //     }
    //   }
    //   Sentry.captureException(props?.error);
    // });
  } else {
    // Sentry.captureException(props?.error);
  }
};

export const sentrySetUser = (_user: User) => {
  // Sentry.setUser({
  //   id: (user?.user_id && Number(user?.user_id)) as number,
  //   tenant_id: user?.tenant_id && Number(user?.tenant_id),
  // });
};
