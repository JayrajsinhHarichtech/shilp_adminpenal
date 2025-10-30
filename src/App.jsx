import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import Dashboard from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./app/signin/page";
import Profile from "./pages/profile";
import MyAccount from "./pages/myaccount";
import Settings from "./pages/setting";
// import TestimonialsPage from "./pages/TestimonialsPage";
import ProjectTreePage from "./pages/ProjectTreePage";
import GeminiChatPage from "./components/gemini/GeminiChatPage";
import AiHistoryPage from "./components/gemini/AiHistoryPage";
import { UserProvider } from "./context/UserContext";
import Blogs from "./pages/blogspage";
import ProjectPage from "./pages/projectpage";
import Projects from "./pages/projectpage";

const ProtectedLayout = ({ collapsed, setCollapsed }) => (
  <div className="flex h-screen bg-gray-100">
    <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header />
      <div className="flex-1 overflow-auto p-6">
        <Outlet />
      </div>
    </div>
  </div>
);

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(Boolean(token));
  }, []);

  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Login Route */}
          <Route
            path="/signin"
            element={
              isLoggedIn ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <LoginPage onLogin={() => setIsLoggedIn(true)} />
              )
            }
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <ProtectedLayout collapsed={collapsed} setCollapsed={setCollapsed} />
              ) : (
                <Navigate to="/signin" replace />
              )
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="home" element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="profile" element={<Profile />} />
            <Route path="account" element={<MyAccount />} />
            <Route path="settings" element={<Settings />} />
            <Route path="projects" element={<ProjectPage />} />
            <Route path="blogs" element={<Blogs />} />
             <Route path="/projects/:category/:slug" element={<Projects />} />
            {/* <Route path="testimonials" element={<TestimonialsPage />} /> */}
            <Route path="project-tree" element={<ProjectTreePage />} />
            <Route path="gemini-ai/chat" element={<GeminiChatPage />} />
            <Route path="gemini-ai/history" element={<AiHistoryPage />} />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
