import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import '../css/Wishlist.css';

const Wishlist = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated()) {
      loadWishlist();
    } else {
      setLoading(false);
    }
  }, []);

  const loadWishlist = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.get('http://localhost:8080/api/wishlist/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setWishlist(response.data);
      
    } catch (err) {
      setError(err.response?.data || 'Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    if (!window.confirm('Remove this product from your wishlist?')) {
      return;
    }

    try {
 
      const token = localStorage.getItem('token');
      
      await axios.delete(`http://localhost:8080/api/wishlist/remove/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Update local state
      setWishlist({
        ...wishlist,
        items: wishlist.items.filter(item => item.product.id !== productId)
      });
      
     
      
    } catch (err) {
      alert(`Error: ${err.response?.data || err.message}`);
    }
  };


  // Not authenticated
  if (!isAuthenticated()) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-header">
          <h2>❌ Please login to view your wishlist</h2>
        </div>
        
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-header">
          <h2>⏳ Loading your wishlist...</h2>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-header">
          <h2>❌ Error</h2>
        </div>
        <div className="empty-wishlist">
          <p>{error}</p>
          <button onClick={loadWishlist} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty wishlist
  if (!wishlist || !wishlist.items || wishlist.items.length === 0) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-header">
          <h2> Wishlist</h2>
        </div>
        <div className="empty-wishlist">
          <p>Your wishlist is empty</p>
          <p>Start adding products you love!</p>
          <a href="/products" className="btn btn-primary">
            Browse Products
          </a>
        </div>
      </div>
    );
  }

  // Display wishlist with products
  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <h2> My Wishlist</h2>
        <span className="item-count">
          ({wishlist.items.length} {wishlist.items.length === 1 ? 'item' : 'items'})
        </span>
      </div>

      <div className="wishlist-grid">
        {wishlist.items.map((item) => (
          <div key={item.id} className="wishlist-card">
            <div className="product-image">
              {item.product.image ? (
                <img
                  src={`http://localhost:8080${item.product.image}`}
                  alt={item.product.name}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="no-image">
                  <span>📦</span>
                  <p>No Image</p>
                </div>
              )}
            </div>

            <div className="product-info">
              <h3 className="product-name">{item.product.name}</h3>
              
              <p className="product-description">
                {item.product.description && item.product.description.length > 100
                  ? `${item.product.description.substring(0, 100)}...`
                  : item.product.description}
              </p>
              
              <div className="product-details">
                <span className="price">
                  ${item.product.price ? item.product.price.toFixed(2) : '0.00'}
                </span>
                <span className={`stock ${item.product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                  {item.product.stock > 0 
                    ? `✓ In Stock (${item.product.stock})` 
                    : '✗ Out of Stock'}
                </span>
              </div>

              <div className="product-actions">
                <button 
                  onClick={() => handleRemoveFromWishlist(item.product.id)}
                  className="btn btn-remove"
                >
                   Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;