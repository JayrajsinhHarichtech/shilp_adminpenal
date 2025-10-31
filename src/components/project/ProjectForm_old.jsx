import React, { useState, useEffect } from "react";

/**
 * Clean Admin Panel Project Form Component
 */
const ProjectForm = ({ editingProject, loading, onSubmit, onCancel }) => {
  // Initial form state matching your structure
  const getInitialState = () => ({
    slug: "",
    typeOfProject: "residential",
    banner: {
      banner: null,
      mobileBanner: null,
    },
    projectDetail: {
      title: "",
      typeOfProject: "residential",
      shortAddress: "",
      projectWorkStatus: "",
      brochure: "",
      projectStatus: "",
    },
    aboutUs: {
      description: [""],
      image: null,
    },
    floorPlan: [
      {
        title: "",
        alt: "",
        image: null,
      },
    ],
    projectImages: {
      images: [
        {
          alt: "",
          image: null,
        },
      ],
    },
    amenities: [
      {
        title: "",
        icon: null,
        alt: "",
      },
    ],
    projectUpdates: [
      {
        date: "",
        title: "",
        image: null,
      },
    ],
    location: {
      mapUrl: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
    projectVideo: {
      videoUrl: "",
      title: "",
    },
  });

  const [formData, setFormData] = useState(getInitialState());

  // Load editing project data
  useEffect(() => {
    if (editingProject) {
      setFormData({
        slug: editingProject.slug || "",
        typeOfProject: editingProject.typeOfProject || "residential",
        banner: editingProject.banner || { banner: null, mobileBanner: null },
        projectDetail: editingProject.projectDetail || getInitialState().projectDetail,
        aboutUs: editingProject.aboutUs || { description: [""], image: null },
        floorPlan: editingProject.floorPlan?.length ? editingProject.floorPlan : [{ title: "", alt: "", image: null }],
        projectImages: editingProject.projectImages || { images: [{ alt: "", image: null }] },
        amenities: editingProject.amenities?.length ? editingProject.amenities : [{ title: "", icon: null, alt: "" }],
        projectUpdates: editingProject.projectUpdates?.length ? editingProject.projectUpdates : [{ date: "", title: "", image: null }],
        location: editingProject.location || getInitialState().location,
        projectVideo: editingProject.projectVideo || { videoUrl: "", title: "" },
      });
    } else {
      setFormData(getInitialState());
    }
  }, [editingProject]);

  // Handle basic field changes
  const handleChange = (section, field, value) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value,
      },
    });
  };

  // Handle file upload
  const handleFileChange = (section, field, file) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: file,
      },
    });
  };

  // Handle description array
  const handleDescriptionChange = (index, value) => {
    const newDescriptions = [...formData.aboutUs.description];
    newDescriptions[index] = value;
    setFormData({
      ...formData,
      aboutUs: {
        ...formData.aboutUs,
        description: newDescriptions,
      },
    });
  };

  const addDescription = () => {
    setFormData({
      ...formData,
      aboutUs: {
        ...formData.aboutUs,
        description: [...formData.aboutUs.description, ""],
      },
    });
  };

  const removeDescription = (index) => {
    const newDescriptions = formData.aboutUs.description.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      aboutUs: {
        ...formData.aboutUs,
        description: newDescriptions.length ? newDescriptions : [""],
      },
    });
  };

  // Handle floor plans
  const handleFloorPlanChange = (index, field, value) => {
    const newFloorPlans = [...formData.floorPlan];
    newFloorPlans[index] = { ...newFloorPlans[index], [field]: value };
    setFormData({ ...formData, floorPlan: newFloorPlans });
  };

  const addFloorPlan = () => {
    setFormData({
      ...formData,
      floorPlan: [...formData.floorPlan, { title: "", alt: "", image: null }],
    });
  };

  const removeFloorPlan = (index) => {
    const newFloorPlans = formData.floorPlan.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      floorPlan: newFloorPlans.length ? newFloorPlans : [{ title: "", alt: "", image: null }],
    });
  };

  // Handle project images
  const handleProjectImageChange = (index, field, value) => {
    const newImages = [...formData.projectImages.images];
    newImages[index] = { ...newImages[index], [field]: value };
    setFormData({
      ...formData,
      projectImages: { images: newImages },
    });
  };

  const addProjectImage = () => {
    setFormData({
      ...formData,
      projectImages: {
        images: [...formData.projectImages.images, { alt: "", image: null }],
      },
    });
  };

  const removeProjectImage = (index) => {
    const newImages = formData.projectImages.images.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      projectImages: {
        images: newImages.length ? newImages : [{ alt: "", image: null }],
      },
    });
  };

  // Handle amenities
  const handleAmenityChange = (index, field, value) => {
    const newAmenities = [...formData.amenities];
    newAmenities[index] = { ...newAmenities[index], [field]: value };
    setFormData({ ...formData, amenities: newAmenities });
  };

  const addAmenity = () => {
    setFormData({
      ...formData,
      amenities: [...formData.amenities, { title: "", icon: null, alt: "" }],
    });
  };

  const removeAmenity = (index) => {
    const newAmenities = formData.amenities.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      amenities: newAmenities.length ? newAmenities : [{ title: "", icon: null, alt: "" }],
    });
  };

  // Handle project updates
  const handleProjectUpdateChange = (index, field, value) => {
    const newUpdates = [...formData.projectUpdates];
    newUpdates[index] = { ...newUpdates[index], [field]: value };
    setFormData({ ...formData, projectUpdates: newUpdates });
  };

  const addProjectUpdate = () => {
    setFormData({
      ...formData,
      projectUpdates: [...formData.projectUpdates, { date: "", title: "", image: null }],
    });
  };

  const removeProjectUpdate = (index) => {
    const newUpdates = formData.projectUpdates.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      projectUpdates: newUpdates.length ? newUpdates : [{ date: "", title: "", image: null }],
    });
  };

  // Image preview component
  const ImagePreview = ({ file, className = "" }) => {
    if (!file) return null;
    
    if (file instanceof File) {
      const imageUrl = URL.createObjectURL(file);
      return (
        <div className={`relative ${className}`}>
          <img 
            src={imageUrl} 
            alt="Preview" 
            className="w-16 h-16 object-cover rounded border border-gray-300"
            onLoad={() => URL.revokeObjectURL(imageUrl)}
          />
          <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">✓</span>
        </div>
      );
    }
    
    if (typeof file === 'string' && file.startsWith('http')) {
      return (
        <div className={`relative ${className}`}>
          <img 
            src={file} 
            alt="Preview" 
            className="w-16 h-16 object-cover rounded border border-gray-300"
          />
        </div>
      );
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.projectDetail.title.trim()) {
      alert("Please enter a project title");
      return;
    }

    console.log("Submitting project data:", formData);

    // Clean data - remove null/empty file objects
    const cleanedData = {
      slug: formData.slug || undefined,
      typeOfProject: formData.typeOfProject,
      banner: {
        banner: formData.banner.banner instanceof File ? formData.banner.banner : undefined,
        mobileBanner: formData.banner.mobileBanner instanceof File ? formData.banner.mobileBanner : undefined,
      },
      projectDetail: formData.projectDetail,
      aboutUs: {
        description: formData.aboutUs.description.filter(d => d.trim() !== ""),
        image: formData.aboutUs.image instanceof File ? formData.aboutUs.image : undefined,
      },
      floorPlan: formData.floorPlan
        .filter(fp => fp.title.trim() !== "")
        .map(fp => ({
          title: fp.title,
          alt: fp.alt || undefined,
          image: fp.image instanceof File ? fp.image : undefined,
        })),
      projectImages: {
        images: formData.projectImages.images
          .filter(img => img.image instanceof File)
          .map(img => ({
            alt: img.alt || undefined,
            image: img.image,
          })),
      },
      amenities: formData.amenities
        .filter(a => a.title.trim() !== "")
        .map(a => ({
          title: a.title,
          alt: a.alt || undefined,
          icon: a.icon instanceof File ? a.icon : undefined,
        })),
      projectUpdates: formData.projectUpdates
        .filter(u => u.title.trim() !== "" || u.date !== "")
        .map(u => ({
          date: u.date || undefined,
          title: u.title || undefined,
          image: u.image instanceof File ? u.image : undefined,
        })),
      location: formData.location,
      projectVideo: {
        videoUrl: formData.projectVideo.videoUrl || undefined,
        title: formData.projectVideo.title || undefined,
      },
    };

    console.log("Cleaned data:", cleanedData);

    const success = await onSubmit(editingProject?._id, cleanedData);

    if (success && !editingProject) {
      setFormData(getInitialState());
      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach((input) => (input.value = ""));
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-8">
      {/* Header */}
      <div style={{backgroundColor: '#00264D'}} className="text-white px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-medium">
              {editingProject ? "Edit Project" : "Create New Project"}
            </h2>
            <p className="text-gray-300 mt-1 text-sm">Fill in the project details</p>
          </div>
          {editingProject && (
            <button
              type="button"
              onClick={onCancel}
              style={{backgroundColor: '#003D8E'}} 
              className="hover:opacity-90 text-white px-4 py-2 rounded text-sm transition-opacity"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-6">
          {/* Basic Information */}
          <section className="border-b border-gray-200 pb-6">
            <h3 style={{color: '#00264D'}} className="text-base font-medium mb-4">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.projectDetail.title}
                  onChange={(e) => handleChange("projectDetail", "title", e.target.value)}
                  placeholder="Enter project title"
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-1 focus:ring-black focus:border-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="project-slug"
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-1 focus:ring-black focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
                <select
                  value={formData.typeOfProject}
                  onChange={(e) => {
                    const type = e.target.value;
                    setFormData({
                      ...formData,
                      typeOfProject: type,
                      projectDetail: { ...formData.projectDetail, typeOfProject: type },
                    });
                  }}
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-1 focus:ring-black focus:border-black"
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="plots">Plots</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Address</label>
                <input
                  type="text"
                  value={formData.projectDetail.shortAddress}
                  onChange={(e) => handleChange("projectDetail", "shortAddress", e.target.value)}
                  placeholder="Near Airport, Mumbai"
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-1 focus:ring-black focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Work Status</label>
                <input
                  type="text"
                  value={formData.projectDetail.projectWorkStatus}
                  onChange={(e) => handleChange("projectDetail", "projectWorkStatus", e.target.value)}
                  placeholder="Under Construction"
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-1 focus:ring-black focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Status</label>
                <input
                  type="text"
                  value={formData.projectDetail.projectStatus}
                  onChange={(e) => handleChange("projectDetail", "projectStatus", e.target.value)}
                  placeholder="Active"
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-1 focus:ring-black focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brochure URL</label>
                <input
                  type="text"
                  value={formData.projectDetail.brochure}
                  onChange={(e) => handleChange("projectDetail", "brochure", e.target.value)}
                  placeholder="https://example.com/brochure.pdf"
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-1 focus:ring-black focus:border-black"
                />
              </div>
            </div>
          </section>

          {/* Banner Images */}
          <section className="border-b border-gray-200 pb-6">
            <h3 className="text-base font-medium text-gray-900 mb-4">Banner Images</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Desktop Banner</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange("banner", "banner", e.target.files[0])}
                  className="w-full border border-gray-300 px-3 py-2 rounded file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-gray-100 file:text-gray-700"
                />
                <ImagePreview file={formData.banner.banner} className="mt-2" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Banner</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange("banner", "mobileBanner", e.target.files[0])}
                  className="w-full border border-gray-300 px-3 py-2 rounded file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-gray-100 file:text-gray-700"
                />
                <ImagePreview file={formData.banner.mobileBanner} className="mt-2" />
              </div>
            </div>
          </section>

          {/* About Project */}
          <section className="border-b border-gray-200 pb-6">
            <h3 className="text-base font-medium text-gray-900 mb-4">About Project</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">About Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange("aboutUs", "image", e.target.files[0])}
                  className="w-full border border-gray-300 px-3 py-2 rounded file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-gray-100 file:text-gray-700"
                />
                <ImagePreview file={formData.aboutUs.image} className="mt-2" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description Paragraphs</label>
                {formData.aboutUs.description.map((desc, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <textarea
                      value={desc}
                      onChange={(e) => handleDescriptionChange(index, e.target.value)}
                      placeholder={`Paragraph ${index + 1}`}
                      rows="2"
                      className="flex-1 border border-gray-300 px-3 py-2 rounded focus:ring-1 focus:ring-black focus:border-black"
                    />
                    {formData.aboutUs.description.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDescription(index)}
                        className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition-colors h-fit text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addDescription}
                  className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition-colors text-sm"
                >
                  Add Paragraph
                </button>
              </div>
            </div>
          </section>

          {/* Floor Plans */}
          <section className="border-b border-gray-200 pb-6">
            <h3 className="text-base font-medium text-gray-900 mb-4">Floor Plans</h3>
            
            {formData.floorPlan.map((plan, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg mb-3">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-700 text-sm">Floor Plan {index + 1}</h4>
                  {formData.floorPlan.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFloorPlan(index)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={plan.title}
                    onChange={(e) => handleFloorPlanChange(index, "title", e.target.value)}
                    placeholder="Plan Title (2 BHK)"
                    className="border border-gray-300 px-3 py-2 rounded focus:ring-1 focus:ring-black focus:border-black"
                  />
                  <input
                    type="text"
                    value={plan.alt}
                    onChange={(e) => handleFloorPlanChange(index, "alt", e.target.value)}
                    placeholder="Alt Text"
                    className="border border-gray-300 px-3 py-2 rounded focus:ring-1 focus:ring-black focus:border-black"
                  />
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFloorPlanChange(index, "image", e.target.files[0])}
                      className="border border-gray-300 px-3 py-2 rounded file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-gray-100 file:text-gray-700 w-full text-sm"
                    />
                    <ImagePreview file={plan.image} className="mt-2" />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addFloorPlan}
              className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition-colors text-sm"
            >
              Add Floor Plan
            </button>
          </section>

          {/* Project Images */}
          <section className="border-b border-gray-200 pb-6">
            <h3 className="text-base font-medium text-gray-900 mb-4">Project Images</h3>
            
            {formData.projectImages.images.map((img, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg mb-3">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-700 text-sm">Image {index + 1}</h4>
                  {formData.projectImages.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProjectImage(index)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={img.alt}
                    onChange={(e) => handleProjectImageChange(index, "alt", e.target.value)}
                    placeholder="Alt Text"
                    className="border border-gray-300 px-3 py-2 rounded focus:ring-1 focus:ring-black focus:border-black"
                  />
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleProjectImageChange(index, "image", e.target.files[0])}
                      className="border border-gray-300 px-3 py-2 rounded file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-gray-100 file:text-gray-700 w-full text-sm"
                    />
                    <ImagePreview file={img.image} className="mt-2" />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addProjectImage}
              className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition-colors text-sm"
            >
              Add Image
            </button>
          </section>

          {/* Amenities */}
          <section className="border-b border-gray-200 pb-6">
            <h3 className="text-base font-medium text-gray-900 mb-4">Amenities</h3>
            
            {formData.amenities.map((amenity, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg mb-3">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-700 text-sm">Amenity {index + 1}</h4>
                  {formData.amenities.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAmenity(index)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={amenity.title}
                    onChange={(e) => handleAmenityChange(index, "title", e.target.value)}
                    placeholder="Amenity Title"
                    className="border border-gray-300 px-3 py-2 rounded focus:ring-1 focus:ring-black focus:border-black"
                  />
                  <input
                    type="text"
                    value={amenity.alt}
                    onChange={(e) => handleAmenityChange(index, "alt", e.target.value)}
                    placeholder="Alt Text"
                    className="border border-gray-300 px-3 py-2 rounded focus:ring-1 focus:ring-black focus:border-black"
                  />
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleAmenityChange(index, "icon", e.target.files[0])}
                      className="border border-gray-300 px-3 py-2 rounded file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-gray-100 file:text-gray-700 w-full text-sm"
                    />
                    <ImagePreview file={amenity.icon} className="mt-2" />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addAmenity}
              className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition-colors text-sm"
            >
              Add Amenity
            </button>
          </section>

          {/* Project Updates */}
          <section className="border-b border-gray-200 pb-6">
            <h3 className="text-base font-medium text-gray-900 mb-4">Project Updates</h3>
            
            {formData.projectUpdates.map((update, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg mb-3">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-700 text-sm">Update {index + 1}</h4>
                  {formData.projectUpdates.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProjectUpdate(index)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="date"
                    value={update.date}
                    onChange={(e) => handleProjectUpdateChange(index, "date", e.target.value)}
                    className="border border-gray-300 px-3 py-2 rounded focus:ring-1 focus:ring-black focus:border-black"
                  />
                  <input
                    type="text"
                    value={update.title}
                    onChange={(e) => handleProjectUpdateChange(index, "title", e.target.value)}
                    placeholder="Update Title"
                    className="border border-gray-300 px-3 py-2 rounded focus:ring-1 focus:ring-black focus:border-black"
                  />
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleProjectUpdateChange(index, "image", e.target.files[0])}
                      className="border border-gray-300 px-3 py-2 rounded file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-gray-100 file:text-gray-700 w-full text-sm"
                    />
                    <ImagePreview file={update.image} className="mt-2" />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addProjectUpdate}
              className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition-colors text-sm"
            >
              Add Update
            </button>
          </section>

          {/* Location */}
          <section className="border-b border-gray-200 pb-6">
            <h3 className="text-base font-medium text-gray-900 mb-4">Location Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Google Map URL</label>
                <input
                  type="text"
                  value={formData.location.mapUrl}
                  onChange={(e) => handleChange("location", "mapUrl", e.target.value)}
                  placeholder="https://maps.google.com/..."
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-1 focus:ring-black focus:border-black"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                <input
                  type="text"
                  value={formData.location.address1}
                  onChange={(e) => handleChange("location", "address1", e.target.value)}
                  placeholder="Street address"
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-1 focus:ring-black focus:border-black"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                <input
                  type="text"
                  value={formData.location.address2}
                  onChange={(e) => handleChange("location", "address2", e.target.value)}
                  placeholder="Landmark, Area"
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-1 focus:ring-black focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={formData.location.city}
                  onChange={(e) => handleChange("location", "city", e.target.value)}
                  placeholder="City"
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-1 focus:ring-black focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  value={formData.location.state}
                  onChange={(e) => handleChange("location", "state", e.target.value)}
                  placeholder="State"
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-1 focus:ring-black focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                <input
                  type="text"
                  value={formData.location.zip}
                  onChange={(e) => handleChange("location", "zip", e.target.value)}
                  placeholder="ZIP Code"
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-1 focus:ring-black focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  value={formData.location.country}
                  onChange={(e) => handleChange("location", "country", e.target.value)}
                  placeholder="Country"
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-1 focus:ring-black focus:border-black"
                />
              </div>
            </div>
          </section>

          {/* Project Video */}
          <section className="pb-6">
            <h3 className="text-base font-medium text-gray-900 mb-4">Project Video</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
                <input
                  type="text"
                  value={formData.projectVideo.videoUrl}
                  onChange={(e) => handleChange("projectVideo", "videoUrl", e.target.value)}
                  placeholder="YouTube/Vimeo URL"
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-1 focus:ring-black focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Video Title</label>
                <input
                  type="text"
                  value={formData.projectVideo.title}
                  onChange={(e) => handleChange("projectVideo", "title", e.target.value)}
                  placeholder="Video Title"
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-1 focus:ring-black focus:border-black"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-black text-white px-6 py-3 rounded font-medium hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </span>
            ) : editingProject ? (
              "Update Project"
            ) : (
              "Create Project"
            )}
          </button>

          {editingProject && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 rounded font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;