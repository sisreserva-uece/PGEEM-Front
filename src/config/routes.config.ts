import type { UserRole } from '@/features/auth/types';

export type RouteConfig = {
  title: string;
  href: string;
  allowedRoles: UserRole[];
  subItems?: RouteConfig[];
};

export const routesConfig: RouteConfig[] = [
  {
    title: 'Espaços',
    href: '/dashboard/espacos',
    allowedRoles: ['ADMIN', 'COORDENADOR'],
  },
];
