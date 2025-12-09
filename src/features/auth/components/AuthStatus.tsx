'use client';
import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { logoutAction } from '@/features/auth/actions/authActions';
import { useAuthStore } from '@/features/auth/store/authStore';

export function AuthStatus() {
  const { status, user } = useAuthStore();
  const [isPending, startTransition] = useTransition();
  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };
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
        onClick={handleLogout}
        variant="destructive_outline"
        size="sm"
        disabled={isPending}
      >
        {isPending ? 'Saindo...' : 'Sair'}
      </Button>
    </div>
  );
}
