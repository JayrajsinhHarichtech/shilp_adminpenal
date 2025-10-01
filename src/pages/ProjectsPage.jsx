import { useEffect, useState } from "react";
import { getCommercials } from "../api/commercialApi";

export default function ProjectsPage({ type }) {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (type === "commercial") {
          const data = await getCommercials();
          console.log("ProjectsPage data:", data); 
          setProjects(data);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };
    fetchProjects();
  }, [type]);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold capitalize">{type} Projects</h1>
      <div className="grid grid-cols-3 gap-4 mt-4">
        {projects.map((project) => (
          <div key={project._id} className="border p-4 rounded bg-white shadow">
            <img
              src={project.image?.startsWith("http") ? project.image : `http://localhost:5000/${project.image}`}
              alt={project.title}
              className="w-full h-40 object-cover mb-2"
            />
            <h2 className="font-semibold">{project.title}</h2>
            <p className="text-sm text-gray-600">{project.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
