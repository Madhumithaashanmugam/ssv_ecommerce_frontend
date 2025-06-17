import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CartItemControls from '../UpdateAndRemove/Update';
import RemoveButton from '../UpdateAndRemove/Remove';
import useCart from './CartUse';
import AuthPromptButtons from './AuthPromptButtons';
import OrderNowButton from './OrderNow';
import './Cart.css';

const CartPage = () => {
  const { userInfo } = useContext(AuthContext);
  const { cart, loading, error, handleUpdateQuantity, setCart } = useCart(userInfo);
  const [itemDataMap, setItemDataMap] = useState({}); // item_id -> fetched item data

  // Fetch item details once cart is loaded
  useEffect(() => {
    const fetchItemDetails = async () => {
      if (!cart || !cart.items) return;

      const newItemData = {};
      await Promise.all(
        cart.items.map(async (item) => {
          try {
            const res = await axios.get(`http://127.0.0.1:8000/items/${item.item_id}`);
            newItemData[item.item_id] = {
              final_price: res.data.final_price,
              base_discount: res.data.discount,
              item_price: res.data.item_price,          // ✅ Added
              item_discount: res.data.discount          // ✅ Added
            };
          } catch (err) {
            console.error(`Error fetching item ${item.item_id}:`, err);
          }
        })
      );
      setItemDataMap(newItemData);
    };

    fetchItemDetails();
  }, [cart]);

  return (
    <div className="cart-page">
      <AuthPromptButtons />
      <h2>🛒 Your Cart</h2>

      {loading && <div>Loading cart...</div>}
      {error && <div>{error}</div>}

      {!loading && !error && (!cart || !cart.items || cart.items.length === 0) && (
        <div>Your cart is empty.</div>
      )}

      {!loading && !error && cart?.items?.length > 0 && (
        <>
          <div className="cart-items">
            {cart.items.map((item) => {
              const {
                item_id,
                item_name,
                item_price,
                mrp_price,
                quantity,
                product_image,
                total_price,
                cart_discount,
              } = item;

              const overrideData = itemDataMap[item_id];
              const baseDiscount = overrideData?.base_discount ?? cart_discount;
              const extraDiscount = quantity > 5 ? 10 : 0;
              const effectiveDiscount = 1 - (1 - baseDiscount / 100) * (1 - extraDiscount / 100);
              const displayPrice = +(mrp_price * (1 - effectiveDiscount)).toFixed(2);
              const displayDiscount = +(effectiveDiscount * 100).toFixed(2);

              return (
                <div key={item_id} className="cart-item">
                  <Link to={`/item/${item_id}`} className="cart-item-link">
                    <img
                      src={`http://127.0.0.1:8000/${product_image.replace(/\\/g, "/")}`}
                      alt={item_name}
                      className="cart-image"
                    />
                  </Link>

                  <div className="cart-details">
                    <Link to={`/item/${item_id}`} className="cart-item-name-link">
                      <h3>{item_name}</h3>
                    </Link>
                    <p><strong>Item Price:</strong> ₹{overrideData?.item_price?.toFixed(2) ?? 'N/A'}</p>

                    <p><strong>Single Item Price after discount:</strong> ₹{displayPrice.toFixed(2)}</p>
                    <p><strong>MRP:</strong> ₹{mrp_price.toFixed(2)}</p>
                    <p>
                    <p><strong>Item Discount:</strong> {overrideData?.item_discount ?? 'N/A'}%</p>

                      {/* <strong>Cart Discount:</strong> {displayDiscount}% 
                      {quantity > 5 && (
                        <span className="extra-discount"> +10% </span>
                      )} */}
<p>
  <strong>additional Discount:</strong>
  <span style={{ display: 'none' }}>{displayDiscount}%</span>
  {quantity > 5 && (
    <span className="extra-discount"> +10% (due to more quantity) </span>
  )}
</p>

                    </p>
                    <p><strong>Quantity:</strong> {quantity}</p>
                    <p><strong>Total (After Discount):</strong> ₹{(displayPrice * quantity).toFixed(2)}</p>

                    {/* ✅ Newly added columns */}
                    <p><strong>Item Price:</strong> ₹{overrideData?.item_price?.toFixed(2) ?? 'N/A'}</p>

                    <div className="cart-controls-row">
                      <CartItemControls
                        item={item}
                        cartId={cart.cart_id}
                        onUpdate={handleUpdateQuantity}
                      />
                      <RemoveButton
                        item={item}
                        cartId={cart.cart_id}
                        onRemove={setCart}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <h3>Cart Summary</h3>
            <p><strong>Total MRP:</strong> ₹{cart.mrp_price.toFixed(2)}</p>
            <p><strong>Total Discount:</strong> ₹{cart.cart_discount.toFixed(2)}</p>
            <p><strong>Total Payable:</strong> ₹{cart.total_cart_price.toFixed(2)}</p>
          </div>

          <OrderNowButton userInfo={userInfo} cart={cart} />
        </>
      )}
    </div>
  );
};

export default CartPage;
