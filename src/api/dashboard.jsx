import axios from "axios";

const API = import.meta.env.VITE_API_URL + "/api/dashboard";

export const getDashboard = async () => {
  const res = await axios.get(API);
  return res.data;
};

export const addDashboard = async (data) => {
  const res = await axios.post(API, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteDashboard = async (id) => {
  await axios.delete(`${API}/${id}`);
};
