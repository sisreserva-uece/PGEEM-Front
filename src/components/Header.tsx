'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { AuthStatus } from '@/features/auth/components/AuthStatus';

export function Header() {
  const t = useTranslations('global');
  return (
    <header
      className="w-full bg-gradient-to-b from-[color:var(--color-green-bg)] from-65% to-[color:var(--color-blue-gradient)] px-4 py-4 sm:px-8 md:bg-gradient-to-r"
    >
      <div className="mx-auto flex max-w-[1920px] flex-col items-center gap-4 md:flex-row md:items-center md:justify-between">
        <Image
          src="/assets/images/header/logo.png"
          alt="Logo da Universidade Estadual do Ceará"
          width={270}
          height={80}
          className="h-16 w-auto md:h-20"
          priority
        />
        <div className="flex flex-col items-center gap-4 text-white md:items-end">
          <div className="flex flex-col items-center gap-2 md:flex-row md:gap-4">
            <h1
              className="text-3xl font-black tracking-wide md:text-4xl"
              style={{ fontFamily: 'Archivo Black, sans-serif' }}
            >
              PGEEM
            </h1>
            <div className="hidden h-16 border-l border-white/75 md:block" />
            <div className="hidden text-sm opacity-90 md:block md:text-left">
              <p>Plataforma de Gestão de Equipamento e Espaços Multiusuários</p>
              <p>
                {t('version')}
                {' '}
                1.0.0-Alpha
              </p>
            </div>
          </div>
          <div className="w-full flex justify-center md:justify-end">
            <AuthStatus />
          </div>
        </div>
      </div>
    </header>
  );
}
