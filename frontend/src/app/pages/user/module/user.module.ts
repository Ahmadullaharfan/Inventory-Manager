export type UserRole = 'admin' | 'manager' | 'user';
export const userRoleDetails: Record<UserRole, { label: string; description: string }> = {
  admin: { label: 'Admin', description: 'Create users, edit user profiles, assign roles and account status, and delete other accounts.' },
  manager: { label: 'Manager', description: 'Browse users and view profiles. Edit your own profile and manage your own account settings.' },
  user: { label: 'User', description: 'Edit your own profile and manage your own account settings. Ask an administrator to change your role.' },
};
export type UserStatus = 'active' | 'inactive' | 'suspended';
export interface UserAddress { id?: number; country: string | null; city_state: string | null; postal_code: string | null; tax_id: string | null; is_primary: boolean; }
export interface SocialLink { id?: number; platform: string; url: string; }
export interface NotificationPreferences { realtime_enabled: boolean; team_alerts: boolean; email_notifications: boolean; }
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  bio: string | null;
  role: UserRole;
  status: UserStatus;
  avatar_url: string | null;
  email_verified: boolean;
  two_fa_enabled: boolean;
  last_login_at: string | null;
  created_at: string | null;
  addresses?: UserAddress[];
  social_links?: SocialLink[];
  notification_preferences?: NotificationPreferences | null;
}
export interface ApiResponse<T> { data: T; }
export interface UserDevice { id: number; device_name: string | null; ip_address: string | null; last_used_at: string | null; revoked_at: string | null; is_current: boolean; }
export interface AuditLog { id: number; event: string; ip_address: string | null; created_at: string; meta: Record<string, unknown> | null; }
export interface AuditPage { data: AuditLog[]; current_page: number; last_page: number; }
export const defaultPreferences = (): NotificationPreferences => ({ realtime_enabled: true, team_alerts: true, email_notifications: true });
