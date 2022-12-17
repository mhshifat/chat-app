export interface RegisterBody {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface UserDocument {
  id?: string;
  created_at?: string;
  updated_at?: string;
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
}

export interface JwtPayload {
  id: string;
}