'use client';
import { Button } from '@/components/ui/button';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { useRouter } from '@/lib/i18nNavigation';
import '@/styles/global.css';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { logout, isPending } = useLogout();
  const handleLogout = () => {
    logout();
  };
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-[7rem] font-bold leading-tight">401</h1>
      <span className="font-medium">Acesso Não Autorizado</span>
      <p className="text-center text-muted-foreground">
        Você não tem permissão para visualizar esta página.
        {' '}
        <br />
        Verifique suas credenciais ou entre em contato com o suporte.
      </p>
      <div className="mt-6 flex gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          Voltar
        </Button>
        <Button onClick={handleLogout} disabled={isPending}>
          {isPending ? 'Saindo...' : 'Sair e ir para o Login'}
        </Button>
      </div>
    </div>
  );
}
