export interface Response<T> {
  json: () => Promise<T>;
  ok?: boolean;
  status?: number;
  statusText?: string;
}
