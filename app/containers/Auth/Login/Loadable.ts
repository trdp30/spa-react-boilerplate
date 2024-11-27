import LazyLoaderErrorBoundary from '@components/Errors/LazyLoaderErrorBoundary';

export default async function Loadable() {
  const { Login } = await import('./index');
  return {
    Component: Login,
    ErrorBoundary: LazyLoaderErrorBoundary,
  };
}
