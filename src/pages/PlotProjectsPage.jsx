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
 * Plot Projects Management Component
 * =================================
 * Manages projects specifically for Plot category
 */
const PlotProjectsPage = () => {
  // State management
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingProject, setEditingProject] = useState(null);

  // ===== LOAD PLOT PROJECTS =====
  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("📥 Loading plot projects...");
      const data = await getAllProjects();
      // Filter only plot projects
      const plotProjects = data.filter(project => 
        project.typeOfProject === 'plots' || 
        project.projectDetail?.typeOfProject === 'plots'
      );
      console.log("🏞️ Loaded plot projects count:", plotProjects.length);
      setProjects(plotProjects);
    } catch (err) {
      console.error("Error loading plot projects:", err);
      setError("Failed to load plot projects");
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
    console.log("🎯 handleSubmit called for plot project with ID:", id);
    
    try {
      setLoading(true);
      setError(null);
      
      // Ensure typeOfProject is set to 'plots'
      if (formData instanceof FormData) {
        const data = JSON.parse(formData.get('data'));
        data.typeOfProject = 'plots';
        data.projectDetail.typeOfProject = 'plots';
        formData.set('data', JSON.stringify(data));
      }
      
      if (id) {
        // Update existing project
        console.log("🔄 Updating plot project with ID:", id);
        await updateProject(id, formData);
        alert("✅ Plot project updated successfully!");
        setEditingProject(null);
      } else {
        // Create new project
        console.log("➕ Creating new plot project");
        await createProject(formData);
        alert("✅ Plot project created successfully!");
      }
      
      await loadProjects();
      return true;
    } catch (err) {
      console.error("❌ Error saving plot project:", err);
      console.error("Error details:", err.response?.data);
      setError(err.response?.data?.message || "Failed to save plot project");
      alert("❌ Error saving plot project!");
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
      alert("✅ Plot project deleted successfully!");
      await loadProjects();
      
      if (editingProject?._id === id) {
        setEditingProject(null);
      }
    } catch (err) {
      console.error("Error deleting plot project:", err);
      setError(err.response?.data?.message || "Failed to delete plot project");
      alert("❌ Error deleting plot project!");
    } finally {
      setLoading(false);
    }
  };

  // ===== EDIT PROJECT =====
  const handleEdit = (project) => {
    console.log("🔍 Debug - Editing plot project:", project);
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
    
    console.log(`✏️ Editing plot project: ${project.projectDetail?.title || project.title || 'Untitled'}`);
  };

  // ===== CANCEL EDIT =====
  const handleCancelEdit = () => {
    setEditingProject(null);
  };

  // ===== RENDER =====
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center mb-6">
        <span className="text-4xl mr-3">🏞️</span>
        <h1 className="text-3xl font-bold">Plot Projects Management</h1>
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
          projectType="plots"
        />
      </div>

      {/* Projects List */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <span className="mr-2">🏞️</span>
          All Plot Projects ({projects.length})
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

export default PlotProjectsPage;