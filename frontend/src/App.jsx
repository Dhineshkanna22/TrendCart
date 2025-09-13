import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./Pages/Landing";
import Women from "./Pages/Women";
import Cart from "./Pages/Cart";
import Details from "./Pages/Details";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import TrackOrder from "./Pages/TrackOrder";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/shop" element={<Women />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/:id" element={<Details />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/orders" element={<TrackOrder />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
