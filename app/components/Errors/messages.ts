import { defineMessages } from 'react-intl';

export default defineMessages({
  heading: {
    id: 'app.components.Errors.LazyLoaderErrorBoundary.heading',
    defaultMessage: 'Connection Lost',
  },
  description: {
    id: 'app.components.Errors.LazyLoaderErrorBoundary.description',
    defaultMessage: "It looks like we've lost connection. Please try again.",
  },
  retry: {
    id: 'app.components.Errors.LazyLoaderErrorBoundary.contactSupport',
    defaultMessage: 'Retry',
  },
  errorImage: {
    id: 'app.components.Errors.LazyLoaderErrorBoundary.errorImage',
    defaultMessage: 'Error Image',
  },
});
