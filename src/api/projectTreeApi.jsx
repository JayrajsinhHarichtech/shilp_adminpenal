import axios from "axios";

const API = "http://localhost:5000/api/project-tree";
const BANNER_API = "http://localhost:5000/api/project-tree/banner";

/* ---- Project Tree ---- */
export const getProjectTree = async () => (await axios.get(API)).data;

export const createProjectNode = async (node) => {
  const formData = new FormData();
  Object.keys(node).forEach((key) => {
    formData.append(key, node[key]);
  });
  return (await axios.post(API, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })).data;
};

export const updateProjectNode = async (id, node) => {
  const formData = new FormData();
  Object.keys(node).forEach((key) => {
    formData.append(key, node[key]);
  });
  return (await axios.put(`${API}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })).data;
};

export const deleteProjectNode = async (id) =>
  (await axios.delete(`${API}/${id}`)).data;

/* ---- Project Banner ---- */
export const getProjectBanner = async () =>
  (await axios.get(BANNER_API)).data;

export const updateProjectBanner = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  return (await axios.post(BANNER_API, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })).data;
};

export const deleteProjectBanner = async () =>
  (await axios.delete(BANNER_API)).data;
