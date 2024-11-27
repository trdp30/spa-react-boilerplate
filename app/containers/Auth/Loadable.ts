import LazyLoaderErrorBoundary from '@components/Errors/LazyLoaderErrorBoundary';

export default async function Loadable() {
  const { LoginContainer } = await import('@containers/Auth/LoginContainer');
  return {
    Component: LoginContainer,
    ErrorBoundary: LazyLoaderErrorBoundary,
  };
}

export async function AuthRedirectLoadable() {
  const { AuthRedirect } = await import('./AuthRedirect');
  return {
    Component: AuthRedirect,
    ErrorBoundary: LazyLoaderErrorBoundary,
  };
}
