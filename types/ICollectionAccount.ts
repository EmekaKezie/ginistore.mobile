export interface ICollectionAccountView {
  collection_account_id: string;
  company_id: string;
  bank_name: string;
  account_name: string;
  account_no: string;
  created_date: string;
  created_by: string;
  last_updated_date?: Date;
  last_updated_by?: string;
  is_active: number;
  store_id: string;
}

export interface IBankList {
  bank_name: string;
  bank_code: string;
}

export interface IVerifyBankAccountNo {
  account_no: string;
  bank_code: string;
}

export interface IVerifyBankAccountNoRes {
  account_no: string;
  account_name: string;
}

export interface ICollectAccountInput {
  bank_name: string;
  account_no: string;
  account_name: string;
}
