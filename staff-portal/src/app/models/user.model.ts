export type UserRole = 'Admin' | 'Supervisor' | 'Technician';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
}
