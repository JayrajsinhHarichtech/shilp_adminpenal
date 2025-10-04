import axios from "axios";

const API = "http://localhost:5000/api/testimonials";

export const getTestimonials = async () => {
  const res = await axios.get(API);
  return res.data;
};

export const createTestimonial = async (data) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("designation", data.designation);
  formData.append("message", data.message);
  if (data.image) formData.append("image", data.image);

  const res = await axios.post(API, formData);
  return res.data;
};

export const deleteTestimonial = async (id) => {
  const res = await axios.delete(`${API}/${id}`);
  return res.data;
};
