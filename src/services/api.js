import axios from "axios";

const BASE = "https://x045ht03-3001.inc1.devtunnels.ms/api";

const api = axios.create({ baseURL: BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("dz_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("dz_token");
      window.location.href = "/admin/login";
    }
    return Promise.reject(err);
  }
);

// Auth
export const login = (creds) => api.post("/auth/login", creds).then((r) => r.data);
export const getMe = () => api.get("/auth/me").then((r) => r.data);

// Deals
export const getDeals = (params) => api.get("/deals", { params }).then((r) => r.data);
export const createDeal = (data) => api.post("/deals", data).then((r) => r.data);
export const updateDeal = (id, data) => api.put(`/deals/${id}`, data).then((r) => r.data);
export const deleteDeal = (id) => api.delete(`/deals/${id}`).then((r) => r.data);

// Categories
export const getCategories = () => api.get("/categories").then((r) => r.data);
export const createCategory = (data) => api.post("/categories", data).then((r) => r.data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data).then((r) => r.data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`).then((r) => r.data);

// Subscribers
export const getSubscribers = () => api.get("/subscribers").then((r) => r.data);
export const subscribe = (email) => api.post("/subscribers", { email }).then((r) => r.data);
export const deleteSubscriber = (id) => api.delete(`/subscribers/${id}`).then((r) => r.data);

// Stats
export const getStats = () => api.get("/stats").then((r) => r.data);

// Image upload
export const uploadImage = (file) => {
  const fd = new FormData();
  fd.append("image", file);
  return api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data);
};

// Base URL for images (without /api)
export const IMG_BASE = BASE.replace("/api", "");
