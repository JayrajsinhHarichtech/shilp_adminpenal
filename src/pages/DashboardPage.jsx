import React from "react";
import Dashboard from "../components/dashboard/Dashboard";

const DashboardPage = () => {
  return (
    <div className="page-content p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
      <Dashboard />
    </div>
  );
};

export default DashboardPage;