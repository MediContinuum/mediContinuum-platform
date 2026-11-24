export type FamilyConnectionId = string;

export type FamilyRelationship =
  | "PARENT"
  | "CHILD"
  | "SPOUSE"
  | "SIBLING"
  | "GRANDPARENT"
  | "GRANDCHILD"
  | "OTHER"
  | (string & {});

export type FamilyConnectionStatus =
  "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED" | (string & {});

export interface CreateFamilyConnectionRequest {
  relatedUserGlobalId: string;
  relationship: FamilyRelationship;
}

export interface FamilyConnection {
  id: FamilyConnectionId;
  relatedUserGlobalId?: string;
  relationship: FamilyRelationship;
  status?: FamilyConnectionStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface FamilyMember {
  id: string;
  globalUserId?: string;
  name?: string;
  relationship: FamilyRelationship;
  connectionStatus?: FamilyConnectionStatus;
}

export interface FamilyPermission {
  permission: string;
  granted: boolean;
}

export interface FamilyPermissionUpdateRequest {
  permissions: FamilyPermission[];
}
