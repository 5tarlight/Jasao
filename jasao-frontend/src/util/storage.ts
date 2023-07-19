export interface LoginMemory {
  login: boolean;
  jwt: string;
  refresh: string; // NOT IMPLEMENTED
}

export interface UserMemory {
  id: number;
  email: string;
  username: string;
  token: string;
  role: string;
}

export interface Memory {
  login: LoginMemory | undefined | null;
  user: UserMemory | undefined | null;
}

export const saveStorage = (data: Memory) => {
  localStorage.setItem("jasao-data", JSON.stringify(data));
};

export const getStorage = (): Memory | undefined => {
  const strData = localStorage.getItem("jasao-data");

  if (strData === undefined || strData === null) return {} as Memory;
  else return JSON.parse(strData) as Memory;
};
