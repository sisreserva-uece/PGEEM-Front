'use client';

import { Button } from '@/components/ui/button';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { useAuthStore } from '@/features/auth/store/authStore';

export function AuthStatus() {
  const { status, user } = useAuthStore();
  const { logout, isPending } = useLogout();
  const handleLogout = () => {
    logout();
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
        Sair
      </Button>
    </div>
  );
}
