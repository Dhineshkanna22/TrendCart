import React, { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import axios from "axios";

const Orders = () => {
  const [users, setUsers] = useState([]);
  const [statusUpdate, setStatusUpdate] = useState({});

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/user/alluser"
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Update order status
  const handleStatusChange = async (userId, orderId, newStatus) => {
    try {
      await axios.patch(
        `http://localhost:5000/user/${userId}/order/${orderId}`,
        { status: newStatus }
      );
      setStatusUpdate({ userId, orderId, status: newStatus });
      alert("Order status updated successfully.");
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [statusUpdate]);

  return (
    <>
      <Dashboard />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">User Orders</h1>
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">User Name</th>
                <th className="border border-gray-300 p-2">Order Details</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, userIndex) => (
                <tr key={userIndex}>
                  <td className="border border-gray-300 p-2">{user.name}</td>
                  <td className="border border-gray-300 p-2">
                    {user.orders && user.orders.length > 0 ? (
                      <table className="table-auto w-full">
                        <thead>
                          <tr>
                            <th className="border border-gray-300 p-1">Name</th>
                            <th className="border border-gray-300 p-1">
                              Price
                            </th>
                            <th className="border border-gray-300 p-1">
                              Quantity
                            </th>
                            <th className="border border-gray-300 p-1">Size</th>
                            <th className="border border-gray-300 p-1">
                              Images
                            </th>
                            <th className="border border-gray-300 p-1">
                              Total Price
                            </th>
                            <th className="border border-gray-300 p-1">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {user.orders.map((orderData, orderIndex) => {
                            const order = orderData.order;
                            return (
                              <tr key={orderIndex}>
                                <td className="border border-gray-300 p-1">
                                  {order.name}
                                </td>
                                <td className="border border-gray-300 p-1">
                                  ₹{order.price}
                                </td>
                                <td className="border border-gray-300 p-1">
                                  {order.quantity}
                                </td>
                                <td className="border border-gray-300 p-1">
                                  {order.size}
                                </td>
                                <td className="border border-gray-300 p-1">
                                  {order.images && order.images.length > 0 ? (
                                    <div className="flex gap-2">
                                      {order.images.map((img, imgIndex) => (
                                        <img
                                          key={imgIndex}
                                          src={img}
                                          alt="Order Image"
                                          className="w-16 h-16 object-cover"
                                        />
                                      ))}
                                    </div>
                                  ) : (
                                    "No Images"
                                  )}
                                </td>
                                <td className="border border-gray-300 p-1">
                                  ₹{orderData.totalPrice}
                                </td>
                                <td className="border border-gray-300 p-1">
                                  <select
                                    className="border border-gray-300 p-1 rounded"
                                    defaultValue={
                                      orderData.status || "Order Placed"
                                    }
                                    onChange={(e) =>
                                      handleStatusChange(
                                        user._id,
                                        orderData._id,
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value="Order Placed">
                                      Order Placed
                                    </option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Out for Delivery">
                                      Out for Delivery
                                    </option>
                                    <option value="Delivered">Delivered</option>
                                  </select>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    ) : (
                      "No Orders"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Orders;
