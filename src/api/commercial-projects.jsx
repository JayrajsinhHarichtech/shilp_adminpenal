import React, { useState, useEffect } from "react";

export default function CommercialProjectsAdmin() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState(null);
  const [form, setForm] = useState({ name: "", location: "", image: "", description: "", status: "" });

  // Fetch projects from API
  useEffect(() => {
    fetch("/api/commercial-projects")
      .then(res => res.json())
      .then(data => { setProjects(data); setLoading(false); })
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const startEditing = (project) => {
    setEditingProject(project.id);
    setForm(project);
  };

  const saveProject = async () => {
    if(editingProject){
      await fetch(`/api/commercial-projects/${editingProject}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      setProjects(projects.map(p => p.id === editingProject ? form : p));
    } else {
      const res = await fetch(`/api/commercial-projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const newProject = await res.json();
      setProjects([...projects, newProject]);
    }
    setEditingProject(null);
    setForm({ name: "", location: "", image: "", description: "", status: "" });
  };

  const deleteProject = async (id) => {
    await fetch(`/api/commercial-projects/${id}`, { method: "DELETE" });
    setProjects(projects.filter(p => p.id !== id));
  };

  if(loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Commercial Projects Admin</h2>

      <div className="mb-6 p-4 border rounded space-y-3">
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="p-2 border rounded w-full" />
        <input name="location" placeholder="Location" value={form.location} onChange={handleChange} className="p-2 border rounded w-full" />
        <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} className="p-2 border rounded w-full" />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="p-2 border rounded w-full" />
        <select name="status" value={form.status} onChange={handleChange} className="p-2 border rounded w-full">
          <option value="">Select Status</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>
        <button onClick={saveProject} className="px-4 py-2 bg-blue-600 text-white rounded">{editingProject ? "Update" : "Add Project"}</button>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Location</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(project => (
            <tr key={project.id} className="hover:bg-gray-50">
              <td className="border p-2">{project.name}</td>
              <td className="border p-2">{project.location}</td>
              <td className="border p-2">{project.status}</td>
              <td className="border p-2 space-x-2">
                <button onClick={() => startEditing(project)} className="px-2 py-1 bg-green-500 text-white rounded">Edit</button>
                <button onClick={() => deleteProject(project.id)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
    