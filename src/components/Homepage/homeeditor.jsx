  "use client";
  import React, { useEffect, useState } from "react";

  export default function HomeEditor() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [banners, setBanners] = useState([{ aboutText: "", image: null, preview: null, mobileImage: null, mobilePreview: null }]);
    const [services, setServices] = useState([{ title: "", description: "", icon: "" }]);
    const [testimonials, setTestimonials] = useState([{ name: "", text: "", image: null, preview: null }]);

    useEffect(() => {
      fetch("http://localhost:5000/api/banner")
        .then((res) => res.json())
        .then((data) => {
          if (data.banners) {
            setBanners(
              data.banners.map((b) => ({
                aboutText: b.aboutText || "",
                image: null,
                preview: b.imageUrl ? `http://localhost:5000${b.imageUrl}` : null,
                mobileImage: null,
                mobilePreview: b.mobileUrl ? `http://localhost:5000${b.mobileUrl}` : null,
                imageUrl: b.imageUrl || "",
                mobileUrl: b.mobileUrl || "",
              }))
            );
          }
          if (data.services) setServices(data.services);
          if (data.testimonials) {
            setTestimonials(
              data.testimonials.map((t) => ({
                name: t.name || "",
                text: t.text || "",
                image: null,
                preview: t.imageUrl ? `http://localhost:5000${t.imageUrl}` : null,
                imageUrl: t.imageUrl || "",
              }))
            );
          }
        })
        .catch((err) => console.error(err));
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

    const handleDelete = (list, setList, idx) => {
      const updated = [...list];
      updated.splice(idx, 1);
      setList(updated);
    };

    const handleAdd = (list, setList, newItem) => {
      setList([...list, newItem]);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setMessage("");

      try {
        const formData = new FormData();

        formData.append(
          "banners",
          JSON.stringify(banners.map((b) => ({ aboutText: b.aboutText, imageUrl: b.imageUrl || "", mobileUrl: b.mobileUrl || "" })))
        );
        banners.forEach((b, idx) => {
          if (b.image) formData.append(`banners[${idx}][bannerImage]`, b.image);
          if (b.mobileImage) formData.append(`banners[${idx}][mobileImage]`, b.mobileImage);
        });

        formData.append("services", JSON.stringify(services));

        formData.append(
          "testimonials",
          JSON.stringify(testimonials.map((t) => ({ name: t.name, text: t.text, imageUrl: t.imageUrl || "" })))
        );
        testimonials.forEach((t, idx) => {
          if (t.image) formData.append(`testimonials[${idx}][testimonialImage]`, t.image);
        });

        const res = await fetch("http://localhost:5000/api/banner", {
          method: "POST",
          body: formData,
        });
        const json = await res.json();
        if (res.ok) {
          setMessage("Homepage updated successfully!");
          if (json.homepage && json.homepage.banners) {
            setBanners(
              json.homepage.banners.map((b) => ({
                aboutText: b.aboutText || "",
                image: null,
                preview: b.imageUrl ? `http://localhost:5000${b.imageUrl}` : null,
                mobileImage: null,
                mobilePreview: b.mobileUrl ? `http://localhost:5000${b.mobileUrl}` : null,
                imageUrl: b.imageUrl || "",
                mobileUrl: b.mobileUrl || "",
              }))
            );
          }
          if (json.homepage && json.homepage.testimonials) {
            setTestimonials(
              json.homepage.testimonials.map((t) => ({
                name: t.name || "",
                text: t.text || "",
                image: null,
                preview: t.imageUrl ? `http://localhost:5000${t.imageUrl}` : null,
                imageUrl: t.imageUrl || "",
              }))
            );
          }
        } else {
          setMessage(json.error || "Failed to update homepage.");
        }
      } catch (err) {
        console.error(err);
        setMessage("Failed to update homepage.");
      } finally {
        setLoading(false);
        setTimeout(() => setMessage(""), 5000);
      }
    };

    return (
      <div className="p-6 bg-white rounded shadow space-y-6">
        <h1 className="text-2xl font-bold">Home-Page</h1>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* BANNERS */}
          <div className="space-y-4">
            <h3 className="font-semibold">Banners</h3>
            {banners.map((b, idx) => (
              <div key={idx} className="space-y-2 border p-3 rounded relative">
                <button type="button" className="absolute top-2 right-2 text-red-600" onClick={() => handleDelete(banners, setBanners, idx)}>Delete</button>
                <label>Banner Text</label>
                <textarea
                  value={b.aboutText}
                  onChange={(e) => handleChange(banners, setBanners, idx, "aboutText", e.target.value)}
                  className="border p-2 w-full"
                />
                <div>
                  <label>Desktop Image Preview</label>
                  {b.preview && <img src={b.preview} className="w-full max-h-40 object-cover" />}
                  <input type="file" accept="image/*" onChange={handleFileChange(banners, setBanners, idx, "image", "preview")} />
                </div>
                <div>
                  <label>Mobile Image Preview</label>
                  {b.mobilePreview && <img src={b.mobilePreview} className="w-full max-h-40 object-contain" />}
                  <input type="file" accept="image/*" onChange={handleFileChange(banners, setBanners, idx, "mobileImage", "mobilePreview")} />
                </div>
              </div>
            ))}
            <button type="button" className="bg-blue-600 text-white py-1 px-3 rounded" onClick={() => handleAdd(banners, setBanners, { aboutText: "", image: null, preview: null, mobileImage: null, mobilePreview: null, imageUrl: "", mobileUrl: "" })}>
              Add Banner
            </button>
          </div>

          {/* TESTIMONIALS */}
          {/* <div className="space-y-4">
            <h3 className="font-semibold">Testimonials</h3>
            {testimonials.map((t, idx) => (
              <div key={idx} className="border p-2 rounded space-y-2 relative">
                <button type="button" className="absolute top-2 right-2 text-red-600" onClick={() => handleDelete(testimonials, setTestimonials, idx)}>Delete</button>
                <input type="text" value={t.name} placeholder="Name"
                  onChange={(e) => handleChange(testimonials, setTestimonials, idx, "name", e.target.value)} className="border p-2 w-full" />
                <textarea value={t.text} placeholder="Text"
                  onChange={(e) => handleChange(testimonials, setTestimonials, idx, "text", e.target.value)} className="border p-2 w-full" />
                {t.preview && <img src={t.preview} className="w-24 h-24 object-cover" />}
                <input type="file" accept="image/*" onChange={handleFileChange(testimonials, setTestimonials, idx, "image", "preview")} />
              </div>
            ))}
            <button type="button" className="bg-blue-600 text-white py-1 px-3 rounded" onClick={() => handleAdd(testimonials, setTestimonials, { name: "", text: "", image: null, preview: null, imageUrl: "" })}>
              Add Testimonial
            </button>
          </div> */}

          

          {/* SERVICES */}
          {/* <div className="space-y-2">
            <h3 className="font-semibold">Services</h3>
            {services.map((s, idx) => (
              <div key={idx} className="flex items-center gap-2 border p-2 rounded relative">
                <button type="button" className="absolute top-2 right-2 text-red-600" onClick={() => handleDelete(services, setServices, idx)}>Delete</button>
                <input type="text" value={s.title} placeholder="Title" className="border p-2 w-1/3"
                  onChange={(e) => handleChange(services, setServices, idx, "title", e.target.value)} />
                <input type="text" value={s.description} placeholder="Description" className="border p-2 w-1/2"
                  onChange={(e) => handleChange(services, setServices, idx, "description", e.target.value)} />
                <input type="text" value={s.icon} placeholder="Icon" className="border p-2 w-1/6"
                  onChange={(e) => handleChange(services, setServices, idx, "icon", e.target.value)} />
              </div>
            ))}
            <button type="button" className="bg-blue-600 text-white py-1 px-3 rounded" onClick={() => handleAdd(services, setServices, { title: "", description: "", icon: "" })}>
              Add Service
            </button>
          </div> */}

          <div className="flex items-center gap-2">
            <button type="submit" disabled={loading} className="bg-gray-800 text-white py-2 px-4 rounded">
              {loading ? "Saving..." : "Save Changes"}
            </button>
            {message && (
              <p className={message.toLowerCase().includes("success") ? "text-green-600" : "text-red-600"}>
                {message}
              </p>
            )}
          </div>
        </form>
      </div>
    );
  }
