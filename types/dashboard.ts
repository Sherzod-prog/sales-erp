import { Product } from "./product";

export type DashboardRecentOrder = {
  id: string;
  total: number;
  status: "PENDING" | "PAID" | "CANCELLED";
  createdAt: string;
  customer: {
    id: string;
    name: string;
    phone: string;
  };
};

export type StatusChartItem = {
  name: string;
  value: number;
};

export type OrdersTimelineItem = {
  date: string;
  orders: number;
  revenue: number;
};

export type DashboardStats = {
  totalProducts: number;
  totalCustomers: number;
  totalOrders: number;
  pendingOrders: number;
  paidOrders: number;
  cancelledOrders: number;
  lowStockProducts: Product[];
  recentOrders: DashboardRecentOrder[];
  statusChart: StatusChartItem[];
  ordersTimeline: OrdersTimelineItem[];
};