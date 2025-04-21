export interface Profile {
  color: string;
  first_name: string;
  last_name: string;
  display_name: string;
  profile_picture: string;
}

export interface UserMeta {
  id: string;
  email: string;
  profile: Profile;
}
