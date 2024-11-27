import LazyLoaderErrorBoundary from '@components/Errors/LazyLoaderErrorBoundary';

export default async function Loadable() {
  const { Login } = await import('@components/Login');
  return {
    Component: Login,
    ErrorBoundary: LazyLoaderErrorBoundary,
  };
}
