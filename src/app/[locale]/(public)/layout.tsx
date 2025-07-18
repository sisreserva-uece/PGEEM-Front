import React from 'react';
import { CenteredPageLayout } from '@/components/CenteredPageLayout';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CenteredPageLayout>{children}</CenteredPageLayout>;
}
