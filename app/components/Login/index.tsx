import { Logo } from '@components/base/Logo';
import { EmailLogin } from '@components/Login/Email';
import PhoneNumber from '@components/Login/Phone';
import type { Email, Phone } from '@components/Login/types';
import { SocialLoginProviderName } from '@containers/Auth/types';
import AuthContext from '@contexts/AuthContext';
import { faSpinner } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { handleEnterKeyPress } from '@utils/keyboardHelpers';
import classNames from 'classnames';
import * as EmailValidator from 'email-validator';
import React, { ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { useLocation, useNavigate } from 'react-router';
import AppleLogin from './AppleLogin';
import GoogleLogin from './GoogleLogin';
import messages from './messages';
import { TermsAndConditions } from './TermsAndConditions';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { triggerEmailOtp, triggerPhoneFirebaseOtp, initiateSocialLogin, redirectPostAuthentication } =
    useContext(AuthContext);
  const [selectedIdentifier, setSelectedIdentifier] = useState<'phone' | 'email' | null>();
  const [email, setEmail] = useState<Phone>('');
  const [phoneNumber, setPhoneNumber] = useState<Email>('');
  const [error, setError] = useState<ReactNode>();
  const [_currentView, setCurrentView] = useState<'identifier' | 'otp'>('identifier');
  const [isLoading, toggleLoading] = useState<boolean>(false);
  const [emailClicked, setEmailClicked] = useState<boolean>(false);
  const [showSocialLogin] = useState<boolean>(false);

  useEffect(() => {
    if (state) {
      setSelectedIdentifier(state?.selectedIdentifier || null);
      setEmail(state?.userEmail || '');
      setPhoneNumber(state?.phoneNo || '');
      setEmailClicked(true);
    }

    if (state?.search.includes('driveScheduleId')) {
      setEmailClicked(emailClicked);
    }
  }, [state]);

  const onOtpSuccess = () => {
    toggleLoading(false);
    setCurrentView('otp');
    navigate('/verify');
  };

  // Request OTP based on selected identifier
  const handleOtpRequest = () => {
    if (phoneNumber && !isValidPhoneNumber(phoneNumber)) {
      setError(<FormattedMessage {...messages?.invalid_phone} />);
      return;
    } else if (email && !EmailValidator.validate(email)) {
      setError(<FormattedMessage {...messages?.invalid_email} />);
      return;
    }
    setError(null);

    //Call getRequestedOtp
    if ((email || '')?.trim() && selectedIdentifier === 'email') {
      toggleLoading(true);
      triggerEmailOtp(email?.toLowerCase(), {
        onSuccess: onOtpSuccess,
        onError: (error) => {
          toggleLoading(false);
          setError(error?.message);
        },
      });
    }
    if ((phoneNumber || '')?.trim() && selectedIdentifier === 'phone') {
      toggleLoading(true);
      triggerPhoneFirebaseOtp(phoneNumber, {
        onSuccess: onOtpSuccess,
        onError: (error) => {
          toggleLoading(false);
          setError(error?.message);
        },
      });
    }
  };

  const disableRequestOtpBtn = useMemo(() => {
    if (isLoading) {
      return true;
    }
    if (selectedIdentifier === 'email') {
      return !(email || '')?.trim().length;
    }
    if (selectedIdentifier === 'phone') {
      return !(phoneNumber || '')?.trim().length;
    }
  }, [selectedIdentifier, email, phoneNumber, isLoading]);

  const setEmailIdentifier = () => {
    if (isLoading) return;
    setSelectedIdentifier('email');
    setEmailClicked(true);
  };

  const setPhoneIdentifier = () => {
    if (isLoading) return;
    setSelectedIdentifier('phone');
  };

  const handleSocialLogin = (provider: SocialLoginProviderName) => {
    toggleLoading(true);
    initiateSocialLogin(provider, {
      onSuccess: () => {
        if (redirectPostAuthentication) {
          redirectPostAuthentication();
        }
        toggleLoading(false);
      },
      onError: () => {
        toggleLoading(false);
      },
    });
  };

  return (
    <div className="flex flex-col items-center">
      <div id="sign-in-button" data-testid="google-sign-in-button"></div>
      {isLoading ? (
        <div className="min-h-[500px] flex items-center" data-testid="login-spinner">
          <FontAwesomeIcon icon={faSpinner} spin />
        </div>
      ) : (
        <>
          <div className="py-4">
            <Logo size={'lg'} />
          </div>
          <div className="text-xl md:text-2xl text-black font-semibold leading-8 py-4">
            <FormattedMessage {...messages?.sign_started} />
          </div>

          <div className="px-3 py-4 w-full">
            <GoogleLogin getAuth={() => handleSocialLogin('google')} disabled={isLoading} />
          </div>

          <div className="py-8 w-full text-gray-500">
            <div className="flex items-center relative">
              <div className="border-b border-gray-300 w-full" />
              <div className="absolute left-[28%] md:left-[34%] bg-white px-4 bottom-[-10px]">
                <FormattedMessage {...messages?.alternate_login} />
              </div>
            </div>
          </div>

          {showSocialLogin ? (
            <div className="flex h-14 justify-center items-center md:pt-3 pt-3 w-full">
              <AppleLogin getAuth={() => handleSocialLogin('apple')} disabled={isLoading} />
            </div>
          ) : (
            ''
          )}

          {!emailClicked && (
            <div className="flex font-medium text-sm text-gray-500 leading-5 space-x-1.5 py-4">
              <div>
                <FormattedMessage {...messages?.continue} />
              </div>
              <div className={classNames('text-blue-600 underline-offset-1', isLoading ? '' : 'cursor-pointer')}>
                {selectedIdentifier === 'email' ? (
                  <div
                    tabIndex={2}
                    onClick={setPhoneIdentifier}
                    role="button"
                    data-testid="phone"
                    aria-disabled={isLoading}
                    className={classNames(isLoading ? 'no-drop' : 'cursor-pointer')}
                    onKeyDown={(e) => handleEnterKeyPress(e, setPhoneIdentifier)}
                  >
                    <FormattedMessage {...messages?.phone_number} />
                  </div>
                ) : (
                  <div
                    tabIndex={2}
                    onClick={setEmailIdentifier}
                    role="button"
                    data-testid="email"
                    className={classNames(isLoading ? 'no-drop' : 'cursor-pointer')}
                    aria-disabled={isLoading}
                    onKeyDown={(e) => handleEnterKeyPress(e, setEmailIdentifier)}
                  >
                    <FormattedMessage {...messages?.email} />
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedIdentifier && (
            <>
              <div className="py-4 w-full">
                {selectedIdentifier === 'email' && (
                  <EmailLogin email={email} setEmail={setEmail} emailError={error} disabled={isLoading} />
                )}

                {selectedIdentifier === 'phone' && (
                  <PhoneNumber
                    phoneNumber={phoneNumber}
                    setPhoneNumber={setPhoneNumber}
                    defaultCountry="IN"
                    error={error}
                    disabled={isLoading}
                  />
                )}
                <div className="py-6 w-full pb-0 md:pb-4 lg:pb-6">
                  <button
                    className={classNames(
                      'py-2.5 w-full rounded text-white font-medium text-base',
                      disableRequestOtpBtn ? 'bg-gray-400' : 'bg-black cursor-pointer'
                    )}
                    onClick={handleOtpRequest}
                    tabIndex={0}
                    disabled={disableRequestOtpBtn}
                  >
                    <FormattedMessage {...messages?.request_otp} />
                  </button>
                </div>
              </div>
            </>
          )}
          <div className={classNames(!selectedIdentifier ? 'pt-8 md:pt-12 lg:pt-16' : '')}>
            <TermsAndConditions />
          </div>
        </>
      )}
    </div>
  );
};
