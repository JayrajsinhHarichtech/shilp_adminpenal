import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";

import Dashboard from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./app/signin/page";
import Profile from "./pages/profile";
import MyAccount from "./pages/myaccount";
import Settings from "./pages/setting";


import TestimonialsPage from "./pages/TestimonialsPage";
import ProjectTreePage from "./pages/ProjectTreePage";
import GeminiPage from "./pages/GeminiPage";
  
import CommercialPage from "./pages/CommercialPage";
import ResidentialPage from "./pages/ResidentialPage";
import PlotsForm from "./pages/PlotsPage";

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(Boolean(token));
  }, []);

  return (
    <Router>
      <Routes>
        {/* Signin Route */}
        <Route  
          path="/signin"
          element={
            isLoggedIn
              ? <Navigate to="/dashboard" replace />
              : <LoginPage onLogin={() => setIsLoggedIn(true)} />
          }
        />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            isLoggedIn ? (
              <div className="flex h-screen bg-gray-100">
                <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
                <div className="flex-1 flex flex-col overflow-hidden">
                  <Header />
                  <div className="flex-1 overflow-auto p-6">
                    <Routes>
                      {/* Basic Pages */}
                      <Route index element={<Dashboard />} />
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="home" element={<HomePage />} />
                      <Route path="about" element={<AboutPage />} />
                      <Route path="profile" element={<Profile />} />
                      <Route path="account" element={<MyAccount />} />
                      <Route path="settings" element={<Settings />} />

                      {/* Projects Subroutes */}
                      <Route path="projects/commercial" element={<CommercialPage/>} />
                      <Route path="projects/residential" element={<ResidentialPage />} />
                      <Route path="projects/plots" element={<PlotsForm/>} />

                      {/* Other Sections */}
                      <Route path="testimonials" element={<TestimonialsPage />} />
                      <Route path="project-tree" element={<ProjectTreePage />} />
                      <Route path="gemini" element={<GeminiPage />} />

                      {/* Catch-all */}
                      <Route path="*" element={<Navigate to="/dashboard" />} />
                    </Routes>
                  </div>
                </div>
              </div>
            ) : (
              <Navigate to="/signin" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
