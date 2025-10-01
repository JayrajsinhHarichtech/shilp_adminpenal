import { useEffect, useState } from "react";
import { getResidentials, deleteResidential } from "../../../api/residentialApi";

export default function ResidentialList({ onEdit, refreshKey }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchItems();
    
  }, [refreshKey]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await getResidentials();
      console.log("Residential API:", data);
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
          {items.map((p) => (
            <div key={p._id} className="bg-white rounded shadow overflow-hidden">
              <div className="h-48 w-full bg-gray-100">
                <img
                  src={p.image?.startsWith("http") ? p.image : `http://localhost:5000/${p.image}`}
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
          ))}
        </div>
      )}
    </div>
  );
}
