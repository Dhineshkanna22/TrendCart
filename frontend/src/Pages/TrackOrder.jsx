import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import axios from "axios";
import { PiSpinnerGapLight } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

const TrackOrder = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [loading, setLoading] = useState(null);
  const [orders, setOrders] = useState([]);

  const fetchUserOrder = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/user/singleUser",
        { userId: userId }
      );
      setOrders(res.data.orders);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserOrder();
  }, []);

  const orderStatuses = [
    "Order Placed",
    "Processing",
    "Shipped",
    "Out for Delivery",
    "Delivered",
  ];

  return (
    <>
      <Header />
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <PiSpinnerGapLight size={50} className="animate-spin mt-[200px]" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center">
          <h1 className="text-center font-bold text-[20px] mt-[100px]">
            You haven't placed any orders!!
          </h1>
          <button
            onClick={() => navigate("/shop")}
            className="px-6 py-2 self-center text-black border-black border mt-5 rounded transition-all duration-300 hover:bg-gray-800 hover:text-white hover:scale-110"
          >
            Shop Now
          </button>
        </div>
      ) : (
        <div className="container mx-auto mt-10 p-2">
          <h1 className="text-2xl font-bold text-center mb-5">
            Track Your Orders
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((orderData, index) => {
              const order = orderData.order; // Access the nested order object
              return (
                <div
                  key={order._id}
                  className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105"
                >
                  <img
                    src={
                      order.images[0] || "https://via.placeholder.com/150" // Placeholder if no image is available
                    }
                    alt={order.name}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-5">
                    <h2 className="text-xl font-semibold mb-2">{order.name}</h2>
                    <p className="text-gray-700">Price: ₹{order.price}</p>
                    <p className="text-gray-700">Quantity: {order.quantity}</p>
                    <p className="text-gray-700">Size: {order.size}</p>
                    <p className="text-gray-700 mt-2 font-bold">
                      Total Price: ₹{orderData.totalPrice}
                    </p>
                    <div className="mt-4">
                      <span
                        className={`inline-block px-3 py-1 text-sm font-semibold text-white rounded ${
                          index % 5 === 0
                            ? "bg-green-500"
                            : index % 4 === 0
                            ? "bg-yellow-500"
                            : index % 3 === 0
                            ? "bg-blue-500"
                            : index % 2 === 0
                            ? "bg-orange-500"
                            : "bg-gray-500"
                        }`}
                      >
                        {orderStatuses[index % orderStatuses.length]}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default TrackOrder;
