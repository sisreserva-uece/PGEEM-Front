'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { AuthStatus } from '@/features/auth/components/AuthStatus';

export function Header() {
  const t = useTranslations('global');
  return (
    <header className="w-full bg-gradient-to-r from-[color:var(--color-green-bg)] from-65% to-[color:var(--color-blue-gradient)] px-8 py-4">
      <div className="mx-auto flex max-w-[1920px] items-center justify-between">
        <Image
          src="/assets/images/header/logo.png"
          alt="Logo da Universidade Estadual do Ceará"
          width={270}
          height={80}
          className="h-[80px] w-auto"
          priority
        />
        <div className="flex flex-col items-end gap-2 text-white">
          <div className="flex items-center gap-4">
            <h1
              className="text-4xl font-black tracking-wide"
              style={{ fontFamily: 'Archivo Black, sans-serif' }}
            >
              PGEEM
            </h1>
            <div className="h-16 border-l border-white/75" />
            <div className="text-sm opacity-90">
              <div>
                Plataforma de Gestão de Equipamento
                <br />
                e Espaços Multiusuários
              </div>
              <div>
                {t('version')}
                {' '}
                1.0.0-Alpha
              </div>
            </div>
          </div>
          <div className="w-full flex justify-end">
            <AuthStatus />
          </div>
        </div>
      </div>
    </header>
  );
}
