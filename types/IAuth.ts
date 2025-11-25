import { IRolePrivilege } from "./IRole";

export interface IAuth {
  token: string;
  user_id: string;
  email: string;
  firstname: string;
  lastname: string;
  is_temporal_password: number;
  is_verified: number;
  employee_id: string;
  role_id: string;
  role_name: string;
  company_id: string;
  company_name: string;
  company_slug: string;
  store_id: string;
  store_name: string;
  store_slug: string;
  store_created_date: string;
  currency_code: string;
  country_code: string;
  country_flag_url: string;
  role_privileges: IRolePrivilege[];
}

export interface IAuthStore {
  isAuthenticated: boolean;
  auth: IAuth;
}

export type ILoginMethod = "classic" | "google_signon";
export interface ILogin {
  email: string;
  password: string;
  login_method: ILoginMethod;
}
