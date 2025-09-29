import React, { useEffect, useState } from "react";
import API from "../../api/axios";

export default function TestimonialsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/testimonials")
      .then((res) => setItems(res.data))
      .catch((err) => console.error("Testimonials fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="px-8 pt-32">
        <h1 className="text-4xl font-extrabold mb-10 text-gray-800">Testimonials</h1>
        <div className="text-gray-500 text-lg">Loading testimonials…</div>
      </div>
    );
  }

  return (
    <section className="bg-gray-50 min-h-screen px-8 pt-32 pb-16">
      <h1 className="text-5xl font-extrabold mb-14 text-center text-gray-800 tracking-tight">
        What People Say About Us
      </h1>

      {items.length === 0 ? (
        <p className="text-center text-gray-500 text-xl">
          No testimonials available yet.
        </p>
      ) : (
        <div className="space-y-10 max-w-6xl mx-auto">
          {items.map((t) => (
            <div
              key={t._id}
              className="bg-white rounded-3xl shadow-xl p-10 flex flex-col md:flex-row items-center md:items-start
                         gap-10 transition-transform hover:-translate-y-1 hover:shadow-2xl"
            >
              <img
                src={t.avatarUrl || "/uploads/default.png"}
                alt={t.name}
                className="w-36 h-36 rounded-full object-cover border-4 border-indigo-100 flex-shrink-0"
              />
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-semibold text-gray-900">{t.name}</h2>
                {t.role && (
                  <p className="text-xl text-indigo-600 font-medium mt-1">{t.role}</p>
                )}
                <p className="mt-6 text-gray-700 text-lg leading-relaxed max-w-3xl">
                  “{t.message}”
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
