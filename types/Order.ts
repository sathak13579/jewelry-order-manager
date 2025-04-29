export interface Order {
  _id?: string;
  orderNumber?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  status: "pending" | "in_progress" | "completed" | "delivered" | "cancelled";
  items: OrderItem[];
  totalAmount?: number;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface OrderItem {
  _id?: string;
  name: string;
  description?: string;
  quantity: number;
  price: number;
  customizations?: string[];
}
