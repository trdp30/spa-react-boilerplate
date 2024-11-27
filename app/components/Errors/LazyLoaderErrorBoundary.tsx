import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { Button } from '@components/base/Button';
import { getAssetUrl } from '@utils/getAssetUrl';
import messages from './messages';

function LazyLoaderErrorBoundary() {
  const error = useRouteError();
  const intl = useIntl();

  const handleContactSupport = () => {
    window.location.reload();
  };

  const renderErrorMessage = () => {
    if (isRouteErrorResponse(error)) {
      return `${error?.status} ${error?.statusText}`;
    }

    if (typeof error === 'object' && error !== null && 'message' in error) {
      return (error as Error)?.message;
    }

    return String(error);
  };

  return (
    <div
      className="flex flex-col flex-1 justify-center items-center text-center lg:px-32 lg:py-4"
      data-testid="error-boundary"
    >
      <div
        className="text-gray-900 md:font-bold lg:text-3xl md:text-xl text-lg font-semibold mb-4 mt-2"
        data-testid="error-heading"
      >
        <FormattedMessage {...messages?.heading} />
      </div>
      <div className="mb-4" data-testid="error-image-container">
        <img
          src={getAssetUrl('connection-lost.png')}
          className="h-60 md:h-72 lg:h-80"
          alt={intl.formatMessage(messages?.errorImage)}
          data-testid="error-image"
        />
      </div>
      <div className="px-4 mb-4 font-normal lg:text-lg md:text-base text-sm" data-testid="error-message">
        {renderErrorMessage()}
        <br />
        <FormattedMessage {...messages?.description} />
      </div>

      <div>
        <Button
          variant="secondary"
          className="rounded"
          onClick={handleContactSupport}
          data-testid="contact-support-button"
        >
          <FormattedMessage {...messages?.retry} />
        </Button>
      </div>
    </div>
  );
}

export default LazyLoaderErrorBoundary;
