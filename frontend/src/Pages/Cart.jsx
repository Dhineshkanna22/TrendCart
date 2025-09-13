import React, { useState } from "react";
import Header from "../components/Header";
import one from "../assets/women/one.png";
import { FaCcMastercard, FaCcVisa } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { PiLock, PiSpinnerGapLight } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import Razorpay from "razorpay";

const Cart = () => {
  const userId = localStorage.getItem("userId");
  const [user, setUser] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [products, setProducts] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [loading, setLoading] = useState(null);
  const navigate = useNavigate();
  const [totalAmount, setTotalAmount] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [cartId, setCartID] = useState(null);

  const handleAddressSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/user/addAdress",
        {
          userId: userId,
          adress: newAddress,
        }
      );
      if (response.status === 200) {
        user.adress = newAddress; // Update the user address locally
        setIsPopupOpen(false); // Close the popup
        handleCheckout(); // Retry checkout
      } else {
        alert("Failed to add address. Please try again.");
      }
    } catch (error) {
      console.error("Error adding address:", error);
      alert("An error occurred while adding the address.");
    }
  };

  const handleOrder = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/order/addOrder",
        {
          userId: userId,
          totalPrice: totalValue,
          items: products,
        }
      );
      console.log("PRODUCTS BACKEND : ",totalAmount)
    } catch (error) {
      console.error("Error adding address:", error);
      alert("An error occurred while adding the address.");
    }
  };

  const fetchCollections = async () => {
  setLoading(true);
  try {
    const res = await axios.post("http://localhost:5000/user/singleUser", { userId });
    const cartWithQuantities = res.data.cart.map(item => ({
      ...item,
      quantity: item.quantity || 1
    }));
    setUser(res.data);
    setProducts(cartWithQuantities);

    const total = cartWithQuantities.reduce(
      (acc, product) => acc + (product.price * product.quantity),
      0
    );
    setTotalValue(total);
    setLoading(false);
  } catch (err) {
    console.error("Error fetching collections:", err);
  }
};

  const updateQuantity = async (id, newQuantity) => {
  setLoading(true);
  try {
    const { data } = await axios.post("http://localhost:5000/cart/updateQuantity", {
      userId,
      itemId: id,
      quantity: newQuantity,
    });
    if (data.success) {
      fetchCollections()
      setProducts(prev =>
        prev.map(item =>
          item._id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};


  const handleDel = async (id) => {
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/cart/removeItem", {
        cartID: id,
        userId: userId,
      });
      fetchCollections();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleCheckout = async () => {
    if (!user.adress) {
      // If address is missing, show the popup
      setIsPopupOpen(true);
      return;
    }

    const amount = quantity * totalValue + 149; // Total amount including delivery
    setTotalAmount(amount * quantity);
    const options = {
      key: "rzp_test_ocDqI1oN10flt3", // Replace with your Razorpay Key ID
      amount: amount*100, // Amount in paise (50000 paise = ₹500)
      currency: "INR",
      name: "TrendCart",
      description: "Payment for your carpool ride",
      image: "https://images.pexels.com/photos/430205/pexels-photo-430205.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Add your logo URL
      handler: function (response) {
        alert(`Payment Successful! Payment ID: ${ + response.razorpay_payment_id}
          Amount : ${amount}
          Currency : INR`);
        console.log(response);
        handleOrder();
      },
      prefill: {
        name: "John Doe", // Prefill user details
        email: "johndoe@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#0d6efd", // Change to match your theme
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

    rzp.on("payment.failed", (response) => {
      // Handle payment failure
      alert("Payment Failed. Please try again.");
      console.error("Payment Failed:", response.error);
    });
  };

  return (
    <>
      <Header />
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <PiSpinnerGapLight size={50} className="animate-spin mt-[200px]" />
        </div>
      ) : products.length == 0 ? (
        <div className="text-center">
          <h1 className="text-center font-bold text-[20px] mt-[100px]">
            Nothing has been added!!
          </h1>
          <button
            onClick={() => navigate("/women")}
            className="px-6 py-2 self-center text-black border-black border mt-5 rounded transition-all duration-300 hover:bg-gray-800 hover:text-white hover:scale-110"
          >
            Shop Now
          </button>
        </div>
      ) : (
        <div className="flex flex-col bg-gray-100 pb-4">
          <div className="flex flex-col w-full sm:w-[1200px] mx-auto">
            {products.map((item) => (
              <div
                key={item._id}
                className="bg-white flex flex-col sm:flex-row gap-4 p-4 sm:my-8 border rounded-lg shadow-lg"
              >
                <img
                  className="h-40 w-auto sm:h-60 mx-auto sm:mx-0"
                  src={item.images[0]}
                  alt={item.name}
                />
                <div className="flex flex-col justify-between sm:flex-1">
                  <Link
                    className="hover:underline text-lg font-semibold"
                    to={`/product/${item._id}`}
                    state={{ item }}
                  >
                    {item.name}
                  </Link>
                  <p className="text-gray-600 text-sm mt-2">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex flex-col">
                      <span className="text-green-600">In stock</span>
                      <span className="text-gray-500 text-sm">
                        Eligible for free shipping
                      </span>
                     <select
  value={item.quantity}
  onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
  className="outline-none bg-gray-200 p-2 rounded-lg mt-2"
>
  {[1,2,3,4,5].map(num => (
    <option key={num} value={num}>{num}</option>
  ))}
</select>
                      <p className="text-gray-600 text-xl mt-2">
                        Size: {item.size}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div>
                        <button
                          onClick={() => handleDel(item._id)}
                          className="bg-red-600 mb-5 sm:mb-0 transition-all duration-300 hover:text-black sm:-translate-y-20 p-2 hover:bg-red-400 rounded-lg text-white"
                        >
                          <MdDelete size={30} />
                        </button>
                      </div>
                      <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                        16% Off
                      </span>
                      <span className="text-red-600 font-bold">
                        Limited time deal
                      </span>
                      <span className="text-2xl font-mono mt-2">
  ₹{item.quantity * item.price}
</span>
                      <span className="text-gray-500 line-through">{item.price}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white w-full sm:w-[1200px] mx-auto p-6 border rounded-lg shadow-lg mt-10">
            {/* <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Discounts</span>
            <button className="text-blue-500">Apply discount</button>
          </div> */}

            {/* <div className="mb-4">
            <span className="text-lg font-semibold">
              Sign in to use your personal offers!
            </span>
            <button className="w-full mt-2 py-2 bg-gray-200 text-black rounded-lg">
              Sign in
            </button>
          </div> */}
            <div className="mb-4">
              <div className="flex justify-between text-xl">
                <span>Order value</span>
                <span>₹{quantity * totalValue}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>₹149</span>
              </div>
              <div className="border-t mt-2"></div>
              <div className="flex justify-between mt-2 font-semibold">
                <span>Total</span>
                <span>₹{quantity * totalValue + 149}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full py-3 bg-black text-white font-semibold rounded-lg mb-4"
            >
              Continue to checkout
            </button>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm">We accept</span>
              <div className="flex space-x-2">
                <FaCcMastercard size={32} />
                <FaCcVisa size={32} />
              </div>
            </div>
            <div className="text-xs text-gray-600 mb-4">
              <p>
                Prices and delivery costs are not confirmed until you’ve reached
                the checkout.
              </p>
              <p>
                15 days free returns. Read more about return and refund policy.
              </p>
              <p>
                Customers would receive an SMS/WhatsApp notifications regarding
                deliveries on the registered phone number.
              </p>
            </div>
            <div className="flex items-center text-sm text-blue-500">
              <span>Delivery and return options</span>
              <svg
                className="h-4 ml-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 15l7-7 7 7"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      )}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Enter Your Address
            </h3>
            <input
              type="text"
              placeholder="Enter your address & pincode"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-between">
              <button
                onClick={handleAddressSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
              >
                Submit
              </button>
              <button
                onClick={() => setIsPopupOpen(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
