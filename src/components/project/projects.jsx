import React, { useState, useEffect } from "react";
import { 
  getAllProjects, 
  createProject, 
  updateProject, 
  deleteProject 
} from "../../api/projectsApi";
import ProjectForm from "./ProjectForm";
import ProjectList from "./ProjectList";

/**
 * Main Projects Management Component
 * ====================================
 * Simplified structure with proper CRUD operations
 * - Create new projects
 * - Read/List all projects
 * - Update existing projects
 * - Delete with double confirmation
 */
const Projects = () => {
  // State management
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingProject, setEditingProject] = useState(null);

  // ===== LOAD PROJECTS =====
  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("📥 Loading projects...");
      const data = await getAllProjects();
      console.log("📊 Loaded projects count:", data.length);
      console.log("📋 Projects data:", data);
      setProjects(data);
    } catch (err) {
      console.error("Error loading projects:", err);
      setError("Failed to load projects");
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
    console.log("🎯 handleSubmit called with ID:", id);
    
    try {
      setLoading(true);
      setError(null);
      
      if (id) {
        // Update existing project
        console.log("🔄 Updating project with ID:", id);
        await updateProject(id, formData);
        alert("✅ Project updated successfully!");
        setEditingProject(null);
      } else {
        // Create new project
        console.log("➕ Creating new project");
        await createProject(formData);
        alert("✅ Project created successfully!");
      }
      
      await loadProjects();
      return true;
    } catch (err) {
      console.error("❌ Error saving project:", err);
      console.error("Error details:", err.response?.data);
      setError(err.response?.data?.message || "Failed to save project");
      alert("❌ Error saving project!");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ===== DELETE PROJECT (DOUBLE CONFIRMATION) =====
  const handleDelete = async (id, projectTitle) => {
    // First confirmation
    const firstConfirm = window.confirm(
      `⚠️ Are you sure you want to delete "${projectTitle}"?\n\nThis action cannot be undone!`
    );
    if (!firstConfirm) return;

    // Second confirmation
    const secondConfirm = window.confirm(
      `🚨 FINAL CONFIRMATION!\n\nAre you absolutely sure you want to permanently delete "${projectTitle}"?\n\nClick OK to delete permanently.`
    );
    if (!secondConfirm) return;

    try {
      setLoading(true);
      setError(null);
      await deleteProject(id);
      alert("✅ Project deleted successfully!");
      await loadProjects();
      
      // If we were editing this project, clear the form
      if (editingProject?._id === id) {
        setEditingProject(null);
      }
    } catch (err) {
      console.error("Error deleting project:", err);
      setError(err.response?.data?.message || "Failed to delete project");
      alert("❌ Error deleting project!");
    } finally {
      setLoading(false);
    }
  };

  // ===== EDIT PROJECT =====
  const handleEdit = (project) => {
    console.log("🔍 Debug - Full project object:", project);
    console.log("🔍 Debug - project._id:", project._id);
    console.log("🔍 Debug - project.id:", project.id);
    
    // Set the editing project first
    setEditingProject(project);
    
    // Add a small delay to ensure the form updates first, then scroll
    setTimeout(() => {
      // Try to scroll to the form area specifically
      const formContainer = document.getElementById('project-form');
      if (formContainer) {
        formContainer.scrollIntoView({ 
          behavior: "smooth", 
          block: "start",
          inline: "nearest"
        });
      } else {
        // Fallback to top of page
        window.scrollTo({ 
          top: 0, 
          behavior: "smooth" 
        });
      }
    }, 150);
    
    // Optional: Show a brief notification
    console.log(`✏️ Editing project: ${project.projectDetail?.title || project.title || 'Untitled'}`);
  };

  // ===== CANCEL EDIT =====
  const handleCancelEdit = () => {
    setEditingProject(null);
  };

  // ===== RENDER =====
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6"> Project Management</h1>

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
        />
      </div>

      {/* Projects List */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">All Projects</h2>
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

export default Projects;
