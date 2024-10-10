import React, { createContext, useContext, useRef, ReactNode } from 'react';

type ToastSeverityType = 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast' | undefined;

interface ToastContextType {
  showToast: (severity: ToastSeverityType, summary: string, detail: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {

 

  return (
    <div>
      {children}
    </div>
  );
};

export const useToast = (): ((severity: ToastSeverityType, summary: string, detail: string) => void) => {
 
};