import { FormattedMessage } from 'react-intl';
import messages from './messages';

export const TermsAndConditions = () => {
  return (
    <div className="text-xs font-medium md:text-sm text-gray-500 w-full">
      <FormattedMessage {...messages?.condition_msg} />
      <span className="mx-0.5">
        <a
          className="text-xs text-blue-600 font-medium md:text-sm underline-offset-1"
          href="https://www.google.com"
          target="_blank"
          rel="noreferrer"
        >
          <FormattedMessage {...messages?.terms_conditions} />
        </a>
      </span>
      <span className="mx-0.5">
        <FormattedMessage {...messages?.and} />
      </span>
      <span className="mx-0.5">
        <a
          className="text-xs text-blue-600 font-medium md:text-sm underline-offset-1"
          href="https://www.google.com"
          target="_blank"
          rel="noreferrer"
        >
          <FormattedMessage {...messages?.privacy_policy} />
        </a>
      </span>
    </div>
  );
};
