import axios from "axios";

const API = "http://localhost:5000/api/project-tree";

export const getProjectTree = async () => {
  const res = await axios.get(API);
  return res.data;
};

export const createProjectNode = async (node) => {
  const res = await axios.post(API, node);
  return res.data;
};

export const deleteProjectNode = async (id) => {
  const res = await axios.delete(`${API}/${id}`);
  return res.data;
};
