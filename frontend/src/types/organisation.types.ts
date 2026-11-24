export type OrganisationId = string;

export type OrganisationStatus =
  "ACTIVE" | "INACTIVE" | "SUSPENDED" | (string & {});

export interface Organisation {
  id: OrganisationId;
  name: string;
  description?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  status?: OrganisationStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrganisationMember {
  id: string;
  organisationId: OrganisationId;
  userId: string;
  role?: string;
  status?: string;
  joinedAt?: string;
}

export interface CreateOrganisationRequest {
  name: string;
  description?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
}

export interface UpdateOrganisationRequest {
  name?: string;
  description?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
}

export interface AddOrganisationMemberRequest {
  userId: string;
  role: string;
}
