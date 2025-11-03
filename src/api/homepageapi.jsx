/**
 * Homepage API functions
 * Handles banner, testimonials, and services API calls
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

/**
 * Fetch homepage data (banners, services, testimonials)
 * @returns {Promise<Object>} Homepage data object
 */
export const fetchHomepageData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/banner`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    throw error;
  }
};

/**
 * Update homepage data (banners, services, testimonials)
 * @param {FormData} formData - Form data containing homepage updates
 * @returns {Promise<Object>} Updated homepage data
 */
export const updateHomepageData = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/banner`, {
      method: "POST",
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating homepage data:", error);
    throw error;
  }
};

/**
 * Helper function to construct full image URL
 * @param {string} imageUrl - Relative image URL from server
 * @returns {string} Full image URL
 */
export const getFullImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  return imageUrl.startsWith('http') 
    ? imageUrl 
    : `${API_BASE_URL.replace('/api', '')}${imageUrl}`;
};
