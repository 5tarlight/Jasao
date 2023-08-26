import { ReactNode } from "react";

export const isNumeric = (check: string | undefined, nan: number): number => {
  const parse = parseInt(check ?? `${nan}`);
  return isNaN(parse) ? nan : parse;
};

export type PropsWithChildren<P> = P & {
  children?: ReactNode;
};

export const stringifyByte = (byte: number): string => {
  if (byte >= 1024 ** 3) return Math.ceil(byte / 1024 ** 3) + "GB";
  else if (byte >= 1024 ** 2) return Math.ceil(byte / 1024 ** 2) + "MB";
  else if (byte >= 1024 ** 1) return Math.ceil(byte / 1024 ** 1) + "KB";
  else return byte + "B";
};
