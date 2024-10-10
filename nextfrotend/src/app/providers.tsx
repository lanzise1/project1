"use client";

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { ToastProvider } from '@/context';
import { useRouter } from 'next/navigation';


const RouteGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage?.getItem('token') : null;
  useEffect(() => {
    if (!token) {
      router.push('/login')
    }
  }, [token]) // 当 token 变化时，重新执行    


  return <>{children}</>;
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
        <ToastProvider>
          <RouteGuard>
            {children}
          </RouteGuard>
        </ToastProvider>
    </Provider>
  );
}