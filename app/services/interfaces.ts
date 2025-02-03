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

export interface teacherData {
  certificates: number | null;
  ground_tutor: boolean;
  location: string | null;
  school: string | null;
  subject: string | null;
  bio: string | null;
  extra_info: string | null;
}

export interface teacherDataRaw {
  message: string;
  proceed: boolean;
  teacher_data: teacherData;
  basic_data: user;
}

export interface modalInterface{
  close:Function
}

export interface serverResponse {
  message: string;
  proceed: boolean;
  url?: string;
  token?: string;
}

export interface userdata_login {
  email: string;
  password: string;
}


export interface dataInterface {
  email: string;
  picture: string;
  username: string;
}

export interface userdetails {
  username: string;
  email: string;
  password: string;
  phone: string;
  picture: string;
  type: number|null;
}
