export type UserId = string;
export type GlobalUserId = string;

export type UserRole =
  | "PATIENT"
  | "FAMILY_MEMBER"
  | "DOCTOR"
  | "ADMIN"
  | "PLATFORM_ADMIN"
  | (string & {});

export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED" | (string & {});

export interface User {
  id: UserId;
  globalUserId: GlobalUserId;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  roles?: UserRole[];
  status?: UserStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserRequest {
  globalUserId?: GlobalUserId;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
}

export interface UserRoleAssignment {
  userId: UserId;
  roles: UserRole[];
}

export interface UserStatusUpdate {
  status: UserStatus;
}
