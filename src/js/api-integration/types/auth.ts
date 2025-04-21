export interface User {
  id: string;
  email: string;
  last_active?: string;
  is_active?: boolean;
  profile: {
    first_name: string;
    last_name?: string;
    display_name: string;
    profile_picture?: string;
    color?: string;
  };
}

export interface UserProfile {
  first_name?: string;
  last_name?: string;
  display_name?: string;
  profile_picture?: File | null;
  password?: string;
  color?: string;
  email?: string;
}

export interface UserCreation {
  first_name: string;
  last_name: string;
  email: string;
  organization_name?: string;
}
