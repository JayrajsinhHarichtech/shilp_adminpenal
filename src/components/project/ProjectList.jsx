import React from "react";

const ProjectList = ({ projects, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading projects...</p>
      </div>
    );
  }

  // Safety check - ensure projects is an array
  if (!Array.isArray(projects)) {
    console.error("❌ Projects is not an array:", projects);
    return (
      <div className="text-center py-8 bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error: Invalid projects data format</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No projects found. Create your first project above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {projects.map((project) => (
        <div
          key={project._id || project.id}
          className="bg-white shadow-md p-5 rounded-lg flex justify-between items-center hover:shadow-lg transition-shadow"
        >
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-800">
              {project.projectDetail?.title || project.title || "Untitled Project"}
            </h3>
            
            <p className="text-gray-500 text-sm mt-1">
              {project.projectDetail?.shortAddress || 
               project.location?.address1 || 
               "No address provided"}
            </p>
            
            <div className="flex gap-4 mt-2">
              <p className="text-xs text-gray-400">
                Type:{" "}
                <span className="capitalize">
                  {project.typeOfProject || project.projectDetail?.typeOfProject || "N/A"}
                </span>
              </p>
              
              {project.projectDetail?.projectStatus && (
                <p className="text-xs text-gray-400">
                  Status: <span>{project.projectDetail.projectStatus}</span>
                </p>
              )}
              
              {project.slug && (
                <p className="text-xs text-gray-400">
                  Slug: <span className="font-mono">{project.slug}</span>
                </p>
              )}
            </div>

            {project.location?.city && (
              <p className="text-xs text-gray-400 mt-1">
                📍 {project.location.city}
                {project.location.state && `, ${project.location.state}`}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => onEdit(project)}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
              disabled={loading}
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(
                project._id || project.id, 
                project.projectDetail?.title || project.title || "Untitled Project"
              )}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
              disabled={loading}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectList;
