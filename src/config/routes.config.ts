import type { UserRole } from '@/features/auth/types';

export type RouteConfig = {
  title: string;
  href: string;
  path: string;
  allowedRoles: UserRole[];
  subItems?: RouteConfig[];
};

export const routesConfig: RouteConfig[] = [
  {
    title: 'Espaços',
    href: '/dashboard/espacos',
    path: '/dashboard/espacos',
    allowedRoles: ['ADMIN', 'COORDENADOR'],
  },
  {
    title: 'Equipamentos',
    href: '#',
    path: '/dashboard/equipamentos',
    allowedRoles: ['ADMIN', 'PROFESSOR', 'COORDENADOR'],
    subItems: [
      {
        title: 'Gerenciar Equipamentos',
        href: '/dashboard/equipamentos?tab=equipamentos',
        path: '/dashboard/equipamentos',
        allowedRoles: ['ADMIN', 'PROFESSOR', 'COORDENADOR'],
      },
      {
        title: 'Gerenciar Tipos',
        href: '/dashboard/equipamentos?tab=tipos',
        path: '/dashboard/equipamentos',
        allowedRoles: ['ADMIN'],
      },
    ],
  },
];
