import React, { useState } from "react";
import model from "../assets/women/photo.png";
import { Link } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { IoCartOutline } from "react-icons/io5";
import { HiMenu } from "react-icons/hi";
import { IoClose } from "react-icons/io5";

const Landing = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="h-screen relative flex overflow-hidden">
      {/* Centered Model Image */}
      <img
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/3 z-50 bottom-0 h-auto max-h-[80vh] lg:mt-20 mt-40"
        src={model}
        alt="Model"
      />

      <div className="absolute ml-10 mt-5 sm:hidden">
        <HiMenu
          size={30}
          className="cursor-pointer"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        />
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 shadow-lg">
          <div className="flex justify-between items-center p-4 border-b border-gray-300">
            <h2 className="text-xl font-semibold">Menu</h2>
            <IoClose
              size={30}
              className="cursor-pointer"
              onClick={() => setIsMenuOpen(false)}
            />
          </div>
          <nav className="mt-4">
            <Link
              className="block py-4 px-6 text-lg text-gray-700 hover:bg-gray-100 transition duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              className="block py-4 px-6 text-lg text-gray-700 hover:bg-gray-100 transition duration-200"
              onClick={() => setIsMenuOpen(false)}
              to="/shop"
            >
              Shop
            </Link>
            <Link
              className="block py-4 px-6 text-lg text-gray-700 hover:bg-gray-100 transition duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </Link>
            <a
              href="https://priyachandilaportfolio.vercel.app"
              className="block py-4 px-6 text-lg text-gray-700 hover:bg-gray-100 transition duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </a>
            <Link
              className="py-4 px-6 text-lg text-gray-700 hover:bg-gray-100 transition duration-200 flex items-center"
              onClick={() => setIsMenuOpen(false)}
              to="/cart"
            >
              <IoCartOutline size={24} className="mr-2" />
              Cart
            </Link>
          </nav>
        </div>
      )}

      {/* Navbar */}
      <div className="header hidden absolute md:flex justify-evenly items-center w-full mt-[50px] text-[20px] font-serif">
        <CiSearch size={30} />
        <Link>Home</Link>
        <Link to="/shop">Shop</Link>
        <h1 className="ml-[45px] text-[25px]">Trend Cart</h1>
        <Link className="text-white">Categories</Link>
        <Link className="text-white">About</Link>
        <Link to="cart">
          <IoCartOutline size={30} />
        </Link>
      </div>

      {/* Main Content */}
      <h1 className="font-serif sm:text-[240px] text-[100px] absolute text-center sm:mx-[250px] mt-20 ">
        New Trends
      </h1>

      {/* Background Sections */}
      <div className="h-full w-[50vw] bg-white"></div>
      <div className="h-full w-[50vw] bg-[#C79F66]"></div>
    </div>
  );
};

export default Landing;
