import axios from "axios";
import { getStorage } from "./storage";

export const getServer = () => {
  // return `http://${window.location.host.split(":")[0]}:8080`;
  return process.env.REACT_APP_BACKEND;
};

export const getCdn = () => {
  return process.env.REACT_APP_CDN_SERVER;
};

export const request = <T>(
  method: "get" | "post" | "patch" | "put" | "delete",
  url: string,
  data: any | undefined,
  headers: any | undefined = undefined
) => {
  switch (method) {
    case "get":
      return axios.get<T>(url, {
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
    case "post":
      return axios.post<T>(url, data, {
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
    case "delete":
      return axios.delete<T>(url, {
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
    case "patch":
      return axios.patch<T>(url, data, {
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
    case "put":
      return axios.put<T>(url, data, {
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
      });
  }
};

export const requestWithLogin = <T>(
  method: "get" | "post" | "patch" | "put" | "delete",
  url: string,
  data?: any | undefined,
  headers?: any | undefined
) =>
  new Promise<T>((resolve, reject) => {
    const storage = getStorage();

    if (storage?.login?.login) {
      request<T>(method, `${getServer()}/${url}`, data, {
        Authorization: storage?.login.jwt,
        ...headers,
      })
        .then((res) => resolve(res.data))
        .catch(reject);
    } else reject("required login");
  });
