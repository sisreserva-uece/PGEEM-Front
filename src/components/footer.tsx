import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('footer');
  return (
    <footer className="w-full bg-[color:var(--color-green-bg)] px-6 py-4 text-center text-white">
      <div className="max-w-[1920px] mx-auto">
        <span>
          {t('university')}
          {' '}
          |
          {' '}
        </span>
        <a href="privacy" className="text-[color:var(--anchor)] hover:underline">
          {t('privacyPolicy')}
        </a>
      </div>
    </footer>
  );
}
