export interface IdTokenPayload {
  aud: string;
  auth_time: number;
  'cognito: username': string;
  email: string;
  email_verified: boolean;
  event_id: string;
  exp: number;
  iat: number;
  iss: string;
  sub: string;
  token_use: string;
}
