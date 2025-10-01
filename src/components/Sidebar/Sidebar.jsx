import { useState } from "react";
import { Link } from "react-router-dom";
import { FaTools, FaHome, FaTree } from "react-icons/fa";
import { RiBuilding2Fill } from "react-icons/ri";
import { BsPeopleFill } from "react-icons/bs";
import { IoIosContact } from "react-icons/io";
import { MdMenuOpen, MdOutlineMenu } from "react-icons/md";
import { IoChevronDown, IoChevronForward } from "react-icons/io5";

const items = [
  { label: "HOME-PAGE", path: "/home", icon: <FaHome /> },
  { label: "ABOUT US", path: "/about", icon: <BsPeopleFill /> },
  {
    label: "PROJECT",
    icon: <RiBuilding2Fill />,
    children: [
      { label: "COMMERCIAL", path: "/projects/commercial" },
      { label: "RESIDENTIAL", path: "/projects/residential" },
      { label: "PLOTS", path: "/projects/plots" },
    ],
  },
  { label: "TESTIMONIALS", path: "/testimonials", icon: <IoIosContact /> },
  { label: "PROJECT TREE", path: "/project-tree", icon: <FaTree /> },
  { label: "GEMINI AI TOOLS", path: "/gemini-ai", icon: <FaTools /> },
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
      } transition-all duration-300 bg-gray-800 text-white flex flex-col`}
    >
      {/* --- Top Section --- */}
      <div className="p-4 flex items-center justify-between">
        {!collapsed && <h1 className="text-xl font-bold">Admin Panel</h1>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-2xl p-2 rounded transition-all duration-200"
        >
          {collapsed ? <MdOutlineMenu /> : <MdMenuOpen />}
        </button>
      </div>

      {/* --- Navigation --- */}
      <nav className="flex-1 overflow-auto">
        <ul>
          {items.map((item, idx) => {
            const hasChildren = item.children && item.children.length > 0;
            const isOpen = openMenus[item.label];

            return (
              <li key={idx} className="px-2 py-2 hover:bg-gray-700 rounded">
                {hasChildren ? (
                  <div
                    className="flex items-center justify-between cursor-pointer px-2"
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
                ) : (
                  <Link
                    to={item.path}
                    className="flex items-center gap-3 px-2 py-2 hover:bg-gray-700 rounded"
                  >
                    <span className="text-xl">{item.icon}</span>
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                )}

                {hasChildren && isOpen && !collapsed && (
                  <ul className="ml-8 mt-1 space-y-1">
                    {item.children.map((child, cidx) => (
                      <li key={cidx}>
                        <Link
                          to={child.path}
                          className="block px-2 py-1 hover:bg-gray-600 rounded"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
