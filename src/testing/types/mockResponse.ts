export interface MockResponse<T> {
  json: () => Promise<T>;
  ok?: boolean;
  status?: number;
  statusText?: string;
}
