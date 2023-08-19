import { ReactNode } from "react";

export const isNumeric = (check: string | undefined, nan: number): number => {
  const parse = parseInt(check ?? `${nan}`);
  return isNaN(parse) ? nan : parse;
};

export type PropsWithChildren<P> = P & {
  children?: ReactNode;
};
