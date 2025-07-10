'use client';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import '@/styles/global.css';

export const metadata: Metadata = {
  title: 'Not Found',

};
export default function NotFound() {
  const router = useRouter();

  return (
    <div className="h-screen">
      <Image className="mr-auto mt-12 ml-12" src="/assets/images/logo-hex-boost.svg" width="48" height="48" alt="logo"></Image>
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
          <Button variant="outline" onClick={() => router.back()}>
            Voltar
          </Button>
          <Button onClick={() => router.push('/')}>Ir para a Home</Button>
        </div>
      </div>
    </div>
  );
}
