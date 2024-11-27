import LazyLoaderErrorBoundary from '@components/Errors/LazyLoaderErrorBoundary';

export default async function Loadable() {
  const { VerifyOtp } = await import('./index');
  return {
    Component: VerifyOtp,
    ErrorBoundary: LazyLoaderErrorBoundary,
  };
}
