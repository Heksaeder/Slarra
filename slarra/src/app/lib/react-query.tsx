'use client'
import { ReactNode, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

interface ReactQueryProviderProps {
  children: ReactNode;
}

const ReactQueryProvider = ({ children }: ReactQueryProviderProps) => {

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default ReactQueryProvider;
