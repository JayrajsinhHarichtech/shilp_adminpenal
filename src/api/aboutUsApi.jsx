import axios from "axios";

const API = "http://localhost:5000/api/aboutus";

export async function getAboutUs() {
  const res = await axios.get(API);
  return res.data;
}

export async function createOrUpdateAboutUs(data) {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("whoWeAre", data.whoWeAre);
  formData.append("vision", data.vision);
  formData.append("mission", data.mission);
  formData.append("values", JSON.stringify(data.values));
  if (data.image) formData.append("image", data.image);

  const res = await axios.post(API, formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function deleteAboutUs(id) {
  const token = localStorage.getItem("token");
  const res = await axios.delete(`${API}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
