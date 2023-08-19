export interface UserRes {
  message: string;
  data: User;
}

export interface User {
  bio: string;
  email: string;
  id: number;
  profile: string | null;
  role: string;
  username: string;
}
