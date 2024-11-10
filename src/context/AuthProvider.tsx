'use client';

import { SessionProvider } from 'next-auth/react';
type SessionProviderType = typeof SessionProvider;
export default function AuthProvider({
  children,
  
  }: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider >
      {children}
    </SessionProvider>
  );
}