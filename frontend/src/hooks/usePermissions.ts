import { useMemo } from "react";

import type { UserRole } from "@/types/user.types";

interface UsePermissionsOptions {
  roles?: UserRole[];
  permissions?: string[];
}

export function usePermissions({
  roles = [],
  permissions = [],
}: UsePermissionsOptions = {}) {
  return useMemo(() => {
    const roleSet = new Set<string>(roles);
    const permissionSet = new Set(permissions);

    const hasRole = (role: UserRole): boolean => roleSet.has(role);

    const hasAnyRole = (requiredRoles: UserRole[]): boolean =>
      requiredRoles.some((role) => roleSet.has(role));

    const hasAllRoles = (requiredRoles: UserRole[]): boolean =>
      requiredRoles.every((role) => roleSet.has(role));

    const hasPermission = (permission: string): boolean =>
      permissionSet.has(permission);

    const hasAnyPermission = (requiredPermissions: string[]): boolean =>
      requiredPermissions.some((permission) => permissionSet.has(permission));

    const hasAllPermissions = (requiredPermissions: string[]): boolean =>
      requiredPermissions.every((permission) => permissionSet.has(permission));

    return {
      roles,
      permissions,

      hasRole,
      hasAnyRole,
      hasAllRoles,

      hasPermission,
      hasAnyPermission,
      hasAllPermissions,

      isPatient: hasRole("PATIENT"),
      isDoctor: hasRole("DOCTOR"),
      isFamilyMember: hasRole("FAMILY_MEMBER"),
      isAdmin: hasRole("ADMIN"),
      isPlatformAdmin: hasRole("PLATFORM_ADMIN"),
    };
  }, [roles, permissions]);
}
