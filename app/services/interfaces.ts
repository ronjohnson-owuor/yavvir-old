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

export interface modalInterface {
  close: Function;
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
  type: number | null;
}

export interface lessonList {
  message: string;
  proceed: boolean;
  lessons: lessons[];
}

export interface lessons {
  creator: number;
  duration: number;
  expired: boolean;
  id: number;
  lesson_name: string;
  lesson_uuid: string;
  start_time: string;
  inprogress:boolean;
}

export  interface lessonModerators {
  createlesson?:boolean,
  setcreatelesson?:Function,
  setEditLesson?:Function,
  id?:number
} 

export interface lessonPayload {
  id:number,
  lesson_name:string|null,
  duration: number|null,
  start_time: string|null,
  lesson_price: number|null,
}

export interface reffInterface {
  proceed:boolean,
  reff?:string
}

export  interface lessonData {
  proceed: boolean,
  isPremium:boolean,
  lesson: {
      total: number,
      expired:number,
      pending: number
  }
}

export  interface paymentUrl {
  proceed: boolean,
  message:string,
  url?:string
}

export interface lessonCreate {
  lesson_name: string,
  duration: number,
  start_time: string,
  lesson_price: number,
}