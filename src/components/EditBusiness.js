import React, { useState } from "react";
import { categories, states } from "../utils/common";

const EditBusiness = ({ initialData = {}, onSubmit, isEdit = false }) => {
  const [formData, setFormData] = useState({
    businessTitle: "",
    description: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    contact: "",
    category: "",
    imageBase64: "",
    ...initialData, // Pre-fill form fields if initialData is provided
  });

  // const states = ["California", "Texas", "New York", "Florida", "Illinois"]; // Example states
  // const categories = ["Education", "Gym", "Healthcare", "Hotel", "Restaurant", "Salon", "Shop", "Technology", "Other"]; // Example categories

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, imageBase64: reader.result }));
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Call the onSubmit function passed as a prop
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="businessTitle" className="form-label">Title</label>
        <input
          type="text"
          className="form-control"
          id="businessTitle"
          name="businessTitle"
          value={formData.businessTitle}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="description" className="form-label">Description</label>
        <textarea
          className="form-control"
          id="description"
          name="description"
          rows="3"
          value={formData.description}
          onChange={handleInputChange}
          required
        ></textarea>
      </div>
      <div className="mb-3">
        <label htmlFor="street" className="form-label">Street</label>
        <input
          type="text"
          className="form-control"
          id="street"
          name="street"
          value={formData.street}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="city" className="form-label">City</label>
        <input
          type="text"
          className="form-control"
          id="city"
          name="city"
          value={formData.city}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="state" className="form-label">State</label>
        <select
          className="form-select"
          id="state"
          name="state"
          value={formData.state}
          onChange={handleInputChange}
          required
        >
          <option value="">Select a state</option>
          {states.map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="zipCode" className="form-label">Zip Code</label>
        <input
          type="text"
          className="form-control"
          id="zipCode"
          name="zipCode"
          value={formData.zipCode}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="contact" className="form-label">Contact</label>
        <input
          type="text"
          className="form-control"
          id="contact"
          name="contact"
          value={formData.contact}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="category" className="form-label">Category</label>
        <select
          className="form-select"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          required
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="image" className="form-label">Image</label>
        <input
          type="file"
          className="form-control"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
        />
        {formData.imageBase64 && (
          <img
            src={formData.imageBase64}
            alt="Preview"
            style={{ marginTop: "10px", maxWidth: "100%", borderRadius: "10px" }}
          />
        )}
      </div>
      <button type="submit" className="btn btn-primary">
        {isEdit ? "Save Changes" : "Add Business"}
      </button>
    </form>
  );
};

export default EditBusiness;