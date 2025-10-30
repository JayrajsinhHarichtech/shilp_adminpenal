"use client";
import React, { useEffect, useState } from "react";

export default function BlogsPage() {
  const [banner, setBanner] = useState({
    desktopImage: null,
    mobileImage: null,
  });
  const [bannerPreview, setBannerPreview] = useState({ desktop: null, mobile: null });
  const [bannerLoading, setBannerLoading] = useState(false);
  const [form, setForm] = useState({
    id: "",
    image: null,
    alt: "",
    publish: "",
    date: "",
    url: "",
    title: "",
    desc: "",
    points: [{ title: "", subtitle: "", image: null }],
  });
  const [preview, setPreview] = useState({ image: null, points: [null] });
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/blogs/banner");
        const data = await res.json();
        if (data) {
          setBanner({
            desktopImage: data.desktopImage || null,
            mobileImage: data.mobileImage || null,
          });
          setBannerPreview({
            desktop: data.desktopImage ? `http://localhost:5000${data.desktopImage}` : null,
            mobile: data.mobileImage ? `http://localhost:5000${data.mobileImage}` : null,
          });
        }
      } catch (err) {
        console.error("Error fetching banner:", err);
      }
    };
    fetchBanner();
  }, []);

  const handleBannerChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setBanner({ ...banner, [name]: files[0] });
      setBannerPreview({
        ...bannerPreview,
        [name === "desktopImage" ? "desktop" : "mobile"]: URL.createObjectURL(files[0]),
      });
    }
  };

  const handleBannerSubmit = async (e) => {
    e.preventDefault();
    setBannerLoading(true);

    const formData = new FormData();
    if (banner.desktopImage instanceof File) formData.append("desktopImage", banner.desktopImage);
    if (banner.mobileImage instanceof File) formData.append("mobileImage", banner.mobileImage);

    try {
      const res = await fetch("http://localhost:5000/api/blogs/banner", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("Banner updated successfully!");
      } else {
        alert("Failed to update banner");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating banner");
    }
    setBannerLoading(false);
  };

  const handleChange = (e, index = null, field = null) => {
    const { name, value, files } = e.target;

    if (index !== null && field !== null) {
      const newPoints = [...form.points];
      newPoints[index][field] = files && files[0] ? files[0] : value;
      setForm({ ...form, points: newPoints });

      if (files && files[0]) {
        const newPreviewPoints = [...preview.points];
        newPreviewPoints[index] = URL.createObjectURL(files[0]);
        setPreview({ ...preview, points: newPreviewPoints });
      }
    } else {
      if (files && files[0]) {
        setForm({ ...form, [name]: files[0] });
        setPreview({ ...preview, image: URL.createObjectURL(files[0]) });
      } else {
        setForm({ ...form, [name]: value });
      }
    }
  };

  const addPoint = () => {
    setForm({
      ...form,
      points: [...form.points, { title: "", subtitle: "", image: null }],
    });
    setPreview({ ...preview, points: [...preview.points, null] });
  };

  const removePoint = (index) => {
    const newPoints = [...form.points];
    newPoints.splice(index, 1);
    const newPreviewPoints = [...preview.points];
    newPreviewPoints.splice(index, 1);
    setForm({ ...form, points: newPoints });
    setPreview({ ...preview, points: newPreviewPoints });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData();

  formData.append("alt", form.alt);
  formData.append("publish", form.publish);
  formData.append("date", form.date);
  formData.append("url", form.url);
  formData.append("title", form.title);
  formData.append("desc", form.desc);

  if (form.image instanceof File) formData.append("image", form.image);

  // Points data without images
  formData.append("points", JSON.stringify(
    form.points.map((p) => ({ title: p.title, subtitle: p.subtitle }))
  ));

  // Points images
  form.points.forEach((point, index) => {
    if (point.image instanceof File) {
      // Backend expects field name like `pointImages_0`, `pointImages_1`
      formData.append(`pointImages_${index}`, point.image);
    }
  });

  try {
    const res = await fetch("http://localhost:5000/api/blogs", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("Blog saved successfully!");
      // Reset form
      setForm({
        id: "",
        image: null,
        alt: "",
        publish: "",
        date: "",
        url: "",
        title: "",
        desc: "",
        points: [{ title: "", subtitle: "", image: null }],
      });
      setPreview({ image: null, points: [null] });
    } else {
      const errorData = await res.json();
      alert("Failed to save blog: " + errorData.error);
    }
  } catch (err) {
    console.error(err);
    alert("Error submitting blog: " + err.message);
  }
};
  return (
    <div className="space-y-10">
      {/* Banner Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Blogs Banner</h2>
        <form onSubmit={handleBannerSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="font-medium block mb-1">Desktop Banner:</label>
              <input
                type="file"
                name="desktopImage"
                accept="image/*"
                onChange={handleBannerChange}
                className="w-full border p-2 rounded"
              />
              {bannerPreview.desktop && (
                <img
                  src={bannerPreview.desktop}
                  alt="Desktop"
                  className="mt-2 h-40 w-full rounded object-cover"
                />
              )}
            </div>
            <div>
              <label className="font-medium block mb-1">Mobile Banner:</label>
              <input
                type="file"
                name="mobileImage"
                accept="image/*"
                onChange={handleBannerChange}
                className="w-full border p-2 rounded"
              />
              {bannerPreview.mobile && (
                <img
                  src={bannerPreview.mobile}
                  alt="Mobile"
                  className="mt-2 h-40 w-full rounded object-cover"
                />
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={bannerLoading}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
          >
            {bannerLoading ? "Saving..." : "Save Banner"}
          </button>
        </form>
      </div>

      {/* Blog Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Add Blog</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* <input
            type="number"
            name="id"
            value={form.id}
            onChange={handleChange}
            placeholder="ID"
            className="w-full border p-2 rounded"
          /> */}
           <input
            type="text"
            name="alt"
            value={form.alt}
            onChange={handleChange}
            placeholder="Alt Text"
            className="w-full border p-2 rounded"
          />
          <textarea
            name="publish"
            value={form.publish}  
            onChange={handleChange}
            placeholder="Publish"
            className="w-full border p-2 rounded"
          />
          <div>
            <label className="font-medium block mb-1">Main Image:</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            {preview.image && (
              <img
                src={preview.image}
                alt="Preview"
                className="mt-2 h-40 w-full rounded object-cover"
              />
            )}
          </div>

        
          
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="url"
            value={form.url}
            onChange={handleChange}
            placeholder="URL"
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full border p-2 rounded"
          />
          <textarea
            name="desc"
            value={form.desc}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border p-2 rounded"
          />

          {/* Points */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Points</h3>
            {form.points.map((point, index) => (
              <div key={index} className="border p-4 rounded-lg space-y-3 bg-gray-50">
                <input
                  type="text"
                  value={point.title}
                  placeholder={`Point #${index + 1} Title`}
                  className="w-full border p-2 rounded"
                  onChange={(e) => handleChange(e, index, "title")}
                />
                <textarea
                  value={point.subtitle}
                  placeholder={`Point #${index + 1} Subtitle`}
                  className="w-full border p-2 rounded"
                  onChange={(e) => handleChange(e, index, "subtitle")}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleChange(e, index, "image")}
                />
                {preview.points[index] && (
                  <img
                    src={preview.points[index]}
                    alt={`Point ${index + 1} Preview`}
                    className="mt-2 h-32 rounded object-cover"
                  />
                )}
                {form.points.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePoint(index)}
                    className="text-red-600 hover:underline"
                  >
                    Remove Point
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addPoint}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Add Point
            </button>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
          >
            Save Blog
          </button>
        </form>
      </div>
    </div>
  );
}
