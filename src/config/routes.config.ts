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
    href: '#',
    allowedRoles: ['ADMIN', 'COORDENADOR'],
    subItems: [
      {
        title: 'Criar Espaço',
        href: '/espacos/criar',
        allowedRoles: ['ADMIN'],
      },
      {
        title: 'Ver Espaços',
        href: '/espacos',
        allowedRoles: ['ADMIN', 'COORDENADOR'],
      },
    ],
  },
  {
    title: 'Equipamentos',
    href: '#',
    allowedRoles: ['ADMIN', 'COORDENADOR'],
    subItems: [
      {
        title: 'Criar Espaço',
        href: '/espacos/criar',
        allowedRoles: ['ADMIN'],
      },
      {
        title: 'Ver Espaços',
        href: '/espacos',
        allowedRoles: ['ADMIN', 'COORDENADOR'],
      },
    ],
  },
  {
    title: 'Alunos',
    href: '#',
    allowedRoles: ['ADMIN', 'COORDENADOR'],
    subItems: [
      {
        title: 'Criar Espaço',
        href: '/espacos/criar',
        allowedRoles: ['ADMIN'],
      },
      {
        title: 'Ver Espaços',
        href: '/espacos',
        allowedRoles: ['ADMIN', 'COORDENADOR'],
      },
    ],
  },
  {
    title: 'Gestão de Usuários',
    href: '/admin/users',
    allowedRoles: ['ADMIN'],
  },
];
