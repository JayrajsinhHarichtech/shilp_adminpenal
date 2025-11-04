"use client";
import React, { useEffect, useState } from "react";
import { 
  createBlog, 
  updateBlog, 
  getFullImageUrl,
  formatBlogData,
  validateBlogData,
  getBlogById
} from "../../api/blogsApi";

export default function BlogsPage({ onSaved, editBlogId, onCancelEdit }) {
  // Blog form state (banner is now integrated)
  const [form, setForm] = useState({
    // Banner Section (integrated)
    bannerTitle: "",
    bannerSubtitle: "",
    bannerImage: null,
    mobileBanner: null,
    
    // Main Content
    mainTitle: "",
    author: "",
    blogDate: new Date().toISOString().split('T')[0],
    blogImage: null,
    blogDescription: "",
    
    // Nested Points Structure
    points: [{
      title: "",
      description: "",
      tagline: "",
      subPoints: []
    }],
    
    // SEO & Status
    url: "",
    metaDescription: "",
    tags: [],
    publish: "published", // Changed to "published" so blogs show immediately
    featured: false
  });

  // Preview state
  const [preview, setPreview] = useState({
    bannerImage: null,
    mobileBanner: null,
    blogImage: null
  });

  // Loading and editing states
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");

  // Fetch blog data for editing
  useEffect(() => {
    if (editBlogId) {
      const fetchBlogForEdit = async () => {
        try {
          const blog = await getBlogById(editBlogId);
          
          // Set form data with existing blog data
          setForm({
            bannerTitle: blog.banner?.bannerTitle || "",
            bannerSubtitle: blog.banner?.bannerSubtitle || "",
            bannerImage: null, // Keep as null, show preview from URL
            mobileBanner: null, // Keep as null, show preview from URL
            mainTitle: blog.mainTitle || "",
            author: blog.author || "",
            blogDate: blog.blogDate ? new Date(blog.blogDate).toISOString().split('T')[0] : "",
            blogImage: null, // Keep as null, show preview from URL
            blogDescription: blog.blogDescription || "",
            points: blog.points && blog.points.length > 0 ? blog.points : [{
              title: "",
              description: "",
              tagline: "",
              subPoints: []
            }],
            url: blog.url || "",
            metaDescription: blog.metaDescription || "",
            tags: blog.tags || [],
            publish: blog.publish || "published",
            featured: blog.featured || false
          });

          // Set previews for existing images
          setPreview({
            bannerImage: blog.banner?.bannerImage ? getFullImageUrl(blog.banner.bannerImage) : null,
            mobileBanner: blog.banner?.mobileBanner ? getFullImageUrl(blog.banner.mobileBanner) : null,
            blogImage: blog.blogImage ? getFullImageUrl(blog.blogImage) : null
          });

          setEditId(editBlogId);
          setMessage("");
        } catch (err) {
          console.error("Error fetching blog for edit:", err);
          setMessage("Error loading blog for edit: " + err.message);
        }
      };
      
      fetchBlogForEdit();
    } else {
      // Reset form when not editing
      setEditId(null);
      setForm({
        bannerTitle: "",
        bannerSubtitle: "",
        bannerImage: null,
        mobileBanner: null,
        mainTitle: "",
        author: "",
        blogDate: new Date().toISOString().split('T')[0],
        blogImage: null,
        blogDescription: "",
        points: [{
          title: "",
          description: "",
          tagline: "",
          subPoints: []
        }],
        url: "",
        metaDescription: "",
        tags: [],
        publish: "published",
        featured: false
      });
      setPreview({
        bannerImage: null,
        mobileBanner: null,
        blogImage: null
      });
    }
  }, [editBlogId]);

  // Handle main form changes
  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    
    if (files && files[0]) {
      setForm({ ...form, [name]: files[0] });
      setPreview({ ...preview, [name]: URL.createObjectURL(files[0]) });
    } else if (type === 'checkbox') {
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Handle tags input (comma-separated)
  const handleTagsChange = (e) => {
    const tagsString = e.target.value;
    // Split by comma and clean each tag thoroughly
    const tags = tagsString.split(',')
      .map(tag => {
        let cleanTag = tag.trim();
        // Remove any JSON-like formatting, quotes, brackets
        cleanTag = cleanTag.replace(/^\[\"|\"\]$|^\[\'|\'\]$|^\"|\"|^\'|\'$|^\[|\]$/g, '');
        cleanTag = cleanTag.replace(/\\"/g, '"'); // Handle escaped quotes
        return cleanTag;
      })
      .filter(tag => tag && tag !== ''); // Remove empty tags
    
    setForm({ ...form, tags });
  };

  // Handle points changes
  const handlePointChange = (pointIndex, field, value) => {
    const newPoints = [...form.points];
    newPoints[pointIndex][field] = value;
    setForm({ ...form, points: newPoints });
  };

  // Handle sub-points changes
  const handleSubPointChange = (pointIndex, subPointIndex, field, value) => {
    const newPoints = [...form.points];
    newPoints[pointIndex].subPoints[subPointIndex][field] = value;
    setForm({ ...form, points: newPoints });
  };

  // Add new point
  const addPoint = () => {
    setForm({
      ...form,
      points: [...form.points, { title: "", description: "", tagline: "", subPoints: [] }],
    });
  };

  // Remove point
  const removePoint = (index) => {
    const newPoints = [...form.points];
    newPoints.splice(index, 1);
    setForm({ ...form, points: newPoints });
  };

  // Add sub-point to a specific point
  const addSubPoint = (pointIndex) => {
    const newPoints = [...form.points];
    if (!newPoints[pointIndex].subPoints) {
      newPoints[pointIndex].subPoints = [];
    }
    newPoints[pointIndex].subPoints.push({ title: "", description: "", tagline: "" });
    setForm({ ...form, points: newPoints });
  };

  // Remove sub-point
  const removeSubPoint = (pointIndex, subPointIndex) => {
    const newPoints = [...form.points];
    newPoints[pointIndex].subPoints.splice(subPointIndex, 1);
    setForm({ ...form, points: newPoints });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Validate form data
      const validation = validateBlogData(form);
      if (!validation.isValid) {
        setMessage("Validation errors: " + validation.errors.join(", "));
        setLoading(false);
        setTimeout(() => setMessage(""), 5000);
        return;
      }

      // Prepare form data including banner information
      const blogData = {
        ...formatBlogData(form),
        // Include banner data in the main blog creation/update
        bannerTitle: form.bannerTitle,
        bannerSubtitle: form.bannerSubtitle,
        bannerImage: form.bannerImage,
        mobileBanner: form.mobileBanner
      };

      let result;
      if (editId) {
        result = await updateBlog(editId, blogData);
        setMessage("Blog updated successfully!");
      } else {
        result = await createBlog(blogData);
        setMessage("Blog created successfully!");
      }

      // Reset form after successful save
      if (!editId) { // Only reset if creating new blog, not editing
        setForm({
          bannerTitle: "",
          bannerSubtitle: "",
          bannerImage: null,
          mobileBanner: null,
          mainTitle: "",
          author: "",
          blogDate: new Date().toISOString().split('T')[0],
          blogImage: null,
          blogDescription: "",
          points: [{
            title: "",
            description: "",
            tagline: "",
            subPoints: []
          }],
          url: "",
          metaDescription: "",
          tags: [],
          publish: "draft", // Default back to draft with filter system
          featured: false
        });

        setPreview({
          bannerImage: null,
          mobileBanner: null,
          blogImage: null
        });
      }

      setEditId(null);
      setTimeout(() => setMessage(""), 3000);

      // Trigger refresh in parent component
      if (onSaved) {
        onSaved();
      }

      // Call cancel edit to reset form in parent
      if (onCancelEdit && editId) {
        onCancelEdit();
      }

    } catch (err) {
      console.error(err);
      setMessage("Error saving blog: " + err.message);
      setTimeout(() => setMessage(""), 5000);
    }
    setLoading(false);
  };
  return (
    <div className="space-y-10 max-w-4xl mx-auto p-6">
      {/* Success/Error Message */}
      {message && (
        <div className={`p-4 rounded-lg ${message.includes('Error') || message.includes('Validation') 
          ? 'bg-red-100 text-red-700 border border-red-300' 
          : 'bg-green-100 text-green-700 border border-green-300'}`}>
          {message}
        </div>
      )}

      {/* Main Blog Form (including banner) */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {editId ? "Edit Blog" : "Create New Blog"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Banner Section */}
          <div className="border border-gray-200 p-6 rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Blog Banner Section</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Banner Title */}
              <div className="md:col-span-2">
                <label className="block font-medium text-gray-700 mb-2">Banner Title:</label>
                <input
                  type="text"
                  name="bannerTitle"
                  value={form.bannerTitle}
                  onChange={handleChange}
                  placeholder="Enter banner title"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Banner Subtitle */}
              <div className="md:col-span-2">
                <label className="block font-medium text-gray-700 mb-2">Banner Subtitle:</label>
                <input
                  type="text"
                  name="bannerSubtitle"
                  value={form.bannerSubtitle}
                  onChange={handleChange}
                  placeholder="Enter banner subtitle"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Desktop Banner */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">Desktop Banner Image:</label>
                <input
                  type="file"
                  name="bannerImage"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {preview.bannerImage && (
                  <div className="mt-3">
                    <img
                      src={preview.bannerImage}
                      alt="Desktop Banner Preview"
                      className="w-full h-40 rounded-lg object-cover border border-gray-200"
                    />
                  </div>
                )}
              </div>

              {/* Mobile Banner */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">Mobile Banner Image:</label>
                <input
                  type="file"
                  name="mobileBanner"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {preview.mobileBanner && (
                  <div className="mt-3">
                    <img
                      src={preview.mobileBanner}
                      alt="Mobile Banner Preview"
                      className="w-full h-40 rounded-lg object-cover border border-gray-200"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Main Title */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">Main Title <span className="text-red-500">*</span>:</label>
            <input
              type="text"
              name="mainTitle"
              value={form.mainTitle}
              onChange={handleChange}
              placeholder="Enter blog main title"
              required
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Author and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium text-gray-700 mb-2">Author <span className="text-red-500">*</span>:</label>
              <input
                type="text"
                name="author"
                value={form.author}
                onChange={handleChange}
                placeholder="Enter author name"
                required
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-2">Blog Date <span className="text-red-500">*</span>:</label>
              <input
                type="date"
                name="blogDate"
                value={form.blogDate}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Blog Main Image */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">Blog Main Image:</label>
            <input
              type="file"
              name="blogImage"
              accept="image/*"
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {preview.blogImage && (
              <div className="mt-3">
                <img
                  src={preview.blogImage}
                  alt="Blog Image Preview"
                  className="w-full h-48 rounded-lg object-cover border border-gray-200"
                />
              </div>
            )}
          </div>

          {/* Blog Description */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">Blog Description <span className="text-red-500">*</span>:</label>
            <textarea
              name="blogDescription"
              value={form.blogDescription}
              onChange={handleChange}
              placeholder="Enter blog description"
              required
              rows={4}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* URL and Meta Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium text-gray-700 mb-2">URL Slug:</label>
              <input
                type="text"
                name="url"
                value={form.url}
                onChange={handleChange}
                placeholder="blog-url-slug"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-2">Meta Description:</label>
              <input
                type="text"
                name="metaDescription"
                value={form.metaDescription}
                onChange={handleChange}
                placeholder="SEO meta description"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">Tags (comma-separated):</label>
            <input
              type="text"
              value={form.tags.join(', ')}
              onChange={handleTagsChange}
              placeholder="real estate, property, investment"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Publish Status and Featured */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium text-gray-700 mb-2">Publish Status:</label>
              <select
                name="publish"
                value={form.publish}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="ml-2 font-medium text-gray-700">Featured Blog</label>
            </div>
          </div>

          {/* Points Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800">Blog Points</h3>
              <button
                type="button"
                onClick={addPoint}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
              >
                Add Point
              </button>
            </div>

            {form.points.map((point, pointIndex) => (
              <div key={pointIndex} className="border border-gray-200 p-6 rounded-lg bg-gray-50 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-gray-800">Point #{pointIndex + 1}</h4>
                  {form.points.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePoint(pointIndex)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Remove Point
                    </button>
                  )}
                </div>

                {/* Point Title */}
                <div>
                  <label className="block font-medium text-gray-700 mb-2">Point Title:</label>
                  <input
                    type="text"
                    value={point.title}
                    onChange={(e) => handlePointChange(pointIndex, 'title', e.target.value)}
                    placeholder="Enter point title"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Point Description */}
                <div>
                  <label className="block font-medium text-gray-700 mb-2">Point Description:</label>
                  <textarea
                    value={point.description}
                    onChange={(e) => handlePointChange(pointIndex, 'description', e.target.value)}
                    placeholder="Enter point description"
                    rows={3}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Point Tagline */}
                <div>
                  <label className="block font-medium text-gray-700 mb-2">Point Tagline:</label>
                  <input
                    type="text"
                    value={point.tagline}
                    onChange={(e) => handlePointChange(pointIndex, 'tagline', e.target.value)}
                    placeholder="Enter point tagline"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Sub-points */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="text-md font-medium text-gray-700">Sub-points</h5>
                    <button
                      type="button"
                      onClick={() => addSubPoint(pointIndex)}
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition duration-200"
                    >
                      Add Sub-point
                    </button>
                  </div>

                  {point.subPoints && point.subPoints.map((subPoint, subPointIndex) => (
                    <div key={subPointIndex} className="border border-gray-300 p-4 rounded bg-white space-y-3">
                      <div className="flex items-center justify-between">
                        <h6 className="text-sm font-medium text-gray-600">Sub-point #{subPointIndex + 1}</h6>
                        <button
                          type="button"
                          onClick={() => removeSubPoint(pointIndex, subPointIndex)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Title:</label>
                          <input
                            type="text"
                            value={subPoint.title}
                            onChange={(e) => handleSubPointChange(pointIndex, subPointIndex, 'title', e.target.value)}
                            placeholder="Sub-point title"
                            className="w-full border border-gray-300 p-2 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Description:</label>
                          <input
                            type="text"
                            value={subPoint.description}
                            onChange={(e) => handleSubPointChange(pointIndex, subPointIndex, 'description', e.target.value)}
                            placeholder="Sub-point description"
                            className="w-full border border-gray-300 p-2 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Tagline:</label>
                          <input
                            type="text"
                            value={subPoint.tagline}
                            onChange={(e) => handleSubPointChange(pointIndex, subPointIndex, 'tagline', e.target.value)}
                            placeholder="Sub-point tagline"
                            className="w-full border border-gray-300 p-2 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 font-medium"
            >
              {loading ? "Saving..." : editId ? "Update Blog" : "Create Blog"}
            </button>
            
            {editId && (
              <button
                type="button"
                onClick={() => {
                  if (onCancelEdit) {
                    onCancelEdit();
                  } else {
                    setEditId(null);
                    setForm({
                      bannerTitle: "",
                      bannerSubtitle: "",
                      bannerImage: null,
                      mobileBanner: null,
                      mainTitle: "",
                      author: "",
                      blogDate: new Date().toISOString().split('T')[0],
                      blogImage: null,
                      blogDescription: "",
                      points: [{
                        title: "",
                        description: "",
                        tagline: "",
                        subPoints: []
                      }],
                      url: "",
                      metaDescription: "",
                      tags: [],
                      publish: "published",
                      featured: false
                    });
                    setPreview({
                      bannerImage: null,
                      mobileBanner: null,
                      blogImage: null
                    });
                  }
                }}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200 font-medium"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
