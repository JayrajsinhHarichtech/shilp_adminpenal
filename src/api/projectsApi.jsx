import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const PROJECTS_ENDPOINT = `${API_BASE_URL}/projects`;

/**
 * Fetch all projects
 * @returns {Promise<Array>} Array of projects
 */
export const getAllProjects = async () => {
  try {
    const { data } = await axios.get(PROJECTS_ENDPOINT);
    console.log("📦 API Response:", data);
    
    // Handle different response formats
    if (Array.isArray(data)) {
      return data;
    } else if (data.projects && Array.isArray(data.projects)) {
      return data.projects;
    } else if (data.data && Array.isArray(data.data)) {
      return data.data;
    } else {
      console.warn("⚠️ Unexpected response format:", data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw new Error(error.response?.data?.error || "Failed to fetch projects");
  }
};

/**
 * Get single project by ID
 * @param {string} id - Project ID
 * @returns {Promise<Object>} Project object
 */
export const getProjectById = async (id) => {
  try {
    const { data } = await axios.get(`${PROJECTS_ENDPOINT}/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetching project:", error);
    throw new Error(error.response?.data?.error || "Failed to fetch project");
  }
};

/**
 * Create new project
 * @param {FormData} projectData - Project FormData with files
 * @returns {Promise<Object>} Created project
 */
export const createProject = async (projectData) => {
  try {
    console.log("➕ API: Creating project");
    console.log("📦 API: Sending FormData with files");
    
    // Check if FormData contains files
    if (projectData instanceof FormData) {
      console.log("📁 FormData detected - files will be processed");
      for (let [key, value] of projectData.entries()) {
        if (value instanceof File) {
          console.log(`📎 File found: ${key} = ${value.name} (${value.size} bytes)`);
        }
      }
    }
    
    const { data } = await axios.post(PROJECTS_ENDPOINT, projectData, {
      // Don't set Content-Type for FormData - let browser set it with boundary
      headers: projectData instanceof FormData ? {} : { "Content-Type": "application/json" },
    });
    
    console.log("✅ API: Create response:", data);
    return data;
  } catch (error) {
    console.error("❌ API: Error creating project:", error);
    console.error("Error response:", error.response?.data);
    throw new Error(error.response?.data?.error || "Failed to create project");
  }
};

/**
 * Update existing project
 * @param {string} id - Project ID
 * @param {FormData} projectData - Updated project FormData with files
 * @returns {Promise<Object>} Updated project
 */
export const updateProject = async (id, projectData) => {
  try {
    console.log("🔄 API: Updating project ID:", id);
    console.log("📦 API: Sending FormData with files");
    
    // Check if FormData contains files
    if (projectData instanceof FormData) {
      console.log("📁 FormData detected - files will be processed");
      for (let [key, value] of projectData.entries()) {
        if (value instanceof File) {
          console.log(`📎 File found: ${key} = ${value.name} (${value.size} bytes)`);
        }
      }
    }
    
    const { data } = await axios.put(`${PROJECTS_ENDPOINT}/${id}`, projectData, {
      // Don't set Content-Type for FormData - let browser set it with boundary
      headers: projectData instanceof FormData ? {} : { "Content-Type": "application/json" },
    });
    
    console.log("✅ API: Update response:", data);
    return data;
  } catch (error) {
    console.error("❌ API: Error updating project:", error);
    console.error("Error response:", error.response?.data);
    throw new Error(error.response?.data?.error || "Failed to update project");
  }
};

/**
 * Delete project
 * @param {string} id - Project ID
 * @returns {Promise<Object>} Deletion response
 */
export const deleteProject = async (id) => {
  try {
    const { data } = await axios.delete(`${PROJECTS_ENDPOINT}/${id}`);
    return data;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw new Error(error.response?.data?.error || "Failed to delete project");
  }
};
