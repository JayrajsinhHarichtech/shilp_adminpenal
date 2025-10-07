import { useState, useEffect } from "react";

export default function HomeEditor() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [banners, setBanners] = useState([{ aboutText: "", image: null, preview: null }]);
  const [services, setServices] = useState([{ title: "", description: "", icon: "" }]);
  const [testimonials, setTestimonials] = useState([{ name: "", text: "", image: null, preview: null }]);

  useEffect(() => {
    fetch("http://localhost:5000/api/banner")
      .then(res => res.json())
      .then(data => {
        if (data.banners && data.banners.length > 0) {
          setBanners(data.banners.map(b => ({
            aboutText: b.aboutText || "",
            image: null,
            preview: b.imageUrl ? `http://localhost:5000${b.imageUrl}` : null
          })));
        }
        if (data.services && data.services.length > 0) {
          setServices(data.services);
        }
        if (data.testimonials && data.testimonials.length > 0) {
          setTestimonials(data.testimonials.map(t => ({
            name: t.name || "",
            text: t.text || "",
            image: null,
            preview: t.imageUrl ? `http://localhost:5000${t.imageUrl}` : null
          })));
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleChange = (list, setList, idx, key, value) => {
    const updated = [...list];
    updated[idx][key] = value;
    setList(updated);
  };

  const handleFileChange = (list, setList, idx, key, previewKey) => (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const updated = [...list];
      updated[idx][key] = file;
      updated[idx][previewKey] = URL.createObjectURL(file);
      setList(updated);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const token = localStorage.getItem("token");

    try {
      const formData = new FormData();

      formData.append("banners", JSON.stringify(banners.map(b => ({ aboutText: b.aboutText }))));
      if (banners[0]?.image) formData.append("banners[0][bannerImage]", banners[0].image);

      formData.append("services", JSON.stringify(services));

      formData.append("testimonials", JSON.stringify(testimonials.map(t => ({ name: t.name, text: t.text }))));
      if (testimonials[0]?.image) formData.append("testimonials[0][testimonialImage]", testimonials[0].image);

      await fetch("http://localhost:5000/api/banner", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      setMessage("Homepage updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to update homepage.");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 5000);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">HOME-PAGE</h1>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Banner Section */}
        {banners.map((b, idx) => (
          <div key={idx} className="bg-white p-4 rounded shadow space-y-2">
            <h2 className="font-semibold">Banner</h2>
            <textarea
              placeholder="About Text"
              value={b.aboutText}
              onChange={(e) => handleChange(banners, setBanners, idx, "aboutText", e.target.value)}
              className="border p-2 w-full"
            />
            {b.preview && <img src={b.preview} alt="preview" className="w-full max-h-40 object-cover my-2" />}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange(banners, setBanners, idx, "image", "preview")}
            />
          </div>
        ))}

        {/* Services Section */}
        <div className="bg-white p-4 rounded shadow space-y-2">
          <h2 className="font-semibold">Services</h2>
          {services.map((s, idx) => (
            <div key={idx} className="space-y-1">
              <input
                type="text"
                placeholder="Title"
                value={s.title}
                onChange={(e) => handleChange(services, setServices, idx, "title", e.target.value)}
                className="border p-2 w-full"
              />
              <input
                type="text"
                placeholder="Description"
                value={s.description}
                onChange={(e) => handleChange(services, setServices, idx, "description", e.target.value)}
                className="border p-2 w-full"
              />
              <input
                type="text"
                placeholder="Icon URL or class"
                value={s.icon}
                onChange={(e) => handleChange(services, setServices, idx, "icon", e.target.value)}
                className="border p-2 w-full"
              />
            </div>
          ))}
        </div>

        {/* Testimonials Section */}
        <div className="bg-white p-4 rounded shadow space-y-2">
          <h2 className="font-semibold">Testimonials</h2>
          {testimonials.map((t, idx) => (
            <div key={idx} className="space-y-1">
              <input
                type="text"
                placeholder="Name"
                value={t.name}
                onChange={(e) => handleChange(testimonials, setTestimonials, idx, "name", e.target.value)}
                className="border p-2 w-full"
              />
              <textarea
                placeholder="Text"
                value={t.text}
                onChange={(e) => handleChange(testimonials, setTestimonials, idx, "text", e.target.value)}
                className="border p-2 w-full"
              />
              {t.preview && <img src={t.preview} alt="preview" className="w-full max-h-40 object-cover my-2" />}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange(testimonials, setTestimonials, idx, "image", "preview")}
              />
            </div>
          ))}
        </div>

        <button type="submit" disabled={loading} className="bg-gray-800 text-white py-2 px-4 rounded">
          {loading ? "Saving..." : "Save Changes"}
        </button>

        {message && (
          <p className={`mt-2 ${message.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
