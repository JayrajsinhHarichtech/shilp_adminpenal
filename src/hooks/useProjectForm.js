import { useState } from "react";
import {
  getInitialProjectForm,
  generateUniqueId,
} from "../utils/projectFormHelpers";

/**
 * Custom hook for managing project form state and handlers
 */
export const useProjectForm = () => {
  const [form, setForm] = useState(getInitialProjectForm());

  // Basic field handler
  const handleFieldChange = (section, field, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // Simple field handler (top level)
  const handleSimpleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Banner handlers
  const handleBannerImages = (files) => {
    const fileArray = Array.from(files || []);
    setForm((prev) => ({
      ...prev,
      banner: { ...prev.banner, banner: fileArray },
    }));
  };

  const handleMobileBanner = (file) => {
    setForm((prev) => ({
      ...prev,
      banner: { ...prev.banner, mobileBanner: file },
    }));
  };

  // About Us handlers
  const handleAboutDescription = (index, value) => {
    const updatedDescriptions = [...form.aboutUs.description];
    updatedDescriptions[index] = value;
    setForm((prev) => ({
      ...prev,
      aboutUs: { ...prev.aboutUs, description: updatedDescriptions },
    }));
  };

  const addAboutDescription = () => {
    setForm((prev) => ({
      ...prev,
      aboutUs: {
        ...prev.aboutUs,
        description: [...prev.aboutUs.description, ""],
      },
    }));
  };

  const removeAboutDescription = (index) => {
    setForm((prev) => ({
      ...prev,
      aboutUs: {
        ...prev.aboutUs,
        description: prev.aboutUs.description.filter((_, i) => i !== index),
      },
    }));
  };

  const handleAboutImage = (file) => {
    setForm((prev) => ({
      ...prev,
      aboutUs: { ...prev.aboutUs, image: file },
    }));
  };

  // Floor Plan handlers
  const handleFloorPlanChange = (id, field, value) => {
    const updated = form.floorPlan.map((fp) =>
      fp.id === id ? { ...fp, [field]: value } : fp
    );
    setForm((prev) => ({ ...prev, floorPlan: updated }));
  };

  const addFloorPlan = () => {
    setForm((prev) => ({
      ...prev,
      floorPlan: [
        ...prev.floorPlan,
        { id: generateUniqueId(), title: "", alt: "", image: null },
      ],
    }));
  };

  const removeFloorPlan = (id) => {
    setForm((prev) => ({
      ...prev,
      floorPlan: prev.floorPlan.filter((fp) => fp.id !== id),
    }));
  };

  // Project Images handlers
  const handleProjectImageChange = (id, field, value) => {
    const updated = form.projectImages.images.map((img) =>
      img.id === id ? { ...img, [field]: value } : img
    );
    setForm((prev) => ({
      ...prev,
      projectImages: { images: updated },
    }));
  };

  const addProjectImage = () => {
    setForm((prev) => ({
      ...prev,
      projectImages: {
        images: [
          ...prev.projectImages.images,
          { id: generateUniqueId(), alt: "", image: null },
        ],
      },
    }));
  };

  const removeProjectImage = (id) => {
    setForm((prev) => ({
      ...prev,
      projectImages: {
        images: prev.projectImages.images.filter((img) => img.id !== id),
      },
    }));
  };

  // Amenities handlers
  const handleAmenityChange = (id, field, value) => {
    const updated = form.amenities.map((amenity) =>
      amenity.id === id ? { ...amenity, [field]: value } : amenity
    );
    setForm((prev) => ({ ...prev, amenities: updated }));
  };

  const addAmenity = () => {
    setForm((prev) => ({
      ...prev,
      amenities: [
        ...prev.amenities,
        { id: generateUniqueId(), title: "", icon: null, alt: "" },
      ],
    }));
  };

  const removeAmenity = (id) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((amenity) => amenity.id !== id),
    }));
  };

  // Project Updates handlers
  const handleProjectUpdateChange = (id, field, value) => {
    const updated = form.projectUpdates.map((update) =>
      update.id === id ? { ...update, [field]: value } : update
    );
    setForm((prev) => ({ ...prev, projectUpdates: updated }));
  };

  const handleProjectUpdateImages = (id, files) => {
    const fileArray = Array.from(files || []);
    const updated = form.projectUpdates.map((update) =>
      update.id === id ? { ...update, images: fileArray } : update
    );
    setForm((prev) => ({ ...prev, projectUpdates: updated }));
  };

  const addProjectUpdate = () => {
    setForm((prev) => ({
      ...prev,
      projectUpdates: [
        ...prev.projectUpdates,
        { id: generateUniqueId(), date: "", title: "", images: [] },
      ],
    }));
  };

  const removeProjectUpdate = (id) => {
    setForm((prev) => ({
      ...prev,
      projectUpdates: prev.projectUpdates.filter((update) => update.id !== id),
    }));
  };

  // Location handlers
  const handleLocationChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      location: { ...prev.location, [field]: value },
    }));
  };

  // Reset form
  const resetForm = () => {
    setForm(getInitialProjectForm());
  };

  // Set form (for editing)
  const setFormData = (data) => {
    setForm(data);
  };

  return {
    form,
    setForm,
    setFormData,
    resetForm,
    handleSimpleChange,
    handleFieldChange,
    handleBannerImages,
    handleMobileBanner,
    handleAboutDescription,
    addAboutDescription,
    removeAboutDescription,
    handleAboutImage,
    handleFloorPlanChange,
    addFloorPlan,
    removeFloorPlan,
    handleProjectImageChange,
    addProjectImage,
    removeProjectImage,
    handleAmenityChange,
    addAmenity,
    removeAmenity,
    handleProjectUpdateChange,
    handleProjectUpdateImages,
    addProjectUpdate,
    removeProjectUpdate,
    handleLocationChange,
  };
};
