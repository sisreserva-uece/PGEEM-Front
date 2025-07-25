'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from '@/lib/i18nNavigation';

export function NotFound() {
  const router = useRouter();
  return (
    <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
      <h1 className="text-[7rem] font-bold leading-tight">404</h1>
      <span className="font-medium">Opa!!</span>
      <p className="text-center text-muted-foreground">
        Parece que a página que você está procurando
        {' '}
        <br />
        não existe ou pode ter sido removida.
      </p>
      <div className="mt-6 flex gap-4">
        <Button onClick={() => router.replace('/')}>Ir para a Home</Button>
      </div>
    </div>
  );
}
