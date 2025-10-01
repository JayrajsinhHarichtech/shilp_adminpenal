import { useState } from "react";
import PlotsForm from "../components/project/plots/PlotsForm";
import PlotsList from "../components/project/plots/PlotsList";

export default function PlotsPage() {
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshList = () => setRefreshKey((prev) => prev + 1);

  const handleEdit = (plot) => {
    setSelectedPlot(plot);
  };

  const handleSaved = () => {
    setSelectedPlot(null);
    refreshList();
  };

  return (
    <div className="p-6 space-y-8">
      <PlotsForm selected={selectedPlot} onSaved={handleSaved} />
      <PlotsList onEdit={handleEdit} refreshKey={refreshKey} />
    </div>
  );
}
