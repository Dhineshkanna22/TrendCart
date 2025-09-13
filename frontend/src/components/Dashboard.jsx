import React, { useState } from "react";
import { Link } from "react-router-dom";

const Dashboard = ({ onFilterChange }) => {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);

  const categories = ["Men", "Women", "Kids", "Accessories", "Shoes"];
  const brands = ["Brand A", "Brand B", "Brand C", "Brand D"];

  const handlePriceChange = (e) => {
    const value = Number(e.target.value);
    setPriceRange([priceRange[0], value]);
    onFilterChange({
      selectedCategories,
      selectedBrands,
      priceRange: [priceRange[0], value],
    });
  };

  const handleCategoryToggle = (category) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((item) => item !== category)
      : [...selectedCategories, category];
    setSelectedCategories(updatedCategories);
    onFilterChange({
      selectedCategories: updatedCategories,
      selectedBrands,
      priceRange,
    });
  };

  const handleBrandToggle = (brand) => {
    const updatedBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter((item) => item !== brand)
      : [...selectedBrands, brand];
    setSelectedBrands(updatedBrands);
    onFilterChange({
      selectedCategories,
      selectedBrands: updatedBrands,
      priceRange,
    });
  };

  return (
    <div className="bg-orange-50 border-r-2 border-slate-200 w-[300px] p-4">
      <h1 className="font-bold text-[30px] font-serif mt-[20px] mb-6">
        FILTER BY
      </h1>

      {/* Categories Filter */}
      <div className="mb-6">
        <h2 className="font-semibold text-lg">Categories</h2>
        <div className="flex flex-col mt-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryToggle(category)}
              />
              {category}
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter (Slider) */}
      <div className="mb-6">
        <h2 className="font-semibold text-lg">Price Range</h2>
        <div className="mt-2">
          <input
            type="range"
            min="0"
            max="1000"
            value={priceRange[1]}
            onChange={handlePriceChange}
            className="w-full"
          />
          <div className="flex justify-between text-sm">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
