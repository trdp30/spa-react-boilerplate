import React from 'react';
import { RouterProvider } from 'react-router-dom';
// import * as Sentry from '@sentry/react';
// import { faSpinner } from '@fortawesome/pro-light-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import router from './router';

// function FallbackComponent() {
//   return (
//     <div className={'h-full w-full flex flex-1 justify-center items-center'} data-testid="fallback-component">
//       <FontAwesomeIcon icon={faSpinner} spin={true} />
//     </div>
//   );
// }

const App: React.FC = () => {
  return (
    // <Sentry.ErrorBoundary fallback={<FallbackComponent />} showDialog>
    <RouterProvider router={router} />
    // </Sentry.ErrorBoundary>
  );
};

export default App;
