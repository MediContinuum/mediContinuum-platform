/**
 * MediContinuum - Roles Configuration
 *
 * Centralized role definitions and permission mapping.
 *
 * IMPORTANT:
 * Frontend role checks are only for UI visibility and navigation.
 * Backend authorization must always be the final security authority.
 */

/* -------------------------------------------------------------------------- */
/* 1. ROLE DEFINITIONS                                                        */
/* -------------------------------------------------------------------------- */

export const USER_ROLES = {
  PATIENT: "PATIENT",
  FAMILY_MEMBER: "FAMILY_MEMBER",
  DOCTOR: "DOCTOR",
  NURSE: "NURSE",
  PHARMACIST: "PHARMACIST",
  VENDOR: "VENDOR",
  ORGANIZATION_ADMIN: "ORGANIZATION_ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

/* -------------------------------------------------------------------------- */
/* 2. ROLE LABELS                                                             */
/* -------------------------------------------------------------------------- */

export const ROLE_LABELS: Record<UserRole, string> = {
  [USER_ROLES.PATIENT]: "Patient",
  [USER_ROLES.FAMILY_MEMBER]: "Family Member",
  [USER_ROLES.DOCTOR]: "Doctor",
  [USER_ROLES.NURSE]: "Nurse",
  [USER_ROLES.PHARMACIST]: "Pharmacist",
  [USER_ROLES.VENDOR]: "Verified Vendor",
  [USER_ROLES.ORGANIZATION_ADMIN]: "Organization Admin",
  [USER_ROLES.SUPER_ADMIN]: "Super Admin",
};

/* -------------------------------------------------------------------------- */
/* 3. ROLE DESCRIPTIONS                                                       */
/* -------------------------------------------------------------------------- */

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  [USER_ROLES.PATIENT]:
    "Manages personal healthcare information, medicines, prescriptions, and appointments.",

  [USER_ROLES.FAMILY_MEMBER]:
    "Accesses permitted healthcare information of linked family members with consent.",

  [USER_ROLES.DOCTOR]:
    "Manages patient consultations, prescriptions, and clinical information.",

  [USER_ROLES.NURSE]: "Supports patient care and assigned clinical activities.",

  [USER_ROLES.PHARMACIST]:
    "Manages medicine-related activities and prescription fulfillment.",

  [USER_ROLES.VENDOR]:
    "Manages medicine listings, inventory, and order fulfillment.",

  [USER_ROLES.ORGANIZATION_ADMIN]:
    "Manages users, staff, and operations within a healthcare organization.",

  [USER_ROLES.SUPER_ADMIN]:
    "Manages platform-level administration and system configuration.",
};

/* -------------------------------------------------------------------------- */
/* 4. ROLE CATEGORIES                                                         */
/* -------------------------------------------------------------------------- */

export const ROLE_CATEGORIES = {
  PATIENT_SIDE: [USER_ROLES.PATIENT, USER_ROLES.FAMILY_MEMBER],

  HEALTHCARE_PROFESSIONALS: [
    USER_ROLES.DOCTOR,
    USER_ROLES.NURSE,
    USER_ROLES.PHARMACIST,
  ],

  BUSINESS: [USER_ROLES.VENDOR],

  ADMINISTRATION: [USER_ROLES.ORGANIZATION_ADMIN, USER_ROLES.SUPER_ADMIN],
} as const;

/* -------------------------------------------------------------------------- */
/* 5. PERMISSION DEFINITIONS                                                  */
/* -------------------------------------------------------------------------- */

export const PERMISSIONS = {
  PROFILE: {
    READ: "profile:read",
    UPDATE: "profile:update",
  },

  PATIENT: {
    READ: "patient:read",
    UPDATE: "patient:update",
    CREATE: "patient:create",
  },

  FAMILY: {
    READ: "family:read",
    MANAGE: "family:manage",
    INVITE: "family:invite",
    MANAGE_CONSENT: "family:manage-consent",
  },

  PRESCRIPTION: {
    READ: "prescription:read",
    CREATE: "prescription:create",
    UPDATE: "prescription:update",
    DELETE: "prescription:delete",
  },

  MEDICINE: {
    READ: "medicine:read",
    MANAGE: "medicine:manage",
  },

  INVENTORY: {
    READ: "inventory:read",
    MANAGE: "inventory:manage",
  },

  APPOINTMENT: {
    READ: "appointment:read",
    CREATE: "appointment:create",
    UPDATE: "appointment:update",
    CANCEL: "appointment:cancel",
  },

  ORDER: {
    READ: "order:read",
    CREATE: "order:create",
    MANAGE: "order:manage",
  },

  ORGANIZATION: {
    READ: "organization:read",
    UPDATE: "organization:update",
    MANAGE_USERS: "organization:manage-users",
  },

  ANALYTICS: {
    READ: "analytics:read",
  },

  AUDIT: {
    READ: "audit:read",
  },

  PLATFORM: {
    MANAGE: "platform:manage",
  },
} as const;

/* -------------------------------------------------------------------------- */
/* 6. PERMISSION TYPE                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Automatically derives permission string types
 * from the PERMISSIONS object.
 */

export type Permission = {
  [
    Group in keyof typeof PERMISSIONS
  ]: (typeof PERMISSIONS)[Group][keyof (typeof PERMISSIONS)[Group]];
}[keyof typeof PERMISSIONS];

/* -------------------------------------------------------------------------- */
/* 7. ROLE-BASED PERMISSION MAPPING                                           */
/* -------------------------------------------------------------------------- */

export const ROLE_PERMISSIONS: Record<UserRole, readonly Permission[]> = {
  [USER_ROLES.PATIENT]: [
    PERMISSIONS.PROFILE.READ,
    PERMISSIONS.PROFILE.UPDATE,
    PERMISSIONS.PATIENT.READ,
    PERMISSIONS.PATIENT.UPDATE,
    PERMISSIONS.FAMILY.READ,
    PERMISSIONS.FAMILY.INVITE,
    PERMISSIONS.FAMILY.MANAGE_CONSENT,
    PERMISSIONS.PRESCRIPTION.READ,
    PERMISSIONS.MEDICINE.READ,
    PERMISSIONS.APPOINTMENT.READ,
    PERMISSIONS.APPOINTMENT.CREATE,
    PERMISSIONS.APPOINTMENT.CANCEL,
    PERMISSIONS.ORDER.READ,
    PERMISSIONS.ORDER.CREATE,
  ],

  [USER_ROLES.FAMILY_MEMBER]: [
    PERMISSIONS.PROFILE.READ,
    PERMISSIONS.PROFILE.UPDATE,
    PERMISSIONS.PATIENT.READ,
    PERMISSIONS.FAMILY.READ,
    PERMISSIONS.PRESCRIPTION.READ,
    PERMISSIONS.MEDICINE.READ,
    PERMISSIONS.APPOINTMENT.READ,
    PERMISSIONS.ORDER.READ,
  ],

  [USER_ROLES.DOCTOR]: [
    PERMISSIONS.PROFILE.READ,
    PERMISSIONS.PROFILE.UPDATE,
    PERMISSIONS.PATIENT.READ,
    PERMISSIONS.PATIENT.UPDATE,
    PERMISSIONS.PRESCRIPTION.READ,
    PERMISSIONS.PRESCRIPTION.CREATE,
    PERMISSIONS.PRESCRIPTION.UPDATE,
    PERMISSIONS.APPOINTMENT.READ,
    PERMISSIONS.APPOINTMENT.UPDATE,
  ],

  [USER_ROLES.NURSE]: [
    PERMISSIONS.PROFILE.READ,
    PERMISSIONS.PROFILE.UPDATE,
    PERMISSIONS.PATIENT.READ,
    PERMISSIONS.PATIENT.UPDATE,
    PERMISSIONS.PRESCRIPTION.READ,
    PERMISSIONS.APPOINTMENT.READ,
    PERMISSIONS.APPOINTMENT.UPDATE,
  ],

  [USER_ROLES.PHARMACIST]: [
    PERMISSIONS.PROFILE.READ,
    PERMISSIONS.PROFILE.UPDATE,
    PERMISSIONS.PATIENT.READ,
    PERMISSIONS.PRESCRIPTION.READ,
    PERMISSIONS.MEDICINE.READ,
    PERMISSIONS.MEDICINE.MANAGE,
    PERMISSIONS.INVENTORY.READ,
    PERMISSIONS.INVENTORY.MANAGE,
    PERMISSIONS.ORDER.READ,
    PERMISSIONS.ORDER.MANAGE,
  ],

  [USER_ROLES.VENDOR]: [
    PERMISSIONS.PROFILE.READ,
    PERMISSIONS.PROFILE.UPDATE,
    PERMISSIONS.MEDICINE.READ,
    PERMISSIONS.MEDICINE.MANAGE,
    PERMISSIONS.INVENTORY.READ,
    PERMISSIONS.INVENTORY.MANAGE,
    PERMISSIONS.ORDER.READ,
    PERMISSIONS.ORDER.MANAGE,
  ],

  [USER_ROLES.ORGANIZATION_ADMIN]: [
    PERMISSIONS.PROFILE.READ,
    PERMISSIONS.PROFILE.UPDATE,
    PERMISSIONS.ORGANIZATION.READ,
    PERMISSIONS.ORGANIZATION.UPDATE,
    PERMISSIONS.ORGANIZATION.MANAGE_USERS,
    PERMISSIONS.ANALYTICS.READ,
    PERMISSIONS.AUDIT.READ,
  ],

  [USER_ROLES.SUPER_ADMIN]: [
    PERMISSIONS.PROFILE.READ,
    PERMISSIONS.PROFILE.UPDATE,
    PERMISSIONS.ORGANIZATION.READ,
    PERMISSIONS.ORGANIZATION.UPDATE,
    PERMISSIONS.ORGANIZATION.MANAGE_USERS,
    PERMISSIONS.ANALYTICS.READ,
    PERMISSIONS.AUDIT.READ,
    PERMISSIONS.PLATFORM.MANAGE,
  ],
};

/* -------------------------------------------------------------------------- */
/* 8. ROLE UTILITIES                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Checks whether a value is a valid application role.
 */
export function isValidRole(role: string): role is UserRole {
  return Object.values(USER_ROLES).includes(role as UserRole);
}

/**
 * Returns the display label for a role.
 */
export function getRoleLabel(role: UserRole): string {
  return ROLE_LABELS[role];
}

/**
 * Returns the description for a role.
 */
export function getRoleDescription(role: UserRole): string {
  return ROLE_DESCRIPTIONS[role];
}

/**
 * Checks whether a role has a particular permission.
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

/**
 * Checks whether a role has at least one of the supplied permissions.
 */
export function hasAnyPermission(
  role: UserRole,
  permissions: readonly Permission[],
): boolean {
  return permissions.some((permission) => hasPermission(role, permission));
}

/**
 * Checks whether a role has every supplied permission.
 */
export function hasAllPermissions(
  role: UserRole,
  permissions: readonly Permission[],
): boolean {
  return permissions.every((permission) => hasPermission(role, permission));
}

/**
 * Checks whether a user role belongs to a category.
 */
export function isRoleInCategory(
  role: UserRole,
  category: keyof typeof ROLE_CATEGORIES,
): boolean {
  return (ROLE_CATEGORIES[category] as readonly UserRole[]).includes(role);
}

/**
 * Returns all permissions assigned to a role.
 */
export function getRolePermissions(role: UserRole): readonly Permission[] {
  return ROLE_PERMISSIONS[role];
}

/* -------------------------------------------------------------------------- */
/* 9. DEFAULT EXPORT                                                          */
/* -------------------------------------------------------------------------- */

const ROLES_CONFIG = {
  USER_ROLES,
  ROLE_LABELS,
  ROLE_DESCRIPTIONS,
  ROLE_CATEGORIES,
  PERMISSIONS,
  ROLE_PERMISSIONS,
};

export default ROLES_CONFIG;
