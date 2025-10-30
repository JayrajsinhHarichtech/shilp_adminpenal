import { useEffect, useState } from "react";

export default function BlogsList({ refreshKey }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, [refreshKey]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/blogs");
      const data = await res.json();
      setBlogs(data || []);
    } catch (err) {
      console.error(err);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    try {
      await fetch(`http://localhost:5000/api/blogs/${id}`, { method: "DELETE" });
      fetchBlogs();
    } catch (err) {
      console.error(err);
      alert("Failed to delete blog.");
    }
  };

  if (loading) return <p>Loading blogs...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-5">Blogs</h2>

      {blogs.length === 0 ? (
        <p className="text-gray-600">No blogs found.</p>
      ) : (
        <div className="grid gap-5">
          {blogs.map((blog) => (
            <div key={blog._id} className="bg-white rounded shadow p-4">
              <div
                className="h-48 w-full bg-gray-100 cursor-pointer mb-4"
                onClick={() => setModalImage(`http://localhost:5000${blog.image}`)}
              >
                {blog.image && (
                  <img
                    src={`http://localhost:5000${blog.image}`}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <h3 className="font-semibold text-lg mb-1">{blog.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{blog.description}</p>
              <p className="text-xs text-gray-500 mb-3">
                {new Date(blog.date).toLocaleString()}
              </p>
              <button
                onClick={() => handleDelete(blog._id)}
                className="px-3 py-1 border rounded text-red-600"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal Image */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setModalImage(null)}
        >
          <img
            src={modalImage}
            alt="Full Blog"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
