// {
//     "user": {
//         "email": "user@example.com"
//     },
//     "profile": {
//         "profile_picture": "http://example.com/media/profile_pictures/user.jpg",
//         "first_name": "John",
//         "last_name": "Doe",
//         "display_name": "JohnD",
//         "phone_number": "123-456-7890"
//     },
//     "preference": {
//         "theme": "dark",
//         "name_display": "display_name",
//         "start_of_week": "monday",
//         "help_bubble_enabled": true,
//         "font_size": "m",
//         "language": "en",
//         "timezone": "UTC"
//     }
// }

export interface UserPreference {
  user: string;
  profile: {
    profile_picture?: string;
    first_name: string;
    last_name: string;
    display_name: string;
    phone_number: string;
  };
  preference: {
    theme: ThemePreference;
    name_display: 'display_name' | 'full_name';
    start_of_week: StartOfWeekPreference;
    help_bubble_enabled: boolean;
    language: string;
    font_size: string;
    timezone: string;
  };
}

export type ThemePreference = 'light' | 'dark' | 'system';
export type NameDisplayPreference = 'display_name' | 'full_name';
export type StartOfWeekPreference =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';
export type FontSizePreference = 'xs' | 's' | 'm' | 'l' | 'xl';

// Queries
export type GetPreferencesResponse = UserPreference;

// Mutations
export type UpdatePreferencesPayload = {
  preference?: {
    theme?: ThemePreference;
    name_display?: 'display_name' | 'full_name';
    start_of_week?: StartOfWeekPreference;
    help_bubble_enabled?: boolean;
    language?: string;
    font_size?: string;
    timezone?: string;
  };
};

export type UpdateProfilePayload = {
  profile?: {
    display_name?: string;
    profile_picture?: File;
    first_name?: string;
    last_name?: string;
    phone_number?: string;
  };
};
