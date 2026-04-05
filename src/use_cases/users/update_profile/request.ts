export interface IUpdateProfileRequest {
  user_id: string;
  career_goal?: string;
  target_role?: string;
  onboarding_completed?: boolean;
  name?: string;
}
