import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaTree, FaBuilding, FaChartBar, FaCog } from "react-icons/fa";
import { BsPeopleFill, BsGrid1X2Fill } from "react-icons/bs";
import { MdArticle } from "react-icons/md";
import { IoChevronDown } from "react-icons/io5";
import { RiRobot2Line } from "react-icons/ri";
import { HiMenu, HiX } from "react-icons/hi";

const menuItems = [
  { label: "Home Page", path: "/home", icon: <FaHome /> },
  { label: "About Us", path: "/about", icon: <BsPeopleFill /> },
  {
    label: "Projects",
    icon: <FaBuilding />,
    children: [
      { label: "Plot", path: "/projects/plot" },
      { label: "Commercial", path: "/projects/commercial" },
      { label: "Residential", path: "/projects/residential" },
    ],
  },
  { label: "Blogs", path: "/blogs", icon: <MdArticle /> },
  { label: "Project Tree", path: "/project-tree", icon: <FaTree /> },
  {
    label: "AI Assistant",
    icon: <RiRobot2Line />,
    children: [
      { label: "Chat Assistant", path: "/gemini-ai/chat" },
      { label: "Chat History", path: "/gemini-ai/history" },
    ],
  },
  { label: "Analytics", path: "/analytics", icon: <FaChartBar /> },
  { label: "Settings", path: "/settings", icon: <FaCog /> },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const [openMenus, setOpenMenus] = useState({});
  const location = useLocation();

  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const isParentActive = (children) => {
    return children?.some(child => location.pathname === child.path);
  };

  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-64"
      } h-full bg-black border-r border-gray-800 transition-all duration-300 flex flex-col shadow-lg`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BsGrid1X2Fill className="text-white text-sm" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">Admin Panel</h1>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            {collapsed ? <HiMenu className="text-lg" /> : <HiX className="text-lg" />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-auto">
        <ul className="space-y-2">
          {menuItems.map((item, idx) => {
            const hasChildren = item.children && item.children.length > 0;
            const isOpen = openMenus[item.label];
            const isActive = hasChildren ? isParentActive(item.children) : isActiveRoute(item.path);

            return (
              <li key={idx}>
                {hasChildren ? (
                  <div>
                    <button
                      onClick={() => toggleMenu(item.label)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                        isActive 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{item.icon}</span>
                        {!collapsed && <span className="font-medium">{item.label}</span>}
                      </div>
                      {!collapsed && (
                        <IoChevronDown 
                          className={`text-sm transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                        />
                      )}
                    </button>

                    {isOpen && !collapsed && (
                      <ul className="mt-2 ml-6 space-y-1 border-l border-gray-700 pl-4">
                        {item.children.map((child, cidx) => (
                          <li key={cidx}>
                            <Link
                              to={child.path}
                              className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                                isActiveRoute(child.path)
                                  ? 'bg-blue-600 text-white'
                                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                              }`}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {!collapsed && <span className="font-medium">{item.label}</span>}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-800">
          <div className="text-center">
            <p className="text-xs text-gray-500">© 2025 Admin Panel</p>
            <p className="text-xs text-gray-600">Version 1.0</p>
          </div>
        </div>
      )}
    </aside>
  );
}
