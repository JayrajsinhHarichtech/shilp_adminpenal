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
    <ul className="ml-6 list-disc">
      {nodes.map((node) => (
        <li key={node._id}>
          <div className="flex items-center gap-2">
            <span className="font-medium">{node.name}</span>
            <button onClick={() => handleDelete(node._id)} className="text-red-500 text-sm">Delete</button>
          </div>
          {node.children?.length > 0 && renderTree(node.children)}
        </li>
      ))}
    </ul>
  );

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Project Tree</h2>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Project Name"
          value={newNode.name}
          onChange={(e) => setNewNode({ ...newNode, name: e.target.value })}
          required
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Parent ID (optional)"
          value={newNode.parentId}
          onChange={(e) => setNewNode({ ...newNode, parentId: e.target.value })}
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-gray-700 text-white px-4 rounded">Add</button>
      </form>

      {tree.length > 0 ? renderTree(tree) : <p>No projects found</p>}
    </div>
  );
}
