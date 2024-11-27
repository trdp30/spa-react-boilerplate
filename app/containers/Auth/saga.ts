import { call, fork, takeLatest, put, select, debounce } from '@redux-saga/core/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { ConfirmationResult, UserCredential } from 'firebase/auth';
import { get } from 'lodash';

import {
  initialize,
  initializeComplete,
  verifyEmailOtp,
  getPhoneFirebaseOtpSuccess,
  verifyFirebaseOtp,
  getEmailOtpSuccess,
  getEmailOtp,
  getPhoneFirebaseOtp,
  authenticate,
  authenticateFailed,
  storeIdToken,
  storeQueryParams,
  initializeSocialLogin,
  storeCurrentUser,
  storeStoredSession,
  fetchCandidateDetails,
  storeCandidateDetails,
} from '@containers/Auth/slice';

import {
  authenticateFirebase,
  getAllParams,
  getStoredSession,
  signInCredential,
  signInPhone,
  initSocialLogin,
  parseToken,
  isTokenExpired,
  getStoredQueryParams,
} from './helpers';

import {
  EmailInput,
  PhoneInput,
  VerifyOtpInput,
  FirebaseVerifyOtpPayload,
  AuthState,
  QueryParams,
  SignUpResponsePayload,
  GetCustomTokenPayload,
  AuthenticateWorker,
  GetStoredSession,
  InitializeSocialLoginPayload,
  SocialLoginSuccessPayload,
  ParsedToken,
  CurrentUserResponse,
  CandidateDetailsProps,
} from './types';

import { FIND_EXISTING_USER, GET_CURRENT_USER, GET_CUSTOM_TOKEN, OTP_REQUEST, SIGNUP, VERIFY_OTP } from './queries';

import { selectAuth, selectIdToken, selectQueryParams } from './selectors';
import { catchError } from '@utils/sentry';
import initializeFirebase from '@utils/firebase';
import {
  AUTH_STORAGE_KEY,
  clearLocalStorage,
  localStorageGetItem,
  localStorageSetItem,
  PAYMENT_DETAILS,
  QUERY_PARAMS_STORAGE_KEY,
} from '@utils/localStorageHelpers';
import { fetchCountryCodeApi } from '@utils/fetchCountryCode';
import postData from '@utils/postData';
import fetchData from '@utils/fetchData';

import { SagaCallback } from '@store/types';

export function* initializeWorker(): Generator {
  try {
    yield call(initializeFirebase);
    const params = (yield call(getAllParams)) as QueryParams;
    if (params.c || params.tid) {
      yield call(clearLocalStorage);
      yield put(storeQueryParams(params));
    } else {
      const storedParams = (yield call(getStoredQueryParams)) as QueryParams;
      yield put(storeQueryParams({ ...storedParams, ...params }));
    }
    const storedSession = (yield call(getStoredSession)) as GetStoredSession;
    //if token is not expired means it is authenticated
    if (!isTokenExpired(storedSession?.accessToken as string)) {
      // redirect to authenticate
      const parsedToken = (yield call(parseToken, storedSession?.accessToken as string)) as ParsedToken;
      yield put(storeStoredSession(storedSession));
      yield put(
        authenticate({
          accessToken: storedSession?.accessToken,
          idToken: storedSession?.idToken,
          customToken: storedSession?.customToken,
          hash_token: storedSession?.hash_token,
          tenant_id: storedSession?.tenant_id as number,
          parsedToken,
        })
      );
    } else {
      if (params.c || storedSession?.hash_token) {
        yield call(authenticateWorker, {
          hash_token: (params.c || storedSession.hash_token) as string,
        });
      } else if (storedSession?.idToken) {
        yield put(storeIdToken(storedSession.idToken));
      }
    }
    yield put(initializeComplete());
  } catch (error) {
    yield call(catchError, {
      title: 'Auth initializeWorker',
      error: error as Error,
    });
  }
}

export function* getEmailOtpWorker({ payload }: PayloadAction<EmailInput>): Generator {
  try {
    yield call(postData, {
      queryString: OTP_REQUEST,
      payload: {
        username: payload?.username,
      },
      spreadPayload: true,
      context: {
        skipAuthorization: true,
        skipHasuraRole: true,
      },
    });

    yield put(getEmailOtpSuccess({ username: payload?.username }));
    if (payload?.callback?.onSuccess) {
      yield call(payload.callback.onSuccess);
    }
  } catch (error) {
    yield call(catchError, {
      title: 'Email Otp Worker',
      error: error as Error,
    });
    if (payload?.callback?.onError) {
      yield call(payload.callback.onError, error as Error);
    }
  }
}

export function* getPhoneFireBaseOtpWorker({ payload }: PayloadAction<PhoneInput>): Generator {
  try {
    const result = yield call(signInPhone, payload?.phone as string);
    if (result) {
      const { verificationId } = result as ConfirmationResult;
      yield put(getPhoneFirebaseOtpSuccess({ verificationId, phone: payload?.phone }));
    } else {
      // TODO: handle no result case
      throw Error('Not able to generate the Id token');
    }
    if (payload.callback.onSuccess) {
      yield call(payload.callback.onSuccess);
    }
  } catch (error) {
    yield call(catchError, {
      title: 'Firebase Otp Worker',
      error: error as Error,
    });
    if (payload.callback.onError) {
      yield call(payload.callback.onError, error as Error);
    }
  }
}

export function* verifyEmailOtpWorker({ payload }: PayloadAction<VerifyOtpInput>): Generator {
  try {
    const state = (yield select(selectAuth)) as AuthState;
    const response = yield call(postData, {
      queryString: VERIFY_OTP,
      payload: {
        username: payload?.username,
        tenant_id: state?.queryParams?.tid && Number(state?.queryParams?.tid),
        code: payload?.code,
      },
      context: {
        skipAuthorization: true,
        skipHasuraRole: true,
      },
    });
    const idToken = get(response, 'data.canx_verify_otp.data.id_token');
    if (idToken) {
      yield put(storeIdToken(idToken));
    } else {
      throw Error('Not able to generate the Id token');
    }
    if (payload?.callback?.onSuccess) {
      yield call(payload.callback.onSuccess);
    }
  } catch (error) {
    yield call(catchError, {
      title: 'Verify Otp Worker',
      error: error as Error,
    });
    if (payload?.callback?.onError) {
      yield call(payload.callback.onError, error as Error);
    }
  }
}

export function* verifyFirebaseOtpWorker({ payload }: PayloadAction<FirebaseVerifyOtpPayload>): Generator {
  try {
    const state = (yield select(selectAuth)) as AuthState;
    const result = yield call(signInCredential, state.verificationId, payload?.code);
    if (result) {
      const { user } = result as UserCredential;
      if (user) {
        // @ts-expect-error // TODO: stsTokenManager is not defined in User type custom type have to define
        const stsTokenManage = user?.stsTokenManager?.toJSON();
        yield put(storeIdToken(stsTokenManage?.accessToken as string));
      } else {
        // TODO: handle no token generation
        throw Error('Failed to generate access token from firebase');
      }
    } else {
      // TODO: no result
      throw Error('Not able to sign in with firebase');
    }
    if (payload?.callback?.onSuccess) {
      yield call(payload.callback.onSuccess);
    }
  } catch (error) {
    yield call(catchError, {
      title: 'firebase verify Otp Worker',
      error: error as Error,
    });
    if (payload?.callback?.onError) {
      yield call(payload.callback.onError, error as Error);
    }
  }
}

export function* signupWorker(): Generator {
  try {
    const idToken = (yield select(selectIdToken)) as string;
    const queryParams = (yield select(selectQueryParams)) as QueryParams;
    const response = (yield call(postData, {
      queryString: SIGNUP,
      payload: {
        id_token: idToken,
        tenant_id: queryParams.tid && Number(queryParams.tid),
      },
      context: {
        skipAuthorization: true,
        skipHasuraRole: true,
      },
    })) as SignUpResponsePayload;

    const result = response?.data?.canx_signup?.[0];
    if (result && result.success) {
      const accessToken = result.data.access_token;
      yield call(
        localStorageSetItem,
        AUTH_STORAGE_KEY,
        JSON.stringify({
          accessToken: accessToken,
          idToken,
          tenant_id: queryParams.tid,
          user_id: result.data.candidate?.user_id,
        })
      );
      const parsedToken = (yield call(parseToken, result.data.access_token as string)) as ParsedToken;
      yield put(
        authenticate({
          accessToken: result.data.access_token,
          candidate: result.data.candidate,
          tenant_id: result.data.tenant_id,
          parsedToken,
          idToken,
        })
      );
    } else {
      if (result?.data?.tenant_id) {
        yield put(storeQueryParams({ ...queryParams, tid: String(result.data.tenant_id) }));
      }
      // TODO: handle no success case. UI should show error message.
      const err = Array.isArray(result?.error_message) ? result?.error_message?.[0] : (result?.error_message as string);
      throw Error('Failed in signupWorker: ' + err);
    }
  } catch (error) {
    yield put(authenticateFailed());
    yield call(catchError, {
      title: 'Authenticate User Worker',
      error: error as Error,
    });
  }
}

export function* authenticateWorker({ hash_token }: AuthenticateWorker): Generator {
  try {
    const response = (yield call(postData, {
      queryString: GET_CUSTOM_TOKEN,
      payload: {
        hash_token: hash_token,
      },
      spreadPayload: true,
      context: {
        skipAuthorization: true,
        skipHasuraRole: true,
      },
    })) as GetCustomTokenPayload;
    const customToken = response?.data?.auth_get_custom_token?.custom_token;
    if (customToken) {
      const idToken = (yield call(authenticateFirebase, {
        customToken,
      })) as string;
      // This idToken is the same as accessToken
      if (idToken) {
        yield call(
          localStorageSetItem,
          AUTH_STORAGE_KEY,
          JSON.stringify({
            accessToken: idToken,
            idToken,
            customToken,
            hash_token,
          })
        );
        const parsedToken = (yield call(parseToken, idToken)) as ParsedToken;
        yield put(
          authenticate({
            accessToken: idToken,
            parsedToken: parsedToken,
            hash_token,
            customToken,
          })
        );
      } else {
        throw Error('Failed to generate idToken from firebase');
      }
    } else {
      throw Error('Not able to generate the custom token.');
    }
  } catch (error) {
    yield put(authenticateFailed());
    yield call(catchError, {
      title: 'Authenticate Worker',
      error: error as Error,
    });
  }
}

export function* socialLoginWorker({ payload }: PayloadAction<InitializeSocialLoginPayload>): Generator {
  try {
    const response = (yield call(initSocialLogin, payload.socialLoginProviderName)) as SocialLoginSuccessPayload;
    if (response && response?.idToken) {
      yield put(storeIdToken(response.idToken));
      if (payload?.callback?.onSuccess) {
        yield call(payload.callback.onSuccess);
      }
    } else {
      throw Error('Id token not found');
    }
  } catch (error) {
    if (payload?.callback?.onError) {
      yield call(payload?.callback?.onError);
    }
    yield call(catchError, {
      title: 'firebase social login worker',
      error: error as Error,
    });
  }
}

export function* storeQueryParamsWorker(): Generator {
  try {
    const params = yield select(selectQueryParams);
    yield call(localStorageSetItem, QUERY_PARAMS_STORAGE_KEY, JSON.stringify(params));
  } catch (error) {
    yield call(catchError, {
      title: 'storeQueryParamsWorker',
      error: error as Error,
    });
  }
}

export function* storeCurrentUserSagaWorker(): Generator {
  try {
    const queryResponse = (yield call(fetchData, {
      queryString: GET_CURRENT_USER,
      queryVariables: {},
      queryKey: 'auth_user_me',
      forceRefresh: true,
    })) as CurrentUserResponse;

    const countryCode = (yield call(fetchCountryCodeApi)) as string;

    if (queryResponse) {
      const updatedResponse = {
        ...queryResponse,
        countryCode: countryCode,
      };
      yield put(storeCurrentUser(updatedResponse));
    }
  } catch (error) {
    yield call(catchError, {
      title: 'Fetch Current User Worker',
      error: error as Error,
    });
  }
}

export function* candidateDetailsSagaWorker({
  payload,
}: PayloadAction<{ email: string; callback?: SagaCallback }>): Generator {
  const { email } = payload;

  try {
    const queryResponse = (yield call(fetchData, {
      queryString: FIND_EXISTING_USER,
      queryVariables: { email },
      queryKey: 'can_candidate',
    })) as CandidateDetailsProps[];

    const candidateDetailsResponse: CandidateDetailsProps = {
      ...queryResponse?.[0],
      detached_order_id: null,
    };

    if (candidateDetailsResponse) {
      const storeOrderId = (yield call(localStorageGetItem, PAYMENT_DETAILS)) as string;
      const fetchOrderId = storeOrderId ? Number(storeOrderId) : null;
      candidateDetailsResponse.detached_order_id = fetchOrderId;

      yield put(storeCandidateDetails(candidateDetailsResponse));
    }

    if (payload?.callback?.onSuccess) {
      yield call(payload.callback.onSuccess, candidateDetailsResponse);
    }
  } catch (error) {
    yield call(catchError, {
      title: 'Fetch Existing User Worker',
      error: error as Error,
      skipToast: true,
    });

    if (payload?.callback?.onError) {
      yield call(payload.callback.onError, error as Error);
    }
  }
}

export function* initializeWatcher() {
  yield debounce(1000, initialize.type, initializeWorker);
}

export function* getEmailOtpWatcher() {
  yield takeLatest(getEmailOtp?.type, getEmailOtpWorker);
}

export function* getPhoneFirebaseOtpWatcher() {
  yield takeLatest(getPhoneFirebaseOtp?.type, getPhoneFireBaseOtpWorker);
}

export function* verifyEmailOtpWatcher() {
  yield takeLatest(verifyEmailOtp.type, verifyEmailOtpWorker);
}

export function* verifyFirebaseOtpWatcher() {
  yield takeLatest(verifyFirebaseOtp.type, verifyFirebaseOtpWorker);
}

export function* signupWatcher() {
  yield takeLatest([storeIdToken.type], signupWorker);
}

export function* socialLoginWatcher() {
  yield takeLatest(initializeSocialLogin.type, socialLoginWorker);
}

export function* storeQueryParamsWatcher() {
  yield takeLatest(storeQueryParams.type, storeQueryParamsWorker);
}

export function* storeCurrentUserSagaWatcher() {
  yield takeLatest(authenticate.type, storeCurrentUserSagaWorker);
}

export function* candidateDetailsSagaWatcher() {
  yield takeLatest(fetchCandidateDetails.type, candidateDetailsSagaWorker);
}

export default function* authRootSaga() {
  yield fork(initializeWatcher);
  yield fork(getEmailOtpWatcher);
  yield fork(getPhoneFirebaseOtpWatcher);
  yield fork(verifyEmailOtpWatcher);
  yield fork(verifyFirebaseOtpWatcher);
  yield fork(signupWatcher);
  yield fork(socialLoginWatcher);
  yield fork(storeQueryParamsWatcher);
  yield fork(storeCurrentUserSagaWatcher);
  yield fork(candidateDetailsSagaWatcher);
}
