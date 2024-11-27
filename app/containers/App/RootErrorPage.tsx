import { useRouteError } from 'react-router-dom';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

interface RouteError {
  statusText: string;
  message: string;
}

const RootErrorPage: React.FC = () => {
  const error = useRouteError() as RouteError;
  console.error(error);

  return (
    <div id="root-error-page">
      <p>
        <i>{error?.statusText || error?.message || <FormattedMessage {...messages.something_went_wrong} />}</i>
      </p>
    </div>
  );
};

export default RootErrorPage;
