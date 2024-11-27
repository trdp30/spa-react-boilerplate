import React from 'react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@components/Login/InputOTP/InputOTP';

interface InputOtpProps {
  value: string | undefined;
  setValue: (value: string | undefined) => void;
  disabled: boolean;
  isPhone: boolean;
}

const PHONE_OTP_LENGTH = 6;
const EMAIL_OTP_LENGTH = 8;

export function InputOtp(props: InputOtpProps) {
  const { setValue, disabled, isPhone } = props;

  return (
    <InputOTP
      maxLength={isPhone ? PHONE_OTP_LENGTH : EMAIL_OTP_LENGTH}
      onChange={(value) => setValue(value)}
      disabled={disabled}
    >
      <InputOTPGroup>
        {[...Array(isPhone ? PHONE_OTP_LENGTH : EMAIL_OTP_LENGTH)].map((_, i) => {
          return <InputOTPSlot index={i} key={i} />;
        })}
      </InputOTPGroup>
    </InputOTP>
  );
}
