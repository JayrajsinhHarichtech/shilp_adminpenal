import { useEffect, useState } from "react";
import { getPlots, deletePlot } from "../../../api/plotsApi";

export default function PlotsList({ onEdit, refreshKey }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); 
  const [isError, setIsError] = useState(false); 
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    fetchItems();
  }, [refreshKey]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await getPlots();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePlot(id);
      setMessage("Plot deleted successfully!"); 
      setIsError(false);
      fetchItems();
      setTimeout(() => setMessage(""), 4000); 
    } catch (err) {
      console.error(err);
      setMessage("Delete failed. Check console.");
      setIsError(true);
      setTimeout(() => setMessage(""), 4000);
    }
  };

  if (loading) return <p>Loading plots....</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-5">Plots</h2>
      {items.length === 0 ? (
        <p className="text-gray-600">No plots found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((p) => {
            const imageUrl = p.image?.startsWith("http") ? p.image : `http://localhost:5000${p.image}`;
            return (
              <div key={p._id} className="bg-white rounded shadow overflow-hidden">
                <div
                  className="h-48 w-full bg-gray-100 cursor-pointer"
                  onClick={() => setModalImage(imageUrl)}
                >
                  <img
                    src={imageUrl}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{p.title}</h3>
                  <p className="text-sm text-gray-600 mt-2">{p.description}</p>
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => onEdit(p)} className="px-3 py-1 border rounded">Edit</button>
                    <button onClick={() => handleDelete(p._id)} className="px-3 py-1 border rounded text-red-600">Delete</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {message && (
        <p className={`mt-4 text-sm font-medium ${isError ? "text-red-600" : "text-green-600"}`}>
          {message}
        </p>
      )}

      {/* Image Modal */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setModalImage(null)} 
        >
          <img
            src={modalImage}
            alt="Plot Full"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
