import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { fetchItemsWithCategories } from './Service';
import { createCart } from '../Cart/CartService';
import { AuthContext } from '../Context/AuthContext';
import Header from './Header';
import { FaWhatsapp } from 'react-icons/fa';
import './ItemDetails.css';
import { v4 as uuidv4 } from 'uuid';

const ItemDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const { userInfo } = useContext(AuthContext);

  useEffect(() => {
    const loadItem = async () => {
      try {
        const categories = await fetchItemsWithCategories();
        const allItems = categories.flatMap(cat => cat.items);
        const foundItem = allItems.find(i => String(i.id) === id);
        setItem(foundItem);
        if (foundItem) {
          setCurrentImage(`http://127.0.0.1:8000/${foundItem.product_image.replace(/\\/g, '/')}`);
        }
      } catch (error) {
        console.error('Failed to fetch item details:', error);
      }
    };
    loadItem();
  }, [id]);

  const getOrCreateGuestCartId = () => {
    let cartId = localStorage.getItem('guest_cart_id');
    if (!cartId) {
      cartId = uuidv4();
      localStorage.setItem('guest_cart_id', cartId);
    }
    return cartId;
  };

  const handleAddToCart = async () => {
    const customerId = userInfo?.id || userInfo?.user_id || null;
    const guestCartId = !customerId ? getOrCreateGuestCartId() : null;

    const cartPayload = {
      customer_id: customerId,
      guest_user_id: null,
      cart_id: guestCartId,
      items: [
        {
          item_id: item.id,
          quantity: quantity,
        },
      ],
    };

    try {
      const response = await createCart(cartPayload);
      console.log('Cart updated:', response);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    } catch (error) {
      console.error('Add to cart failed:', error);
      alert('Failed to add item to cart.');
    }
  };

  if (!item) return <p>Loading item details...</p>;

  const allImages = item.additional_images?.length
    ? [item.product_image, ...item.additional_images]
    : [item.product_image];

  return (
    <div className="main-page-container">
      <Header />
      <div className="item-detail-card">
        {/* Image Preview Section */}
        <div className="image-preview-container">
          <img
            src={currentImage}
            alt={item.item_name}
            className="item-main-image"
          />
          <div className="thumbnail-container">
            {allImages.map((img, index) => (
              <img
                key={index}
                src={`http://127.0.0.1:8000/${img.replace(/\\/g, '/')}`}
                alt={`Thumbnail ${index}`}
                className={`thumbnail-image ${
                  currentImage === `http://127.0.0.1:8000/${img.replace(/\\/g, '/')}` ? 'active' : ''
                }`}
                onClick={() =>
                  setCurrentImage(`http://127.0.0.1:8000/${img.replace(/\\/g, '/')}`)
                }
              />
            ))}
          </div>
        </div>

        {/* Item Info */}
        <div className="item-info">
          <h2>{item.item_name}</h2>
          <p>
            <strong>Price:</strong>{' '}
            <s>₹{item.item_price}</s>{' '}
            <span className="final-price">₹{item.final_price}</span>
          </p>
          <p><strong>Discount:</strong> {item.discount}%</p>
          <p><strong>Weight:</strong> {item.kg} kg</p>
          <p><strong>Quality:</strong> {item.quality}</p>
          <p><strong>Quantity Available:</strong> {item.quantity}</p>
          <p><strong>Description:</strong> {item.description}</p>

          <a
            href="https://wa.me/918008692727"
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-link"
          >
            <FaWhatsapp className="icon" />
            Chat with us on WhatsApp: <strong>08008692727</strong>
          </a>

          {/* Quantity Selection */}
          <div style={{ marginTop: '1em' }}>
            <label htmlFor="quantity"><strong>Quantity:</strong> </label>
            <input
              type="number"
              id="quantity"
              min="1"
              max={item.quantity}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              style={{ width: '60px', marginLeft: '0.5em' }}
            />
          </div>

          {/* Add to Cart Button */}
          <button
            className="add-to-cart-button"
            onClick={handleAddToCart}
            disabled={isAdded}
            style={{ marginTop: '1em' }}
          >
            {isAdded ? '✅ Item Added' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
