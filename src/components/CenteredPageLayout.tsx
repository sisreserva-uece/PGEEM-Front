import React from 'react';

export function CenteredPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full items-center justify-center p-4">
      {children}
    </div>
  );
}
