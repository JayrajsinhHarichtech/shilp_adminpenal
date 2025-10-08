import { useState, useEffect } from "react";
import { createResidential, updateResidential } from "../../../api/residentialApi";

export default function ResidentialForm({ selected, onSaved }) {
  const [form, setForm] = useState({ title: "", description: "", image: null });
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selected) {
      setForm({ title: selected.title || "", description: selected.description || "", image: null });
      setPreview(selected.image?.startsWith("http") ? selected.image : `http://localhost:5000/${selected.image}`);
    } else {
      setForm({ title: "", description: "", image: null });
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

  const handleSave = async () => {
    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      if (selected) await updateResidential(selected._id, form);
      else await createResidential(form);

      setMessage(selected ? "Residential updated successfully!" : "Residential added successfully!");
      onSaved();
      setForm({ title: "", description: "", image: null });
      setPreview(null);
    } catch (err) {
      console.error(err);
      setMessage("Failed to save Residential project.");
      setIsError(true);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 5000);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        {selected ? "Edit Residential Project" : "Add Residential Project"}
      </h2>

      <input
        type="text"
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        className="w-full border p-2 rounded mb-3"
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className="w-full border p-2 rounded mb-3 h-28"
        required
      />

      <div className="flex flex-col items-center justify-center border rounded-lg p-4 bg-gray-50">
        {preview ? (
          <img src={preview} alt="Residential Preview" className="w-full max-h-80 object-cover rounded-lg mb-4" />
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
        {message && <p className={`text-sm font-medium ${isError ? "text-red-600" : "text-green-600"}`}>{message}</p>}
      </div>
    </div>
  );
}
