import { useContext, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Outlet, useNavigate } from 'react-router-dom';
import AuthContext from '@contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/pro-solid-svg-icons';

export function AuthRedirect() {
  const { isAuthenticated, isAuthenticating, isInitialized } = useContext(AuthContext);
  const navigate = useNavigate();

  const landingPathAndSearchParams = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('from', new URL(window.location.href).pathname);
    return params.toString();
  }, []);

  useEffect(() => {
    if (!isAuthenticating && !isAuthenticated && isInitialized) {
      navigate({
        pathname: '/login',
        search: landingPathAndSearchParams,
      });
    }
  }, [isAuthenticating, isAuthenticated, isInitialized]);

  if (isAuthenticated) {
    return <Outlet />;
  }

  return (
    <div className="flex flex-1 h-full w-full justify-center items-center">
      <FontAwesomeIcon icon={faSpinner} spin data-testid="loading" />
    </div>
  );
}

AuthRedirect.propTypes = {
  path: PropTypes.string,
  location: PropTypes.object,
};
