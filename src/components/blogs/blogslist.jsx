import { useEffect, useState } from "react";
import { getAllBlogs, deleteBlog, getFullImageUrl } from "../../api/blogsApi";

export default function BlogsList({ refreshKey, onEdit }) {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'published', 'draft'

  useEffect(() => {
    fetchBlogs();
  }, [refreshKey]);

  useEffect(() => {
    // Filter blogs based on selected status
    if (filterStatus === 'all') {
      setFilteredBlogs(blogs);
    } else {
      setFilteredBlogs(blogs.filter(blog => blog.publish === filterStatus));
    }
  }, [blogs, filterStatus]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      console.log('Starting to fetch blogs...');
      const data = await getAllBlogs();
      console.log('Raw data from API:', data);
      console.log('Is data an array?', Array.isArray(data));
      console.log('Data length:', data?.length);
      
      if (Array.isArray(data)) {
        console.log('Setting blogs data:', data);
        setBlogs(data);
        
        // Log each blog's details
        data.forEach((blog, index) => {
          console.log(`Blog ${index + 1}:`, {
            id: blog._id,
            title: blog.mainTitle,
            status: blog.publish,
            author: blog.author
          });
        });
      } else {
        console.error('Data is not an array:', typeof data);
        setBlogs([]);
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    try {
      await deleteBlog(id);
      fetchBlogs(); // Refresh the list
    } catch (err) {
      console.error(err);
      alert("Failed to delete blog: " + err.message);
    }
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading blogs...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800">All Blogs</h2>
        <div className="flex items-center gap-4">
          {/* Filter Dropdown */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">All Blogs ({blogs.length})</option>
            <option value="published">
              Published ({blogs.filter(b => b.publish === 'published').length})
            </option>
            <option value="draft">
              Drafts ({blogs.filter(b => b.publish === 'draft').length})
            </option>
          </select>
          
          <button
            onClick={fetchBlogs}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition duration-200"
          >
            {loading ? '🔄 Refreshing...' : '🔄 Refresh'}
          </button>
          
          <div className="text-sm text-gray-600">
            Showing: {filteredBlogs.length} blog{filteredBlogs.length !== 1 ? 's' : ''}
            {filterStatus !== 'all' && (
              <div className="mt-1 text-blue-600 font-medium">
                Filter: {filterStatus === 'published' ? 'Published' : 'Draft'} blogs
              </div>
            )}
          </div>
        </div>
      </div>

      {filteredBlogs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          {blogs.length === 0 ? (
            <>
              <p className="text-xl text-gray-600 mb-2">No blogs found</p>
              <p className="text-gray-500">Create your first blog to get started!</p>
            </>
          ) : (
            <>
              <p className="text-xl text-gray-600 mb-2">
                No {filterStatus === 'published' ? 'published' : filterStatus === 'draft' ? 'draft' : ''} blogs found
              </p>
              <p className="text-gray-500">
                {filterStatus === 'published' 
                  ? 'Publish some blogs to see them here!'
                  : filterStatus === 'draft'
                  ? 'Create some draft blogs to see them here!'
                  : 'Try adjusting your filter or create new blogs!'
                }
              </p>
              <button
                onClick={() => setFilterStatus('all')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Show All Blogs
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBlogs.map((blog) => (
            <div key={blog._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
              {/* Blog Image */}
              <div
                className="h-48 w-full bg-gray-100 cursor-pointer relative overflow-hidden"
                onClick={() => setModalImage(blog.blogImage ? getFullImageUrl(blog.blogImage) : null)}
              >
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

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(blog._id)}
                        className="px-3 py-1 text-sm border border-blue-300 text-blue-600 rounded hover:bg-blue-50 transition duration-200"
                      >
                        ✏️ Edit
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="px-4 py-2 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50 transition duration-200"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                  
                  <div className="text-xs text-gray-400">
                    ID: {blog._id.slice(-6)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Image */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
          onClick={() => setModalImage(null)}
        >
          <div className="relative max-h-[90vh] max-w-[90vw]">
            <button
              onClick={() => setModalImage(null)}
              className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full w-10 h-10 flex items-center justify-center transition duration-200"
            >
              ✕
            </button>
            <img
              src={modalImage}
              alt="Full Blog Image"
              className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
