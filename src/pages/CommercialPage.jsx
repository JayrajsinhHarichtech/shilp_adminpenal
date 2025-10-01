import { useState } from "react";
import CommercialForm from "../components/project/commercial/CommercialForm";
import CommercialList from "../components/project/commercial/CommercialList";

export default function CommercialPage() {
  const [selected, setSelected] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); 

  const handleSaved = () => {
    setSelected(null); 
    setRefreshKey((prev) => prev + 1); 
  };

  const handleEdit = (project) => {
    setSelected(project); 
  };

  return (
    <div className="space-y-8 p-6">
      <CommercialForm selected={selected} onSaved={handleSaved} />
      <CommercialList onEdit={handleEdit} refreshKey={refreshKey} />
    </div>
  );
}
