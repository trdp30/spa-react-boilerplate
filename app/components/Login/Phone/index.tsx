// PhoneNumber.tsx

import React, { ReactNode } from 'react';
import PhoneInput from 'react-phone-number-input';
import { FormattedMessage } from 'react-intl';
import type { CountryCode } from 'libphonenumber-js/core';
import 'react-phone-number-input/style.css';
import Input from './Input';
import messages from './messages';
import classNames from 'classnames';
import type { Phone } from '@components/Login/types';

interface PhoneNumberProps {
  defaultCountry?: CountryCode;
  international?: boolean;
  countrySelectClassName?: string;
  onChange?: (value: string | undefined) => void;
  phoneNumber?: Phone;
  setPhoneNumber: (value: Phone) => void;
  error?: ReactNode;
  disabled: boolean;
}

const PhoneNumber: React.FC<PhoneNumberProps> = ({
  defaultCountry,
  international = true,
  onChange,
  phoneNumber,
  setPhoneNumber,
  error,
  disabled,
}) => {
  const handleChange = (newValue: Phone) => {
    setPhoneNumber(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className="flex flex-col items-left space-y-1">
      <div className="text-gray-700 text-sm font-normal">
        <FormattedMessage {...messages.phone} />
      </div>
      <PhoneInput
        international={international}
        defaultCountry={defaultCountry}
        disabled={disabled}
        autoComplete={'phone'}
        placeholder="Enter phone number"
        value={phoneNumber}
        onChange={handleChange}
        className={classNames(
          'flex items-center px-2 border border-gray-300 rounded-md w-full',
          error ? 'focus:ring-red-700 focus:border-red-700 border-red-700' : ''
        )}
        inputComponent={Input}
        countrySelectProps={{
          className: 'rounded-md border-transparent bg-transparent text-gray-500 focus:outline-none text-sm w-16',
        }}
        focusInputOnCountrySelection={false}
      />
      {error && <p className="text-left text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default PhoneNumber;
