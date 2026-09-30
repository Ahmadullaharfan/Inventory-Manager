export interface User {
  id: string;
  user:string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  role: 'admin' | 'manager' | 'user';
  avatar_url: string | null;
  email_verified: boolean;
  status: string;
  last_login_at: string | null;
  actions?: {
    edit: boolean;
    delete: boolean;
  };
}
