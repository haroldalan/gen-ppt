'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const qc = new QueryClient();
export function Providers({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}
