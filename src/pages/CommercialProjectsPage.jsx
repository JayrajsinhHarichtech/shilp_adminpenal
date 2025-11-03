import React, { useState, useEffect } from "react";
import { 
  getAllProjects, 
  createProject, 
  updateProject, 
  deleteProject 
} from "../api/projectsApi";
import ProjectForm from "../components/project/ProjectForm";
import ProjectList from "../components/project/ProjectList";

/**
 * Commercial Projects Management Component
 * =======================================
 * Manages projects specifically for Commercial category
 */
const CommercialProjectsPage = () => {
  // State management
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingProject, setEditingProject] = useState(null);

  // ===== LOAD COMMERCIAL PROJECTS =====
  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("📥 Loading commercial projects...");
      const data = await getAllProjects();
      // Filter only commercial projects
      const commercialProjects = data.filter(project => 
        project.typeOfProject === 'commercial' || 
        project.projectDetail?.typeOfProject === 'commercial'
      );
      console.log("🏢 Loaded commercial projects count:", commercialProjects.length);
      setProjects(commercialProjects);
    } catch (err) {
      console.error("Error loading commercial projects:", err);
      setError("Failed to load commercial projects");
    } finally {
      setLoading(false);
    }
  };

  // Load projects on component mount
  useEffect(() => {
    loadProjects();
  }, []);

  // ===== HANDLE SUBMIT (CREATE OR UPDATE) =====
  const handleSubmit = async (id, formData) => {
    console.log("🎯 handleSubmit called for commercial project with ID:", id);
    
    try {
      setLoading(true);
      setError(null);
      
      // Ensure typeOfProject is set to 'commercial'
      if (formData instanceof FormData) {
        const data = JSON.parse(formData.get('data'));
        data.typeOfProject = 'commercial';
        data.projectDetail.typeOfProject = 'commercial';
        formData.set('data', JSON.stringify(data));
      }
      
      if (id) {
        // Update existing project
        console.log("🔄 Updating commercial project with ID:", id);
        await updateProject(id, formData);
        alert("✅ Commercial project updated successfully!");
        setEditingProject(null);
      } else {
        // Create new project
        console.log("➕ Creating new commercial project");
        await createProject(formData);
        alert("✅ Commercial project created successfully!");
      }
      
      await loadProjects();
      return true;
    } catch (err) {
      console.error("❌ Error saving commercial project:", err);
      console.error("Error details:", err.response?.data);
      setError(err.response?.data?.message || "Failed to save commercial project");
      alert("❌ Error saving commercial project!");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ===== DELETE PROJECT (DOUBLE CONFIRMATION) =====
  const handleDelete = async (id, projectTitle) => {
    const firstConfirm = window.confirm(
      `⚠️ Are you sure you want to delete "${projectTitle}"?\n\nThis action cannot be undone!`
    );
    if (!firstConfirm) return;

    const secondConfirm = window.confirm(
      `🚨 FINAL CONFIRMATION!\n\nAre you absolutely sure you want to permanently delete "${projectTitle}"?\n\nClick OK to delete permanently.`
    );
    if (!secondConfirm) return;

    try {
      setLoading(true);
      setError(null);
      await deleteProject(id);
      alert("✅ Commercial project deleted successfully!");
      await loadProjects();
      
      if (editingProject?._id === id) {
        setEditingProject(null);
      }
    } catch (err) {
      console.error("Error deleting commercial project:", err);
      setError(err.response?.data?.message || "Failed to delete commercial project");
      alert("❌ Error deleting commercial project!");
    } finally {
      setLoading(false);
    }
  };

  // ===== EDIT PROJECT =====
  const handleEdit = (project) => {
    console.log("🔍 Debug - Editing commercial project:", project);
    setEditingProject(project);
    
    setTimeout(() => {
      const formContainer = document.getElementById('project-form');
      if (formContainer) {
        formContainer.scrollIntoView({ 
          behavior: "smooth", 
          block: "start",
          inline: "nearest"
        });
      } else {
        window.scrollTo({ 
          top: 0, 
          behavior: "smooth" 
        });
      }
    }, 150);
    
    console.log(`✏️ Editing commercial project: ${project.projectDetail?.title || project.title || 'Untitled'}`);
  };

  // ===== CANCEL EDIT =====
  const handleCancelEdit = () => {
    setEditingProject(null);
  };

  // ===== RENDER =====
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center mb-6">
        <span className="text-4xl mr-3">🏢</span>
        <h1 className="text-3xl font-bold">Commercial Projects Management</h1>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          ❌ {error}
        </div>
      )}

      {/* Edit Mode Indicator */}
      {editingProject && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4 animate-pulse">
          ✏️ <strong>Edit Mode:</strong> You are currently editing "{editingProject.projectDetail?.title || editingProject.title || 'Untitled Project'}"
        </div>
      )}

      {/* Project Form - For Create/Update */}
      <div id="project-form" className="scroll-mt-4">
        <ProjectForm
          editingProject={editingProject}
          onSubmit={handleSubmit}
          onCancel={handleCancelEdit}
          loading={loading}
          projectType="commercial"
        />
      </div>

      {/* Projects List */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <span className="mr-2">🏢</span>
          All Commercial Projects ({projects.length})
        </h2>
        <ProjectList
          projects={projects}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default CommercialProjectsPage;