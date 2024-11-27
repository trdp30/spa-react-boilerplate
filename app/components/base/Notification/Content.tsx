import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentLines, faCommentExclamation, faCommentXmark, faCommentCheck } from '@fortawesome/pro-solid-svg-icons';
import { faXmark } from '@fortawesome/pro-light-svg-icons';
import React, { ReactNode } from 'react';
import classNames from 'classnames';
import { get } from 'lodash';
import { NotificationContentProps } from '@components/base/Notification/types';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { handleEnterKeyPress } from '@utils/keyboardHelpers';

const dataMap = {
  success: { Icon: faCommentCheck, color: 'text-green-700', borderColor: 'border-green-100' },
  danger: { Icon: faCommentXmark, color: 'text-rose-600', borderColor: 'border-rose-100' },
  warning: { Icon: faCommentExclamation, color: 'text-yellow-500', borderColor: 'border-yellow-100' },
  info: { Icon: faCommentLines, color: 'text-blue-700', borderColor: 'border-blue-100' },
  default: { Icon: faCommentLines, color: 'text-blue-700', borderColor: 'border-blue-100' },
  processing: { Icon: faCommentLines, color: 'text-blue-700', borderColor: 'border-blue-100' },
};

const Content = (props: NotificationContentProps) => {
  const { title, summary, close, actions, variant } = props;
  return (
    <div
      className={classNames(
        'flex flex-1 items-start py-3 border-l-8 bg-white w-[350px]',
        get(dataMap, `${variant}.borderColor`)
      )}
    >
      <div className="w-11 flex justify-center items-start  mt-1" data-chromatic="ignore">
        <FontAwesomeIcon
          icon={get(dataMap, `${variant}.Icon`) as IconProp}
          className={classNames(get(dataMap, `${variant}.color`))}
          aria-hidden="true"
          size="lg"
        />
      </div>
      <div className={classNames('flex flex-1 flex-col justify-center items-center')}>
        {title ? (
          <>
            <div className="flex justify-between w-full">
              <div>
                <span className="text-sm text-gray-900 font-semibold leading-5 self-stretch">{title as ReactNode}</span>
                {summary ? <p className="text-sm text-gray-900 font-normal">{summary as ReactNode}</p> : <></>}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center w-full h-full">
              <div>
                {summary ? <p className="text-sm text-gray-900 font-normal pt-1">{summary as ReactNode}</p> : <></>}
              </div>
            </div>
          </>
        )}
        <div className="flex justify-start items-center w-full space-x-4">
          {actions ? (
            <>
              {actions.map((action) => (
                <span
                  key={action.label}
                  role="button"
                  tabIndex={-1}
                  className={classNames(
                    'cursor-pointer text-sm font-medium',
                    get(dataMap, `${action.variant || 'default'}.color`)
                  )}
                  onClick={action.onClick}
                  onKeyDown={(e) => handleEnterKeyPress(e, action.onClick)}
                >
                  {action.label}
                </span>
              ))}
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className="pr-4 pl-4 pt-[2px]">
        <FontAwesomeIcon
          icon={faXmark}
          size="lg"
          onClick={close}
          className="text-black"
          data-testid="close-toast-notification"
        />
      </div>
    </div>
  );
};

export default Content;
