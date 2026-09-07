export interface CheckAuthResponse {
  authenticated: boolean;
  email: string;
  username: string;
  role: string;
}