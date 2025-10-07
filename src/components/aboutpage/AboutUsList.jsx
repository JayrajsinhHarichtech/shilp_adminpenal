import { useEffect, useState } from "react";
import { getAboutUs, deleteAboutUs } from "../../api/aboutUsApi";

export default function AboutUsList({ onEdit, refreshKey }) {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalImage, setModalImage] = useState(null);

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
          <div
            className="h-48 w-full bg-gray-100 cursor-pointer mb-4"
            onClick={() => setModalImage(`http://localhost:5000${item.image}`)}
          >
            {item.image && (
              <img
                src={`http://localhost:5000${item.image}`}
                alt="About Us"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Who We Are</h3>
            <p className="text-sm text-gray-600 mb-3">{item.whoWeAre}</p>

            <h3 className="font-semibold text-lg mb-2">Vision</h3>
            <p className="text-sm text-gray-600 mb-3">{item.vision}</p>

            <h3 className="font-semibold text-lg mb-2">Mission</h3>
            <p className="text-sm text-gray-600 mb-3">{item.mission}</p>

            <h3 className="font-semibold text-lg mb-2">Core Values</h3>
            <ul className="list-disc list-inside text-gray-600 mb-3">
              {item.values?.map((v, i) => (
                <li key={i}>{v}</li>
              ))}
            </ul>

            <div className="mt-4 flex gap-2">
              <button onClick={() => onEdit(item)} className="px-3 py-1 border rounded">
                Edit
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                className="px-3 py-1 border rounded text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setModalImage(null)}
        >
          <img
            src={modalImage}
            alt="About Us Full"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
