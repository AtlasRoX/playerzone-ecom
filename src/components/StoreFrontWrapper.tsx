"use client";
import { usePathname } from 'next/navigation';
import React from 'react';

export default function StoreFrontWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;
  return <>{children}</>;
}
