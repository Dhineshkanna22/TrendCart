import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCcMastercard, FaCcVisa } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
import axios from "axios";
import { FaArrowTurnDown } from "react-icons/fa6";
import cart from "../assets/women/shopping-cart.gif";
const Details = () => {
  const { state } = useLocation();
  const { item } = state;
  const [product, setProduct] = useState(null); // Initialize as null
  const [mainImage, setMainImage] = useState(null); // For main image preview
  const [selectedSize, setSelectedSize] = useState(""); // State for selected size
  const [showSizeWarning, setShowSizeWarning] = useState(false); // State for size warning
  const [showLoginModal, setShowLoginModal] = useState(false); // State for login modal
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const sizeAvailability = {
    XS: 1,
    S: 9,
    M: 9,
    L: 9,
    XL: 9,
  }; // Mock data for size availability

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await axios.post(
          "http://localhost:8000/items/singleItem",
          { id: item._id } // Sending item._id in the request body
        );
        setProduct(res.data.item); // Assuming the API returns product in `res.data.item`
        console.log("SINGLE PRODUCT DETAIL : ", res);
        setMainImage(res.data.item?.images[0]); // Set the first image as the default main image
      } catch (err) {
        console.error("Error fetching product details:", err);
      }
    };

    fetchProductDetails();
  }, [item._id]);

  const handleAddToCart = () => {

    const userId = localStorage.getItem("userId");
    if (!userId) {
      setShowLoginModal(true); // Show the login modal
      return;
    }

    const payload = {
      userID: userId,
      name: product.name,
      price: product.price,
      quantity: 1,
      images: product.images,
      size: selectedSize,
    };
    setLoading(true);
    axios
      .post("http://localhost:5000/cart/addItem", payload)
      .then(() => {
        setModalMessage(`${product.name} has been added to your cart!`);
        setModalVisible(true);
        setTimeout(() => setModalVisible(false), 3000);
      });
    setLoading(false);
  };

  // Render a loading state until the product data is available
  if (!product) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Loading product details...</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="bg-gray-50 min-h-screen p-4 sm:p-10">
        {/* Main Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 sm:p-12 shadow-lg rounded-lg">
          {/* Product Images */}
          <div className="flex flex-col">
            <img
              src={mainImage}
              alt="Selected Product"
              className="w-full h-[500px] object-cover rounded-lg shadow-md transition-all duration-300 hover:scale-105"
            />
            <div className="flex mt-4 overflow-x-auto space-x-2">
              {product.images &&
                product.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Thumbnail ${index}`}
                    className={`w-24 h-24 object-cover rounded-lg cursor-pointer border-2 transition duration-200 hover:border-gray-800 ${
                      mainImage === img ? "border-gray-800" : "border-gray-300"
                    }`}
                    onClick={() => setMainImage(img)}
                  />
                ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              {product.name}
            </h1>
            <p className="text-gray-600 mb-4">{product.description}</p>

            {/* Price Section */}
            <div className="mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-gray-800">
                  ₹{product.discountedPrice}
                </span>
                {product.price && (
                  <>
                    <span className="text-lg text-gray-500 line-through">
                      ₹{product.price}
                    </span>
                    <span className="text-sm font-bold text-red-600">
                      {Math.round(
                        ((product.price - product.discountedPrice) /
                          product.price) *
                          100
                      )}
                      % OFF
                    </span>
                  </>
                )}
              </div>
              <span className="text-sm text-green-600 mt-2">
                Limited time deal!
              </span>
            </div>

            {/* Buttons */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-black text-white py-3 rounded-lg text-lg font-semibold mb-4 hover:bg-gray-800 transition"
            >
              {loading ? (
                <ImSpinner8 className="animate-spin place-self-center" />
              ) : (
                "Add to Cart"
              )}
            </button>
            <button
              onClick={handleAddToCart}
              className="w-full border border-gray-800 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition"
            >
              {loading ? (
                <ImSpinner8 className="animate-spin place-self-center" />
              ) : (
                "Buy Now"
              )}
            </button>

            {/* Payment Methods */}
            <div className="flex items-center space-x-4 mt-6">
              <span className="text-gray-700">We accept:</span>
              <FaCcMastercard size={40} className="text-red-600" />
              <FaCcVisa size={40} className="text-blue-600" />
            </div>

            {/* Return Policy */}
            <div className="text-sm text-gray-500 mt-6">
              <p>
                15 days free returns. Read more about our return and refund
                policy.
              </p>
              <p>Delivery available within 2-5 business days.</p>
            </div>
          </div>
        </div>

        {/* Login Modal */}
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
      </div>
    </>
  );
};

export default Details;
