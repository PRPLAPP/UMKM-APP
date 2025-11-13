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

export interface CommunityHomeResponse {
  stats: {
    eventsCount: number;
    businessesCount: number;
    tourismSpotsCount: number;
    activeMembers: number;
  };
  news: Array<{
    id: string;
    title: string;
    summary: string;
    type: string;
    publishedAt: string;
  }>;
  tourismSpots: Array<{
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    location: string;
  }>;
  msmes: Array<{
    id: string;
    name: string;
    category: string;
    distanceKm: number;
    rating: number;
    location: string;
  }>;
}

export interface AdminDashboardResponse {
  stats: {
    totalUsers: number;
    activeMsmes: number;
    totalOrders: number;
    pendingRequests: number;
  };
  growth: Array<{
    month: string;
    users: number;
    msmes: number;
    orders: number;
  }>;
  verificationRequests: Array<{
    id: string;
    name: string;
    category: string;
    submittedAt: string;
    owner: string;
  }>;
  msmeCategories: Array<{
    category: string;
    count: number;
  }>;
  population: {
    entries: Array<{
      category: string;
      value: string;
      change: string;
    }>;
  };
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: "villager" | "msme" | "admin";
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "villager" | "msme" | "admin";
    createdAt: string;
  };
}

const authHeaders = (token?: string) =>
  token
    ? {
        Authorization: `Bearer ${token}`
      }
    : {};

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

export function fetchCommunityHome() {
  return fetch(`${API_BASE}/community/home`).then((res) => handleResponse<CommunityHomeResponse>(res));
}

export function fetchAdminDashboard(token: string) {
  return fetch(`${API_BASE}/admin/dashboard`, {
    headers: {
      ...authHeaders(token)
    }
  }).then((res) => handleResponse<AdminDashboardResponse>(res));
}

export function registerAccount(payload: RegisterPayload) {
  return fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }).then((res) => handleResponse<AuthResponse>(res));
}

export function login(payload: LoginPayload) {
  return fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }).then((res) => handleResponse<AuthResponse>(res));
}

export function fetchCurrentUser(token: string) {
  return fetch(`${API_BASE}/auth/me`, {
    headers: {
      ...authHeaders(token)
    }
  })
    .then((res) => handleResponse<{ user: AuthResponse["user"] }>(res))
    .then((data) => data.user);
}
