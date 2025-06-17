import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../SignIn/api";
import "./UpdateItem.css";

const UpdateItemModal = ({ item, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    item_name: "",
    item_price: 0,
    discount: 0,
    final_price: 0,
    kg: 0,
    quality: "",
    quantity: 0,
    description: "",
  });

  const [additionalImages, setAdditionalImages] = useState([]);

  useEffect(() => {
    setFormData({
      item_name: item.item_name,
      item_price: item.item_price,
      discount: item.discount,
      final_price: item.final_price,
      kg: item.kg,
      quality: item.quality,
      quantity: item.quantity,
      description: item.description,
    });
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedForm = {
      ...formData,
      [name]: ["item_price", "final_price", "quantity", "kg"].includes(name)
        ? parseFloat(value)
        : value,
    };

    // Recalculate discount if item_price or final_price changes
    if (name === "item_price" || name === "final_price") {
      const price = name === "item_price" ? parseFloat(value) : updatedForm.item_price;
      const final = name === "final_price" ? parseFloat(value) : updatedForm.final_price;

      if (price > 0 && final <= price) {
        const discount = ((price - final) / price) * 100;
        updatedForm.discount = Math.round(discount);
      } else {
        updatedForm.discount = 0;
      }
    }

    setFormData(updatedForm);
  };

  const handleImageChange = (e) => {
    setAdditionalImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();

    for (const key in formData) {
      form.append(key, formData[key]);
    }

    additionalImages.forEach((file) => {
      form.append("additional_images", file);
    });

    try {
      await api.put(`items/${item.id}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      onSuccess();
    } catch (err) {
      console.error("Failed to update item:", err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Update Item</h2>
        <form onSubmit={handleSubmit} className="update-form">
          <label htmlFor="item_name">Item Name:</label>
          <input
            id="item_name"
            name="item_name"
            value={formData.item_name}
            onChange={handleChange}
            required
          />

          <label htmlFor="item_price">Price (₹):</label>
          <input
            type="number"
            id="item_price"
            name="item_price"
            value={formData.item_price}
            onChange={handleChange}
            required
          />

          <label htmlFor="final_price">Final Price (₹):</label>
          <input
            type="number"
            id="final_price"
            name="final_price"
            value={formData.final_price}
            onChange={handleChange}
            required
          />

          <div><strong>Discount: {formData.discount}%</strong></div>

          <label htmlFor="kg">Weight (kg):</label>
          <input
            type="number"
            id="kg"
            name="kg"
            value={formData.kg}
            onChange={handleChange}
            required
          />

          <label htmlFor="quantity">Quantity (bags):</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />

          <label htmlFor="quality">Quality:</label>
          <input
            id="quality"
            name="quality"
            value={formData.quality}
            onChange={handleChange}
            required
          />

          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <label htmlFor="additional_images">Additional Images:</label>
          <input
            type="file"
            id="additional_images"
            name="additional_images"
            onChange={handleImageChange}
            multiple
            accept="image/*"
          />

          <button type="submit">Update</button>
          <button type="button" className="close-button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateItemModal;
