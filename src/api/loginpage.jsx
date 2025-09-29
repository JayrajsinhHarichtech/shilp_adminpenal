import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export async function loginUser(email, password) {
  try {
    const res = await axios.post(`${API}/login`, { email, password});
    return { success: true, data: res.data };
  } catch (error) {
    const msg = error.response?.data?.msg || error.message || "Login failetd!";
    return { success: false, message: msg };
  }
} 

