// AddCategory.js
import React, { useState } from 'react';
import './category.css';

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Category submitted:', categoryName);
    // Add your API call here
  };

  return (
    <div className="add-category-container">
      <h2>Add New Category</h2>
      <form onSubmit={handleSubmit} className="category-form">
        <label htmlFor="categoryName">Category Name:</label>
        <input
          type="text"
          id="categoryName"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          required
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default AddCategory;
