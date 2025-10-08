import { useEffect, useState } from "react";
import { getResidentials, deleteResidential } from "../../../api/residentialApi";

export default function ResidentialList({ onEdit, refreshKey }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    fetchItems();
  }, [refreshKey]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await getResidentials();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteResidential(id);
      fetchItems();
    } catch (err) {
      console.error(err);
      alert("Delete failed. Check console.");
    }
  };

  if (loading) return <p>Loading projects...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-5">Residential Projects</h2>
      {items.length === 0 ? (
        <p className="text-gray-600">No projects found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((p) => {
            const imageUrl = p.image?.startsWith("http") ? p.image : `http://localhost:5000/${p.image}`;
            return (
              <div key={p._id} className="bg-white rounded shadow overflow-hidden">
                <div
                  className="h-48 w-full bg-gray-100 cursor-pointer"
                  onClick={() => setModalImage(imageUrl)}
                >
                  <img src={imageUrl} alt={p.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{p.title}</h3>
                  <p className="text-sm text-gray-600 mt-2">{p.description}</p>
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => onEdit(p)} className="px-3 py-1 border rounded">Edit</button>
                    <button onClick={() => handleDelete(p._id)} className="px-3 py-1 border rounded text-red-600">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setModalImage(null)}
        >
          <img
            src={modalImage}
            alt="Residential Full"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
