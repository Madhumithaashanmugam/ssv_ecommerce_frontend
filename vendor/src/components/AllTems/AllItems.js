// src/components/AllItems.js
import React, { useEffect, useState } from "react";
import "./AllItems.css";
import api from "../SignIn/api";
import UpdateItemModal from "./UpdateItem";

const AllItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchItems = async () => {
    try {
      const response = await api.get("items/");
      setItems(response.data);
    } catch (error) {
      console.error("Failed to fetch items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleUpdateClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  const handleUpdateSuccess = () => {
    fetchItems();
    handleCloseModal();
  };

  const openDeletePopup = (item) => {
    setItemToDelete(item);
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`items/${itemToDelete.id}`);
      setShowDeletePopup(false);
      setItemToDelete(null);
      fetchItems();
    } catch (error) {
      console.error("Failed to delete item:", error);
      alert("Failed to delete item. Please try again.");
    }
  };

  const cancelDelete = () => {
    setShowDeletePopup(false);
    setItemToDelete(null);
  };

  if (loading) return <p>Loading items...</p>;

  return (
    <div className="items-container">
      <h2>All Items</h2>
      <div className="items-list">
        {items.map((item) => (
          <div className="item-row" key={item.id}>
            <div className="item-image-wrapper">
              <img
                src={`http://localhost:8000/${item.product_image.replace("\\", "/")}`}
                alt={item.item_name}
                className="item-image"
              />
              <p>Additional Images</p>
              {item.additional_images && item.additional_images.length > 0 && (
                <div className="additional-images-wrapper">
                  {item.additional_images.map((img, index) => (
                    <img
                      key={index}
                      src={`http://localhost:8000/${img.replace("\\", "/")}`}
                      alt={`Additional ${index + 1}`}
                      className="additional-image"
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="item-details">
              <h3>{item.item_name}</h3>
              <p><strong>Price:</strong> ₹{item.item_price}</p>
              <p><strong>Discount:</strong> {item.discount}%</p>
              <p><strong>Final Price:</strong> ₹{item.final_price}</p>
              <p><strong>Kg:</strong> {item.kg}</p>
              <p><strong>Quality:</strong> {item.quality}</p>
              <p><strong>Quantity:</strong> {item.quantity} Bag</p>
              <p><strong>Description:</strong> {item.description}</p>
              <div className="button-group">
                <button
                  className="update-button"
                  onClick={() => handleUpdateClick(item)}
                >
                  Update
                </button>
                <button
                  className="delete-button"
                  onClick={() => openDeletePopup(item)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && selectedItem && (
        <UpdateItemModal
          item={selectedItem}
          onClose={handleCloseModal}
          onSuccess={handleUpdateSuccess}
        />
      )}

      {showDeletePopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete <strong>{itemToDelete.item_name}</strong>?</p>
            <div className="popup-buttons">
              <button className="confirm-button" onClick={confirmDelete}>Yes, Delete</button>
              <button className="cancel-button" onClick={cancelDelete}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllItems;
