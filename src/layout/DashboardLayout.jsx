import React, { useState, useContext } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Make sure this path is correct
import {
  FiGrid,
  FiPackage,
  FiUsers,
  FiShoppingCart,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const NavItem = ({ to, icon, children }) => (
    <NavLink
      to={to}
      // Close sidebar on mobile when a link is clicked
      onClick={() => setIsSidebarOpen(false)}
      className={({ isActive }) =>
        `flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${
          isActive
            ? "bg-indigo-600 text-white shadow-lg"
            : "text-gray-400 hover:bg-gray-700 hover:text-white"
        }`
      }
    >
      {icon}
      <span className="mx-4 font-medium">{children}</span>
    </NavLink>
  );

  return (
    <div className="relative min-h-screen bg-slate-100 md:flex">
      {/* Mobile Header */}
      <header className="bg-gray-900 text-gray-100 flex justify-between md:hidden">
        <Link to="/dashboard" className="block p-4 text-white font-bold">
          ERP Admin
        </Link>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-4 focus:outline-none focus:bg-gray-800"
          aria-label="Open sidebar"
        >
          {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={`bg-gray-900 text-white w-64 fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-30 flex flex-col`}
      >
        <div className="flex items-center justify-center p-6 border-b border-gray-700">
          <span className="text-2xl font-extrabold text-white">ERP Admin</span>
        </div>

        <nav className="flex-1 px-4 py-6">
          <NavItem to="/dashboard" icon={<FiGrid size={20} />}>
            Dashboard
          </NavItem>
          <NavItem to="/products" icon={<FiPackage size={20} />}>
            Products
          </NavItem>
          <NavItem to="/customers" icon={<FiUsers size={20} />}>
            Customers
          </NavItem>
          <NavItem to="/sales" icon={<FiShoppingCart size={20} />}>
            Sales
          </NavItem>
        </nav>

        {/* User Profile / Logout */}
        <div className="px-4 py-6 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center p-3 rounded-lg text-gray-400 hover:bg-red-600 hover:text-white transition-colors duration-200"
          >
            <FiLogOut size={20} />
            <span className="mx-4 font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
