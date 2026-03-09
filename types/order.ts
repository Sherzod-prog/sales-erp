export type OrderStatus = "PENDING" | "PAID" | "CANCELLED";

export type OrderItem = {
  id: string;
  productId: string;
  orderId: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    price: number;
    stock: number;
  };
};

export type Order = {
  id: string;
  customerId: string;
  total: number;
  status: OrderStatus;
  cancelReason?: string | null;
  cancelledAt?: string | null;
  createdAt: string;
  updatedAt: string;
  customer: {
    id: string;
    name: string;
    phone: string;    
  };
  items: OrderItem[];
};