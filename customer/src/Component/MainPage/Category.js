import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchItemsWithCategories } from './Service';

const CategoryPage = () => {
  const { id } = useParams();
  const [categoryItems, setCategoryItems] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const loadItems = async () => {
      try {
        const data = await fetchItemsWithCategories();
        const category = data.find((cat) => String(cat.category_id) === String(id));

        if (category) {
          setCategoryItems(category.items || []);
          setCategoryName(category.category_name || 'Unnamed Category');
        } else {
          console.warn('No matching category found for ID:', id);
        }
      } catch (error) {
        console.error('Failed to load category items:', error);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [id]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="category-page">
      <h2>{categoryName}</h2>
      {categoryItems.length > 0 ? (
        <ul>
          {categoryItems.map((item) => (
            <li key={item.item_id}>{item.item_name}</li>
          ))}
        </ul>
      ) : (
        <p>No items found in this category.</p>
      )}
    </div>
  );
};

export default CategoryPage;
