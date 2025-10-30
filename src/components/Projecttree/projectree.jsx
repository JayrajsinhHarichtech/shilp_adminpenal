"use client";
import React, { useEffect, useState } from "react";
import {
  getProjectTree,
  createProjectNode,
  updateProjectNode,
  deleteProjectNode,
  getProjectBanner,
  updateProjectBanner,
} from "../../api/projectTreeApi";

const AdminProjectTree = () => {
  const [projects, setProjects] = useState({});
  const [banner, setBanner] = useState(null); // banner file ya object
  const [bannerPreview, setBannerPreview] = useState("");

  const [form, setForm] = useState({
    year: "",
    title: "",
    location: "",
    type: "",
    image: null,
  });
  const [editId, setEditId] = useState(null);
  const [preview, setPreview] = useState("");

  // Fetch Projects
  const fetchProjects = async () => {
    const data = await getProjectTree();
    setProjects(data);
  };

  // Fetch Banner
  const fetchBanner = async () => {
    const data = await getProjectBanner();
    setBanner(data);
  };

  useEffect(() => {
    fetchProjects();
    fetchBanner();
  }, []);

  // Form input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files[0]) {
      setForm({ ...form, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Submit Project Node
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await updateProjectNode(editId, form);
      setEditId(null);
    } else {
      await createProjectNode(form);
    }
    setForm({ year: "", title: "", location: "", type: "", image: null });
    setPreview("");
    fetchProjects();
  };

  // Edit Project Node
  const handleEdit = (p) => {
    setForm({
      year: p.year,
      title: p.title,
      location: p.location,
      type: p.type,
      image: null,
    });
    setPreview(p.image || "");
    setEditId(p._id);
  };

  // Delete Project Node
  const handleDelete = async (id) => {
    await deleteProjectNode(id);
    fetchProjects();
  };

  // Handle Banner File Select
  const handleBannerFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBanner(file); // Store file for upload
    setBannerPreview(URL.createObjectURL(file)); // show preview
  };

  // Submit Banner
  const handleBannerSubmit = async () => {
    if (!banner) return alert("Select a file first");
    try {
      const updated = await updateProjectBanner(banner);
      setBanner(updated);
      setBannerPreview(""); // reset preview
      alert("Banner updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error uploading banner");
    }
  };

  return (
    <div className="p-6">
      {/* Banner Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Project Banner</h2>

        {/* Existing Banner */}
        {banner?.image && !bannerPreview && (
          <img
            src={
              banner.image.startsWith("http")
                ? banner.image
                : `http://localhost:5000${banner.image}`
            }
            alt="Banner"
            className="w-full h-72 object-cover rounded mb-2"
          />
        )}

        {/* Preview */}
        {bannerPreview && (
          <img
            src={bannerPreview}
            alt="Banner Preview"
            className="w-full h-64 object-cover rounded mb-2"
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleBannerFileChange}
          className="mb-2"
        />

        <button
          onClick={handleBannerSubmit}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Submit Banner
        </button>
      </div>

      {/* Title Section */}
      <div className="mb-12 text-left">
        <h1 className="text-xl text-customGrey">Explore</h1>
        <h2 className="text-4xl font-extrabold text-black">
          Our Project Tree
        </h2>
      </div>

      {/* Project Form */}
      <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-2">
        <input
          name="year"
          value={form.year}
          onChange={handleChange}
          placeholder="Year"
          required
        />
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          required
        />
        <input
          name="type"
          value={form.type}
          onChange={handleChange}
          placeholder="Type"
          required
        />

        <input type="file" name="image" accept="image/*" onChange={handleChange} />

        {preview && (
          <img
            src={
              preview.startsWith("blob")
                ? preview
                : `http://localhost:5000${preview}`
            }
            alt="Preview"
            className="h-40 w-40 object-cover mt-2 border"
          />
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 mt-2 rounded"
        >
          {editId ? "Update Project" : "Add Project"}
        </button>
      </form>

      {/* Project List */}
      {Object.keys(projects)
        .sort((a, b) => Number(b) - Number(a))
        .map((year) => (
          <div key={year} className="mb-6">
            <h2 className="text-xl font-bold mb-2">{year}</h2>
            <div className="space-y-2">
              {projects[year].map((p) => (
                <div
                  key={p._id}
                  className="flex justify-between items-center border p-2 rounded"
                >
                  <div>
                    <p className="font-semibold">{p.title}</p>
                    <p className="text-sm">{p.location}</p>
                    <p className="text-xs text-gray-500">{p.type}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="text-green-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default AdminProjectTree;
