export interface IPosProductsView {
  product_id: string;
  product_code: string;
  product_name: string;
  category_id: string;
  unit_of_measure: number;
  unit_stock_level: number;
  unit_sell_price: number;
  stock_id: string;
  currency_code: string;
  vat_percentage: number;
}

export interface IPosProductBatchView {
  product_batch_id: string;
  batch_no: string;
  product_id: string;
  current_unit_qty: number;
}

export interface IPosInput {
  sale_code: string;
  sub_total_amount: number;
  vat_percentage: number;
  vat_amount: number;
  discount_percentage: number;
  discount_amount: number;
  total_amount: number;
  seller_user_id: string;
  store_name: string;
  seller_fullname: string;
  device_id: string;
  payment_channel: string;
  collection_account_id: string;
  sale_date: string;
  created_by: string;
  paid_amount: number;
  currency_code: string;
  sale_details: IPosDetailInput[];
}

export interface IPosDetailInput {
  product_id: string;
  product_name: string;
  unit_of_measure: number;
  unit_qty: number;
  unit_sell_price: number;
  sub_total_amount: number;
  vat_percentage: number;
  vat_amount: number;
  discount_percentage: number;
  discount_amount: number;
  total_amount: number;
  stock_id: string;
  currency_code: string;
  product_batch_id: string;
}

export interface IPosHold {
  dataList: IPosInput[];
}
