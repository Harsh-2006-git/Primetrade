import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true,
});

// Intercept requests to add tokens if needed (though cookies handle most)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (data) => API.post("/auth/register", data),
  login: (data) => API.post("/auth/login", data),
  logout: () => API.post("/auth/logout"),
  getMe: () => API.get("/auth/me"),
};

export const taskService = {
  getTasks: (params) => API.get("/tasks", { params }),
  getTask: (id) => API.get(`/tasks/${id}`),
  createTask: (data) => API.post("/tasks", data),
  updateTask: (id, data) => API.patch(`/tasks/${id}`, data),
  deleteTask: (id) => API.delete(`/tasks/${id}`),
};

export const adminService = {
  getStats: () => API.get("/admin/dashboard"),
  getUsers: () => API.get("/admin/users"),
  getAllTasks: () => API.get("/admin/tasks"),
};

export default API;
