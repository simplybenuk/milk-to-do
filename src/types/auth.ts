
export interface Role {
  id: string;
  name: string;
  created_at?: string;
}

export interface UserRole {
  user_id: string;
  role_id: string;
  assigned_at?: string;
}

export interface UserWithRoles {
  id: string;
  email: string;
  roles: string[];
}
