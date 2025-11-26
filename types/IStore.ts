export interface IStoreAccessView {
  store_id: string;
  store_name: string;
  store_slug: string;
  logo_url: string;
  cover_image_url: string;
  store_access_id: string;
  store_in_use: number;
  company_id: string;
  company_name: string;
  company_slug: string;
  employee_id: string;
  employee_firstname: string;
  employee_lastname: string;
  employee_in_use: number;
}

export interface ISwitchStore {
  store_id: string;
  store_access_id: string;
  employee_id: string;
  company_id: string;
}

export interface IStoreView {
  store_access_id: string;
  employee_id: string;
  store_id: string;
  company_id: string;
  store_name: string;
  store_desc: string;
  store_slug: string;
  contact_email: string;
  contact_phone: string;
  contact_fullname: string;
  longitude?: string;
  latitude?: null;
  address?: string;
  city?: string;
  state?: string;
  country: string;
  created_date?: string;
  created_by?: string;
  last_updated_date?: string;
  last_updated_by?: string;
  is_main: number;
  currency_code: string;
  country_code: string;
  country_flag_url: string;
  vat_percentage: number;
  logo_url: string;
  cover_image_url: string;
  social_facebook: string;
  social_x: string;
  social_whatsapp: string;
  social_instagram: string;
  company_name: string;
  company_slug: string;
  markup_price: number;
  markup_price_type: string;
}

export interface ISwitchStore {
  store_id: string;
  store_access_id: string;
  employee_id: string;
  company_id: string;
}
