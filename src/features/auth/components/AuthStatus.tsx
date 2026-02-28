'use client';

import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useLogout } from '../hooks/useLogout';

export function AuthStatus() {
  const { status, user } = useAuthStore();
  const { logout, isPending } = useLogout();

  if (status === 'unauthenticated' || !user) {
    return null;
  }

  return (
    <div className="flex items-center gap-4 text-white">
      <span className="font-light text-sm">
        Bem-vindo(a),
        {' '}
        {user.nome}
      </span>
      <Button
        onClick={() => logout()}
        variant="destructive_outline"
        size="sm"
        disabled={isPending}
      >
        {isPending ? 'Saindo...' : 'Sair'}
      </Button>
    </div>
  );
}
