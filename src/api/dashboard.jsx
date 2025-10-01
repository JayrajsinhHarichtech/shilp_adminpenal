import axios from "axios";

const API = "http://localhost:5000/api/dashboard";

export const getDashboard = async () => {
  const res = await axios.get(API);
  return res.data;
};

export const addDashboard = async (item) => {
  const res = await axios.post(API, item);
  return res.data;
};

export const updateDashboard = async (id, item) => {
  const res = await axios.put(`${API}/${id}`, item);
  return res.data;
};

export const deleteDashboard = async (id) => {
  await axios.delete(`${API}/${id}`);
};
