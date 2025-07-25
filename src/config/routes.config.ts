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
    allowedRoles: [],
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
  {
    title: 'Comitês',
    href: '/dashboard/comites',
    path: '/dashboard/comites',
    allowedRoles: ['ADMIN', 'COORDENADOR'],
  },
  {
    title: 'Usuários',
    href: '/dashboard/usuarios',
    path: '/dashboard/usuarios',
    allowedRoles: ['ADMIN'],
  },
  {
    title: 'Projetos',
    href: '/dashboard/projetos',
    path: '/dashboard/projetos',
    allowedRoles: ['ADMIN', 'PROFESSOR', 'PESQUISADOR'],
  },
  {
    title: 'Reservas',
    href: '/dashboard/reservas',
    path: '/dashboard/reservas',
    allowedRoles: ['ADMIN', 'PROFESSOR', 'PESQUISADOR'],
  },
];
