import React from 'react';
import { getFullImageUrl } from '../../api/blogsApi';

/**
 * BlogCard component for displaying individual blog in a card format
 * @param {Object} blog - Blog object
 * @param {Function} onEdit - Callback for edit action
 * @param {Function} onDelete - Callback for delete action
 */
export default function BlogCard({ blog, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
    if (status === 'published') {
      return `${baseClasses} bg-green-100 text-green-800`;
    }
    return `${baseClasses} bg-yellow-100 text-yellow-800`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      {/* Blog Image */}
      <div className="h-48 w-full bg-gray-100 relative overflow-hidden">
        {blog.blogImage ? (
          <img
            src={getFullImageUrl(blog.blogImage)}
            alt={blog.blogImageAlt || blog.mainTitle}
            className="w-full h-full object-cover hover:scale-105 transition duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400 text-4xl">🖼️</span>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={getStatusBadge(blog.publish)}>
            {blog.publish}
          </span>
        </div>
        
        {/* Featured Badge */}
        {blog.featured && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-500 text-white">
              ⭐ Featured
            </span>
          </div>
        )}
      </div>

      {/* Blog Content */}
      <div className="p-6">
        <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-2">
          {blog.mainTitle}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-3">
          {blog.blogDescription}
        </p>

        {/* Author and Date */}
        <div className="flex items-center text-xs text-gray-500 mb-4">
          <span className="mr-2">👤 {blog.author}</span>
          <span>📅 {formatDate(blog.blogDate)}</span>
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
              >
                {tag}
              </span>
            ))}
            {blog.tags.length > 3 && (
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                +{blog.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Points Count */}
        {blog.points && blog.points.length > 0 && (
          <div className="text-xs text-gray-500 mb-4">
            📄 {blog.points.length} main point{blog.points.length !== 1 ? 's' : ''}
            {blog.points.some(p => p.subPoints && p.subPoints.length > 0) && (
              <span className="ml-1">
                with sub-points
              </span>
            )}
          </div>
        )}

        {/* URL */}
        {blog.url && (
          <div className="text-xs text-gray-500 mb-4 truncate">
            🔗 /{blog.url}
          </div>
        )}

        {/* Banner Info */}
        {blog.banner && (blog.banner.bannerTitle || blog.banner.bannerSubtitle) && (
          <div className="text-xs text-gray-500 mb-4 p-2 bg-gray-50 rounded">
            <strong>Banner:</strong> {blog.banner.bannerTitle}
            {blog.banner.bannerSubtitle && (
              <div className="truncate">{blog.banner.bannerSubtitle}</div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(blog)}
                className="px-3 py-1 text-sm border border-blue-300 text-blue-600 rounded hover:bg-blue-50 transition duration-200"
              >
                ✏️ Edit
              </button>
            )}
            
            {onDelete && (
              <button
                onClick={() => onDelete(blog._id)}
                className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50 transition duration-200"
              >
                🗑️ Delete
              </button>
            )}
          </div>
          
          <div className="text-xs text-gray-400">
            ID: {blog._id.slice(-6)}
          </div>
        </div>
      </div>
    </div>
  );
}