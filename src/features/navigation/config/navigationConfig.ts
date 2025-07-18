import type { UserProfile } from '@/features/auth/types';

export type NavItem = {
  title: string;
  href: string;
  subItems?: Omit<NavItem, 'subItems'>[];
};

const navigationConfig: Record<UserProfile['cargosNome'][0], NavItem[]> = {
  ADMINISTRADOR: [
    { title: 'dashboard', href: '/dashboard' },
    { title: 'spaces', href: '/dashboard/spaces' },
  ],
  PROFESSOR: [
    { title: 'dashboard', href: '/dashboard' },
    { title: 'reservations', href: '/dashboard/reservations' },
  ],
};

export default navigationConfig;
