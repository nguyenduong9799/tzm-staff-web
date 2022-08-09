export type OrderResponse = {
  pageNumber: number,
  pageSize: number,
  totalNumberOfPages: number,
  totalNumberOfRecords: number,
  results: Order[]
};

export type FromStation = {
  id: number;
  code: string;
  longitude: number;
  latitude: number;
  address: string;
  createdAt: string;
}
export type ToStation = {
  id: number;
  code: string;
  longitude: number;
  latitude: number;
  address: string;
  district: string;
  ward: string;
  city: string;
  createdAt: string;
}


export type Order = {
  packageActions: any[];
  fromStation: FromStation;
  toStation: ToStation;
  id: number;
  fromStationId: number;
  toStationId: number;
  batchId: number;
  createdAt: string;
  updatedAt: string;
  orderCode: string;
  status: number;
  customerPhone: string;
  customerName: string;
  customerEmail: string;
  orderAmount: number;
  paymentMethod: number;
  isCOD: boolean;
  shippingFee: number;
  distanceFee: number;
  surCharge: number;
  packageItems: any[];
  brandId: number;
};

export type Customer = {
  customer_id: number;
  name: string;
  phone_number: string;
};

export enum OrderStatus {
  New = 0,
  Assigend = 1,
  Removed = 2,
  PickedUp = 3,
  Delivered = 4,
  Cancel = 5,
  All = 10,
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
  product_description: string;
  supplier_store_name: string;
  supplier_store_id: number;
  unit_price: number;
  unit_cost: number;
  final_cost: number;
  supplier_id: number;
  list_of_childs: OrderItem[];
  supplier_notes?: { content: string; order_id: number; supplier_store_id: number }[];
}

export interface OtherAmount {
  name: string;
  amount: number;
  unit: string;
}

export interface OrderDetail {
  order_id: number;
  invoice_id: string;
  address: string;
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
  supplier_notes?: { content: string; order_id: number; supplier_store_id: number }[];
}

export enum PaymentType {
  Cash = 1,
  CreditPayment = 2, //tra bang xu
  Momo = 3
}
export type ProductsList = {
  master_product: number;
  quantity: number;
}


export type Cart = {
  destination_location_id: number;
  payment: PaymentType;
  products_list: ProductsList[];
  customer_info: Customer;
}

export const paymentList = [

  {
    label: 'Tiền mặt',
    value: `${PaymentType.Cash}`,
  },
  {
    label: 'Momo',
    value: `${PaymentType.Momo}`,
  },
  {
    label: 'Xu',
    value: `${PaymentType.CreditPayment}`,
  },
  {
    label: 'Tất Cả',
    value: ``,
  }
];


export const statusList = [
  {
    label: 'Hoàn Thành',
    value: `${OrderStatus.Delivered}`,
  },
  {
    label: 'Mới',
    value: `${OrderStatus.New}`,
  },
  {
    label: 'Đã Hủy',
    value: `${OrderStatus.Removed}`,
  },
  {
    label: 'Tất Cả',
    value: ``,
  }
]
