export interface ExternalUser {
  display_name: string;
  email: string;
  user_type: "external" | "guest" | "task_share";
}
