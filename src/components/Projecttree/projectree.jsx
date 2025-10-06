import { useEffect, useState } from "react";
import { getProjectTree, createProjectNode, deleteProjectNode } from "../../api/projectTreeApi";

export default function AdminProjectTree() {
  const [tree, setTree] = useState([]);
  const [newNode, setNewNode] = useState({ name: "", parentId: "" });

  useEffect(() => {
    loadTree();
  }, []);

  const loadTree = async () => {
    const data = await getProjectTree();
    setTree(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createProjectNode(newNode);
    setNewNode({ name: "", parentId: "" });
    loadTree();
  };

  const handleDelete = async (id) => {
    await deleteProjectNode(id);
    loadTree();
  };

  const renderTree = (nodes) => (
    <ul className="ml-6 list-disc space-y-2">
      {nodes.map((node) => (
        <li key={node._id}>
          <div className="flex items-center gap-2">
            <span className="font-medium">{node.name}</span>
            <button
              onClick={() => handleDelete(node._id)}
              className="text-red-500 text-sm"
            >
              Delete
            </button>
          </div>
          {node.children?.length > 0 && renderTree(node.children)}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">Manage Project Tree</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <input
          type="text"
          placeholder="Project Name"
          value={newNode.name}
          onChange={(e) => setNewNode({ ...newNode, name: e.target.value })}
          required
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Parent ID (optional)"
          value={newNode.parentId}
          onChange={(e) => setNewNode({ ...newNode, parentId: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-gray-700 text-white px-4 py-2 rounded w-full"
        >
          Add Project
        </button>
      </form>

      {/* Tree List */}
      <div className="mt-6">
        {tree.length > 0 ? (
          renderTree(tree)
        ) : (
          <p className="text-gray-500">No projects found</p>
        )}
      </div>
    </div>
  );
}
