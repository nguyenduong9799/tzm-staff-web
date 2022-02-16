export type OrderResponse = {
  check_in_date: Date;
  list_of_orders: Order[];
};

export type Order = {
  order_id: number;
  invoice_id: string;
  master_product_quantity: number;
  total_amount: number;
  final_amount: number;
  discount: number;
  check_in_date: Date;
  order_status: number;
  customer: Customer;
  payment_type: number;
  delivery_address: string;
  package_ids: any[];
  other_amounts: any[];
};

export type Customer = {
  customer_id: number;
  name: string;
  phone_number: string;
};

export enum OrderStatus {
  DONE = 3,
  NEW = 1,
}

export interface OrderItem {
  order_detail_id: number;
  product_name: string;
  product_type: number;
  quantity: number;
  order_status: number;
  discount: number;
  final_amount: number;
  description: string;
  supplier_store_name: string;
  supplier_store_id: number;
  unit_price: number;
  unit_cost: number;
  final_cost: number;
  supplier_id: number;
  list_of_childs: OrderItem[];
  supplier_notes: any[];
}

export interface OtherAmount {
  name: string;
  amount: number;
  unit: string;
}

export interface OrderDetail {
  order_id: number;
  invoice_id: string;
  master_product_quantity: number;
  total_amount: number;
  final_amount: number;
  discount: number;
  check_in_date: Date;
  order_status: number;
  payment_type: number;
  delivery_address: string;
  package_ids: any[];
  list_order_details: OrderItem[];
  other_amounts: OtherAmount[];
}
