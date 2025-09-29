import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/loginpage";

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      return;
    }

    setMessage(result.message || "Invalid email or password!");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Login to Shilp
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full border px-4 py-2 mb-4 rounded focus:ring-2 focus:ring-gray-400"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full border px-4 py-2 mb-4 rounded focus:ring-2 focus:ring-gray-400"
            required
          />
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-900 transition"
          >
            Login
          </button>
        </form>
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
  