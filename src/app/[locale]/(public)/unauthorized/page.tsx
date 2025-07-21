'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import '@/styles/global.css';

export default function UnauthorizedPage() {
  //   TODO: make this a component
  const router = useRouter();
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
        <Button onClick={() => router.replace('/')}>Ir para a Home</Button>
      </div>
    </div>
  );
}
