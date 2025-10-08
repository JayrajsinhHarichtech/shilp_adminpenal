
import axios from "axios";

const API = import.meta.env.VITE_URL + "/api/dashboard";

// ✅ Get all dashboard projects
export const getDashboard = async () => {
  const res = await axios.get(API);
  return res.data;
};

// ✅ Add new project
export const addDashboard = async (data) => {
  const res = await axios.post(API, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// ✅ Delete a project by ID
export const deleteDashboard = async (id) => {
  await axios.delete(`${API}/${id}`);
};

// ✅ Update existing project by ID
export const updateDashboard = async (id, data) => {
  const res = await axios.put(`${API}/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

