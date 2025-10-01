import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import API from "../../api/axios";

export default function ProjectsPage() {
  const location = useLocation();
  const type = location.pathname.split("/").pop();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    API.get("/api/projects", { params: { type } })
      .then((res) => setItems(res.data))
      .catch((err) => console.error("Projects fetch error:", err))
      .finally(() => setLoading(false));  }, [type]);

  if (loading) {
    return (
      <div className="px-8 pt-32">
        <h1 className="text-4xl font-bold mb-10 text-gray-800">Projects</h1>
        <div className="text-gray-500 text-lg">Loading projects…</div>
      </div>
    );
  }

  return (
    <section className="bg-gray-50 min-h-screen px-8 pt-32 pb-16">
      <h1 className="text-5xl font-extrabold mb-14 text-center text-gray-800 tracking-tight">
        {type ? `${type.toUpperCase()} Projects` : "All Projects"}
      </h1>

      {items.length === 0 ? (
        <p className="text-center text-gray-500 text-xl">
          No projects found for {type || "selected type"}.
        </p>
      ) : (
        <div className="max-w-6xl mx-auto space-y-10">
          {items.map((proj) => (
            <div
              key={proj._id}
              className="bg-white rounded-3xl shadow-xl p-8 transition-transform
                         hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    {proj.title}
                  </h2>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                {/* Optional: add project meta or actions */}
                <div className="mt-6 md:mt-0 md:ml-8 text-gray-500 text-sm">
                  {proj.status && (
                    <span className="inline-block px-4 py-1 rounded-full bg-indigo-100 text-indigo-700 font-medium">
                      {proj.status}
                    </span>
                  )}
                </div>
              </div>

              {/* Optional nested “tree” children if your API provides them */}
              {Array.isArray(proj.children) && proj.children.length > 0 && (
                <div className="mt-6 ml-4 border-l-2 border-gray-200 pl-6 space-y-4">
                  {proj.children.map((child) => (
                    <div key={child._id} className="relative">
                      <span className="absolute -left-3 top-2 w-2 h-2 bg-indigo-500 rounded-full"></span>
                      <h3 className="text-xl font-medium text-gray-800">
                        {child.title}
                      </h3>
                      <p className="text-gray-600">{child.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
  