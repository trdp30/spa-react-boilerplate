import { useIntl, IntlShape } from 'react-intl';

export const formatIntlMessage = (id: string, defaultMessage: string, values?: Record<string, string>) => {
  const intl: IntlShape = useIntl();
  return intl.formatMessage({ id, defaultMessage }, values);
};
