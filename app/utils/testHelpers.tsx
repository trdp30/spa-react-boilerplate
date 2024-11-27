import AuthContext, { authContextInitialState } from '@contexts/AuthContext';
import { LanguageProvider } from '@contexts/LanguageContext';
import type { InitialEntry } from '@remix-run/router';
import store from '@store/index';
import type { RenderOptions } from '@testing-library/react';
import { RenderResult, render as rtlRender } from '@testing-library/react';
import type { ReactNode } from 'react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';

interface ExtendedRenderOptions extends RenderOptions {
  initialPath?: '/';
  route?: InitialEntry[];
  authContextValues?: typeof authContextInitialState;
}

class ResizeObserver {
  observe() {}

  unobserve() {}

  disconnect() {}
}

window.ResizeObserver = ResizeObserver;

function render(ui: React.ReactNode, options?: ExtendedRenderOptions): RenderResult {
  const Wrapper = (props: { children: ReactNode }) => {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={options?.route}>
          <AuthContext.Provider value={options?.authContextValues || authContextInitialState}>
            <LanguageProvider>{props.children}</LanguageProvider>
          </AuthContext.Provider>
        </MemoryRouter>
      </Provider>
    );
  };

  return { ...rtlRender(ui, { wrapper: Wrapper, ...options }) };
}

export * from '@testing-library/react';

export { render };
