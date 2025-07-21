'use client';

import Link from 'next/link';
import * as React from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { useAuthStore } from '@/features/auth/store/authStore';
import { menuItems } from '@/features/nav-bar/config/navigation';

export function ProtectedNavigation() {
  const { user } = useAuthStore();
  const userRoles = user?.cargos?.map(cargo => cargo.nome) || [];

  function hasAccess(allowedRoles: string[]) {
    return allowedRoles.some(role => userRoles.includes(role));
  }

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {menuItems.map((item) => {
          if (!hasAccess(item.allowedRoles)) {
            return null;
          }
          const visibleSubItems = item.subItems
            ? item.subItems.filter(sub => hasAccess(sub.allowedRoles))
            : [];

          return (
            <NavigationMenuItem key={item.title}>
              <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-4">
                  {visibleSubItems.length > 0
                    ? visibleSubItems.map(sub => (
                        <li key={sub.title}>
                          <NavigationMenuLink asChild>
                          <Link href={sub.href}>{sub.title}</Link>
                          </NavigationMenuLink>
                        </li>
                      ))
                    : (
                      <li>
                        <NavigationMenuLink asChild>
                          <Link href={item.href}>{item.title}</Link>
                        </NavigationMenuLink>
                      </li>
                    )}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
