import axios from "axios";

export const getServer = () => {
  // return `http://${window.location.host.split(":")[0]}:8080`;
  return process.env.REACT_APP_BACKEND;
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
