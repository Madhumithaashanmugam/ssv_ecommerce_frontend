import React, { useEffect, useState, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Link, useLocation } from 'react-router-dom';

import { fetchItemsWithCategories } from './Service';
import { createCart } from '../Cart/CartService';
import { AuthContext } from '../Context/AuthContext';

import Header from './Header';
import IntroSection from './IntroSection';
import Footer from './Footer';

import './MainPage.css';

const MainPage = () => {
  const [categories, setCategories] = useState([]);
  const [quantityInputs, setQuantityInputs] = useState({});
  const location = useLocation();
  const { userInfo } = useContext(AuthContext);

  const queryParams = new URLSearchParams(location.search);
  const selectedCategoryId = queryParams.get('category');

  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await fetchItemsWithCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load items:', err);
      }
    };

    loadItems();
  }, [location.search]);

  const getOrCreateGuestCartId = () => {
    let cartId = localStorage.getItem('guest_cart_id');
    if (!cartId) {
      cartId = uuidv4();
      localStorage.setItem('guest_cart_id', cartId);
    }
    return cartId;
  };

  const showNotification = (message, type = 'success') => {
    const notification = document.getElementById('notification');
    if (notification) {
      notification.textContent = message;
      notification.className = `notification ${type}`;
      notification.style.display = 'block';
      setTimeout(() => {
        notification.style.display = 'none';
      }, 3000);
    }
  };

  const handleAddToCart = async (item) => {
    const customerId = userInfo?.id || userInfo?.user_id || null;
    const guestId = localStorage.getItem('guest_user_id');

    const quantity = quantityInputs[item.id]
      ? parseInt(quantityInputs[item.id])
      : 1;

    let cartPayload = {
      customer_id: null,
      guest_user_id: null,
      cart_id: null,
      items: [
        {
          item_id: item.id,
          quantity: quantity,
        },
      ],
    };

    if (customerId) {
      cartPayload.customer_id = customerId;
    } else if (userInfo?.email === 'guest@example.com' && guestId) {
      cartPayload.guest_user_id = guestId;
    } else {
      const newCartId = getOrCreateGuestCartId();
      cartPayload.cart_id = newCartId;
    }

    try {
      const response = await createCart(cartPayload);

      if (response.customer_id) {
        localStorage.setItem('customer_id', response.customer_id);
        localStorage.removeItem('guest_user_id');
        localStorage.removeItem('guest_cart_id');
      } else if (response.guest_user_id) {
        localStorage.setItem('guest_user_id', response.guest_user_id);
        localStorage.setItem('guest_cart_id', response.cart_id);
      }

      showNotification('Item added to cart!', 'success');
    } catch (error) {
      showNotification('Failed to add item to cart.', 'error');
    }
  };

  const filteredCategories = selectedCategoryId
    ? categories.filter(cat => String(cat.id) === selectedCategoryId)
    : categories;

  return (
    <div className="main-page-container">
      <div id="notification" className="notification"></div>

      <Header />
      <IntroSection />

      <h2 className="section-title">
        {selectedCategoryId ? 'Filtered Products' : 'All Products'}
      </h2>

      {filteredCategories.length === 0 ? (
        <p className="no-items">No matching category or items found.</p>
      ) : (
        filteredCategories.map((category, index) => (
          <div key={category.id || `category-${index}`} className="category-section">
            <h3 className="category-title">{category.category_name}</h3>

            {category.items && category.items.length > 0 ? (
              <div className="item-grid">
                {category.items.map((item, idx) => (
                  <div className="item-card" key={item.id || `item-${idx}`}>
                    <Link to={`/item/${item.id}`} className="item-link">
                      <img
                        src={`http://127.0.0.1:8000/${item.product_image.replace(/\\/g, '/')}`}
                        alt={item.name}
                        className="item-image"
                      />
                      <div className="item-details">
                        <h3>{item.name}</h3>
                        <div className="item-info">
                          <h2>{item.item_name}</h2>
                          <p><strong>Price:</strong> <span className="strike">₹{item.item_price}</span></p>
                          <p><strong>Discount:</strong> {item.discount}%</p>
                          <p><strong>Final Price:</strong> <span className="final-price">₹{item.final_price}</span></p>
                        </div>
                      </div>
                    </Link>

                    <div className="quantity-input-wrapper">
                      <label htmlFor={`quantity-${item.id}`}>Bags</label>
                      <input
                        type="number"
                        id={`quantity-${item.id}`}
                        value={quantityInputs[item.id] || ''}
                        onChange={(e) =>
                          setQuantityInputs((prev) => ({
                            ...prev,
                            [item.id]: e.target.value,
                          }))
                        }
                        className="quantity-input"
                        min="1"
                        placeholder="Enter quantity"
                      />
                    </div>

                    <button
                      className="add-to-cart-button"
                      onClick={() => handleAddToCart(item)}
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-items">No items available under this category</p>
            )}
          </div>
        ))
      )}

      <Footer />
    </div>
  );
};

export default MainPage;
