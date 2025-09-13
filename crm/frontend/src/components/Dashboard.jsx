import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <header className="bg-gradient-to-r from-green-500 to-emerald-600 w-full h-[100px] flex items-center justify-between px-10 shadow-lg">
      {/* Title Section */}
      <h1 className="text-white font-extrabold text-3xl tracking-wide">
        Admin Dashboard
      </h1>

      {/* Navigation Section */}
      <nav className="flex items-center gap-8">
        <Link
          to="/"
          className="text-white text-lg font-medium hover:text-gray-200 transition duration-300"
        >
          Collections
        </Link>
        <Link
          to="/users"
          className="text-white text-lg font-medium hover:text-gray-200 transition duration-300"
        >
          Users
        </Link>
        <Link
          to="/orders"
          className="text-white text-lg font-medium hover:text-gray-200 transition duration-300"
        >
          Orders
        </Link>
      </nav>
    </header>
  );
};

export default Dashboard;
