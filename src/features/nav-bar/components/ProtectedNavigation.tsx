'use client';

import type { UserRole } from '@/features/auth/types';
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
import { routesConfig } from '@/config/routes.config';
import { useAuthStore } from '@/features/auth/store/authStore';

export function ProtectedNavigation() {
  const { user } = useAuthStore();
  const userRoles = user?.cargos?.map(cargo => cargo.nome) || [];
  function hasAccess(allowedRoles: UserRole[]) {
    return allowedRoles.some(role => userRoles.includes(role));
  }
  return (
    <NavigationMenu className="z-50">
      <NavigationMenuList>
        {routesConfig.map((item) => {
          if (!hasAccess(item.allowedRoles)) {
            return null;
          }
          const visibleSubItems = item.subItems?.filter(sub =>
            hasAccess(sub.allowedRoles),
          ) || [];
          if (item.subItems && visibleSubItems.length > 0) {
            return (
              <NavigationMenuItem key={item.title}>
                <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-3 p-4">
                    {visibleSubItems.map(sub => (
                      <li key={sub.title}>
                        <NavigationMenuLink asChild>
                          <Link href={sub.href}>{sub.title}</Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            );
          }
          if (!item.subItems && item.href !== '#') {
            return (
              <NavigationMenuItem key={item.title}>
                <NavigationMenuLink asChild>
                  <Link href={item.href}>{item.title}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          }
          return null;
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
