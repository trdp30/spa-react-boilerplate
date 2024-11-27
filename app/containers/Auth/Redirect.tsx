import AuthContext from '@contexts/AuthContext';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
// import * as Sentry from '@sentry/react';

export const Redirect = () => {
  const { queryParams } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (queryParams?.from) {
      const path = `${queryParams?.from}`;
      navigate(path, { replace: true });
    } else {
      // Sentry.captureMessage(`Redirect page:  ${JSON.stringify(queryParams)}`);
    }
  }, [queryParams?.from]);

  console.log('Redirecting page content: ', queryParams);

  return (
     
    <div>Redirecting...</div>
  );
};
