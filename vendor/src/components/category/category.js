import React, { useState, useEffect } from 'react';
import { createCategory, listCategories } from './Service';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext'; // adjust path based on your structure

import './category.css';

const AddCategory = () => {
  const navigate = useNavigate();
  const { authData } = useAuth();

  const [categoryName, setCategoryName] = useState('');
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const vendorId = authData?.user?.id;

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const categoriesData = await listCategories();
      setCategories(categoriesData);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!categoryName.trim()) {
      setError('Please enter a category name.');
      return;
    }

    if (!vendorId) {
      setError('Vendor not logged in. Please log in again.');
      return;
    }

    const categoryData = {
      category_name: categoryName.trim(),
      vendor_id: vendorId,
    };

    try {
      const newCategory = await createCategory(categoryData);
      setMessage('Category created successfully!');
      setCategoryName('');
      navigate(`/items?categoryId=${newCategory.id}`);

    } catch (err) {
      setError('Failed to create category. Please try again.');
      console.error(err);
    }
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/items?categoryId=${categoryId}`);
  };

  return (
    <div className="add-category-container">
      <div className="header">
        <h1>Add New Category</h1>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="category-form">
          <div>
            <label htmlFor="categoryName">Category Name:</label>
            <input
              type="text"
              id="categoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
              placeholder="Enter Category Name"
            />
          </div>
          <button type="submit" className="submit-button">
            Add Category
          </button>
        </form>
      </div>

      <div className="category-list">
        <h3>Existing Categories:</h3>
        {categories.length === 0 ? (
          <p>No categories available.</p>
        ) : (
          <div className="category-buttons">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="category-button"
              >
                {category.category_name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddCategory;
