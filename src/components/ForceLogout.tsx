'use client';

import { useEffect, useRef } from 'react';
import { logoutAction } from '@/features/auth/actions/authActions';

export function ForceLogout() {
  const called = useRef(false);
  useEffect(() => {
    if (called.current) {
      return;
    }
    called.current = true;
    logoutAction();
  }, []);
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
