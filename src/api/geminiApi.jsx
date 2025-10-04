import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/ai", // must match your backend
});

export default API;
