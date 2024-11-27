import React, { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import { Input } from '../../base/Input';
import classNames from 'classnames';
import messages from './messages';
import type { Email } from '@components/Login/types';

interface EmailLoginProps {
  email?: Email;
  setEmail: (e: string) => void;
  emailError?: ReactNode;
  disabled: boolean;
}

export function EmailLogin(props: EmailLoginProps) {
  const { email, setEmail, emailError, disabled } = props;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <div className={'w-full space-y-1'}>
      <div className="text-gray-700 text-sm font-normal">
        <FormattedMessage {...messages.email} />
      </div>
      <Input
        type="email"
        value={email}
        autoComplete={'email'}
        placeholder="Please enter email"
        onChange={handleChange}
        className={classNames(
          'flex items-center border border-gray-300 rounded-md w-full',
          emailError ? 'focus:ring-red-700 focus:border-red-700 border-red-700' : ''
        )}
        disabled={disabled}
      />
      {emailError && <p className="text-left text-sm text-red-700">{emailError}</p>}
    </div>
  );
}
