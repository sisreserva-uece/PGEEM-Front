type NavItem = {
  title: string;
  href: string;
  allowedRoles: string[];
  subItems?: NavItem[];
};

export const menuItems: NavItem[] = [
  {
    title: 'Espaços',
    href: '#',
    allowedRoles: ['ADMIN', 'GESTOR'],
    subItems: [
      {
        title: 'Criar Espaço',
        href: '/espacos/criar',
        allowedRoles: ['ADMIN'],
      },
      {
        title: 'Ver Espaços',
        href: '/espacos',
        allowedRoles: ['ADMIN', 'GESTOR'],
      },
    ],
  },
  {
    title: 'Gestão de Usuários',
    href: '/admin/users',
    allowedRoles: ['ADMIN'],
  },
];
