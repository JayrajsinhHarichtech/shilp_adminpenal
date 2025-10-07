import { useState, useEffect } from "react";
import { createOrUpdateAboutUs } from "../../api/aboutUsApi";

export default function AboutUsForm({ selected, onSaved }) {
  const [form, setForm] = useState({
    whoWeAre: "",
    vision: "",
    mission: "",
    values: [""],
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selected) {
      setForm({
        whoWeAre: selected.whoWeAre || "",
        vision: selected.vision || "",
        mission: selected.mission || "",
        values: selected.values || [""],
        image: null,
      });
      setPreview(selected.image ? `http://localhost:5000${selected.image}` : null);
    } else {
      setForm({ whoWeAre: "", vision: "", mission: "", values: [""], image: null });
      setPreview(null);
    }
  }, [selected]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((f) => ({ ...f, [name]: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleValueChange = (index, value) => {
    const updated = [...form.values];
    updated[index] = value;
    setForm((f) => ({ ...f, values: updated }));
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      await createOrUpdateAboutUs(form);
      setMessage(selected ? "About Us updated!" : "About Us saved!");
      setIsError(false);
      onSaved();
    } catch (err) {
      console.error(err);
      setMessage("Failed to save About Us.");
      setIsError(true);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 5000);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        {selected ? "Edit About Us" : "Add About Us"}
      </h2>

      <textarea
        name="whoWeAre"
        placeholder="Who We Are"
        value={form.whoWeAre}
        onChange={handleChange}
        className="w-full border p-2 rounded mb-3 h-20"
        required
      />

      <textarea
        name="vision"
        placeholder="Vision"
        value={form.vision}
        onChange={handleChange}
        className="w-full border p-2 rounded mb-3 h-20"
        required
      />

      <textarea
        name="mission"
        placeholder="Mission"
        value={form.mission}
        onChange={handleChange}
        className="w-full border p-2 rounded mb-3 h-20"
        required
      />

      <div>
        <label className="font-semibold">Core Values</label>
        {form.values.map((val, idx) => (
          <input
            key={idx}
            type="text"
            value={val}
            onChange={(e) => handleValueChange(idx, e.target.value)}
            className="w-full border p-2 rounded mb-2"
          />
        ))}
      </div>

      <div className="flex flex-col items-center justify-center border rounded-lg p-4 bg-gray-50">
        {preview ? (
          <img src={preview} alt="Preview" className="w-full max-h-80 object-cover rounded-lg mb-4" />
        ) : (
          <div className="text-gray-500 italic mb-4">No image uploaded yet</div>
        )}
        <input type="file" name="image" accept="image/*" onChange={handleChange} />
      </div>

      <div className="flex flex-col items-start md:items-end space-y-2">
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Saving..." : selected ? "Update" : "Save"}
        </button>
        {message && (
          <p className={`text-sm font-medium ${isError ? "text-red-600" : "text-green-600"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
