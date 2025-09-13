import React, { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import axios from "axios";

const Items = () => {
  const collectionID = localStorage.getItem("collectionID");
  const [collectionName, setCollectionName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemStock, setItemStock] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [itemImages, setItemImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [discountedPrice, setDiscountedPrice] = useState();

  // Fetch collection details
  const getCollection = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:8000/collection/singleCollection",
        { id: collectionID }
      );
      setCollectionName(data.name);
      setItems(data.items);
      console.log(data.items);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteItem = async (itemID) => {
    try {
      await axios.post(
        "http://localhost:8000/items/removeItem",
        {
          itemID: itemID,
        }
      );
      alert("Item deleted successfully!");
      setItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item. Please try again.");
    }
  };

  const handleFileSelection = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleImageUpload = async () => {
    setLoading(true);
    if (selectedFiles.length === 0) {
      alert("Please select images to upload.");
      setLoading(false);
      return;
    }

    const uploadedImages = [];
    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ml_default");

      try {
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/ddj39krrq/image/upload",
          formData
        );
        uploadedImages.push(response.data.secure_url);
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Error uploading one or more images. Please try again.");
      }
    }

    setItemImages((prevImages) => [...prevImages, ...uploadedImages]);
    setLoading(false);
    alert("Images uploaded successfully!");
  };

  const handleAddItem = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/items/newItem",
        {
          name: itemName,
          price: itemPrice,
          stock: itemStock,
          images: itemImages,
          discountedPrice: discountedPrice,
          collectionID,
        }
      );
      alert("Item added successfully!");
      setIsModalOpen(false);
      setItems((prevItems) => [...prevItems, response.data]);
      setItemName("");
      setItemPrice("");
      setItemStock("");
      setItemImages([]);
      setSelectedFiles([]);
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Failed to add item. Please try again.");
    }
  };

  useEffect(() => {
    getCollection();
  }, []);

  return (
    <>
      <Dashboard />
      <div className="text-center mt-8">
        <h1 className="text-3xl font-bold">{collectionName}</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded shadow hover:bg-blue-600 transition duration-200"
        >
          Add New Item
        </button>
      </div>

      {/* Items Display */}
      <div className="mt-8 p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-lg shadow-lg p-4 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {item.name}
              </h2>
              <p className="text-gray-600">Price: ₹{item.price}</p>
              <p className="text-gray-600">
                Discounted Price: ₹{item.discountedPrice}
              </p>
              <p className="text-gray-600">Stock: {item.stock}</p>
            </div>
            <div className="mt-4 relative">
              <div className="relative overflow-hidden rounded-lg">
                <div className="flex space-x-2 overflow-x-auto">
                  {item.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Item ${index + 1}`}
                      className="w-32 h-32 object-cover rounded-md hover:scale-105 transition-transform duration-200"
                    />
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={() => handleDeleteItem(item._id)}
              className="mt-4 px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition duration-200"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
              Add New Item
            </h2>
            <input
              type="text"
              placeholder="Enter item name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Enter item price"
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Enter discounted price"
              value={discountedPrice}
              onChange={(e) => setDiscountedPrice(e.target.value)}
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Enter item stock"
              value={itemStock}
              onChange={(e) => setItemStock(e.target.value)}
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="file"
              multiple
              onChange={handleFileSelection}
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleImageUpload}
              className="px-4 py-2 mb-4 bg-purple-500 text-white rounded shadow hover:bg-purple-600 transition duration-200 w-full"
            >
              {loading ? "Uploading..." : "Upload Images"}
            </button>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleAddItem}
                className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 transition duration-200"
              >
                Submit
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600 transition duration-200"
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

export default Items;
