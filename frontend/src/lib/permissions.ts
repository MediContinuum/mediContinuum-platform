import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  isValidRole,
  getRolePermissions,
  type UserRole,
  type Permission,
} from "@/config/roles.config";

export function canAccess(
  role: UserRole | null | undefined,
  permission: Permission,
): boolean {
  if (!role || !isValidRole(role)) {
    return false;
  }

  return hasPermission(role, permission);
}

export function canAccessAny(
  role: UserRole | null | undefined,
  permissions: readonly Permission[],
): boolean {
  if (!role || !isValidRole(role)) {
    return false;
  }

  return hasAnyPermission(role, [...permissions]);
}

export function canAccessAll(
  role: UserRole | null | undefined,
  permissions: readonly Permission[],
): boolean {
  if (!role || !isValidRole(role)) {
    return false;
  }

  return hasAllPermissions(role, [...permissions]);
}

export function hasRequiredRole(
  userRole: UserRole | null | undefined,
  allowedRoles: readonly UserRole[],
): boolean {
  if (!userRole || !isValidRole(userRole)) {
    return false;
  }

  return allowedRoles.includes(userRole);
}

export function getPermissions(
  role: UserRole | null | undefined,
): readonly Permission[] {
  if (!role || !isValidRole(role)) {
    return [];
  }

  return getRolePermissions(role);
}
