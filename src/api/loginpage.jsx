import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export async function loginUser(email, password) {
  try {
    const res = await axios.post(`${API}/login`, { email, password });
    return { success: true, data: res.data };
  } catch (error) {
    const msg = error.response?.data?.error || error.message || "Login failed!";
    return { success: false, message: msg };
  }
}

export async function logoutUser() {
  try {
    const res = await axios.post(`${API}/logout`);
    return { success: true, message: res.data.message };
  } catch (error) {
    return { success: false, message: "Logout failed" };
  }
}

export async function forgotPassword(email) {
  try {
    const res = await axios.post(`${API}/forgot-password`, { email });
    return { success: true, data: res.data };
  } catch (error) {
    const msg = error.response?.data?.error || error.message || "Something went wrong!";
    return { success: false, message: msg };
  }
}
