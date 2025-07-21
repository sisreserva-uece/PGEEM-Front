'use client';

import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useRouter } from '@/lib/i18nNavigation';

export function AuthStatus() {
  const { status, user, clearAuth } = useAuthStore();
  const router = useRouter();
  const handleLogout = () => {
    router.replace('/signin');
    clearAuth();
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
      >
        Sair
      </Button>
    </div>
  );
}
