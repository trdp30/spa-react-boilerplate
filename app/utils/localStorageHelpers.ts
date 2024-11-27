import { catchError } from '@utils/sentry';
import { forEach } from 'lodash';

export const appName = `cx-3.x-${process.env.BUILD_ENV}`;

export const AUTH_STORAGE_KEY = 'authentication';
export const LANG_STORAGE_KEY = 'lang';
export const TEST_SESSION_STORAGE_KEY = 'testSession';
export const PAYMENT_DETAILS = 'paymentDetails';
export const QUERY_PARAMS_STORAGE_KEY = 'queryParams';

const allStorageKeys = [
  AUTH_STORAGE_KEY,
  LANG_STORAGE_KEY,
  TEST_SESSION_STORAGE_KEY,
  QUERY_PARAMS_STORAGE_KEY,
  PAYMENT_DETAILS,
];

export const localStorageSetItem = (key: string, value: string) => {
  try {
    if (localStorage && typeof localStorage.setItem === 'function') {
      return localStorage.setItem(`${appName}-${key}`, value);
    }
    throw Error('Either localStorage is undefined or localStorage.setItem is not a function');
  } catch (error) {
    catchError({
      title: 'localStorage.setItem not found',
      error: error as Error,
    });
  }
};

export const localStorageGetItem = (key: string) => {
  try {
    if (localStorage && typeof localStorage.getItem === 'function') {
      return localStorage.getItem(`${appName}-${key}`);
    }
    throw Error('Either localStorage is undefined or localStorage.getItem is not a function');
  } catch (error) {
    catchError({
      title: 'localStorage.getItem not found',
      error: error as Error,
    });
    return undefined;
  }
};

export const removeLocalStorageItem = (key: string) => {
  try {
    if (localStorage && typeof localStorage.removeItem === 'function') {
      return localStorage.removeItem(`${appName}-${key}`);
    }
    throw Error('Either localStorage is undefined or localStorage.removeItem is not a function');
  } catch (error) {
    catchError({
      title: 'localStorage.removeItem not found',
      error: error as Error,
    });
  }
};

export const clearLocalStorage = () => {
  try {
    forEach(allStorageKeys, (key) => {
      removeLocalStorageItem(key);
    });
  } catch (error) {
    catchError({
      title: 'localStorage.clear not found',
      error: error as Error,
    });
  }
};
