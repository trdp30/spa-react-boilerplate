import { formatIntlMessage } from '@utils/formattedIntlMsg';
import { getAssetUrl } from '@utils/getAssetUrl';
import classNames from 'classnames';

interface LogoProps {
  size: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeMap = {
  sm: 'h-6',
  md: 'h-8',
  lg: 'h-10',
  xl: 'h-12',
};

export const Logo = ({ size }: LogoProps) => {
  const orgLogo = getAssetUrl('Logo.png');

  return (
    <div>
      <img
        className={classNames(sizeMap[size], 'max-w-max')}
        src={orgLogo}
        alt={formatIntlMessage('app.components.base.logo.logo.altText', 'Logo')}
      />
    </div>
  );
};
