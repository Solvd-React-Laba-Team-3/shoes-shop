export type QueryParam = Record<
  string,
  | string
  | number
  | boolean
  | Record<string, unknown>
  | Array<string | number | boolean>
>;
