import React from 'react';
import { useIntl } from 'react-intl';
import messages from './messages';
import { handleEnterKeyPress } from '@utils/keyboardHelpers';
import classNames from 'classnames';
import { getAssetUrl } from '@utils/getAssetUrl';

interface AppleLoginProps {
  getAuth: () => void;
  disabled?: boolean;
}

const AppleLogin: React.FC<AppleLoginProps> = ({ getAuth }) => {
  const intl = useIntl();

  const handleClick = () => {
    getAuth();
  };

  return (
    <button
      className={classNames('py-3  cursor-pointer')}
      onClick={handleClick}
      onKeyDown={(e) => handleEnterKeyPress(e, handleClick)}
    >
      <img src={getAssetUrl('apple.svg')} alt={intl.formatMessage(messages.altIconText)} className="w-12 h-12" />
    </button>
  );
};

export default AppleLogin;
