import { translations } from '@utils/intl';
import React, { useContext } from 'react';
import { LanguageContext, LanguageContextInterfaceWithHandleChange } from '@contexts/LanguageContext';
import { useIntl } from 'react-intl';
import messages from './messages';

const ChangeLanguage = () => {
  const { handleChangeLanguage, locale } = useContext(LanguageContext) as LanguageContextInterfaceWithHandleChange;
  const intl = useIntl();
  return (
    <select
      name="locale"
      className={'w-16 h-9'}
      value={locale}
      aria-label={intl.formatMessage(messages?.select_language)}
      id="locale"
      onChange={(event): void => handleChangeLanguage(event.target.value as keyof typeof translations)}
    >
      {Object.keys(translations).map((locale) => (
        <option key={locale} value={locale}>
          {locale}
        </option>
      ))}
    </select>
  );
};

export default ChangeLanguage;
