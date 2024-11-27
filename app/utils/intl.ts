import { createIntl, createIntlCache, IntlShape } from 'react-intl';
import enTranslationMessages from '../locale/en.json';
import esTranslationMessages from '../locale/es.json';
import { get } from 'lodash';
import { LANG_STORAGE_KEY, localStorageGetItem, localStorageSetItem } from '@utils/localStorageHelpers';
import { catchError } from '@utils/sentry';

export const translations: {
  en: { [key: string]: string };
  es: { [key: string]: string };
} = {
  en: enTranslationMessages,
  es: esTranslationMessages,
};

export const DEFAULT_LOCALE_CONSTANT = 'en';

export const defaultLocale: () => keyof typeof translations = () => {
  try {
    const val = localStorageGetItem(LANG_STORAGE_KEY);
    if (val) {
      return val as keyof typeof translations;
    }
    return DEFAULT_LOCALE_CONSTANT;
  } catch (error) {
    catchError({
      title: 'An error occurred in defaultLocale function',
      error: error as Error,
    });
    return DEFAULT_LOCALE_CONSTANT;
  }
};

export const DEFAULT_LOCALE: keyof typeof translations = defaultLocale();

export const cache = createIntlCache();

const translationContent = translations[DEFAULT_LOCALE];

export let intl = createIntl({ locale: DEFAULT_LOCALE, messages: translationContent }, cache);

export let fmt = intl.formatMessage;

export const changeLanguage = (newLocale: keyof typeof translations): IntlShape => {
  try {
    const parsedLocale = (newLocale || '').trim().length && get(translations, newLocale) ? newLocale : DEFAULT_LOCALE;
    const translationContent = get(translations, parsedLocale);
    intl = createIntl({ locale: newLocale, messages: translationContent }, cache);
    fmt = intl.formatMessage;
    if (typeof document !== 'undefined') {
      document.documentElement.lang = parsedLocale;
    }
    localStorageSetItem(LANG_STORAGE_KEY, parsedLocale);
    return intl;
  } catch (error) {
    catchError({
      title: 'An error occurred in changeLanguage function',
      error: error as Error,
    });
    return intl;
  }
};

export default intl;
