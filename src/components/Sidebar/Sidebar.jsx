import { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaTree, FaBuilding } from "react-icons/fa";
import { BsPeopleFill } from "react-icons/bs";
import { MdMenuOpen, MdOutlineMenu, MdArticle } from "react-icons/md";
import { IoChevronDown, IoChevronForward } from "react-icons/io5";
import { RiRobot2Line } from "react-icons/ri";

const items = [
  { label: "HOME-PAGE", path: "/home", icon: <FaHome /> },
  { label: "ABOUT US", path: "/about", icon: <BsPeopleFill /> },
  { label: "PROJECTS", path: "/projects", icon: <FaBuilding /> },
  { label: "BLOGS", path: "/blogs", icon: <MdArticle /> },
  { label: "PROJECT TREE", path: "/project-tree", icon: <FaTree /> },
  {
    label: "GEMINI AI TOOLS",
    icon: <RiRobot2Line  />,
    children: [
      { label: "Chat", path: "/gemini-ai/chat" },
      { label: "History", path: "/gemini-ai/history" },
    ],
  },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <aside
      className={`h-full ${
        collapsed ? "w-20" : "w-64"
      } transition-all duration-300 bg-gray-800 text-white flex flex-col shadow-lg`}
    >
      {/* --- Top Section --- */}
      <div className="p-4 flex items-center justify-between border-b border-gray-700">
        {!collapsed && <h1 className="text-lg font-semibold">Admin Panel</h1>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-2xl p-2 rounded hover:bg-gray-700 transition"
        >
          {collapsed ? <MdOutlineMenu /> : <MdMenuOpen />}
        </button>
      </div>

      {/* --- Navigation --- */}
      <nav className="flex-1 overflow-auto py-2">
        <ul className="space-y-1">
          {items.map((item, idx) => {
            const hasChildren = item.children && item.children.length > 0;
            const isOpen = openMenus[item.label];

            return (
              <li key={idx}>
                {hasChildren ? (
                  <>
                    <div
                      className="flex items-center justify-between cursor-pointer px-3 py-2 hover:bg-gray-700 rounded-md"
                      onClick={() => toggleMenu(item.label)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{item.icon}</span>
                        {!collapsed && <span>{item.label}</span>}
                      </div>
                      {!collapsed && (
                        <span className="text-lg">
                          {isOpen ? <IoChevronDown /> : <IoChevronForward />}
                        </span>
                      )}
                    </div>

                    {isOpen && !collapsed && (
                      <ul className="ml-8 mt-1 space-y-1">
                        {item.children.map((child, cidx) => (
                          <li key={cidx}>
                            <Link
                              to={child.path}
                              className="block px-2 py-1 text-sm hover:bg-gray-600 rounded-md"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-700 rounded-md"
                  >
                    <span className="text-xl">{item.icon}</span>
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
