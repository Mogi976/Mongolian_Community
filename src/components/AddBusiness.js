import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { categories, states } from "../utils/common";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const AddBusiness = () => {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [businessTitle, setBusinessTitle] = useState("");
  const [description, setDescription] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [contact, setContact] = useState("");
  const [category, setCategory] = useState("");
  const [imageBase64, setImageBase64] = useState(""); // Store Base64 string
  const [error, setError] = useState("");
  console.log("isLoggedIn", isLoggedIn);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      setError("You must be logged in to add a business.");
      return;
    }

    try {
      // Save business data to Firestore
      const newBusiness = {
        businessTitle,
        description,
        street,
        city,
        state,
        zipCode,
        contact,
        category,
        imageBase64, // Store Base64 string in Firestore
        createdBy: user.uid,
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, "businesses"), newBusiness);
      console.log("Business added with ID:", docRef.id);

      // Redirect to Home
      navigate("/");
    } catch (err) {
      console.error("Error adding business:", err);
      setError("Failed to add business. Please try again.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        resizeImage(reader.result, 800, 800, 0.7, (resizedBase64) => {
          setImageBase64(resizedBase64); // Store the resized and compressed Base64 string
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Function to resize and compress the image
  const resizeImage = (base64Str, maxWidth, maxHeight, quality, callback) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
  
      let width = img.width;
      let height = img.height;
  
      // Maintain aspect ratio while resizing
      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }
  
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
  
      // Compress the image and return the Base64 string
      const resizedBase64 = canvas.toDataURL("image/jpeg", quality); // Adjust quality (0.1 to 1.0)
      callback(resizedBase64);
    };
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Add Business</h2>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="businessTitle" className="form-label">Business Title</label>
          <input
            type="text"
            className="form-control"
            id="businessTitle"
            value={businessTitle}
            onChange={(e) => setBusinessTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Business Description</label>
          <textarea
            className="form-control"
            id="description"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Address</label>
          <div className="row">
            <div className="col-md-6 mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <select
                className="form-select"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Zip Code"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                required
              />
            </div>
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="contact" className="form-label">Contact</label>
          <input
            type="text"
            className="form-control"
            id="contact"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="category" className="form-label">Category</label>
          <select
            className="form-select"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="image" className="form-label">Image</label>
          <input
            type="file"
            className="form-control"
            id="image"
            onChange={handleImageChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100 mb-4">Add Business</button>
      </form>
    </div>
  );
};

export default AddBusiness;