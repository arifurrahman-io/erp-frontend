import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Assuming you have this

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  // const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    // logout();
    navigate("/login");
  };

  return (
    <div className="relative min-h-screen md:flex">
      {/* Mobile Menu Button */}
      <div className="bg-gray-800 text-gray-100 flex justify-between md:hidden">
        <Link to="/dashboard" className="block p-4 text-white font-bold">
          ERP Admin
        </Link>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-4 focus:outline-none focus:bg-gray-700"
        >
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition duration-200 ease-in-out z-20`}
      >
        <Link
          to="/dashboard"
          className="text-white flex items-center space-x-2 px-4"
        >
          <span className="text-2xl font-extrabold">ERP Admin</span>
        </Link>

        <nav>
          <Link
            to="/dashboard"
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
          >
            Dashboard
          </Link>
          <Link
            to="/products"
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
          >
            Products
          </Link>
          <Link
            to="/customers"
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
          >
            Customers
          </Link>
          <Link
            to="/sales"
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
          >
            Sales
          </Link>
        </nav>

        <div className="absolute bottom-0 w-full p-4">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
