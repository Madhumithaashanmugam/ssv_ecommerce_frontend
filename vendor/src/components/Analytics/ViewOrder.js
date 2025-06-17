import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ViewOrder.css";

const ViewOrder = () => {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/order/${orderId}`);
        setOrder(res.data);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to fetch order.");
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleUserDetails = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/customer/users/customer/users/${order.user_id}`
      );
      setUserDetails(res.data);
      setShowPopup(true);
    } catch (err) {
      console.error("Failed to fetch user details:", err);
      alert("Error fetching user details.");
    }
  };

  if (error) return <div className="error">{error}</div>;
  if (!order) return <div className="loading">Loading order details...</div>;

  return (
    <div className="view-order-container">
      <h2>Order ID: {order.id}</h2>
      <p>
        <strong>User ID:</strong> {order.user_id}
        <button onClick={handleUserDetails} className="user-details-button">
          View User Details
        </button>
      </p>
       <p><strong>Guest User ID:</strong> {order.guest_user_id || "N/A"}</p>
       <p><strong>Status:</strong> {order.order_status}</p>
       <p><strong>Payment Method:</strong> {order.payment_method}</p>
       <p><strong>Payment Status:</strong> {order.payment_status}</p>
      <p><strong>Is Paid:</strong> {order.is_paid ? "Yes" : "No"}</p>
       <p><strong>Razorpay Order ID:</strong> {order.razorpay_order_id || "N/A"}</p>
       <p><strong>Razorpay Payment ID:</strong> {order.razorpay_payment_id || "N/A"}</p>
       <p><strong>Razorpay Signature:</strong> {order.razorpay_signature || "N/A"}</p>
       <p><strong>Address:</strong> {order.address}</p>
       <p><strong>City:</strong> {order.city}</p>
      <p><strong>State:</strong> {order.state}</p>
       <p><strong>Created At:</strong> {new Date(order.created_datetime).toLocaleString()}</p>
       <p><strong>Updated At:</strong> {new Date(order.updated_datetime).toLocaleString()}</p>
       <p><strong>Total Price:</strong> ₹{order.total_price}</p>

      {/* ... all your existing fields remain the same ... */}

      <div className="items-section">
        <h3>Items:</h3>
        {order.items && order.items.length > 0 ? (
          <ul>
            {order.items.map((item) => (
              <li key={item.item_id} className="item-card">
                <p><strong>Name:</strong> {item.item_name}</p>
                <p><strong>Quantity:</strong> {item.quantity}</p>
                <p><strong>Unit Price:</strong> ₹{item.unit_price}</p>
                <p><strong>Total Price:</strong> ₹{item.total_price}</p>
                {item.product_image && (
                  <img
                    src={`http://localhost:8000/${item.product_image}`}
                    alt={item.item_name}
                  />
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No items found in this order.</p>
        )}
      </div>

      {showPopup && userDetails && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>User Details</h3>
            <p><strong>Name:</strong> {userDetails.name}</p>
            <p><strong>Email:</strong> {userDetails.email}</p>
            <p><strong>Phone Number:</strong> {userDetails.phone_number}</p>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewOrder;


// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import "./ViewOrder.css";

// const ViewOrder = () => {
//   const { orderId } = useParams();
//   const [order, setOrder] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchOrder = async () => {
//       try {
//         const res = await axios.get(`http://localhost:8000/order/${orderId}`);
//         setOrder(res.data);
//       } catch (err) {
//         console.error("Error fetching order:", err);
//         setError("Failed to fetch order.");
//       }
//     };
//     fetchOrder();
//   }, [orderId]);

//   if (error) return <div className="error">{error}</div>;
//   if (!order) return <div className="loading">Loading order details...</div>;

//   return (
//     <div className="view-order-container">
//       <h2>Order ID: {order.id}</h2>
//       <p><strong>User ID:</strong> {order.user_id}</p>
//       <p><strong>Guest User ID:</strong> {order.guest_user_id || "N/A"}</p>
//       <p><strong>Status:</strong> {order.order_status}</p>
//       <p><strong>Payment Method:</strong> {order.payment_method}</p>
//       <p><strong>Payment Status:</strong> {order.payment_status}</p>
//       <p><strong>Is Paid:</strong> {order.is_paid ? "Yes" : "No"}</p>
//       <p><strong>Razorpay Order ID:</strong> {order.razorpay_order_id || "N/A"}</p>
//       <p><strong>Razorpay Payment ID:</strong> {order.razorpay_payment_id || "N/A"}</p>
//       <p><strong>Razorpay Signature:</strong> {order.razorpay_signature || "N/A"}</p>
//       <p><strong>Address:</strong> {order.address}</p>
//       <p><strong>City:</strong> {order.city}</p>
//       <p><strong>State:</strong> {order.state}</p>
//       <p><strong>Created At:</strong> {new Date(order.created_datetime).toLocaleString()}</p>
//       <p><strong>Updated At:</strong> {new Date(order.updated_datetime).toLocaleString()}</p>
//       <p><strong>Total Price:</strong> ₹{order.total_price}</p>

//       <div className="items-section">
//         <h3>Items:</h3>
//         {order.items && order.items.length > 0 ? (
//           <ul>
//             {order.items.map((item) => (
//               <li key={item.item_id} className="item-card">
//                 <p><strong>Name:</strong> {item.item_name}</p>
//                 <p><strong>Quantity:</strong> {item.quantity}</p>
//                 <p><strong>Unit Price:</strong> ₹{item.unit_price}</p>
//                 <p><strong>Total Price:</strong> ₹{item.total_price}</p>
//                 {item.product_image && (
//                   <img
//                     src={`http://localhost:8000/${item.product_image}`}
//                     alt={item.item_name}
//                   />
//                 )}
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>No items found in this order.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ViewOrder;
