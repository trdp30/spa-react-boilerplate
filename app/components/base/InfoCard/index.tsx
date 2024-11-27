import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { InfoCardProps } from './types';

const InfoCard: React.FC<InfoCardProps> = ({
  title = 'Default Title',
  icon,
  iconClassName = 'text-blue-600 w-4 h-4',
  text = '-',
  textClassName = 'text-blue-600 text-sm font-semibold',
  titleClassName = 'text-gray-500 text-xs',
  iconContainerClassName = 'flex items-center justify-center',
  containerClassName = 'mb-4 p-2 rounded-md border border-gray-200 flex flex-col gap-1',
}) => {
  return (
    <>
      <div className={containerClassName}>
        {title && <div className={titleClassName}>{title}</div>}
        <div className="flex gap-2 cursor-pointer">
          {icon && (
            <div className={iconContainerClassName}>
              <FontAwesomeIcon icon={icon} className={iconClassName} />
            </div>
          )}
          {text && <div className={textClassName}>{text}</div>}
        </div>
      </div>
    </>
  );
};

export default InfoCard;
