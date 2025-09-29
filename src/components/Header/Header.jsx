import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoSearch, IoCartOutline } from 'react-icons/io5';
import { MdOutlineLightMode, MdOutlineMailOutline } from 'react-icons/md';
import { FaRegBell } from 'react-icons/fa';

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mailOpen, setMailOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setDropdownOpen(false);      
    navigate('/signin', { replace: true });   
  };

  const toggleMail = () => {
    setMailOpen(prev => !prev);
    setNotificationsOpen(false);
    setDropdownOpen(false);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(prev => !prev);
    setMailOpen(false);
    setDropdownOpen(false);
  };

  const toggleUserDropdown = () => {
    setDropdownOpen(prev => !prev);
    setMailOpen(false);
    setNotificationsOpen(false);
  };

  return (
    <header className="flex items-center justify-between bg-white px-6 py-3 shadow">
      {/* Left side: Logo + Search */}
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/Logo/shilp-logo.svg" alt="Shilp Logo" className="h-12 w-12" />
        </Link>
        <div className="flex items-center border rounded px-3 py-1 bg-gray-50">
          <IoSearch className="text-gray-500 text-xl" />
          <input
            type="text"
            placeholder="Search here..."
            className="ml-2 bg-transparent outline-none"
          />
        </div>
      </div>

      {/* Right side: Icons + User Dropdown */}
      <div className="flex items-center gap-3 relative">
        {/* <button className="text-2xl p-2 rounded hover:bg-gray-200">
          <MdOutlineLightMode />
        </button>
        <button className="text-2xl p-2 rounded hover:bg-gray-200">
          <IoCartOutline />
        </button> */}

        {/* Mail Dropdown */}
        <div className="relative">
          <button onClick={toggleMail} className="text-2xl p-2 rounded hover:bg-gray-200">
            <MdOutlineMailOutline />
          </button>
          {mailOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-lg z-10">
              <p className="px-4 py-2 font-semibold border-b">Mail</p>
              <ul className="max-h-60 overflow-y-auto">
                <li className="px-4 py-2 hover:bg-gray-100">Message 1</li>
                <li className="px-4 py-2 hover:bg-gray-100">Message 2</li>
                <li className="px-4 py-2 hover:bg-gray-100">Message 3</li>
              </ul>
              <button className="w-full text-center text-blue-500 py-2 border-t hover:bg-gray-50">
                View All
              </button>
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button onClick={toggleNotifications} className="text-2xl p-2 rounded hover:bg-gray-200">
            <FaRegBell />
          </button>
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-lg z-10">
              <p className="px-4 py-2 font-semibold border-b">Notifications</p>
              <ul className="max-h-60 overflow-y-auto">
                <li className="px-4 py-2 hover:bg-gray-100">Notification 1</li>
                <li className="px-4 py-2 hover:bg-gray-100">Notification 2</li>
                <li className="px-4 py-2 hover:bg-gray-100">Notification 3</li>
              </ul>
              <button className="w-full text-center text-blue-500 py-2 border-t hover:bg-gray-50">
                View All
              </button>
            </div>
          )}
        </div>

        {/* User Dropdown */}
        <div className="relative">
          <button onClick={toggleUserDropdown} className="flex items-center gap-2">
            <img src="/Logo/shilp-logo.svg" alt="User" className="w-10 h-10 rounded-full border" />
            <div className="flex flex-col items-start">
              <span className="text-sm font-semibold">Shilp</span>
              <span className="text-xs text-gray-500">@shilp12</span>
            </div>
          </button>
          {dropdownOpen && (
  <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
    <Link to="/account" className="block px-4 py-2 hover:bg-gray-100">My Account</Link>
    <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100">Settings</Link>
    <button
      onClick={handleLogout}
      className="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100"
    >
      Logout
    </button>
  </div>
)}
        </div>
      </div>
    </header>
  );
}
