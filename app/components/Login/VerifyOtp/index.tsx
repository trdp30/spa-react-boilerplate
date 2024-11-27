import React, { useContext, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { forEach, get, isEmpty } from 'lodash';
import { Logo } from '@components/base/Logo';
import { LoadingSpinner } from '@components/base/Loader';
import { InputOtp } from '@components/Login/InputOTP';
import { Email, Phone } from '@components/Login/types';
import AuthContext from '@contexts/AuthContext';
import { handleEnterKeyPress } from '@utils/keyboardHelpers';
import useTimer from '@hooks/useTimer';
import messages from './messages';

export const VerifyOtp = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState<Phone | Email>('');
  const [otpError, setOtpError] = useState<boolean>(false);
  const [isLoading, toggleLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string>('');
  const { currentTime, restartTimer } = useTimer({ targetTime: 10 });

  const {
    triggerVerifyEmailOtp,
    triggerFirebaseVerifyOtp,
    triggerEmailOtp,
    triggerPhoneFirebaseOtp,
    phone,
    username,
    verificationCodeRequested,
    queryParams,
    redirectPostAuthentication,
  } = useContext(AuthContext);

  const onVerifyOtpSuccess = () => {
    if (redirectPostAuthentication) {
      redirectPostAuthentication();
    }
    toggleLoading(false);
  };

  const onVerifyOtpError = (error: Error | undefined) => {
    toggleLoading(false);
    setOtpError(true);
    setApiError(error?.message || '');
  };

  const verifyOtpCall = () => {
    if (phone && value?.length === 6) {
      toggleLoading(true);
      triggerFirebaseVerifyOtp(value, {
        onSuccess: onVerifyOtpSuccess,
        onError: onVerifyOtpError,
      });
    } else if (username && value?.length === 8) {
      toggleLoading(true);
      triggerVerifyEmailOtp(+value, {
        onSuccess: onVerifyOtpSuccess,
        onError: onVerifyOtpError,
      });
    }
  };

  // const handleResend = () => {
  //   if (isLoading || currentTime) return;
  //   toggleLoading(true);
  //   restartTimer();
  //   // requestOtp again
  //   if ((username || '')?.trim()) {
  //     triggerEmailOtp(username?.toLowerCase(), {
  //       onSuccess: () => {
  //         toggleLoading(false);
  //       },
  //       onError: () => {
  //         toggleLoading(false);
  //       },
  //     });
  //   }
  //   if ((phone || '')?.trim()) {
  //     triggerPhoneFirebaseOtp(phone, {
  //       onSuccess: () => {
  //         toggleLoading(false);
  //       },
  //       onError: () => {
  //         toggleLoading(false);
  //       },
  //     });
  //   }
  // };

  const handleResend = () => {
    if (isLoading || currentTime) return;

    toggleLoading(true);
    restartTimer();

    const handleResponse = () => toggleLoading(false);

    const trimmedUsername = username?.trim().toLowerCase();
    const trimmedPhone = phone?.trim();

    if (trimmedUsername) {
      triggerEmailOtp(trimmedUsername, {
        onSuccess: handleResponse,
        onError: handleResponse,
      });
    }

    if (trimmedPhone) {
      triggerPhoneFirebaseOtp(trimmedPhone, {
        onSuccess: handleResponse,
        onError: handleResponse,
      });
    }
  };

  // const navigateToLogin = () => {
  //   if (isLoading) return;
  //   const search = new URLSearchParams();
  //   if (Object.keys(queryParams || {}).length) {
  //     forEach(Object.keys(queryParams || {}), (key) => {
  //       search.set(key, get(queryParams, key));
  //     });
  //   }
  //   const selectedIdentifierStr = phone ? 'phone' : username ? 'email' : null;

  //   navigate('/login', {
  //     replace: true,
  //     state: {
  //       search: search.toString(),
  //       selectedIdentifier: selectedIdentifierStr,
  //       phoneNo: phone || null,
  //       userEmail: username || null,
  //     },
  //   });
  // };

  const navigateToLogin = () => {
    if (isLoading) return;

    const search = new URLSearchParams();
    if (!isEmpty(queryParams)) {
      forEach(queryParams, (_value, key) => {
        search.set(key, get(queryParams, key));
      });
    }

    const selectedIdentifierRes = phone ? 'phone' : username ? 'email' : null;

    navigate('/login', {
      replace: true,
      state: {
        search: search.toString(),
        selectedIdentifier: selectedIdentifierRes,
        phoneNo: phone || null,
        userEmail: username || null,
      },
    });
  };

  useEffect(() => {
    if (!verificationCodeRequested || (!phone && !username)) {
      navigateToLogin();
    }
  }, [verificationCodeRequested, phone, username]);

  useEffect(() => {
    verifyOtpCall();
  }, [value]);

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="py-4">
          <Logo size={'lg'} />
        </div>
        <div className="text-lg font-medium leading-8 text-slate-800 mb-2">
          {phone ? <FormattedMessage {...messages?.check_phone} /> : <FormattedMessage {...messages?.check_email} />}
        </div>
        <div className="text-sm leading-4 text-gray-500 text-center ">
          {phone ? (
            <FormattedMessage {...messages?.phone_code_sent} />
          ) : (
            <FormattedMessage {...messages?.email_code_sent} />
          )}
          <span className="ml-1">{phone || username}</span>
        </div>
        <div className="text-sm leading-4 text-gray-500 mb-10">
          <FormattedMessage {...messages?.enter} />
        </div>

        <InputOtp value={value} setValue={setValue} disabled={isLoading} isPhone={!!phone} />
        <div className="mt-2">
          {isLoading ? (
            <div data-testid="loading">
              <LoadingSpinner />
            </div>
          ) : (
            ''
          )}
        </div>

        {otpError && (
          <div className="text-red-700 pt-2 font-normal text-sm">
            {/* TODO: Handle the correct error msg with respect to the API error */}
            <FormattedMessage {...messages?.otp_error} />
            <p className={'text-xs'}>{apiError}</p>
          </div>
        )}

        <div className="text-sm font-medium text-gray-400 mt-8">
          <FormattedMessage {...messages?.did_not_receive_otp} />
          <span
            className={!currentTime ? 'text-blue-600 ml-1 cursor-pointer' : 'text-gray-200 ml-1 cursor-default'}
            role="button"
            onKeyDown={(e) => handleEnterKeyPress(e, handleResend)}
            onClick={handleResend}
            tabIndex={1}
            id="sign-in-button"
          >
            <FormattedMessage {...messages?.resend} />
          </span>
        </div>
        <div
          className="text-gray-500 text-sm font-medium leading-5 mt-2 cursor-pointer"
          role="button"
          onKeyDown={(e) => handleEnterKeyPress(e, navigateToLogin)}
          onClick={navigateToLogin}
          tabIndex={0}
        >
          {phone ? <FormattedMessage {...messages?.change_phone} /> : <FormattedMessage {...messages?.change_email} />}
        </div>

        {/* {currentTime} */}
        {/* {resendDisabled ? (
          <div data-testid="countdown">
            <CountDownTimer targetTime={25} setTimeProgressed={() => {}} onFinish={() => setResendDisabled(false)} />
          </div>
        ) : null} */}
      </div>
    </>
  );
};
