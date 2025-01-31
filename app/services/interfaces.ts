export interface userdata {
  message: string;
  proceed: boolean;
  user?: user;
}

export interface user {
  username: string;
  email: string;
  phone: string;
  role: string;
  id: number;
  picture: string;
}

export interface envBackendData {
  backendUrl: string;
  uuidName: string;
  uuidSecret: string;
}
