import { useState } from "react";
import ResidentialForm from "../components/project/residential/ResidentialForm";
import ResidentialList from "../components/project/residential/ResidentialList";

export default function ResidentialPage() {
  const [selected, setSelected] = useState(null);
  const [refreshKey, setRefreshKey] = useState(false);

  const refresh = () => {
    setSelected(null);
    setRefreshKey((k) => !k);
  };    

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <ResidentialForm selected={selected} onSaved={refresh} />
        </div>
        <div className="lg:col-span-2">
          <ResidentialList onEdit={setSelected} refreshKey={refreshKey} />
        </div>
      </div>
    </div>
  );
}
