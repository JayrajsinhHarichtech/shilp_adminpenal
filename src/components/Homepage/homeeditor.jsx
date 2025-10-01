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
      if (data.aboutText) {
        setBanners([{
          aboutText: data.aboutText,
          image: null,
          preview: data.imageUrl ? `http://localhost:5000${data.imageUrl}` : null
        }]);
      }
    })
    .catch(err => console.error(err));
}, []);

  // Handlers
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

  const handleFileChange = (setter, previewSetter) => (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setter(file);
      previewSetter(URL.createObjectURL(file));
    }
  };

  // Save function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const token = localStorage.getItem("token");

    try {
      // 1️⃣ Save banners
      for (let b of banners) {
        const formData = new FormData();
        formData.append("aboutText", b.aboutText);
        if (b.image) formData.append("image", b.image);

        await fetch("http://localhost:5000/api/banner", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      }

      // 2️⃣ Save services
      for (let s of services) {
        const formData = new FormData();
        formData.append("title", s.title);
        formData.append("description", s.description);
        formData.append("icon", s.icon);

        await fetch("http://localhost:5000/api/banner", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      }

      // 3️⃣ Save testimonials
      for (let t of testimonials) {
        const formData = new FormData();
        formData.append("name", t.name);
        formData.append("text", t.text);
        if (t.image) formData.append("image", t.image);

        await fetch("http://localhost:5000/api/banner", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      }

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
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">HOME-PAGE</h1>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Banner Section */}
        {banners.map((b, idx) => (
          <div key={idx} className="bg-white p-4 rounded shadow space-y-2">
            <h2 className="font-semibold">Banner</h2>
            <textarea
              placeholder="About Text"
              value={b.aboutText}
              onChange={(e) => handleBannerChange(idx, "aboutText", e.target.value)}
              className="border p-2 w-full"
            />
            {b.preview && <img src={b.preview} alt="preview" className="w-full max-h-40 object-cover my-2" />}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange(
                (file) => handleBannerChange(idx, "image", file),
                (url) => handleBannerChange(idx, "preview", url)
              )}
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
                onChange={(e) => handleServiceChange(idx, "title", e.target.value)}
                className="border p-2 w-full"
              />
              <input
                type="text"
                placeholder="Description"
                value={s.description}
                onChange={(e) => handleServiceChange(idx, "description", e.target.value)}
                className="border p-2 w-full"
              />
              <input
                type="text"
                placeholder="Icon URL or class"
                value={s.icon}
                onChange={(e) => handleServiceChange(idx, "icon", e.target.value)}
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
                onChange={(e) => handleTestimonialChange(idx, "name", e.target.value)}
                className="border p-2 w-full"
              />
              <textarea
                placeholder="Text"
                value={t.text}
                onChange={(e) => handleTestimonialChange(idx, "text", e.target.value)}
                className="border p-2 w-full"
              />
              {t.preview && <img src={t.preview} alt="preview" className="w-full max-h-40 object-cover my-2" />}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange(
                  (file) => handleTestimonialChange(idx, "image", file),
                  (url) => handleTestimonialChange(idx, "preview", url)
                )}
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
