import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ConfigProvider, App as AntdApp } from 'antd';
import { store } from '@/app/store';
import { queryClient } from '@/core/query/queryClient';
import { ThemeProvider, useTheme } from '@/theme/ThemeContext';
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary';

/**
 * Ant Design Consumer to inject dynamic AntD theme token map from ThemeContext.
 */
const AntdThemeBridge: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { antdTheme } = useTheme();

  return (
    <ConfigProvider theme={antdTheme}>
      <AntdApp>{children}</AntdApp>
    </ConfigProvider>
  );
};

export interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * Enterprise compound provider assembling Query, Redux, Theme, AntD, and Error Boundaries.
 */
export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ReduxProvider store={store}>
          <ThemeProvider>
            <AntdThemeBridge>{children}</AntdThemeBridge>
          </ThemeProvider>
        </ReduxProvider>
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </ErrorBoundary>
  );
};
