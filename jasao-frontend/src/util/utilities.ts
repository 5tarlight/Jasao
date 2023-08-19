export const checkNumber = (check: string | undefined, nan: number): number => {
  const parse = parseInt(check ?? `${nan}`);
  return isNaN(parse) ? nan : parse;
};
