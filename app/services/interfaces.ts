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
  subject: number | null;
  bio: string | null;
  extra_info: string | null;
}

export interface addittionalProfile {
  teacher_data: teacherData;
  basic_data: user;
  backendUrl: string;
  uuidName: string;
  uuidSecret: string;
}

export interface teacherDataRaw {
  message: string;
  proceed: boolean;
  teacher_data: teacherData;
  basic_data: user;
}
