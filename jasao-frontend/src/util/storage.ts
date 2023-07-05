export interface LoginMemory {
  login: boolean;
  jwt: string;
  refresh: string; // NOT IMPLEMENTED
}

export interface Memory {
  user: LoginMemory | undefined;
}

export const saveStorage = (data: Memory) => {
  localStorage.setItem("jasao-data", JSON.stringify(data));
};

export const getStorage = (): Memory | undefined => {
  const strData = localStorage.getItem("jasao-data");

  if (strData === undefined || strData === null) return undefined;
  else return JSON.parse(strData) as Memory;
};
