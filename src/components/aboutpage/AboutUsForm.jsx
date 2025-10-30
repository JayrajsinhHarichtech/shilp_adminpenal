"use client";
import { useEffect, useState } from "react";
import { createOrUpdateAboutUs } from "../../api/aboutUsApi";
import axios from "axios";

const API_BASE = "http://localhost:5000/api/aboutus";

export default function AboutUsEditor() {
  const [form, setForm] = useState({
    whoWeAre: "",
    desktopBanner: null,
    mobileBanner: null,
    desktopPreview: null,
    mobilePreview: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAboutUs = async () => {
      try {
        const res = await axios.get(API_BASE);
        if (res.data) {
          const data = res.data;
          setForm((prev) => ({
            ...prev,
            whoWeAre: data.whoWeAre || "",
            desktopPreview: data.desktopBanner ? `http://localhost:5000${data.desktopBanner}` : null,
            mobilePreview: data.mobileBanner ? `http://localhost:5000${data.mobileBanner}` : null,
          }));
        }
      } catch (err) {
        console.error("Failed to fetch existing AboutUs:", err);
      }
    };
    fetchAboutUs();
  }, []);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    setForm((prev) => ({
      ...prev,
      [name]: file,
      [`${name === "desktopBanner" ? "desktopPreview" : "mobilePreview"}`]: URL.createObjectURL(file),
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await createOrUpdateAboutUs(form);
      setMessage("About Us updated successfully!");
    } catch (err) {
      setMessage("Failed to update About Us.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">About Us Editor</h2>

      <div className="grid gap-4">
        <label>Who We Are</label>
        <textarea
          value={form.whoWeAre}
          onChange={(e) => setForm({ ...form, whoWeAre: e.target.value })}
          className="border p-2 w-full rounded"
        />

        <label>Desktop Banner</label>
        {form.desktopPreview && (
          <img src={form.desktopPreview} alt="Desktop Preview" className="w-48 h-32 object-cover mb-2" />
        )}
        <input type="file" name="desktopBanner" onChange={handleFileChange} />

        <label>Mobile Banner</label>
        {form.mobilePreview && (
          <img src={form.mobilePreview} alt="Mobile Preview" className="w-48 h-32 object-cover mb-2" />
        )}
        <input type="file" name="mobileBanner" onChange={handleFileChange} />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded mt-4 hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>

        {message && <p className="mt-3 text-green-600">{message}</p>}
      </div>
    </div>
  );
}
