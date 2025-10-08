import { useEffect, useState } from "react";
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from "../../api/testimonialapi";

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [form, setForm] = useState({ name: "", designation: "", message: "", image: null });
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    const data = await getTestimonials();
    setTestimonials(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selected) {
        await updateTestimonial(selected._id, form);
      } else {
        await createTestimonial(form);
      }
      setForm({ name: "", designation: "", message: "", image: null });
      setSelected(null);
      loadTestimonials();
    } catch (err) {
      console.error(err);
      alert("Failed to save testimonial.");
    }
  };

  const handleEdit = (t) => {
    setSelected(t);
    setForm({
      name: t.name,
      designation: t.designation,
      message: t.message,
      image: null,
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    await deleteTestimonial(id);
    loadTestimonials();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Manage Testimonials</h2>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-3 w-1/2">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Designation"
          value={form.designation}
          onChange={(e) => setForm({ ...form, designation: e.target.value })}
          required
          className="border p-2 rounded w-full"
        />
        <textarea
          placeholder="Message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
          className="border p-2 rounded w-full"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
          className="border p-2 rounded w-full"
        />
        <button type="submit" className="bg-gray-700 text-white py-2 px-4 rounded w-full">
          {selected ? "Update Testimonial" : "Add Testimonial"}
        </button>
      </form>

      {/* List Section */}
      <ul className="space-y-4 w-full">
        {testimonials.map((t) => (
          <li key={t._id} className="border p-4 rounded shadow">
            <h4 className="font-bold text-lg">{t.name}</h4>
            <p className="text-sm text-gray-600">{t.designation}</p>
            <p className="mt-2">{t.message}</p>
            {t.image && (
              <img
                src={`http://localhost:5000${t.image}`}
                alt={t.name}
                className="mt-3 w-24 h-24 object-cover rounded"
              />
            )}
            <div className="mt-3 flex gap-2">
              <button onClick={() => handleEdit(t)} className="bg-blue-600 text-white py-1 px-3 rounded">
                Edit
              </button>
              <button onClick={() => handleDelete(t._id)} className="bg-red-500 text-white py-1 px-3 rounded">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
