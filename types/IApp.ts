export type ResponseStatus =
  | "success"
  | "failed"
  | "error"
  | "invalid_token"
  | "unverified"
  | "access_denied"
  | "true"
  | "failed_show_errors";

export interface IApiResponse<T> {
  status: ResponseStatus;
  message: string;
  total?: number;
  data: T;
  errors?: string[];
}