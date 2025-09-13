import React, { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { IoCartOutline } from "react-icons/io5";
import { HiMenu } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { PiCarThin } from "react-icons/pi";
import { BiSearch } from "react-icons/bi";

const Header = ({ onSearch }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [products, setProducts] = useState([]);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCollections = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/user/singleUser",
        { userId: userId }
      );
      setProducts(res.data.cart);
    } catch (err) {
      console.error("Error fetching collections:", err);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value); // Pass the search term to the parent component
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="border-b-2 border-slate-200 flex justify-between backdrop-blur-lg items-center h-[80px] sticky top-0 z-50">
      {/* Left Navigation Links */}
      <div className="hidden md:flex justify-center items-center gap-8 ml-10 font-semibold text-[20px]">
        <Link to="/shop">Shop</Link>
        <Link to="/orders">Track Order</Link>
      </div>

      {/* Centered Heading */}
      <Link to="/" className="absolute left-1/2 transform -translate-x-1/2">
        <h1 className="font-serif text-[40px] font-bold">TrendCart</h1>
      </Link>

      <BiSearch
        onClick={() => setShowSearchBar(true)}
        size={30}
        className="sm:hidden ml-2"
      />
      {showSearchBar ? (
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search..."
          className="border shadow-lg border-gray-600 mt-2 sm:hidden bg-white z-10 max-w-full mx-2 rounded-lg p-4 fixed top-0 left-0 right-0"
          onBlur={() => setShowSearchBar(false)} // Hide the search bar when it loses focus
        />
      ) : null}

      {/* Right Icons */}
      <div className="hidden md:flex justify-center items-center gap-10 mr-10  text-[20px] font-semibold">
        {showSearchBar ? (
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search..."
            className="border border-gray-300 rounded-lg p-2"
            onBlur={() => setShowSearchBar(false)} // Hide the search bar when it loses focus
          />
        ) : (
          <CiSearch
            size={30}
            className="hover:cursor-pointer"
            onClick={() => setShowSearchBar(true)}
          />
        )}
        {userId ? (
          <button onClick={handleLogout} className="hover:underline">
            Logout
          </button>
        ) : (
          <Link to="/login">Login</Link>
        )}
        {/* Cart Icon with Hover Effect */}
        <div className="relative group">
          <IoCartOutline size={30} className="hover:cursor-pointer" />
          {/* Mini Cart Preview */}

          <div className="absolute right-0 hidden group-hover:block bg-white -translate-y-2  shadow-lg rounded-lg w-72 p-4 mt-2 overflow-y-auto">
            <div className="text-2xl mb-2 ">Your Cart</div>
            {products.length === 0 ? (
              <div>Your cart is empty</div>
            ) : (
              products.map((product, index) => (
                <div>
                  <div
                    key={index}
                    className="flex mt-5 items-center gap-2 mb-2"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="text-sm">
                      <p>{product.name}</p>
                      <p className="text-gray-500">Size : {product.size}</p>
                      <p className="font-bold">${product.price}</p>
                    </div>
                  </div>
                </div>
              ))
            )}

            <Link
              to="/cart"
              className="block hover:text-blue-950 hover:underline transition-all duration-100 text-center mt-4 text-blue-500 font-semibold"
            >
              Go to Cart
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu Icon */}
      <div className="flex md:hidden mr-4">
        <HiMenu
          size={30}
          onClick={toggleSidebar}
          className="hover:cursor-pointer ml-2"
        />
      </div>
      {/* 
      <Link to="/" className="lg:hidden flex">
        <IoCartOutline size={35} className="mr-5" />
      </Link> */}

      {/* Sidebar for Mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0">
          <div
            className="fixed top-0 left-0 w-full h-full bg-white shadow-lg flex flex-col gap-6 font-mono font-semibold text-[18px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-row justify-between">
              <p className="pt-4 pl-6 text-3xl">MENU</p>
              {/* Close Button */}
              <button
                onClick={toggleSidebar}
                className="self-end pr-6 pt-2 text-[30px] font-bold"
              >
                &times;
              </button>
            </div>

            {/* Sidebar Links */}
            <div className="flex px-10 pt-4 pb-10 flex-col gap-10 bg-white ">
              
              <Link
                to="/shop"
                onClick={toggleSidebar}
                className="hover:text-gray-600"
              >
                Shop
              </Link>
             
              <Link
                to="/orders"
                onClick={toggleSidebar}
                className="hover:text-gray-600"
              >
                Track Order
              </Link>
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    toggleSidebar();
                    handleLogout();
                  }}
                  className="hover:text-gray-600 text-left"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={toggleSidebar}
                  className="hover:text-gray-600"
                >
                  Login
                </Link>
              )}
              <Link
                to="/cart"
                onClick={toggleSidebar}
                className="hover:text-gray-600"
              >
                <div className="flex items-center gap-2">
                  <IoCartOutline size={20} />
                  Cart
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
