export interface IRole {
  role_id: string;
  company_id: string;
  role_name: string;
  role_desc: string;
  created_date: Date;
  created_by: string;
  last_updated_date: Date;
  last_updated_by: string;
  is_deactivated: number;
  is_super_admin: number;
}

export interface IRolePrivilege {
  role_privilege_id: string;
  role_id: string;
  privilege_code: string;
  action: number;
}

export interface ISystemPrivileges {
  privilege_code: string;
  app_module: string;
  privilege_desc: string;
  auto_enable: number;
  auto_enable_admin: number;
}

export interface IPermissionView {
  role_privilege_id: string;
  privilege_code: string;
  privilege_desc: string;
  app_module: string;
  action: number;
}

export interface IRoleView {
  role_id: string;
  role_name: string;
  role_desc?: string;
  employee_firstname?: string;
  employee_image_url?: string;
  is_super_admin: number;
  last_updated_by?: string;
  last_updated_date?: string;
  permissions: IPermissionView[];
}

export interface IPermissionsPreview {
  privilege_code: string;
  action: number;
}

export interface IRoleInput {
  role_name: string;
  role_desc?: string;
  privilege_codes: string[];
}

export interface IRolePrivilegeInput {
  role_id: string;
  privilege_codes: string[];
}
