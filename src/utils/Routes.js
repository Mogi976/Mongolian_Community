import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../components/Home";
import AddBusiness from "../components/AddBusiness";
import Auth from "../components/Auth";
import PrivateRoute from "./PrivateRoute";
import BusinessDetails from "../components/BusinessDetails";
import Contact from "../components/Contact";

const AppRoutes = ({ searchQuery, setLocation, setZoom, selectedState }) => {
  return (
    <Routes>
      <Route path="/" element={<Home searchQuery={searchQuery} selectedState={selectedState} setZoom={setZoom} />} />
      <Route path="/auth" element={<Auth />} />
      <Route
        path="/add"
        element={
          <PrivateRoute>
            <AddBusiness />
          </PrivateRoute>
        }
      />
      <Route path="/business/:id" element={<BusinessDetails setLocation={setLocation} setZoom={setZoom} />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
};

export default AppRoutes;