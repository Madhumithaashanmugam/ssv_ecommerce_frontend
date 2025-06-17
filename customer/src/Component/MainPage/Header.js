import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import logo from '../../Assets/SSV_logo.png';
import { fetchItemsWithCategories } from './Service';
import './Header.css';


const Header = () => {
  const [categories, setCategories] = useState([]);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchItemsWithCategories();
        setCategories(data || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    loadCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    setShowSideMenu(false);
    if (!categoryId || categoryId === 'all') {
      navigate('/main');
    } else {
      navigate(`/main?category=${categoryId}`);
    }
  };

  return (
    <>
      <header className="main-header">
        <div className="logo-title">
          <img src={logo} alt="SSV Logo" className="logo" />
          <h1>Sri Sai Venkateswara</h1>
        </div>

        <div className="hamburger" onClick={() => setShowSideMenu(true)}>
          <div></div>
          <div></div>
          <div></div>
        </div>

        <nav className="nav-links">
        <Link to="/past-orders">Orders</Link>
          <Link to="/user-details" title="Account">
            <FaUser className="nav-icon" />
          </Link>
          
          <Link to="/cart" title="Cart">
            <FaShoppingCart className="nav-icon" />
          </Link>
        </nav>
      </header>

      <div className={`side-menu ${showSideMenu ? 'open' : ''}`}>
        <button className="close-btn" onClick={() => setShowSideMenu(false)}>&times;</button>
        <ul className="side-menu-categories">
          <li onClick={() => handleCategoryClick('all')}>All Items</li>
          {categories.map((cat, idx) => {
            const id = cat.category_id || cat.id;
            const name = cat.category_name || cat.name || 'Unnamed Category';
            return (
              <li key={idx} onClick={() => handleCategoryClick(id)}>
                {name}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default Header;
