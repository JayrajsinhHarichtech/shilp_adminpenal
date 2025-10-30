import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, forgotPassword, logoutUser } from "../../api/loginpage";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const result = await loginUser(email, password);

    if (result.success && result.data?.token) {
      localStorage.setItem("token", result.data.token);
      onLogin?.();
      navigate("/dashboard", { replace: true });
    } else {
      setMessage(result.message || "Invalid email or password!");
    }
  };

  const handleForgot = async () => {
    const result = await forgotPassword(email);
    if (result.success) {
      setMessage(`Reset link: ${result.data.resetToken}`);
    } else {
      setMessage(result.message);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();

      localStorage.removeItem("token");
      sessionStorage.clear();

      setMessage("Logged out successfully");

      navigate("/", { replace: true });
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.error("Logout error:", error);
      setMessage("Logout failed. Try again!");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Login to Shilp
        </h2>

        {/* 🔹 Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full border px-4 py-2 mb-4 rounded focus:ring-2 focus:ring-gray-400"
            required
          />

          {/* Password Input with Eye Icon */}
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-gray-400 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-800"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-900 transition"
          >
            Login
          </button>
        </form>

        {/* 🔹 Actions */}
        <div className="flex justify-between mt-4">
          <button
            onClick={handleForgot}
            className="text-gray-900 hover:underline"
          >
            Forgot Password?
          </button>
          <button
            onClick={handleLogout}
            className="text-gray-900 hover:underline"
          >
            Logout
          </button>
        </div>

        {/* 🔹 Message */}
        {message && (
          <p
            className={`mt-4 text-center font-medium ${
              message.toLowerCase().includes("success")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
