import React, { createContext, useCallback, useMemo, useRef, useState } from 'react';
import intl, { changeLanguage, DEFAULT_LOCALE, translations } from '@utils/intl';
import { IntlShape, RawIntlProvider } from 'react-intl';

export type LanguageContextInterface = {
  locale: keyof typeof translations;
  intl: IntlShape;
};

export interface LanguageContextInterfaceWithHandleChange extends LanguageContextInterface {
  handleChangeLanguage: (locale: keyof typeof translations) => void;
}

export const LanguageContext = createContext<LanguageContextInterface | LanguageContextInterfaceWithHandleChange>({
  locale: DEFAULT_LOCALE,
  intl: intl,
});

interface LanguageProviderTypes {
  children: React.ReactNode | React.ReactElement;
}

export const LanguageProvider = (props: LanguageProviderTypes) => {
  const [selectedLanguage, setSelectedLanguage] = useState(DEFAULT_LOCALE);
  const intlInstance = useRef(intl);

  const handleChangeLanguage = useCallback(
    (locale: keyof typeof translations) => {
      intlInstance.current = changeLanguage(locale);
      setSelectedLanguage(locale);
    },
    [setSelectedLanguage]
  );

  const value = useMemo(
    () => ({
      locale: selectedLanguage,
      intl: intlInstance.current,
      handleChangeLanguage,
    }),
    [selectedLanguage, intlInstance.current, handleChangeLanguage]
  );

  return (
    <LanguageContext.Provider value={value}>
      <RawIntlProvider value={intlInstance.current}>{props.children}</RawIntlProvider>
    </LanguageContext.Provider>
  );
};
