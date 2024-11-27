import React from 'react';
import messages from './messages';
import { FormattedMessage } from 'react-intl';

export const Logout: React.FC = () => {
  return (
    <div data-testid="logout-key">
      <FormattedMessage {...messages.logout} />
    </div>
  );
};

Logout.displayName = 'Logout';
