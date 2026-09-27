export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  role: 'admin' | 'manager' | 'user';
  avatar_url: string | null;
  email_verified: boolean;
  status: string;
  last_login_at: string | null;
}
