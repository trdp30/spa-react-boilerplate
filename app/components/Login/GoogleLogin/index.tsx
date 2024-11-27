import React from 'react';
import { useIntl } from 'react-intl';
import messages from './messages';
import { handleEnterKeyPress } from '@utils/keyboardHelpers';
import classNames from 'classnames';
import { getAssetUrl } from '@utils/getAssetUrl';

interface GoogleLoginProps {
  getAuth: () => void;
  disabled: boolean;
}

const GoogleLogin: React.FC<GoogleLoginProps> = ({ getAuth, disabled }) => {
  const intl = useIntl();

  const handleClick = () => {
    getAuth();
  };

  return (
    <button
      tabIndex={1}
      className={classNames(
        'flex justify-center items-center bg-sky-100 space-x-3 rounded-full w-full py-2.5 md:py-3',
        disabled ? 'no-drop' : 'cursor-pointer'
      )}
      onClick={handleClick}
      onKeyDown={(e) => handleEnterKeyPress(e, handleClick)}
      disabled={disabled}
    >
      <img
        src={getAssetUrl('googleIcon.svg')}
        alt={intl.formatMessage(messages.altIconText)}
        className="md:w-6 md:h-6 w-4 h-4"
      />
      <span className="text-base md:text-lg font-medium">{intl.formatMessage(messages.buttonText)}</span>
    </button>
  );
};

export default GoogleLogin;
