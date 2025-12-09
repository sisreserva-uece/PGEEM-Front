import { redirect } from '@/lib/i18nNavigation';
import { getSession } from '@/lib/session';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function RootPage({ params }: Props) {
  const { locale } = await params;
  const token = await getSession();
  if (token) {
    redirect({ href: '/dashboard', locale });
  } else {
    redirect({ href: '/signin', locale });
  }
}
