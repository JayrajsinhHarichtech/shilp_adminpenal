import axios from "axios";

const API = "http://localhost:5000/api/aboutus";

export async function getAboutUs() {
  const res = await axios.get(API);
  return res.data;
}

export async function createOrUpdateAboutUs(form) {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("whoWeAre", form.whoWeAre);
  formData.append("vision", form.vision);
  formData.append("mission", form.mission);
  formData.append("values", JSON.stringify(form.values || []));

  if (form.desktopBanner) formData.append("desktopBanner", form.desktopBanner);
  if (form.mobileBanner) formData.append("mobileBanner", form.mobileBanner);
  if (form.image) formData.append("image", form.image);

  const res = await axios.post(API, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
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
