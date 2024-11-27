import VerifyOtp from '@components/Login/VerifyOtp/Loadable';
import LoginContainer, { AuthRedirectLoadable } from '@containers/Auth/Loadable';
import Login from '@containers/Auth/Login/Loadable';
import { Logout } from '@containers/Auth/Logout';
import { Redirect } from '@containers/Auth/Redirect';
import { createBrowserRouter } from 'react-router-dom';
import RootErrorPage from './RootErrorPage';
import RootLayout from './RootLayout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RootErrorPage />,
    children: [
      {
        lazy: LoginContainer,
        children: [
          {
            path: 'login',
            lazy: Login,
          },
          {
            path: 'verify',
            lazy: VerifyOtp,
          },
        ],
      },
      {
        lazy: AuthRedirectLoadable,
        children: [
          {
            path: 'redirect',
            element: <Redirect />,
          },
          {
            path: 'logout',
            element: <Logout />,
          },
        ],
      },
    ],
  },
]);

export default router;
