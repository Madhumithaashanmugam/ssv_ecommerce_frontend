import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { createItem, getItems } from './service';
import './items.css';

const AddItem = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryIdFromURL = queryParams.get('categoryId');

  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [finalPrice, setFinalPrice] = useState('');
  const [discount, setDiscount] = useState(0);
  const [kg, setKg] = useState('');
  const [quality, setQuality] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!categoryIdFromURL) {
      setError('Category ID not found in URL. Please navigate from the category creation page.');
    } else {
      fetchItems();
    }
  }, [categoryIdFromURL]);

  useEffect(() => {
    const original = parseFloat(itemPrice);
    const final = parseFloat(finalPrice);
    if (!isNaN(original) && !isNaN(final) && original > 0 && final > 0 && final <= original) {
      const calculatedDiscount = Math.round(((original - final) / original) * 100);
      setDiscount(calculatedDiscount);
    } else {
      setDiscount(0);
    }
  }, [itemPrice, finalPrice]);

  const fetchItems = async () => {
    try {
      const data = await getItems();
      setItems(data);
    } catch (err) {
      console.error('Failed to fetch items:', err);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setProductImage(e.target.files[0]);
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!categoryIdFromURL) {
      setError('Category ID is missing. Cannot add item.');
      return;
    }

    const original = parseFloat(itemPrice);
    const final = parseFloat(finalPrice);

    if (isNaN(original) || isNaN(final) || original <= 0 || final <= 0 || final > original) {
      setError('Please enter valid item price and final price.');
      return;
    }

    const formData = new FormData();
    formData.append('category_id', categoryIdFromURL);
    formData.append('item_name', itemName);
    formData.append('item_price', itemPrice);
    formData.append('discount', discount);
    formData.append('kg', kg);
    formData.append('quality', quality);
    formData.append('quantity', quantity);
    formData.append('description', description);
    formData.append('file', productImage);

    additionalImages.forEach((img) => {
      formData.append('additional_images', img);
    });

    try {
      // 🔴 Missing API call here
      await createItem(formData);  // ✅ Add this line

      setMessage('Item added successfully!');
      fetchItems();

      // Clear form
      setItemName('');
      setItemPrice('');
      setFinalPrice('');
      setKg('');
      setQuality('');
      setQuantity('');
      setDescription('');
      setProductImage(null);
      setAdditionalImages([]);
      setDiscount(0);
      document.getElementById('productImage').value = '';
      document.getElementById('additionalImages').value = '';
    } catch (err) {
      setError('Failed to add item. Please check your inputs.');
    }

  };

  return (
    <div className="add-item-container">
      <h2>Add New Item</h2>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit} className="item-form">
        <div className="form-field">
          <label htmlFor="itemName">Item Name:</label>
          <input
            type="text"
            id="itemName"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="itemPrice">Item Price:</label>
          <input
            type="text"
            id="itemPrice"
            value={itemPrice}
            onChange={(e) => setItemPrice(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="finalPrice">Final Price:</label>
          <input
            type="text"
            id="finalPrice"
            value={finalPrice}
            onChange={(e) => setFinalPrice(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label>Discount:</label>
          <p><strong>{discount}%</strong></p>
        </div>

        <div className="form-field">
          <label htmlFor="kg">Kg:</label>
          <input
            type="text"
            id="kg"
            value={kg}
            onChange={(e) => setKg(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="quality">Quality:</label>
          <input
            type="text"
            id="quality"
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label htmlFor="productImage">Main Product Image:</label>
          <input
            type="file"
            id="productImage"
            onChange={handleFileChange}
            accept="image/*"
            required
          />
        </div>

<div className="form-field">
  <label htmlFor="additionalImages">Additional Images (Max 6):</label>
  <input
    type="file"
    id="additionalImages"
    multiple
    onChange={(e) => {
      const files = Array.from(e.target.files);
      if (!files.length) return;

      // Combine old + new images
      const combined = [...additionalImages, ...files];

      // Slice to max 6
      const uniqueLimited = combined.slice(0, 6);

      // Update state
      setAdditionalImages(uniqueLimited);

      // Clear input value so same files can be selected again
      e.target.value = '';
    }}
    accept="image/*"
  />

  {additionalImages.length > 0 && (
    <ul className="image-preview-list">
      {additionalImages.map((file, index) => (
        <li key={index} className="image-preview-item">
          {file.name}
          <button
            type="button"
            className="remove-button"
            onClick={() => {
              const updatedImages = additionalImages.filter((_, i) => i !== index);
              setAdditionalImages(updatedImages);
            }}
          >
            ❌
          </button>
        </li>
      ))}
    </ul>
  )}
</div>



        <button type="submit">Add Item</button>
      </form>

      <div className="item-list">
        <h3>All Items</h3>
        {items.length === 0 ? (
          <p>No items found.</p>
        ) : (
          <ul>
            {items.map((item) => (
              <li key={item.id} style={{ marginBottom: '1rem' }}>
                <p><strong>Name:</strong> {item.item_name}</p>
                <p><strong>Price:</strong> ₹{item.item_price}</p>
                <p><strong>KG:</strong> {item.kg}</p>
                <p><strong>Quality:</strong> {item.quality}</p>
                <p><strong>Quantity:</strong> {item.quantity}</p>
                <p><strong>Discount:</strong> {item.discount ? `${item.discount}%` : 'None'}</p>
                <p><strong>Category ID:</strong> {item.category_id}</p>
                <p><strong>Description:</strong> {item.description || 'N/A'}</p>

                <p><strong>Main Image:</strong></p>
                {item.product_image && (
                  <img
                    src={`http://127.0.0.1:8000/uploads/${item.product_image.split(/[\\/]/).pop()}`}
                    alt={item.item_name}
                    style={{ width: '200px', height: 'auto', cursor: 'pointer' }}
                    onClick={() =>
                      window.open(`http://127.0.0.1:8000/uploads/${item.product_image.split(/[\\/]/).pop()}`, '_blank')
                    }
                  />
                )}

                {item.additional_images && item.additional_images.length > 0 && (
                  <>
                    <p><strong>Additional Images:</strong></p>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {item.additional_images.map((img, index) => (
                        <img
                          key={index}
                          src={`http://127.0.0.1:8000/uploads/${img.split(/[\\/]/).pop()}`}
                          alt={`Additional ${index + 1}`}
                          style={{ width: '80px', height: 'auto', cursor: 'pointer', borderRadius: '6px' }}
                          onClick={() =>
                            window.open(`http://127.0.0.1:8000/uploads/${img.split(/[\\/]/).pop()}`, '_blank')
                          }
                        />
                      ))}
                    </div>
                  </>
                )}
                <hr />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AddItem;
