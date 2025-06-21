import React, { useEffect, useState } from 'react';
import api from '../SignIn/api';
import './OfflineOrders.css';
import { useNavigate } from 'react-router-dom';

const OfflineOrder = () => {
  const [step, setStep] = useState(1);
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_address: '',
    order_date: '',
    delivery_date: '',
    total_amount: '', // 💡 now user inputs final total
    amount_paid: 0,
    payment_status: 'Paid',
    payment_method: 'Cash',
    created_by: 'vendor123',
    notes: ''
  });

  useEffect(() => {
    api.get('items/')
      .then(res => setItems(res.data))
      .catch(err => console.error('Failed to fetch items', err));
  }, []);

  const toggleItem = (item) => {
    setSelectedItems(prev => {
      const updated = { ...prev };
      if (updated[item.id]) {
        delete updated[item.id];
      } else {
        updated[item.id] = {
          item_id: item.id,
          quantity: 1,
          final_price: item.final_price,
          name: item.item_name
        };
      }
      return updated;
    });
  };

  const updateQuantity = (itemId, quantity) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        quantity: Math.max(1, parseInt(quantity) || 1)
      }
    }));
  };

  const calculateSubtotal = () => {
    return Object.values(selectedItems).reduce(
      (acc, item) => acc + item.quantity * item.final_price,
      0
    );
  };

  const calculateDiscountPercentage = () => {
    const subtotal = calculateSubtotal();
    const total = parseFloat(formData.total_amount);
    if (!subtotal || !total || subtotal === 0) return 0;
    const discount = ((subtotal - total) / subtotal) * 100;
    return discount.toFixed(2);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = () => {
    const payload = {
      ...formData,
      total_amount: parseFloat(formData.total_amount),
      discount: calculateDiscountPercentage(),
      items: Object.values(selectedItems).map(({ item_id, quantity }) => ({ item_id, quantity }))
    };

    api.post('offline-order/', payload)
      .then(() => navigate('/orders/success'))
      .catch(err => alert('Failed to place order: ' + (err.response?.data?.detail || 'Unknown error')));
  };

  return (
    <div className="order-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            backgroundColor: '#f0f0f0',
            cursor: 'pointer',
          }}
        >
          ← Back to Dashboard
        </button>
      </div>
      {step === 1 && (
        <div className="step-one">
          <h2>Select Items</h2>
          <ul className="item-list">
            {items.map(item => (
              <li key={item.id} className="item-row">
                <label>
                  <input
                    type="checkbox"
                    checked={!!selectedItems[item.id]}
                    onChange={() => toggleItem(item)}
                  />
                  <span className="item-name">{item.item_name}</span>
                  <span className="item-price">₹{item.final_price}</span>
                  <span className="item-stock">Available: {item.quantity}kg</span>
                </label>
                {selectedItems[item.id] && (
                  <>
                    <input
                      type="number"
                      min="1"
                      max={item.quantity}
                      value={selectedItems[item.id].quantity}
                      onChange={(e) => updateQuantity(item.id, e.target.value)}
                      className="quantity-input"
                    />
                    <span className="item-total">
                      Total: ₹{selectedItems[item.id].quantity * item.final_price}
                    </span>
                  </>
                )}
              </li>
            ))}
          </ul>
          <div className="grand-total">Subtotal: ₹{calculateSubtotal().toFixed(2)}</div>
          <button
            onClick={() => setStep(2)}
            disabled={Object.keys(selectedItems).length === 0}
            className="proceed-btn"
          >
            Proceed
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="step-two">
          <h2>Customer Details</h2>
          <form className="order-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            {[
              ['customer_name', 'Name'],
              ['customer_phone', 'Phone'],
              ['customer_address', 'Address'],
              ['order_date', 'Order Date'],
              ['delivery_date', 'Delivery Date'],
              ['total_amount', 'Final Total (₹)'],
              ['amount_paid', 'Amount Paid'],
              ['notes', 'Notes']
            ].map(([name, label]) => (
              <div key={name} className="form-field">
                <label>{label}</label>
                <input
                  type={
                    name === 'total_amount' || name === 'amount_paid'
                      ? 'number'
                      : name.includes('date')
                        ? 'date'
                        : 'text'
                  }
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  required={name !== 'notes'}
                />
              </div>
            ))}

            <div className="form-field">
              <label>Payment Status</label>
              <select name="payment_status" value={formData.payment_status} onChange={handleChange}>
                <option>Paid</option>
                <option>Partial</option>
                <option>Unpaid</option>
              </select>
            </div>

            <div className="form-field">
              <label>Payment Method</label>
              <select name="payment_method" value={formData.payment_method} onChange={handleChange}>
                <option>Cash</option>
                <option>Bank Transfer</option>
                <option>UPI</option>
              </select>
            </div>

            <div className="grand-total">Subtotal: ₹{calculateSubtotal().toFixed(2)}</div>
            <div className="grand-total">You Entered Final Amount: ₹{formData.total_amount}</div>
            <div className="calculated-discount">
              Calculated Discount: {calculateDiscountPercentage()}%
            </div>

            <button type="submit" className="submit-btn">Place Order</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default OfflineOrder;
