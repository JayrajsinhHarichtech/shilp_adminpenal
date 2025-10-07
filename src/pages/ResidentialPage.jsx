import { useState } from "react";
import ResidentialForm from "../components/project/residential/ResidentialForm";
import ResidentialList from "../components/project/residential/ResidentialList";

export default function ResidentialPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selected, setSelected] = useState(null);

  const handleSaved = () => {
    setSelected(null);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="p-6 space-y-8">
      <ResidentialForm selected={selected} onSaved={handleSaved} />
      <ResidentialList refreshKey={refreshKey} onEdit={(item) => setSelected(item)} />
    </div>
  );
}
