'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

export function Header() {
  const t = useTranslations('global');
  return (
    <header className="w-full bg-gradient-to-r from-[color:var(--color-green-bg)] from-65% to-[color:var(--color-blue-gradient)] px-8 py-4">
      <div className="max-w-[1920px] mx-auto flex items-center justify-between">
        <Image
          src="/assets/images/header/logo.png"
          alt="Logo da Universidade Estadual do Ceará"
          width={270}
          height={80}
          className="w-auto h-[80px]"
          priority
        />
        <div className="flex items-center gap-4 text-white">
          <h1
            className="text-4xl font-black tracking-wide"
            style={{ fontFamily: 'Archivo Black, sans-serif' }}
          >
            SisEspaços
          </h1>
          <div className="h-16 border-l border-white/75" />
          <div className="text-base opacity-90">
            <div>Sistema de Gestão de Espaços</div>
            <div>
              {t('version')}
              {' '}
              1.0.0-Alpha
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
