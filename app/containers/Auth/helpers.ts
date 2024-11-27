import { firebaseInstance } from '@utils/firebase';
import {
  browserLocalPersistence,
  PhoneAuthProvider,
  RecaptchaVerifier,
  setPersistence,
  signInWithCredential,
  signInWithCustomToken,
  signInWithPhoneNumber,
} from 'firebase/auth';
import { replace, trim } from 'lodash';
import { AuthenticateFirebase, ParsedToken, QueryParams, SocialLoginProviderName } from '@containers/Auth/types';
import { AUTH_STORAGE_KEY, localStorageGetItem, QUERY_PARAMS_STORAGE_KEY } from '@utils/localStorageHelpers';
import { signInWithPopup } from 'firebase/auth';
import { socialLoginProviders } from '@contexts/AuthContext/socialAuthProvider';

interface Params {
  [key: string]: string;
}

export const signInPhone = (phoneNumber: string) => {
  const auth = firebaseInstance?.fireBaseAuth;
  const appVerifier = new RecaptchaVerifier(auth, 'sign-in-button', {
    size: 'invisible',
    callback: () => {
      console.log('recaptcha resolved..');
    },
  });
  return signInWithPhoneNumber(auth, phoneNumber, appVerifier);
};

export const signInCredential = (verificationId: string, code: string) => {
  const auth = firebaseInstance?.fireBaseAuth;
  const credential = PhoneAuthProvider.credential(verificationId, code);
  return signInWithCredential(auth, credential);
};

export const getAllParams = (): QueryParams => {
  const s = window.location.search;
  const search = new URLSearchParams(s);
  const params: Params = {};
  for (const [key, value] of search.entries()) {
    if (key === 'username') {
      params[key] = replace(trim(value), ' ', '+');
    } else {
      params[key] = value;
    }
  }
  return params;
};

export async function authenticateFirebase({ customToken }: AuthenticateFirebase) {
  if (!trim(customToken)) throw new Error('Invalid Access Token');
  await setPersistence(firebaseInstance.fireBaseAuth, browserLocalPersistence);
  const UC = await signInWithCustomToken(firebaseInstance.fireBaseAuth, customToken);
  if (UC.user) {
    return await UC.user.getIdToken();
  }
  throw new Error('Invalid User');
}

export const getStoredSession = () => {
  const tokens = localStorageGetItem(AUTH_STORAGE_KEY);
  return tokens ? JSON.parse(tokens) : {};
};

export const getStoredQueryParams = () => {
  const params = localStorageGetItem(QUERY_PARAMS_STORAGE_KEY);
  return params ? JSON.parse(params) : {};
};

export const initSocialLogin = async (socialLoginProviderName: SocialLoginProviderName) => {
  const auth = firebaseInstance?.fireBaseAuth;
  const provider = socialLoginProviders[socialLoginProviderName];

  if (provider) {
    const result = await signInWithPopup(auth, provider);
    if (result?.user?.getIdToken) {
      const token = await result?.user?.getIdToken();
      const user = {
        username: result?.user?.displayName,
        phone: result?.user?.phoneNumber,
        email: result?.user?.email,
        tenantId: result?.user?.tenantId,
        uid: result?.user?.uid,
        idToken: token,
      };
      return user;
    } else {
      throw Error('getIdToken not found');
    }
  } else {
    throw Error('No provider found on social login, initSocialLogin');
  }
};
export const parseJwt = (token: string) => {
  if (!token) {
    throw Error('No token provided for parse');
  }

  const base64Url = token.split('.')[1];
  if (base64Url) {
    try {
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
          .join('')
      );

      return JSON.parse(jsonPayload);
    } catch (error) {
      throw Error('Error parsing JWT: ' + (error as Error)?.message);
    }
  }
};
export const parseToken = (accessToken: string): ParsedToken => {
  const user = parseJwt(accessToken);
  if (user && Object.keys(user).length) {
    const user_id = user?.['https://hasura.io/jwt/claims']?.['X-Hasura-User-Id'] || null;
    const tenant_id = user?.['https://hasura.io/jwt/claims']?.['X-Hasura-Tenant-Id'] || null;
    const roles = user?.['https://hasura.io/jwt/claims']?.['X-Hasura-Allowed-Roles'] || [];
    const expiryTime = user?.['exp'] || null;

    return { user_id, tenant_id, roles, expiryTime };
  } else {
    throw Error('Parsed token no data');
  }
};

export function isTokenExpired(token: string) {
  if (token) {
    const user = parseJwt(token); //using atob -> atob(token.split('.')[1])
    const expiryTime = user?.['exp'] || null;
    return Math.floor(new Date().getTime() / 1000) >= expiryTime;
  }
  return true;
}
