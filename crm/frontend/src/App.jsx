import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Users from "./pages/Users";
import Items from "./pages/Items";
import Collection from "./pages/Collection";
import Orders from "./pages/Orders";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Collection />} />
          <Route path="/users" element={<Users />} />
          <Route path="/items" element={<Items />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
