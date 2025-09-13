import React, { useState, useEffect } from "react";
import axios from "axios";
import Dashboard from "../components/Dashboard";
import { useNavigate } from "react-router-dom";

const Collection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const [image, setImage] = useState(null);
  const [collections, setCollections] = useState([]);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  // Fetch all collections
  const fetchCollections = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/collection/allCollection"
      );
      setCollections(response.data.data);
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  };

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async () => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "ml_default");

    try {
      setUploading(true);
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/ddj39krrq/image/upload",
        formData
      );
      setUploading(false);
      return response.data.url;
    } catch (error) {
      setUploading(false);
      console.error("Error uploading image:", error);
      alert("Image upload failed. Please try again.");
      return null;
    }
  };

  // Add a new collection
  const handleAddCollection = async () => {
    if (!collectionName || !image) {
      alert("Please provide both a collection name and an image.");
      return;
    }

    const imageUrl = await uploadImageToCloudinary();

    if (!imageUrl) return;

    try {
      await axios.post(
        "http://localhost:8000/collection/newCollection",
        {
          name: collectionName,
          image: imageUrl,
        }
      );
      alert("Collection added successfully!");
      setIsModalOpen(false); // Close modal after submission
      setCollectionName(""); // Reset input fields
      setImage(null);
      fetchCollections(); // Refresh collection list
    } catch (error) {
      console.error("Error adding collection:", error);
      alert("Failed to add collection. Please try again.");
    }
  };

  // Delete a collection
  const handleDeleteCollection = async (collectionID) => {
    try {
      await axios.delete(
        `http://localhost:8000/collection/removeCollection/${collectionID}`
      );
      alert("Collection deleted successfully!");
      fetchCollections(); // Refresh collection list
    } catch (error) {
      console.error("Error deleting collection:", error);
      alert("Failed to delete collection. Please try again.");
    }
  };

  // Fetch collections on component mount
  useEffect(() => {
    fetchCollections();
  }, []);

  return (
    <>
      <Dashboard />
      <div className="relative">
        {/* Add Collection Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute top-5 left-5 px-4 py-2 bg-blue-500 text-white font-semibold rounded shadow hover:bg-blue-600 transition duration-200"
        >
          Add Collection
        </button>
        <h1 className="text-3xl font-bold text-center mt-10">Collections</h1>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
              Add New Collection
            </h2>
            <input
              type="text"
              placeholder="Enter collection name"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleAddCollection}
                disabled={uploading}
                className={`px-4 py-2 text-white rounded shadow transition duration-200 ${
                  uploading ? "bg-gray-500" : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {uploading ? "Uploading..." : "Submit"}
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

      {/* Collection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6 mt-[50px]">
        {collections?.map((collection) => (
          <div
            key={collection._id}
            className="bg-white p-4 rounded shadow-lg relative flex flex-col items-center"
          >
            <img
              src={collection.image}
              alt={collection.name}
              className="w-full h-[300px] object-cover rounded mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {collection.name}
            </h3>
            <div className="flex justify-center items-center mt-10 gap-20">
              <button
                onClick={() => {
                  localStorage.setItem("collectionID", collection._id);
                  navigate("/items");
                }}
                className=" text-green-500 hover:text-green-700 font-bold text-2xl"
              >
                Check Collection
              </button>
              <button
                onClick={() => handleDeleteCollection(collection._id)}
                className=" text-red-500 hover:text-red-700 font-bold text-2xl"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Collection;
