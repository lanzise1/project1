"use client";

import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { ToastProvider } from '@/context';
import { ChakraProvider } from '@chakra-ui/react';
import { RouteGuard } from './RouteGuard';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ChakraProvider>
        <ToastProvider>
          <RouteGuard>
            {children}
          </RouteGuard>
        </ToastProvider>
      </ChakraProvider>
    </Provider>
  );
}