import AuthContext from '@contexts/AuthContext';
import { faSpinner } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppDispatch } from '@store/hooks';
import React, { useContext, useLayoutEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { getAllParams } from './helpers';
import { storeQueryParams } from './slice';

export const LoginContainer: React.FC = () => {
  const { isAuthenticating, isInitialized, queryParams } = useContext(AuthContext);
  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    if (isInitialized) {
      const params = getAllParams();
      dispatch(storeQueryParams({ ...queryParams, ...params }));
    }
  }, [isInitialized]);

  return (
    <div className="flex justify-center items-center h-full w-full overflow-hidden">
      {isAuthenticating || !isInitialized ? (
        <div className="min-h-[500px] flex items-center" data-testid="login-container-spinner">
          <FontAwesomeIcon icon={faSpinner} spin />
        </div>
      ) : (
        <Outlet />
      )}
    </div>
  );
};

LoginContainer.displayName = 'Login';
