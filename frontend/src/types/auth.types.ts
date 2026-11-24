export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: number;
}

export interface AuthSession {
  userId: string;
  globalUserId?: string;
  email: string;
  roles: string[];
  isAuthenticated: boolean;
}

export interface LoginResponse {
  user?: import("./user.types").User;
  tokens?: AuthTokens;
  accessToken?: string;
  refreshToken?: string;
}

export interface RegisterResponse {
  user?: import("./user.types").User;
  message?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface LogoutRequest {
  refreshToken?: string;
}
