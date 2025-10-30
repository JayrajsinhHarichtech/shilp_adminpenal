import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/projects";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const initialForm = {
    id: null,
    title: "",
    parent_category: "commercial",
    address: {
      mini_address: { line1: "", line2: "", city: "", state: "", zip: "" },
      full_address: "",
      googleMap: "",
    },
    details: {
      banner_imgs: [],
      mobile_banner: null,
      about: { img1: null, about_desc: "" },
      floor_plans: [{ name: "", image: null }],
      project_view: [{ image: null }],
      amenities: [{ name: "", image: null }],
      explore_more: [],
      project_updates: { month: "", year: "", images: [] },
    },
  };

  const [form, setForm] = useState(initialForm);

  // Fetch all projects
  const fetchProjects = useCallback(async () => {
    try {
      setError(null);
      const { data } = await axios.get(API_URL);
      setProjects(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch projects");
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Basic form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMiniAddressChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        mini_address: { ...prev.address.mini_address, [name]: value },
      },
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
  };

  // File handlers
  const handleSingleFile = (e, field) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({
        ...prev,
        details: { ...prev.details, [field]: file },
      }));
    }
  };

  const handleMultipleFiles = (e, field) => {
    const files = Array.from(e.target.files || []);
    setForm((prev) => ({
      ...prev,
      details: { ...prev.details, [field]: files },
    }));
  };

  // About section handlers
  const handleAboutChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        about: { ...prev.details.about, [name]: value },
      },
    }));
  };

  const handleAboutImage = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({
        ...prev,
        details: {
          ...prev.details,
          about: { ...prev.details.about, img1: file },
        },
      }));
    }
  };

  // Floor plan handlers
  const handleFloorPlanChange = (index, field, value) => {
    const updated = [...form.details.floor_plans];
    updated[index] = { ...updated[index], [field]: value };
    setForm((prev) => ({
      ...prev,
      details: { ...prev.details, floor_plans: updated },
    }));
  };

  const addFloorPlan = () => {
    setForm((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        floor_plans: [...prev.details.floor_plans, { name: "", image: null }],
      },
    }));
  };

  const removeFloorPlan = (index) => {
    setForm((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        floor_plans: prev.details.floor_plans.filter((_, i) => i !== index),
      },
    }));
  };

  // Amenity handlers
  const handleAmenityChange = (index, field, value) => {
    const updated = [...form.details.amenities];
    updated[index] = { ...updated[index], [field]: value };
    setForm((prev) => ({
      ...prev,
      details: { ...prev.details, amenities: updated },
    }));
  };

  const addAmenity = () => {
    setForm((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        amenities: [...prev.details.amenities, { name: "", image: null }],
      },
    }));
  };

  const removeAmenity = (index) => {
    setForm((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        amenities: prev.details.amenities.filter((_, i) => i !== index),
      },
    }));
  };

  // Project view handlers
  const handleProjectViewChange = (index, file) => {
    const updated = [...form.details.project_view];
    updated[index] = { ...updated[index], image: file };
    setForm((prev) => ({
      ...prev,
      details: { ...prev.details, project_view: updated },
    }));
  };

  const addProjectView = () => {
    setForm((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        project_view: [...prev.details.project_view, { image: null }],
      },
    }));
  };

  const removeProjectView = (index) => {
    setForm((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        project_view: prev.details.project_view.filter((_, i) => i !== index),
      },
    }));
  };

  // Project updates handlers
  const handleProjectUpdateChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        project_updates: { ...prev.details.project_updates, [name]: value },
      },
    }));
  };

  const handleProjectUpdateImages = (e) => {
    const files = Array.from(e.target.files || []);
    setForm((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        project_updates: { ...prev.details.project_updates, images: files },
      },
    }));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Please enter a project title");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();

      // Prepare JSON data
      const jsonData = {
        title: form.title,
        parent_category: form.parent_category,
        address: {
          mini_address: form.address.mini_address,
          full_address: form.address.full_address,
          googleMap: form.address.googleMap,
        },
        details: {
          about: {
            about_desc: form.details.about.about_desc || "",
          },
          floor_plans: form.details.floor_plans.map((fp) => ({
            title: fp.name,
          })),
          amenities: form.details.amenities.map((a) => ({
            title: a.name,
          })),
          project_updates: {
            month: form.details.project_updates.month || "",
            year: form.details.project_updates.year || "",
          },
        },
      };

      formData.append("data", JSON.stringify(jsonData));

      // Append files
      if (form.details.mobile_banner instanceof File) {
        formData.append("mobile_banner", form.details.mobile_banner);
      }

      if (form.details.about.img1 instanceof File) {
        formData.append("about_img1", form.details.about.img1);
      }

      form.details.banner_imgs.forEach((file) => {
        if (file instanceof File) {
          formData.append("banner_imgs", file);
        }
      });

      form.details.project_view.forEach((pv) => {
        if (pv.image instanceof File) {
          formData.append("project_view", pv.image);
        }
      });

      form.details.floor_plans.forEach((fp) => {
        if (fp.image instanceof File) {
          formData.append("floor_plan_images", fp.image);
        }
      });

      form.details.amenities.forEach((a) => {
        if (a.image instanceof File) {
          formData.append("amenity_images", a.image);
        }
      });

      form.details.project_updates.images.forEach((file) => {
        if (file instanceof File) {
          formData.append("project_updates_images", file);
        }
      });

      form.details.explore_more.forEach((file) => {
        if (file instanceof File) {
          formData.append("explore_more", file);
        }
      });

      // API call
      if (form.id) {
        await axios.put(`${API_URL}/${form.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("✅ Project updated successfully!");
      } else {
        await axios.post(API_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("✅ Project created successfully!");
      }

      fetchProjects();
      setForm(initialForm);

      // Reset file inputs
      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach((input) => (input.value = ""));
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.response?.data?.error || "Failed to save project");
      alert(err.response?.data?.error || "❌ Error saving project!");
    } finally {
      setLoading(false);
    }
  };

  // Edit handler
  const handleEdit = (proj) => {
    const projectView = proj.details.project_view?.length
      ? proj.details.project_view
      : [{ image: null }];

    const floorPlans = proj.details.floor_plans?.length
      ? proj.details.floor_plans.map((fp) => ({
          name: fp.title || "",
          image: fp.image || null,
        }))
      : [{ name: "", image: null }];

    const amenities = proj.details.amenities?.length
      ? proj.details.amenities.map((a) => ({
          name: a.title || "",
          image: a.image || null,
        }))
      : [{ name: "", image: null }];

    setForm({
      id: proj._id,
      title: proj.title,
      parent_category: proj.parent_category,
      address: proj.address || initialForm.address,
      details: {
        ...proj.details,
        about: {
          img1: proj.details.about?.img1 || null,
          about_desc: proj.details.about?.description || "",
        },
        project_view: projectView,
        floor_plans: floorPlans,
        amenities: amenities,
        banner_imgs: [],
        mobile_banner: null,
        explore_more: [],
        project_updates: proj.details.project_updates || {
          month: "",
          year: "",
          images: [],
        },
      },
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    setLoading(true);
    try {
      await axios.delete(`${API_URL}/${id}`);
      alert("✅ Project deleted successfully!");
      fetchProjects();
    } catch (err) {
      console.error("Delete error:", err);
      alert("❌ Error deleting project!");
    } finally {
      setLoading(false);
    }
  };

  // Cancel edit
  const cancelEdit = () => {
    setForm(initialForm);
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input) => (input.value = ""));
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Project Management</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg p-6 rounded-lg space-y-6"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {form.id ? "Edit Project" : "Create New Project"}
          </h2>
          {form.id && (
            <button
              type="button"
              onClick={cancelEdit}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel Edit
            </button>
          )}
        </div>

        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <label className="block font-semibold mb-2">Project Title *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter project title"
              className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Category</label>
            <select
              name="parent_category"
              value={form.parent_category}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="commercial">Commercial</option>
              <option value="residential">Residential</option>
              <option value="plots">Plots</option>
            </select>
          </div>
        </div>

        {/* Banner Images */}
        <div className="border-t pt-4">
          <label className="block font-semibold mb-2">
            Banner Images (Desktop)
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleMultipleFiles(e, "banner_imgs")}
            className="w-full border border-gray-300 p-2 rounded"
          />
          <p className="text-sm text-gray-500 mt-1">
            {form.details.banner_imgs.length > 0
              ? `${form.details.banner_imgs.length} file(s) selected`
              : "Select multiple images"}
          </p>
        </div>

        {/* Mobile Banner */}
        <div>
          <label className="block font-semibold mb-2">Mobile Banner</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleSingleFile(e, "mobile_banner")}
            className="w-full border border-gray-300 p-2 rounded"
          />
          {form.details.mobile_banner && (
            <p className="text-sm text-green-600 mt-1">
              {form.details.mobile_banner instanceof File
                ? form.details.mobile_banner.name
                : "Image uploaded"}
            </p>
          )}
        </div>

        {/* Mini Address */}
        <div className="border-t pt-4">
          <h3 className="font-semibold text-lg mb-3">Mini Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              name="line1"
              placeholder="Address Line 1"
              value={form.address.mini_address.line1}
              onChange={handleMiniAddressChange}
              className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="line2"
              placeholder="Address Line 2"
              value={form.address.mini_address.line2}
              onChange={handleMiniAddressChange}
              className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="city"
              placeholder="City"
              value={form.address.mini_address.city}
              onChange={handleMiniAddressChange}
              className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="state"
              placeholder="State"
              value={form.address.mini_address.state}
              onChange={handleMiniAddressChange}
              className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="zip"
              placeholder="ZIP Code"
              value={form.address.mini_address.zip}
              onChange={handleMiniAddressChange}
              className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* About Section */}
        <div className="border-t pt-4">
          <h3 className="font-semibold text-lg mb-3">About Section</h3>
          <input
            type="file"
            accept="image/*"
            onChange={handleAboutImage}
            className="w-full border border-gray-300 p-2 rounded mb-3"
          />
          {form.details.about.img1 && (
            <p className="text-sm text-green-600 mb-2">
              {form.details.about.img1 instanceof File
                ? form.details.about.img1.name
                : "Image uploaded"}
            </p>
          )}
          <textarea
            name="about_desc"
            placeholder="About Description"
            value={form.details.about.about_desc}
            onChange={handleAboutChange}
            rows="4"
            className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Floor Plans */}
        <div className="border-t pt-4">
          <h3 className="font-semibold text-lg mb-3">Floor Plans</h3>
          {form.details.floor_plans.map((fp, i) => (
            <div key={i} className="flex gap-2 mb-3 items-start">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Floor Plan Name"
                  value={fp.name}
                  onChange={(e) =>
                    handleFloorPlanChange(i, "name", e.target.value)
                  }
                  className="w-full border border-gray-300 p-3 rounded mb-2"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleFloorPlanChange(i, "image", e.target.files[0])
                  }
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              {form.details.floor_plans.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeFloorPlan(i)}
                  className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 mt-1"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addFloorPlan}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            + Add Floor Plan
          </button>
        </div>

        {/* Project View */}
        <div className="border-t pt-4">
          <h3 className="font-semibold text-lg mb-3">Project View Images</h3>
          {form.details.project_view.map((pv, i) => (
            <div key={i} className="flex gap-2 mb-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleProjectViewChange(i, e.target.files[0])
                }
                className="flex-1 border border-gray-300 p-2 rounded"
              />
              {form.details.project_view.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeProjectView(i)}
                  className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addProjectView}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            + Add Project View
          </button>
        </div>

        {/* Amenities */}
        <div className="border-t pt-4">
          <h3 className="font-semibold text-lg mb-3">Amenities</h3>
          {form.details.amenities.map((a, i) => (
            <div key={i} className="mb-3">
              <div className="flex gap-2 items-start">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Amenity Name"
                    value={a.name}
                    onChange={(e) =>
                      handleAmenityChange(i, "name", e.target.value)
                    }
                    className="w-full border border-gray-300 p-3 rounded mb-2"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleAmenityChange(i, "image", e.target.files[0])
                    }
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </div>
                {form.details.amenities.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAmenity(i)}
                    className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 mt-1"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addAmenity}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            + Add Amenity
          </button>
        </div>

        {/* Explore More */}
       <div className="border-t pt-4">
  <label className="block font-semibold mb-2">Explore More (Video Links)</label>

  {form.details.explore_more.map((link, index) => (
    <div key={index} className="flex items-center gap-2 mb-2">
      <input
        type="url"
        placeholder="Enter video link (YouTube, Vimeo, etc.)"
        value={link}
        onChange={(e) => {
          const newLinks = [...form.details.explore_more];
          newLinks[index] = e.target.value;
          setForm({
            ...form,
            details: { ...form.details, explore_more: newLinks },
          });
        }}
        className="flex-1 border border-gray-300 p-2 rounded"
      />
      <button
        type="button"
        onClick={() => {
          const newLinks = form.details.explore_more.filter((_, i) => i !== index);
          setForm({
            ...form,
            details: { ...form.details, explore_more: newLinks },
          });
        }}
        className="bg-red-500 text-white px-3 py-2 rounded"
      >
        Remove
      </button>
    </div>
  ))}

  <button
    type="button"
    onClick={() =>
      setForm({
        ...form,
        details: {
          ...form.details,
          explore_more: [...form.details.explore_more, ""],
        },
      })
    }
    className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
  >
    + Add Video Link
  </button>
</div>

        {/* Project Updates */}
        <div className="border-t pt-4">
          <h3 className="font-semibold text-lg mb-3">Project Updates</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              name="month"
              placeholder="Month (e.g., January)"
              value={form.details.project_updates.month}
              onChange={handleProjectUpdateChange}
              className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="year"
              placeholder="Year (e.g., 2025)"
              value={form.details.project_updates.year}
              onChange={handleProjectUpdateChange}
              className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleProjectUpdateImages}
            className="w-full border border-gray-300 p-2 rounded"
          />
          <p className="text-sm text-gray-500 mt-1">
            {form.details.project_updates.images.length > 0
              ? `${form.details.project_updates.images.length} image(s) selected`
              : "Select update images"}
          </p>
        </div>

        {/* Location */}
        <div className="border-t pt-4">
          <h3 className="font-semibold text-lg mb-3">Location</h3>
          <input
            name="full_address"
            placeholder="Full Address"
            value={form.address.full_address}
            onChange={handleAddressChange}
            className="w-full border border-gray-300 p-3 rounded mb-3 focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="googleMap"
            placeholder="Google Map Embed Link"
            value={form.address.googleMap}
            onChange={handleAddressChange}
            className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading
            ? "Saving..."
            : form.id
            ? "Update Project"
            : "Create Project"}
        </button>
      </form>

      {/* Projects List */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">All Projects</h2>
        {projects.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No projects found. Create your first project above.
          </p>
        ) : (
          <div className="space-y-3">
            {projects.map((proj) => (
              <div
                key={proj._id}  
                className="bg-white shadow-md p-5 rounded-lg flex justify-between items-center hover:shadow-lg transition-shadow"
              >
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800">
                    {proj.title}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {proj.address?.full_address || "No address provided"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Category:{" "}
                    <span className="capitalize">{proj.parent_category}</span>
                  </p>
                  <p className="text-xs text-gray-400">
                    Slug: <span className="font-mono">{proj.slug}</span>
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(proj)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
                    disabled={loading}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(proj._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                    disabled={loading}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;