import { LanguageProvider } from '@contexts/LanguageContext';
import React from 'react';
import { Root, createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './containers/App';
import './index.css';
import store from './store';
// import * as Sentry from '@sentry/react';

// Sentry.init({
//   dsn: '',
//   integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
//   release: process.env.VERSION || 'dev',
//   environment: process.env.APP_ENV || process.env.NODE_ENV || 'internal',
//   enabled: process.env.NODE_ENV !== 'development',
//   tracesSampleRate: process.env.NODE_ENV !== 'production' ? 1.0 : 0.5,
//   replaysSessionSampleRate: process.env.NODE_ENV !== 'production' ? 1.0 : 0.5,
//   replaysOnErrorSampleRate: 1.0,
//   normalizeDepth: 10,
// });

console.log('App version: ', process.env.VERSION);
console.log('Created at: ', process.env.CREATED_AT);

const rootElement = document.getElementById('root');
let root: Root;
if (rootElement) {
  root = createRoot(rootElement);
}

const renderApp = () => {
  if (root && root.render) {
    root.render(
      <React.StrictMode>
        <Provider store={store}>
          <LanguageProvider>
            <App />
          </LanguageProvider>
        </Provider>
      </React.StrictMode>
    );
  } else {
    console.error('Root element with id "root" not found in the document.');
  }
};

if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept('./containers/App', renderApp);
}
//Dev env deployment update
renderApp();
