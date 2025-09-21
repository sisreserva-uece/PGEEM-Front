import type { UserRole } from '@/features/auth/types';

export type SubItem = {
  title: string;
  href: string;
  allowedRoles: UserRole[];
  isManagerOnly?: boolean;
};

export type RouteConfig = {
  title: string;
  href: string;
  path: string;
  allowedRoles: UserRole[];
  subItems?: SubItem[];
};

export const routesConfig: RouteConfig[] = [
  {
    title: 'Espaços',
    href: '#',
    path: '/dashboard/espacos',
    allowedRoles: [],
    subItems: [
      {
        title: 'Buscar Espaços',
        href: '/dashboard/espacos',
        allowedRoles: [],
      },
      {
        title: 'Meus Espaços Gerenciados',
        href: '/dashboard/meus-espacos',
        allowedRoles: [],
        isManagerOnly: true,
      },
    ],
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
        allowedRoles: ['ADMIN', 'PROFESSOR', 'COORDENADOR'],
      },
      {
        title: 'Gerenciar Tipos',
        href: '/dashboard/equipamentos?tab=tipos',
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
