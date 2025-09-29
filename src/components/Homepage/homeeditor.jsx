import { useState, useEffect } from "react";
import api from "../../api/homepageapi";

export default function HomeEditor() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [banners, setBanners] = useState([{ aboutText: "", image: null }]);
  const [services, setServices] = useState([{ title: "", description: "", icon: "" }]);
  const [testimonials, setTestimonials] = useState([{ name: "", text: "", image: null }]);

  useEffect(() => {
    api.get("/banner")
      .then(res => {
        const data = res.data;
        if (data.banners) setBanners(data.banners.map(b => ({ aboutText: b.aboutText, image: null })));
        if (data.services) setServices(data.services);
        if (data.testimonials) setTestimonials(data.testimonials.map(t => ({ name: t.name, text: t.text, image: null })));
      })
      .catch(err => console.error(err));
  }, []);

  const handleBannerChange = (idx, key, value) => {
    const updated = [...banners];
    updated[idx][key] = value;
    setBanners(updated);
  };

  const handleServiceChange = (idx, key, value) => {
    const updated = [...services];
    updated[idx][key] = value;
    setServices(updated);
  };

  const handleTestimonialChange = (idx, key, value) => {
    const updated = [...testimonials];
    updated[idx][key] = value;
    setTestimonials(updated);
  };

  const handleFileChange = (setter) => (e) => {
    if (e.target.files && e.target.files[0]) setter(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();

      // Banner texts and images
      banners.forEach((b) => {
        formData.append("bannersAboutText[]", b.aboutText);
        if (b.image) formData.append("bannersImages[]", b.image);
      });

      // Services
      services.forEach((s, idx) => {
        formData.append(`services[${idx}][title]`, s.title);
        formData.append(`services[${idx}][description]`, s.description);
        formData.append(`services[${idx}][icon]`, s.icon);
      });

      // Testimonials
      testimonials.forEach((t) => {
        formData.append("testimonialsName[]", t.name);
        formData.append("testimonialsText[]", t.text);
        if (t.image) formData.append("testimonialsImages[]", t.image);
      });

      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/banner", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Do NOT set Content-Type, browser handles it
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Homepage updated successfully!");
      } else {
        setMessage(data.message || "Failed to update homepage.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to update homepage.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Homepage Editor</h1>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Banner Section */}
        {banners.map((b, idx) => (
          <div key={idx} className="bg-white p-4 rounded shadow space-y-2">
            <h2 className="font-semibold">Banner {idx + 1}</h2>
            <textarea
              placeholder="About Text"
              value={b.aboutText}
              onChange={(e) => handleBannerChange(idx, "aboutText", e.target.value)}
              className="border p-2 w-full"
            />
            <input type="file" accept="image/*" onChange={handleFileChange((file) => handleBannerChange(idx, "image", file))} />
          </div>
        ))}

        {/* Services Section */}
        <div className="bg-white p-4 rounded shadow space-y-2">
          <h2 className="font-semibold">Services</h2>
          {services.map((s, idx) => (
            <div key={idx} className="space-y-1">
              <input type="text" placeholder="Title" value={s.title} onChange={(e) => handleServiceChange(idx, "title", e.target.value)} className="border p-2 w-full" />
              <input type="text" placeholder="Description" value={s.description} onChange={(e) => handleServiceChange(idx, "description", e.target.value)} className="border p-2 w-full" />
              <input type="text" placeholder="Icon URL or class" value={s.icon} onChange={(e) => handleServiceChange(idx, "icon", e.target.value)} className="border p-2 w-full" />
            </div>
          ))}
        </div>

        {/* Testimonials Section */}
        <div className="bg-white p-4 rounded shadow space-y-2">
          <h2 className="font-semibold">Testimonials</h2>
          {testimonials.map((t, idx) => (
            <div key={idx} className="space-y-1">
              <input type="text" placeholder="Name" value={t.name} onChange={(e) => handleTestimonialChange(idx, "name", e.target.value)} className="border p-2 w-full" />
              <textarea placeholder="Text" value={t.text} onChange={(e) => handleTestimonialChange(idx, "text", e.target.value)} className="border p-2 w-full" />
              <input type="file" accept="image/*" onChange={handleFileChange((file) => handleTestimonialChange(idx, "image", file))} />
            </div>
          ))}
        </div>

        <button type="submit" disabled={loading} className="bg-gray-800 text-white py-2 px-4 rounded">
          {loading ? "Saving..." : "Save Changes"}
        </button>
        {message && <p className={`mt-2 ${message.includes("successfully") ? "text-green-600" : "text-red-600"}`}>{message}</p>}
      </form>
    </div>
  );
}
