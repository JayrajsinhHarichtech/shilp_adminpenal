import { useState } from "react";
import BlogsFrom from "../components/blogs/blogsFrom";
import BlogsList from "../components/blogs/blogslist";

export default function BlogsPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [editBlogId, setEditBlogId] = useState(null);
  
  const handleBlogSaved = () => {
    setRefreshKey(refreshKey + 1);
  };

  const handleEditBlog = (blogId) => {
    setEditBlogId(blogId);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditBlogId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Blog Management</h1>
          <p className="text-gray-600">Create and manage your blog posts</p>
        </div>
        
        <div className="space-y-12">
          {/* Blog Form Component */}
          <BlogsFrom 
            onSaved={handleBlogSaved} 
            editBlogId={editBlogId}
            onCancelEdit={handleCancelEdit}
          />
          
          {/* Blog List Component */}
          <BlogsList 
            refreshKey={refreshKey} 
            onEdit={handleEditBlog}
          />
        </div>
      </div>
    </div>
  );
}
