import type { RouteConfig } from './routes.config';
import type { UserRole } from '@/features/auth/types';
import { match } from 'path-to-regexp';
import { routesConfig } from './routes.config';

type FlatRoute = {
  path: string;
  allowedRoles: UserRole[];
};

function flattenRoutes(routes: RouteConfig[]): FlatRoute[] {
  const flatList: FlatRoute[] = [];
  for (const route of routes) {
    if (route.path && route.path !== '#') {
      flatList.push({
        path: route.path,
        allowedRoles: route.allowedRoles,
      });
    }
    if (route.subItems) {
      flatList.push(...flattenRoutes(route.subItems));
    }
  }

  return flatList;
}

const protectedRoutesMap = flattenRoutes(routesConfig);
const dashboardPrefix = '/dashboard';

export function getAllowedRolesForPath(pathname: string): UserRole[] | null {
  if (!pathname.startsWith(dashboardPrefix)) {
    return null;
  }
  const pathWithoutPrefix = pathname.slice(dashboardPrefix.length);
  for (const route of protectedRoutesMap) {
    const fn = match(route.path, { decode: decodeURIComponent });
    if (fn(pathWithoutPrefix)) {
      return route.allowedRoles;
    }
  }
  return null;
}
