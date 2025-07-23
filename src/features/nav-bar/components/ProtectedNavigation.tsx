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
  const { user, status } = useAuthStore();
  if (status !== 'authenticated') {
    return null;
  }
  const userRoles = user?.cargos?.map(cargo => cargo.nome) || [];
  function hasAccess(allowedRoles: UserRole[]) {
    if (allowedRoles.length === 0) {
      return true;
    }
    return allowedRoles.some(role => userRoles.includes(role));
  }
  const accessibleRoutes = routesConfig.filter(item => hasAccess(item.allowedRoles));
  if (accessibleRoutes.length === 0) {
    return null;
  }
  return (
    <div className="w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-[1920px] px-4 sm:px-8">
        <NavigationMenu className="w-full py-2">
          <div className="w-full overflow-x-auto">
            <NavigationMenuList className="justify-start whitespace-nowrap">
              {accessibleRoutes.map((item) => {
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
          </div>
        </NavigationMenu>
      </div>
    </div>
  );
}
