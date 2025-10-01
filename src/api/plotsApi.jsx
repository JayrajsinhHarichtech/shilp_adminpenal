import axios from "axios";

const API = "http://localhost:5000/api/plots";
  
export const getPlots = async () => {
  const res = await axios.get(API);
  return res.data;
};

export const createPlot = async (data) => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("description", data.description);
  if (data.image) formData.append("file", data.image); 

  const token = localStorage.getItem("token");

  await axios.post(API, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updatePlot = async (id, data) => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("description", data.description);
  if (data.image) formData.append("file", data.image);

  const token = localStorage.getItem("token");

  await axios.put(`${API}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deletePlot = async (id) => {
  const token = localStorage.getItem("token");

  await axios.delete(`${API}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
