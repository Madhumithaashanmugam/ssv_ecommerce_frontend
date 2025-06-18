import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import "./Analytics.css";
import api from "../SignIn/api";

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showItemDetails, setShowItemDetails] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get("/analytics/analytics"); // ✅ Uses the interceptor
        setAnalyticsData(res.data.data);
      } catch (err) {
        console.error("❌ Error fetching analytics:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
      }
    };

    fetchAnalytics();
  }, []);

  // useEffect(() => {
  //   const fetchAnalytics = async () => {
  //     try {
  //       const res = await axios.get("http://localhost:8000/analytics/analytics");
  //       setAnalyticsData(res.data.data);
  //     } catch (err) {
  //       console.error("Error fetching analytics:", err);
  //     }
  //   };
  //   fetchAnalytics();
  // }, []);

  const handleViewOrder = (entry) => {
    if (entry?.order_id) {
      navigate(`/view-order/${entry.order_id}`);
    } else if (entry?.status) {
      const status = entry.status.toLowerCase();
      if (status === "pending") navigate("/orders/pending");
      else if (status === "accepted") navigate("/orders/accepted");
      else if (status === "completed") navigate("/orders/completed");
      else if (status === "declined") navigate("/orders/declined");
      else if (status === "returned") navigate("/orders/returned");
      else alert("Unknown status.");
    } else {
      alert("Navigation target not found.");
    }
  };

  const handleViewAllItems = () => {
    navigate("/all-items");
  };

  const handleViewItemDetails = async (item) => {
    try {
      const res = await axios.get(`http://localhost:8000/items/${item.item_id}`);
      setSelectedItem(res.data);
      setShowItemDetails(true);
    } catch (error) {
      console.error("Failed to fetch item details:", error);
      alert("Failed to load item details.");
    }
  };

  const closeModal = () => {
    setShowItemDetails(false);
    setSelectedItem(null);
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const exportToExcel = () => {
    const sheetData = [];
    const sections = [
      "orders_today",
      "orders_last_3_days",
      "orders_last_week",
      "orders_last_month"
    ];
    sections.forEach((section) => {
      if (analyticsData[section]) {
        sheetData.push({}, { SECTION: section.toUpperCase() });
        analyticsData[section].forEach((entry) => sheetData.push(entry));
      }
    });
    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "AnalyticsData");
    XLSX.writeFile(workbook, "analytics_data.xlsx");
  };

  if (!analyticsData) return <div className="analytics-container">Loading...</div>;

  return (
    <div className="analytics-container">
      <h1 className="analytics-title">Analytics Dashboard</h1>
      <button onClick={exportToExcel} className="export-button">Export to Excel</button>

      <div className="dynamic-stats-container">
        {[
          { title: "Total Orders", value: analyticsData.total_orders },
          { title: "Total Revenue", value: `₹${analyticsData.total_revenue}` },
          { title: "Average Order Value", value: `₹${analyticsData.average_order_value}` },
          { title: "Total Products", value: analyticsData.total_products },
          { title: "Potential Revenue from Stock", value: `₹${analyticsData.potential_revenue_from_stock}` },
          { title: "Total Returns Value", value: `₹${analyticsData.total_returns_value}` },
          { title: "Online Returns Value", value: `₹${analyticsData.online_returns_value}` },
          { title: "Offline Returns Value", value: `₹${analyticsData.offline_returns_value}` },
          { title: "Returned Orders Count", value: analyticsData.returned_orders_count },
        ].map((stat, idx) => (
          <div key={idx} className="dynamic-stat-card">
            <p className="dynamic-stat-title">{stat.title}</p>
            <p className="dynamic-stat-value">{stat.value ?? 'N/A'}</p>
          </div>
        ))}
      </div>

      {[
        { key: "orders_today", title: "Orders Today" },
        { key: "orders_last_3_days", title: "Orders in Last 3 Days" },
        { key: "orders_last_week", title: "Orders in Last Week" },
        { key: "orders_last_month", title: "Orders in Last Month" }
      ].map(({ key, title }) => (
        <div key={key}>
          <h2
          onClick={() => toggleSection(key)}
          className={`collapsible-title ${expandedSections[key] ? 'open' : ''}`}
        >
          {title}
        </h2>

          {expandedSections[key] && (
            <Section
              title=""
              data={analyticsData[key]}
              keys={["order_id", "customer_name", "date", "status", "amount"]}
              handleView={handleViewOrder}
            />
          )}
        </div>
      ))}

      {analyticsData.order_status_counts && (
        <Section
          title="Order Status Counts"
          data={analyticsData.order_status_counts}
          keys={["status", "count"]}
          handleView={handleViewOrder}
        />
      )}
      {analyticsData.revenue_per_status && (
        <Section
          title="Revenue Per Status"
          data={analyticsData.revenue_per_status}
          keys={["status", "revenue"]}
          handleView={handleViewOrder}
        />
      )}
      {analyticsData.stock_levels && (
        <div className="stock-levels-header">
          <h2>Stock Levels</h2>
          <button className="view-all-items-button" onClick={handleViewAllItems}>View All Items</button>
        </div>
      )}
      {analyticsData.stock_levels && (
        <Section
          title=""
          data={analyticsData.stock_levels}
          keys={["item_id", "item_name", "quantity"]}
        />
      )}
      {analyticsData.out_of_stock_items && (
        <Section
          title="Out of Stock Items"
          data={analyticsData.out_of_stock_items}
          keys={["item_id", "item_name"]}
        />
      )}
      {analyticsData.best_selling_products && (
        <Section
          title="Best Selling Products"
          data={analyticsData.best_selling_products}
          keys={["item_id", "item_name", "total_quantity_sold", "total_revenue"]}
          handleView={handleViewItemDetails}
          showViewButton={true}
        />
      )}

      {showItemDetails && selectedItem && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Item Details</h2>
            <button className="modal-close-button" onClick={closeModal}>X</button>
            <div className="item-details">
              <p><strong>Name:</strong> {selectedItem.item_name}</p>
              <p><strong>Price:</strong> ₹{selectedItem.item_price}</p>
              <p><strong>Discount:</strong> {selectedItem.discount}%</p>
              <p><strong>Final Price:</strong> ₹{selectedItem.final_price}</p>
              <p><strong>Weight (kg):</strong> {selectedItem.kg}</p>
              <p><strong>Quality:</strong> {selectedItem.quality}</p>
              {selectedItem.product_image && (
                <img
                  src={`http://localhost:8000/${selectedItem.product_image.replace(/\\/g, "/")}`}
                  alt={selectedItem.item_name}
                  className="product-image"
                />
              )}
              <p><strong>Quantity:</strong> {selectedItem.quantity}</p>
              <p><strong>Description:</strong> {selectedItem.description}</p>
              <p><strong>Created At:</strong> {new Date(selectedItem.created_datetime).toLocaleString()}</p>
              <p><strong>Updated At:</strong> {new Date(selectedItem.updated_datetime).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Section = ({ title, data, keys, handleView, showViewButton }) => {
  if (!Array.isArray(data)) {
    return <p className="error-message">{title}: Data is not available or is invalid.</p>;
  }
  return (
    <div className="section">
      {title && <h2 className="section-title">{title}</h2>}
      {data.length === 0 ? (
        <p className="empty-message">No data found.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                {keys.map((key) => (
                  <th key={key}>{key.replace(/_/g, " ").toUpperCase()}</th>
                ))}
                {handleView && <th>ACTION</th>}
              </tr>
            </thead>
            <tbody>
              {data.map((entry, i) => (
                <tr key={i}>
                  {keys.map((key) => (
                    <td key={key}>{entry[key] ?? "—"}</td>
                  ))}
                  {handleView && (
                    <td>
                      <button className="table-button" onClick={() => handleView(entry)}>
                        View
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Analytics;