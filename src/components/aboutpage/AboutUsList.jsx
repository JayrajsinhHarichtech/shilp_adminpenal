import { useEffect, useState } from "react";
import { getAboutUs, deleteAboutUs } from "../../api/aboutUsApi";

export default function AboutUsList({ onEdit, refreshKey }) {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchItem();
  }, [refreshKey]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      const data = await getAboutUs();
      setItem(data || null);
    } catch (err) {
      console.error(err);
      setItem(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete About Us?")) return;
    try {
      await deleteAboutUs(id);
      setItem(null);
    } catch (err) {
      console.error(err);
      alert("Delete failed. Check console.");
    }
  };

  if (loading) return <p>Loading About Us...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-5">About Us</h2>

      {!item ? (
        <p className="text-gray-600">No About Us info found.</p>
      ) : (
        <div className="bg-white rounded shadow overflow-hidden p-4">
          <div className="h-48 w-full bg-gray-100 mb-4">
            {item.desktopBanner && (
              <img
                src={`http://localhost:5000${item.desktopBanner}`}
                alt="Desktop Banner"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="h-48 w-full bg-gray-100 mb-4">
            {item.mobileBanner && (
              <img
                src={`http://localhost:5000${item.mobileBanner}`}
                alt="Mobile Banner"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <h3 className="font-semibold text-lg mb-2">Who We Are</h3>
          <p className="text-sm text-gray-600 mb-3">{item.whoWeAre}</p>

          <div className="mt-4 flex gap-2">
            <button onClick={() => onEdit(item)} className="px-3 py-1 border rounded">
              Edit
            </button>
            <button onClick={() => handleDelete(item._id)} className="px-3 py-1 border rounded text-red-600">
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
