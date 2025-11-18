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
        allowedRoles: ['ADMIN', 'USUARIO_INTERNO', 'USUARIO_EXTERNO'],
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
    allowedRoles: ['ADMIN', 'USUARIO_INTERNO', 'USUARIO_EXTERNO'],
    subItems: [
      {
        title: 'Gerenciar Equipamentos',
        href: '/dashboard/equipamentos?tab=equipamentos',
        allowedRoles: ['ADMIN', 'USUARIO_INTERNO', 'USUARIO_EXTERNO'],
      },
      {
        title: 'Gerenciar Tipos',
        href: '/dashboard/equipamentos?tab=tipos',
        allowedRoles: ['ADMIN'],
      },
    ],
  },
  {
    title: 'Complexos',
    href: '/dashboard/complexos',
    path: '/dashboard/complexos',
    allowedRoles: ['ADMIN', 'USUARIO_INTERNO', 'USUARIO_EXTERNO'],
  },
  {
    title: 'Comitês',
    href: '/dashboard/comites',
    path: '/dashboard/comites',
    allowedRoles: ['ADMIN', 'USUARIO_INTERNO', 'USUARIO_EXTERNO'],
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
    allowedRoles: ['ADMIN', 'USUARIO_INTERNO', 'USUARIO_EXTERNO'],
  },
  {
    title: 'Reservas',
    href: '/dashboard/reservas',
    path: '/dashboard/reservas',
    allowedRoles: ['ADMIN', 'USUARIO_INTERNO', 'USUARIO_EXTERNO'],
  },
];
