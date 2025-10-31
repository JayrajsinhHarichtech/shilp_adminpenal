/**
 * Get initial/empty project form state based on new data structure
 */
export const getInitialProjectForm = () => ({
  id: null,
  slug: "",
  typeOfProject: "commercial",
  banner: {
    banner: [],
    mobileBanner: null,
  },
  projectDetail: {
    title: "",
    typeOfProject: "commercial",
    shortAddress: "",
    projectWorkStatus: "",
    brochure: null,
    projectStatus: "",
  },
  aboutUs: {
    description: [""],
    image: null,
  },
  floorPlan: [
    {
      id: Date.now(),
      title: "",
      alt: "",
      image: null,
    },
  ],
  projectImages: {
    images: [
      {
        id: Date.now(),
        alt: "",
        image: null,
      },
    ],
  },
  amenities: [
    {
      id: Date.now(),
      title: "",
      icon: null,
      alt: "",
    },
  ],
  projectUpdates: [
    {
      id: Date.now(),
      date: "",
      title: "",
      images: [],
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

/**
 * Convert form data to FormData object for API submission
 * @param {Object} formState - Current form state
 * @returns {FormData} FormData object ready for API
 */
export const convertToFormData = (formState) => {
  const formData = new FormData();

  // Prepare JSON data structure
  const jsonData = {
    slug: formState.slug,
    typeOfProject: formState.typeOfProject,
    projectDetail: {
      title: formState.projectDetail.title,
      typeOfProject: formState.projectDetail.typeOfProject,
      shortAddress: formState.projectDetail.shortAddress,
      projectWorkStatus: formState.projectDetail.projectWorkStatus,
      projectStatus: formState.projectDetail.projectStatus,
    },
    aboutUs: {
      description: formState.aboutUs.description,
    },
    floorPlan: formState.floorPlan.map((fp) => ({
      title: fp.title,
      alt: fp.alt,
    })),
    projectImages: {
      images: formState.projectImages.images.map((img) => ({
        alt: img.alt,
      })),
    },
    amenities: formState.amenities.map((amenity) => ({
      title: amenity.title,
      alt: amenity.alt,
    })),
    projectUpdates: formState.projectUpdates.map((update) => ({
      date: update.date,
      title: update.title,
    })),
    location: formState.location,
    projectVideo: formState.projectVideo,
  };

  formData.append("data", JSON.stringify(jsonData));

  // Append banner images
  if (formState.banner.banner && formState.banner.banner.length > 0) {
    formState.banner.banner.forEach((file) => {
      if (file instanceof File) {
        formData.append("banner_images", file);
      }
    });
  }

  // Append mobile banner
  if (formState.banner.mobileBanner instanceof File) {
    formData.append("mobile_banner", formState.banner.mobileBanner);
  }

  // Append about us image
  if (formState.aboutUs.image instanceof File) {
    formData.append("about_image", formState.aboutUs.image);
  }

  // Append brochure
  if (formState.projectDetail.brochure instanceof File) {
    formData.append("brochure", formState.projectDetail.brochure);
  }

  // Append floor plan images
  formState.floorPlan.forEach((fp) => {
    if (fp.image instanceof File) {
      formData.append("floor_plan_images", fp.image);
    }
  });

  // Append project images
  formState.projectImages.images.forEach((img) => {
    if (img.image instanceof File) {
      formData.append("project_images", img.image);
    }
  });

  // Append amenity icons
  formState.amenities.forEach((amenity) => {
    if (amenity.icon instanceof File) {
      formData.append("amenity_icons", amenity.icon);
    }
  });

  // Append project update images
  formState.projectUpdates.forEach((update) => {
    if (update.images && update.images.length > 0) {
      update.images.forEach((file) => {
        if (file instanceof File) {
          formData.append("project_update_images", file);
        }
      });
    }
  });

  return formData;
};

/**
 * Convert API response to form state
 * @param {Object} project - Project from API
 * @returns {Object} Form state object
 */
export const convertApiToFormState = (project) => {
  return {
    id: project._id || project.id,
    slug: project.slug || "",
    typeOfProject: project.typeOfProject || "commercial",
    banner: {
      banner: project.banner?.banner || [],
      mobileBanner: project.banner?.mobileBanner || null,
    },
    projectDetail: {
      title: project.projectDetail?.title || "",
      typeOfProject: project.projectDetail?.typeOfProject || "commercial",
      shortAddress: project.projectDetail?.shortAddress || "",
      projectWorkStatus: project.projectDetail?.projectWorkStatus || "",
      brochure: project.projectDetail?.brochure || null,
      projectStatus: project.projectDetail?.projectStatus || "",
    },
    aboutUs: {
      description: project.aboutUs?.description || [""],
      image: project.aboutUs?.image || null,
    },
    floorPlan:
      project.floorPlan && project.floorPlan.length > 0
        ? project.floorPlan.map((fp) => ({
            id: fp.id || Date.now() + Math.random(),
            title: fp.title || "",
            alt: fp.alt || "",
            image: fp.image || null,
          }))
        : [{ id: Date.now(), title: "", alt: "", image: null }],
    projectImages: {
      images:
        project.projectImages?.images && project.projectImages.images.length > 0
          ? project.projectImages.images.map((img) => ({
              id: img.id || Date.now() + Math.random(),
              alt: img.alt || "",
              image: img.image || null,
            }))
          : [{ id: Date.now(), alt: "", image: null }],
    },
    amenities:
      project.amenities && project.amenities.length > 0
        ? project.amenities.map((amenity) => ({
            id: amenity.id || Date.now() + Math.random(),
            title: amenity.title || "",
            icon: amenity.icon || null,
            alt: amenity.alt || "",
          }))
        : [{ id: Date.now(), title: "", icon: null, alt: "" }],
    projectUpdates:
      project.projectUpdates && project.projectUpdates.length > 0
        ? project.projectUpdates.map((update) => ({
            id: update.id || Date.now() + Math.random(),
            date: update.date || "",
            title: update.title || "",
            images: update.images || [],
          }))
        : [{ id: Date.now(), date: "", title: "", images: [] }],
    location: {
      mapUrl: project.location?.mapUrl || "",
      address1: project.location?.address1 || "",
      address2: project.location?.address2 || "",
      city: project.location?.city || "",
      state: project.location?.state || "",
      zip: project.location?.zip || "",
      country: project.location?.country || "",
    },
    projectVideo: {
      videoUrl: project.projectVideo?.videoUrl || "",
      title: project.projectVideo?.title || "",
    },
  };
};

/**
 * Validate project form
 * @param {Object} formState - Current form state
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export const validateProjectForm = (formState) => {
  const errors = {};

  if (!formState.projectDetail.title?.trim()) {
    errors.title = "Project title is required";
  }

  if (!formState.typeOfProject) {
    errors.typeOfProject = "Project type is required";
  }

  if (!formState.location.city?.trim()) {
    errors.city = "City is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Reset file inputs in the DOM
 */
export const resetFileInputs = () => {
  const fileInputs = document.querySelectorAll('input[type="file"]');
  fileInputs.forEach((input) => (input.value = ""));
};

/**
 * Generate unique ID for array items
 */
export const generateUniqueId = () => {
  return Date.now() + Math.random();
};
