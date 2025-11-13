const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed");
  }
  return response.json() as Promise<T>;
}

export interface ProductPayload {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
}

export interface Product extends ProductPayload {
  id: string;
  createdAt: string;
}

export interface OrderItemPayload {
  productId: string;
  quantity: number;
}

export interface OrderPayload {
  customerName: string;
  customerEmail: string;
  items: OrderItemPayload[];
  status?: "pending" | "processing" | "completed";
}

export interface Order extends OrderPayload {
  id: string;
  total: number;
  createdAt: string;
  status: "pending" | "processing" | "completed";
}

export interface SalesSummary {
  totalRevenue: number;
  ordersCount: number;
  lastOrderAt: string | null;
}

export function fetchProducts() {
  return fetch(`${API_BASE}/products`).then((res) => handleResponse<Product[]>(res));
}

export function createProduct(payload: ProductPayload) {
  return fetch(`${API_BASE}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }).then((res) => handleResponse<Product>(res));
}

export function fetchOrders() {
  return fetch(`${API_BASE}/orders`).then((res) => handleResponse<Order[]>(res));
}

export function createOrder(payload: OrderPayload) {
  return fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }).then((res) => handleResponse<Order>(res));
}

export function fetchSalesSummary() {
  return fetch(`${API_BASE}/reports/sales`).then((res) => handleResponse<SalesSummary>(res));
}
