/**
 *
 * AuthContext
 *
 */

import type { Email, Phone } from '@components/Login/types';
import {
  selectAuth,
  selectCandidateDetails,
  selectCurrentUser,
  selectQueryParams,
  selectUser,
} from '@containers/Auth/selectors';
import {
  getEmailOtp,
  getPhoneFirebaseOtp,
  initialize,
  initializeSocialLogin,
  unAuthenticate,
  verifyEmailOtp,
  verifyFirebaseOtp,
} from '@containers/Auth/slice';
import type { AuthUserMe, CandidateDetailsProps, QueryParams, User } from '@containers/Auth/types';
import { SocialLoginProviderName } from '@containers/Auth/types';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import type { SagaCallback } from '@store/types';
import { sentrySetUser } from '@utils/sentry';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

export interface Tokens {
  accessToken: string | null;
  customToken?: string | null;
  idToken?: string | null;
  hash_token?: string | null;
}

export type AuthContextType = {
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  isInitialized: boolean;
  triggerEmailOtp: (_userName: Email, _callback: SagaCallback) => void;
  triggerPhoneFirebaseOtp: (_phoneNumber: Phone, _callback: SagaCallback) => void;
  triggerVerifyEmailOtp: (_code: number, _callback?: SagaCallback) => void;
  triggerFirebaseVerifyOtp: (_code: string, _callback?: SagaCallback) => void;
  triggerUnAuthenticate: () => void;
  phone?: Phone;
  username?: Email;
  verificationCodeRequested: boolean;
  user?: User;
  queryParams?: QueryParams;
  socialLoginProviders?: SocialLoginProviderName;
  initiateSocialLogin: (_name: SocialLoginProviderName, _callback: SagaCallback) => void;
  currentUser?: AuthUserMe | undefined;
  tokens?: Tokens;
  candidateDetails?: CandidateDetailsProps | undefined;
  redirectPostAuthentication?: () => void;
};

export const authContextInitialState = {
  isAuthenticated: false,
  isAuthenticating: true,
  triggerEmailOtp: (_userName: Email, _callback: SagaCallback) => {},
  triggerPhoneFirebaseOtp: (_phoneNumber: Phone, _callback: SagaCallback) => {},
  initiateSocialLogin: (_name: SocialLoginProviderName) => {},
  triggerVerifyEmailOtp: (_code: number, _callback?: SagaCallback) => {},
  triggerFirebaseVerifyOtp: (_code: string, _callback?: SagaCallback) => {},
  triggerUnAuthenticate: () => {},
  phone: '' as Phone,
  username: '' as Email,
  verificationCodeRequested: false,
  isInitialized: false,
  // currentUser: undefined,
  // candidateDetails: undefined,
  tokens: { accessToken: '' },
};

const AuthContext = React.createContext<AuthContextType>(authContextInitialState);

interface AuthProviderProps {
  children: React.ReactNode | React.ReactElement;
}

function AuthProvider(props: AuthProviderProps) {
  const dispatch = useAppDispatch();
  const state = useAppSelector(selectAuth);
  const user = useAppSelector(selectUser);
  const queryParams = useAppSelector(selectQueryParams);
  const currentUser = useAppSelector(selectCurrentUser);
  const candidateDetails = useAppSelector(selectCandidateDetails);
  const navigate = useNavigate();

  const tokens = useMemo<Tokens>(() => {
    const { accessToken, customToken, idToken, hash_token } = state;
    return { accessToken, customToken, idToken, hash_token };
  }, [state]);

  const triggerEmailOtp = useCallback(
    (username: Email, callback: SagaCallback) => {
      dispatch(getEmailOtp({ username, callback }));
    },
    [dispatch]
  );

  const triggerPhoneFirebaseOtp = useCallback(
    (phone: Phone, callback: SagaCallback) => {
      dispatch(getPhoneFirebaseOtp({ phone, callback }));
    },
    [dispatch]
  );

  const triggerVerifyEmailOtp = useCallback(
    (code: number, callback?: SagaCallback) => {
      dispatch(
        verifyEmailOtp({
          username: user?.phone || user?.username,
          code,
          callback,
        })
      );
    },
    [user, dispatch]
  );

  const triggerFirebaseVerifyOtp = useCallback(
    (code: string, callback?: SagaCallback) => {
      dispatch(
        verifyFirebaseOtp({
          code,
          callback,
        })
      );
    },
    [dispatch]
  );

  const initiateSocialLogin = (name: SocialLoginProviderName, callback: SagaCallback) => {
    dispatch(
      initializeSocialLogin({
        socialLoginProviderName: name,
        callback: callback,
      })
    );
  };

  const redirectPostAuthentication = () => {
    if (queryParams?.from) {
      const path = `${queryParams?.from}`;
      navigate(path, { replace: true });
    }
  };

  const triggerUnAuthenticate = () => {
    dispatch(unAuthenticate());
  };

  const value = useMemo(
    () => ({
      user,
      queryParams,
      isAuthenticated: state.authenticated,
      isAuthenticating: state.authenticating,
      isInitialized: state.initialized,
      triggerEmailOtp,
      triggerPhoneFirebaseOtp,
      initiateSocialLogin,
      triggerVerifyEmailOtp,
      triggerFirebaseVerifyOtp,
      username: user?.username,
      phone: user?.phone,
      verificationCodeRequested: state?.verificationCodeRequested,
      currentUser: currentUser || undefined,
      tokens,
      candidateDetails: candidateDetails || undefined,
      redirectPostAuthentication,
      triggerUnAuthenticate,
    }),
    [
      user,
      queryParams,
      state.authenticated,
      state.authenticating,
      state.initialized,
      state?.verificationCodeRequested,
      triggerEmailOtp,
      triggerPhoneFirebaseOtp,
      triggerVerifyEmailOtp,
      triggerFirebaseVerifyOtp,
      currentUser,
      tokens,
      candidateDetails,
      triggerUnAuthenticate,
    ]
  );

  useEffect(() => {
    dispatch(initialize());
  }, []);

  useEffect(() => {
    sentrySetUser(user);
  }, [value.isAuthenticated, value.isAuthenticating]);

  return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
}

export const AuthConsumer = AuthContext.Consumer;

export { AuthProvider };

export default AuthContext;
