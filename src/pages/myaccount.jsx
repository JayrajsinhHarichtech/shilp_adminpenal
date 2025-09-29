import React, { useState, useEffect } from "react";

export default function MyAccount() {
  const [user, setUser] = useState({
    username: "",
    role: "User",
    email: "",
    phone: "",
    createdAt: "",
  });

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;

  useEffect(() => {
    const local = localStorage.getItem("myaccount_user");
    if (local) {
      try {
        const parsed = JSON.parse(local);
        setUser(parsed);
        setForm(parsed);
        return;
      } catch (e) {

      }
    }
    const demo = {
      username: "Jayrajsinh",
      role: "Admin",
      email: "jayrajsinh@gmail.com",
      phone: "123-456-7890",
      createdAt: "2025-01-15",
    };
    setUser(demo);
    setForm(demo);
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function startEditing() {
    setError(null);
    setMessage(null);
    setEditing(true);
  }

  function cancelEditing() {
    setForm(user);
    setError(null);
    setMessage(null);
    setEditing(false);
  }

  async function saveChanges() {
    setError(null);
    setMessage(null);

    if (!form.username || form.username.trim().length < 2) {
      setError('Username must be at least 2 characters.');
      return;
    }
    if (!gmailRegex.test(form.email)) {
      setError('Please use a valid Gmail address (example@gmail.com).');
      return;
    }
    if (form.phone && form.phone.trim().length < 6) {
      setError('Phone number looks too short.');
      return;
    }

    setLoading(true);
    try {
      const updated = { ...form };

      localStorage.setItem("myaccount_user", JSON.stringify(updated));

      setUser(updated);
      setForm(updated);
      setEditing(false);
      setMessage("Account updated successfully.");
    } catch (e) {
      console.error(e);
      setError("Failed to update account. Saved locally instead.");

      localStorage.setItem("myaccount_user", JSON.stringify(form));
      setUser(form);
      setForm(form);
      setEditing(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">My Account</h2>

      {message && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        <label className="flex flex-col">
          <span className="font-semibold text-gray-600">Username</span>
          <input
            name="username"
            value={form.username || ""}
            onChange={handleChange}
            disabled={!editing}
            className={`mt-1 p-2 border rounded ${editing ? 'bg-white' : 'bg-gray-100'} `}
          />
        </label>

        <label className="flex flex-col">
          <span className="font-semibold text-gray-600">Role</span>
          <input
            name="role"
            value={form.role || ""}
            onChange={handleChange}
            disabled={!editing}
            className="mt-1 p-2 border rounded bg-gray-100 cursor-not-allowed"
          />
          <small className="text-gray-500 mt-1">Role is read-only in this demo.</small>
        </label>

        <label className="flex flex-col">
          <span className="font-semibold text-gray-600">Email (must be Gmail)</span>
          <input
            name="email"
            value={form.email || ""}
            onChange={handleChange}
            disabled={!editing}
            className={`mt-1 p-2 border rounded ${editing ? 'bg-white' : 'bg-gray-100'}`}
          />
        </label>

        <label className="flex flex-col">
          <span className="font-semibold text-gray-600">Phone</span>
          <input
            name="phone"
            value={form.phone || ""}
            onChange={handleChange}
            disabled={!editing}
            className={`mt-1 p-2 border rounded ${editing ? 'bg-white' : 'bg-gray-100'}`}
          />
        </label>

        <div className="flex justify-between items-center">
          <div>
            <span className="font-semibold text-gray-600">Account Created:</span>
            <div className="text-gray-800">{user.createdAt}</div>
          </div>

          <div className="space-x-2">
            {!editing && (
              <button
                onClick={startEditing}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Edit
              </button>
            )}

            {editing && (
              <>
                <button
                  onClick={saveChanges}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>

                <button
                  onClick={cancelEditing}
                  disabled={loading}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              </>
            )}
            <button
              onClick={() => (editing ? saveChanges() : startEditing())}
              className="ml-2 px-4 py-2 border rounded"
            >
              Update Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
