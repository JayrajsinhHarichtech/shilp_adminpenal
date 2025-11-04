const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

/**
 * Get full image URL by appending base URL if needed
 * @param {string} imagePath - The image path from backend
 * @returns {string} Full image URL
 */
export const getFullImageUrl = (imagePath) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  // Use the base API URL without /api since imagePath already contains the full path
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  return `${baseUrl}${imagePath}`;
};

/**
 * Get all blogs (including drafts and published)
 * @returns {Promise<Array>} Array of all blogs
 */
export const getAllBlogs = async () => {
  try {
    console.log('Fetching blogs from:', `${API_BASE_URL}/blogs`);
    const response = await fetch(`${API_BASE_URL}/blogs`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('API Response:', data);
    console.log('Number of blogs received:', Array.isArray(data) ? data.length : 'Not an array');
    
    if (Array.isArray(data)) {
      console.log('Blog statuses:', data.map(blog => ({ title: blog.mainTitle, status: blog.publish })));
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching all blogs:', error);
    throw error;
  }
};

/**
 * Get only published blogs (for frontend)
 * @returns {Promise<Array>} Array of published blogs
 */
export const getPublishedBlogs = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/blogs`);
    if (!response.ok) throw new Error('Failed to fetch published blogs');
    return await response.json();
  } catch (error) {
    console.error('Error fetching published blogs:', error);
    throw error;
  }
};

/**
 * Get blog by ID
 * @param {string} id - Blog ID
 * @returns {Promise<Object>} Blog object
 */
export const getBlogById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/blogs/${id}`);
    if (!response.ok) throw new Error('Failed to fetch blog');
    return await response.json();
  } catch (error) {
    console.error('Error fetching blog:', error);
    throw error;
  }
};

/**
 * Create new blog
 * @param {Object} blogData - Blog form data
 * @returns {Promise<Object>} Created blog object
 */
export const createBlog = async (blogData) => {
  try {
    const formData = new FormData();
    
    // Add banner data (integrated with blog creation)
    if (blogData.bannerTitle) formData.append('bannerTitle', blogData.bannerTitle);
    if (blogData.bannerSubtitle) formData.append('bannerSubtitle', blogData.bannerSubtitle);
    
    // Add main content
    if (blogData.mainTitle) formData.append('mainTitle', blogData.mainTitle);
    if (blogData.author) formData.append('author', blogData.author);
    if (blogData.blogDate) formData.append('blogDate', blogData.blogDate);
    if (blogData.blogDescription) formData.append('blogDescription', blogData.blogDescription);
    if (blogData.url) formData.append('url', blogData.url);
    if (blogData.metaDescription) formData.append('metaDescription', blogData.metaDescription);
    if (blogData.publish) formData.append('publish', blogData.publish);
    if (blogData.featured !== undefined) formData.append('featured', blogData.featured);
    
    // Add tags - ensure proper array format without double quotes
    if (blogData.tags && Array.isArray(blogData.tags)) {
      // Clean tags to remove any extra quotes, brackets, or JSON formatting
      const cleanTags = blogData.tags
        .filter(tag => tag && tag.trim())
        .map(tag => {
          // Remove any JSON-like formatting: ["property"] -> property
          let cleanTag = tag.toString().trim();
          cleanTag = cleanTag.replace(/^\[\"|\"\]$|^\[\'|\'\]$|^\"|\"|^\'|\'$/g, '');
          cleanTag = cleanTag.replace(/\\"/g, '"'); // Handle escaped quotes
          return cleanTag;
        })
        .filter(tag => tag && tag !== ''); // Remove empty tags
      
      formData.append('tags', JSON.stringify(cleanTags));
    }
    
    // Add points with nested structure
    if (blogData.points && Array.isArray(blogData.points)) {
      formData.append('points', JSON.stringify(blogData.points));
    }
    
    // Add image files
    if (blogData.bannerImage instanceof File) formData.append('bannerImage', blogData.bannerImage);
    if (blogData.mobileBanner instanceof File) formData.append('mobileBanner', blogData.mobileBanner);
    if (blogData.blogImage instanceof File) formData.append('blogImage', blogData.blogImage);

    const response = await fetch(`${API_BASE_URL}/blogs`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create blog');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating blog:', error);
    throw error;
  }
};

/**
 * Update existing blog
 * @param {string} id - Blog ID
 * @param {Object} blogData - Updated blog form data
 * @returns {Promise<Object>} Updated blog object
 */
export const updateBlog = async (id, blogData) => {
  try {
    const formData = new FormData();
    
    // Add banner data
    if (blogData.bannerTitle !== undefined) formData.append('bannerTitle', blogData.bannerTitle);
    if (blogData.bannerSubtitle !== undefined) formData.append('bannerSubtitle', blogData.bannerSubtitle);
    
    // Add main content
    if (blogData.mainTitle !== undefined) formData.append('mainTitle', blogData.mainTitle);
    if (blogData.author !== undefined) formData.append('author', blogData.author);
    if (blogData.blogDate !== undefined) formData.append('blogDate', blogData.blogDate);
    if (blogData.blogDescription !== undefined) formData.append('blogDescription', blogData.blogDescription);
    if (blogData.url !== undefined) formData.append('url', blogData.url);
    if (blogData.metaDescription !== undefined) formData.append('metaDescription', blogData.metaDescription);
    if (blogData.publish !== undefined) formData.append('publish', blogData.publish);
    if (blogData.featured !== undefined) formData.append('featured', blogData.featured);
    
    // Add tags - ensure proper array format without double quotes
    if (blogData.tags && Array.isArray(blogData.tags)) {
      // Clean tags to remove any extra quotes, brackets, or JSON formatting
      const cleanTags = blogData.tags
        .filter(tag => tag && tag.trim())
        .map(tag => {
          // Remove any JSON-like formatting: ["property"] -> property
          let cleanTag = tag.toString().trim();
          cleanTag = cleanTag.replace(/^\[\"|\"\]$|^\[\'|\'\]$|^\"|\"|^\'|\'$/g, '');
          cleanTag = cleanTag.replace(/\\"/g, '"'); // Handle escaped quotes
          return cleanTag;
        })
        .filter(tag => tag && tag !== ''); // Remove empty tags
      
      formData.append('tags', JSON.stringify(cleanTags));
    }
    
    // Add points with nested structure
    if (blogData.points && Array.isArray(blogData.points)) {
      formData.append('points', JSON.stringify(blogData.points));
    }
    
    // Add image files only if they're new File objects (preserve existing images)
    if (blogData.bannerImage instanceof File) formData.append('bannerImage', blogData.bannerImage);
    if (blogData.mobileBanner instanceof File) formData.append('mobileBanner', blogData.mobileBanner);
    if (blogData.blogImage instanceof File) formData.append('blogImage', blogData.blogImage);

    // Add a flag to indicate this is an update to preserve existing images
    formData.append('preserveExistingImages', 'true');

    const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
      method: 'PUT',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update blog');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating blog:', error);
    throw error;
  }
};

/**
 * Delete blog by ID
 * @param {string} id - Blog ID
 * @returns {Promise<Object>} Delete confirmation
 */
export const deleteBlog = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete blog');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting blog:', error);
    throw error;
  }
};

/**
 * Get blog banner data
 * @returns {Promise<Object>} Banner data
 */
export const getBlogBanner = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/blogs/banner`);
    if (!response.ok) throw new Error('Failed to fetch banner');
    return await response.json();
  } catch (error) {
    console.error('Error fetching banner:', error);
    throw error;
  }
};

/**
 * Update blog banner
 * @param {Object} bannerData - Banner form data
 * @returns {Promise<Object>} Updated banner data
 */
export const updateBlogBanner = async (bannerData) => {
  try {
    const formData = new FormData();
    
    if (bannerData.bannerTitle) formData.append('bannerTitle', bannerData.bannerTitle);
    if (bannerData.bannerSubtitle) formData.append('bannerSubtitle', bannerData.bannerSubtitle);
    if (bannerData.bannerImage) formData.append('bannerImage', bannerData.bannerImage);
    if (bannerData.mobileBanner) formData.append('mobileBanner', bannerData.mobileBanner);

    const response = await fetch(`${API_BASE_URL}/blogs/banner`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update banner');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating banner:', error);
    throw error;
  }
};

/**
 * Helper function to format blog data for API submission
 * @param {Object} formData - Raw form data
 * @returns {Object} Formatted blog data
 */
export const formatBlogData = (formData) => {
  return {
    bannerTitle: formData.bannerTitle || '',
    bannerSubtitle: formData.bannerSubtitle || '',
    mainTitle: formData.mainTitle || '',
    author: formData.author || '',
    blogDate: formData.blogDate || new Date().toISOString().split('T')[0],
    blogDescription: formData.blogDescription || '',
    url: formData.url || '',
    metaDescription: formData.metaDescription || '',
    tags: formData.tags || [],
    points: formData.points || [],
    publish: formData.publish || 'draft',
    featured: formData.featured || false,
    bannerImage: formData.bannerImage,
    mobileBanner: formData.mobileBanner,
    blogImage: formData.blogImage,
  };
};

/**
 * Helper function to validate blog form data
 * @param {Object} blogData - Blog data to validate
 * @returns {Object} Validation result { isValid: boolean, errors: Array }
 */
export const validateBlogData = (blogData) => {
  const errors = [];

  if (!blogData.mainTitle?.trim()) {
    errors.push('Main title is required');
  }

  if (!blogData.author?.trim()) {
    errors.push('Author is required');
  }

  if (!blogData.blogDescription?.trim()) {
    errors.push('Blog description is required');
  }

  if (!blogData.blogDate) {
    errors.push('Blog date is required');
  }

  if (!['draft', 'published'].includes(blogData.publish)) {
    errors.push('Publish status must be either "draft" or "published"');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};