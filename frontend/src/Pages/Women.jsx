import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import handBag from "../assets/women/handBag.png";
import { CiShoppingCart } from "react-icons/ci";
import { PiSpinnerGapLight } from "react-icons/pi";
import cart from "../assets/women/shopping-cart.gif";
import cart2 from "../assets/women/shoppingcarttwo.gif";
import { BsCart } from "react-icons/bs";
import Select from "react-select";

const Women = () => {
  const [collections, setCollections] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [secondLoading, setSecondLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false); // State for login modal
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCollections = collections.map((collection) => ({
    ...collection,
    items: collection.items.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  }));

  useEffect(() => {
    const fetchCollections = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "http://localhost:8000/collection/allCollection"
        );
        setCollections(res.data.data);
        setLoading(false);
        console.log(res.data.data);
      } catch (err) {
        console.error("Error fetching collections:", err);
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  const handleCart = async (product) => {
    setSecondLoading(true);
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setShowLoginModal(true);
      setSecondLoading(false);
      return;
    }

    try {
      const payload = {
        userID: userId,
        name: product.name,
        price: product.price,
        quantity: 1,
        images: product.images,
        size: product.size || "default",
      };

      const response = await axios.post(
        "http://localhost:5000/cart/addItem",
        payload
      );

      if (response.status === 200) {
        setSecondLoading(false);
        setModalMessage(`${product.name} has been added to your cart!`);
        setModalVisible(true);
        setTimeout(() => setModalVisible(false), 3000); // Auto-hide modal after 3 seconds
      } else {
        alert("Failed to add the product to your cart. Please try again.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("An error occurred while adding the product to your cart.");
      setSecondLoading(false);
    }
  };

  return (
    <>
      <Header onSearch={setSearchTerm} />
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <PiSpinnerGapLight size={50} className="animate-spin mt-[200px]" />
        </div>
      ) : (
        <div>
          {/* Loader for Add to Cart */}
          {secondLoading && (
            <div className="fixed inset-0 flex justify-center items-center bg-slate-200 bg-opacity-75 z-50">
              <PiSpinnerGapLight
                size={60}
                className="animate-spin text-gray-800"
              />
            </div>
          )}

          {/* Main Content */}
          <div className="relative lg:h-[400px] h-[200px] flex lg:justify-center lg:items-center p-2">
            <img
              className="lg:h-[300px] h-[100px] mt-[20px] object-cover"
              src={handBag}
              alt="Handbag"
            />
          </div>

          <div className="sm:mt-[75px] flex justify-center items-center font-bold text-[50px] sm:text-[90px]">
            <h1>Our Products</h1>
          </div>

          <div className="flex flex-col gap-12 mt-12 px-6 py-2">
            {filteredCollections.map((collection) => (
              <div key={collection._id} className="space-y-6">
                <h2 className="text-3xl font-bold text-center">
                  {collection.name}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {collection.items.map((item) => (
                    <div
                      key={item._id}
                      className="border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col"
                    >
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="h-[500px] w-full object-cover"
                      />
                      <div className="p-4 flex flex-col justify-between flex-grow">
                        <div>
                          <Link
                            to={`/product/${item._id}`}
                            state={{ item }}
                            className="text-lg font-semibold text-blue-600 hover:underline"
                          >
                            {item.name}
                          </Link>
                          {item.price ? (
                            <p className="text-gray-500 text-sm mt-1 line-through">
                              ₹{item.price}
                            </p>
                          ) : null}
                          {item.discountedPrice ? (
                            <p className="text-gray-500 text-sm mt-1  ">
                              ₹{item.discountedPrice}
                            </p>
                          ) : null}
                        </div>
                        <div className="flex gap-2 items-center justify-start mt-4 group relative">
                          <span className="text-lg font-medium text-gray-700">
                            Add to Cart
                          </span>
                          <div
                            className="relative w-10 h-10 rounded-lg p-2 transition-all duration-300 transform cursor-pointer hover:bg-transparent"
                            onClick={() => handleCart(item)}
                          >
                            {/* Default Cart Icon */}
                            <BsCart
                              size={30}
                              className="text-gray-600 translate-x-2 translate-y-1 group-hover:opacity-0 absolute inset-0 transition-opacity duration-300"
                            />

                            {/* Hover Image */}
                            <img
                              src={cart2}
                              alt="Cart Icon Hover"
                              className="opacity-0 group-hover:opacity-100 absolute inset-0 transition-opacity duration-300"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-semibold mb-4">
              Please log in to add items to your cart
            </h2>
            <div className="space-y-4">
              <button
                onClick={() => setShowLoginModal(false)}
                className="px-6 py-2 mr-5 transition-all duration-300 bg-gray-200 rounded hover:bg-gray-300"
              >
                Close
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-2 bg-black text-white rounded transition-all duration-300 hover:bg-gray-800"
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      )}

      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="flex justify-center mb-5">
              <img className=" size-20" src={cart} />
            </div>
            <h2 className="text-lg font-semibold mb-4">{modalMessage}</h2>
            <div className="space-y-4">
              <button
                onClick={() => setModalVisible(false)}
                className="px-6 py-2 mr-5 transition-all duration-300 bg-gray-200 rounded hover:bg-gray-300"
              >
                Close
              </button>
              <button
                onClick={() => navigate("/cart")}
                className="px-6 py-2 bg-black text-white rounded transition-all duration-300 hover:bg-gray-800"
              >
                Check Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Women;
