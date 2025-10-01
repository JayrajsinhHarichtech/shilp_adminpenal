import axios from "axios";

const API = "http://localhost:5000/api/commercials";

export const getCommercials = async () => {
  const res = await axios.get(API);
  return res.data;
};

export const createCommercial = async (data) => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("image", data.image);

  await axios.post(API, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateCommercial = async (id, data) => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("description", data.description);
  if (data.image) formData.append("image", data.image);

  await axios.put(`${API}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteCommercial = async (id) => {
  await axios.delete(`${API}/${id}`);
};
