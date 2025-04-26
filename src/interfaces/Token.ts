export interface TokenDevice {
  id: string;
  // one_signal_id: string;
  os_type: string;
}

export interface Role {
  role_id: string;
  name: string;
  description: string;
}
export interface Token {
  is_login: boolean;
  user: {
    id: string;
    name: string;
    username: string;
    provider: string;
    providerId: string;
  } | null;
}

export interface ResponseLocalAuth {
  token: string;
  decoded_token: Token;
}
