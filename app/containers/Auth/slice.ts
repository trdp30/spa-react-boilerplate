import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  AuthenticatePayload,
  AuthState,
  CandidateObject,
  EmailInput,
  EmailInputSuccess,
  FirebaseOtpSuccessPayload,
  FirebaseVerifyOtpPayload,
  PhoneInput,
  QueryParams,
  VerifyOtpInput,
  InitializeSocialLoginPayload,
  GetStoredSession,
  CandidateDetailsProps,
} from '@containers/Auth/types';
import { getAllParams } from '@containers/Auth/helpers';
import { SagaCallback } from '@store/types';

export const initialState: AuthState = {
  initializing: false,
  initialized: false,
  authenticated: false,
  authenticating: false,
  idToken: null,
  accessToken: null,
  expiryTime: null,
  verificationCodeRequested: false,
  user: {},
  queryParams: {},
  verificationId: '',
  currentUser: null,
  candidateDetails: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    initialize: () => {
      return {
        ...initialState,
        initializing: true,
        queryParams: getAllParams(),
      };
    },
    initializeComplete: (state) => {
      state.initializing = false;
      state.initialized = true;
    },
    authenticate: (state, action: PayloadAction<AuthenticatePayload>) => {
      state.initializing = false;
      state.initialized = true;
      state.authenticated = !!(action.payload?.accessToken || '').trim();
      state.authenticating = false;
      state.accessToken = action.payload?.accessToken || null;
      state.idToken = action.payload?.idToken || null;
      state.customToken = action.payload?.customToken || null;
      state.hash_token = action.payload?.hash_token || null;
      state.expiryTime = action.payload?.parsedToken?.expiryTime || null;
      state.user = {
        ...(action.payload?.candidate as CandidateObject),
        phone_number: action.payload?.candidate?.phone_number || state.user.phone,
        email: action.payload?.candidate?.email || state.user.username,
        username: action.payload?.candidate?.email || state.user.username,
        user_id: action.payload?.parsedToken?.user_id || null,
        tenant_id: action.payload?.parsedToken?.tenant_id || null,
        roles: action.payload?.parsedToken?.roles || null,
      };
    },
    authenticateFailed: (state) => {
      state.initializing = false;
      state.initialized = true;
      state.authenticated = false;
      state.authenticating = false;
    },
    unAuthenticate: (state) => {
      state.initializing = false;
      state.initialized = true;
      state.authenticated = false;
      state.authenticating = false;
    },
    getEmailOtp: (_state, _action: PayloadAction<EmailInput>) => {
      // state.user.username = action.payload.username;
    },
    getPhoneFirebaseOtp: (_state, _action: PayloadAction<PhoneInput>) => {
      // state.user.phone = action.payload.phone;
    },
    getEmailOtpSuccess: (state, action: PayloadAction<EmailInputSuccess>) => {
      state.user.username = action.payload.username;
      state.verificationCodeRequested = true;
    },
    getPhoneFirebaseOtpSuccess: (state, action: PayloadAction<FirebaseOtpSuccessPayload>) => {
      state.verificationId = action.payload?.verificationId;
      state.user.phone = action.payload.phone;
      state.verificationCodeRequested = true;
    },
    verifyEmailOtp: (_state, _action: PayloadAction<VerifyOtpInput>) => {},
    verifyFirebaseOtp: (_state, _action: PayloadAction<FirebaseVerifyOtpPayload>) => {},
    storeIdToken: (state, action: PayloadAction<string>) => {
      state.idToken = action.payload;
      state.authenticating = true;
    },
    storeQueryParams: (state, action: PayloadAction<QueryParams>) => {
      state.queryParams = action.payload;
    },
    initializeSocialLogin: (_state, _action: PayloadAction<InitializeSocialLoginPayload>) => {},

    storeCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },

    storeStoredSession: (state, action: PayloadAction<GetStoredSession>) => {
      state.accessToken = action.payload.accessToken ?? null;
      state.idToken = action.payload.idToken ?? null;
      state.customToken = action.payload.customToken;
      state.hash_token = action.payload.hash_token;
      state.tenant_id = action.payload.tenant_id ?? null;
    },

    fetchCandidateDetails: (_state, _action: PayloadAction<{ email: string; callback?: SagaCallback }>) => {},

    storeCandidateDetails: (state, action: PayloadAction<CandidateDetailsProps>) => {
      state.candidateDetails = action.payload;
    },
  },
});

export const {
  initialize,
  initializeComplete,
  authenticate,
  unAuthenticate,
  getEmailOtp,
  getPhoneFirebaseOtp,
  getEmailOtpSuccess,
  verifyEmailOtp,
  verifyFirebaseOtp,
  getPhoneFirebaseOtpSuccess,
  authenticateFailed,
  storeIdToken,
  storeQueryParams,
  initializeSocialLogin,
  storeCurrentUser,
  storeStoredSession,
  fetchCandidateDetails,
  storeCandidateDetails,
} = authSlice.actions;

export default authSlice.reducer;
