import axios from "axios";

const API = "http://localhost:5000/api/testimonials";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getTestimonials = async () => {
  const res = await api.get("/testimonials");
  return res.data;
};

export const createTestimonial = async (data) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("designation", data.designation);
  formData.append("message", data.message);
  if (data.image) formData.append("image", data.image);

  const res = await api.post("/testimonials", formData);
  return res.data;
};

export const updateTestimonial = async (id, data) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("designation", data.designation);
  formData.append("message", data.message);
  if (data.image) formData.append("image", data.image);

  const res = await api.put(`/testimonials/${id}`, formData);
  return res.data;
};

export const deleteTestimonial = async (id) => {
  const res = await api.delete(`/testimonials/${id}`);
  return res.data;
};
