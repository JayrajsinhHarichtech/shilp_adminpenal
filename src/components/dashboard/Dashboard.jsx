import { useState, useEffect } from "react";
import { getDashboard, addDashboard, deleteDashboard } from "../../api/dashboard";

const dashboardMetrics = [
{ label: "Total Projects", value: 12 },
{ label: "Ongoing Units", value: 632 },
{ label: "Completed Units", value: 299 },
{ label: "Happy Clients", value: 220 },
{ label: "Years of Experience", value: 18 },
];

const testimonials = [
{ client: "Ajay Patel", feedback: "Recommended Shilp Group to our friends..." },
{ client: "Rahul Shah", feedback: "They made dream come true for us." },
];

export default function Dashboard() {
const [projects, setProjects] = useState([]);
const [form, setForm] = useState({ name: "", location: "", image: null });
const [preview, setPreview] = useState(null);
const [selectedImage, setSelectedImage] = useState(null);

const API_URL = import.meta.env.VITE_URL;

useEffect(() => {
loadData();
}, []);

const loadData = async () => {
const data = await getDashboard();
setProjects(data);
};

const handleAdd = async () => {
if (!form.name || !form.location || !form.image) return;

const formData = new FormData();
formData.append("name", form.name);
formData.append("location", form.location);
formData.append("image", form.image);

const newItem = await addDashboard(formData);
setProjects([...projects, newItem]);

setForm({ name: "", location: "", image: null });
setPreview(null);


};

const handleDelete = async (id) => {
await deleteDashboard(id);
setProjects(projects.filter((p) => p._id !== id));
};

const openImage = (url) => setSelectedImage(url);
const closeImage = () => setSelectedImage(null);

return ( <div className="space-y-8">
{/* Metrics */} 
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
{dashboardMetrics.map((m, idx) => ( <div key={idx} className="bg-white rounded shadow p-6 text-center">
   <div className="text-3xl font-bold">{m.value}</div> <div className="text-gray-600 mt-2">{m.label}</div> </div>
))} </div>

  {/* Add Project Form */}
  <div className="mb-4 flex flex-col space-y-3 w-full">
    <input
      placeholder="Name"
      value={form.name}
      onChange={(e) => setForm({ ...form, name: e.target.value })}
      className="border p-2 rounded w-full"
    />

    <input
      placeholder="Location"
      value={form.location}
      onChange={(e) => setForm({ ...form, location: e.target.value })}
      className="border p-2 rounded w-full"
    />

    <input
      type="file"
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files[0];
        if (!file) return;
        setForm({ ...form, image: file });
        setPreview(URL.createObjectURL(file));
      }}
      className="border p-2 rounded w-full"
    />

    <button
      onClick={handleAdd}
      className="bg-gray-700 text-white px-4 py-2 rounded w-full"
    >
      Add
    </button>

    {/* Preview selected image */}
    {preview && (
      <img
        src={preview}
        alt="Preview"
        className="w-20 h-20 object-cover border rounded"
      />
    )}
  </div>

  {/* Latest Projects */}
  <div>
    <h2 className="text-2xl font-semibold mb-4">Latest Projects</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {projects.map((proj, idx) => {
        const imageUrl = proj.image?.startsWith("http")
          ? proj.image
          : `${API_URL}/uploads/${proj.image}`;

        return (
          <div
            key={proj._id || idx}
            className="bg-white rounded shadow overflow-hidden hover:shadow-lg relative"
          >
            {/* Image with click */}
            <img
              src={imageUrl}
              alt={proj.name}
              className="w-full h-60 object-contain bg-black cursor-pointer"
              onClick={() => openImage(imageUrl)}
            />

            {/* Content */}
            <div className="p-4">
              <h3 className="text-xl font-semibold">{proj.name}</h3>
              <p className="text-gray-600 mt-1">{proj.location}</p>
            </div>

            {/* Delete */}
            <div className="flex justify-end px-4 pb-3">
              <button
                onClick={() => handleDelete(proj._id)}
                className="text-red-600 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  </div>

  {/* Image Modal */}
  {selectedImage && (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="relative">
        <img
          src={selectedImage}
          alt="Full Preview"
          className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-lg"
        />
        <button
          onClick={closeImage}
          className="absolute top-2 right-2 text-white text-2xl font-bold"
        >
          ✕
        </button>
      </div>
    </div>
  )}

  {/* Testimonials */}
  <div>
    <h2 className="text-2xl font-semibold mb-4">Recent Testimonials</h2>
    <div className="space-y-4">
      {testimonials.map((t, idx) => (
        <div key={idx} className="bg-white rounded shadow p-4">
          <p className="italic">"{t.feedback}"</p>
          <div className="mt-2 text-right font-semibold">— {t.client}</div>
        </div>
      ))}
    </div>
  </div>
</div>


);
}
