'use client';

import { useEffect } from 'react';
import { useLogout } from '@/features/auth/hooks/useLogout';

export function ForceLogout() {
  const { logout } = useLogout();

  useEffect(() => {
    logout();
  });

  return (
    <div className="flex h-screen w-full items-center justify-center bg-white">
      <div className="text-center">
        <p className="text-lg font-medium text-gray-700">
          Sessão inválida. Redirecionando para o login...
        </p>
      </div>
    </div>
  );
}
