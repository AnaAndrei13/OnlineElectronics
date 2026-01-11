import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/Cart.css';

const Cart = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingQuantity, setUpdatingQuantity] = useState({});
  const [placingOrder, setPlacingOrder] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      loadCart();
    } else {
      setLoading(false);
    }
  }, []);

  const loadCart = async () => {
    setLoading(true);
    setError(null);
    
    try {
      
      const token = localStorage.getItem('token');

      const response = await axios.get('http://localhost:8080/api/cart/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
     let cartData;

    if (Array.isArray(response.data)) {
      //If returns array of items
      cartData = {
        id: null,
        cartItem: response.data,
        items: response.data  
      };
    } 
    else {
      cartData = {
        ...response.data,
        items: response.data.cartItem || response.data.items || []
      };
    }
     setCart(cartData);
    
  } catch (err) {
    setError(err.response?.data || 'Failed to load cart');

  } finally {
    setLoading(false);
  }
};

  
const updateQuantity = async (productId, newQuantity) => {

    if (newQuantity < 1) return;
    
    try {
      setUpdatingQuantity(prev => ({ ...prev, [productId]: true }));
      
      const token = localStorage.getItem('token');

      await axios.put(
        `http://localhost:8080/api/cart/update`,
        null,
        {
          params: { productId, quantity: newQuantity },
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Update local state
      setCart({
        ...cart,
        items: cart.items.map(item =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      });
      
    } catch (err) {
      alert(`Error: ${err.response?.data || err.message}`);
    } finally {
      setUpdatingQuantity(prev => ({ ...prev, [productId]: false }));
    }
  };

  const clearCart = async () => {
    if (!window.confirm('Clear all items from your cart?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/api/cart/clear`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setCart({ ...cart, items: [] });
      alert('✅ Cart cleared!');
      
    } catch (err) {
      alert(`Error: ${err.response?.data || err.message}`);
    }
  };

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

 
const removeFromCart = async (productId) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(
      `http://localhost:8080/api/cart/remove/${productId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }
    
    // Update local state - remove item from list
    setCart({
      ...cart,
      items: cart.items.filter(item => item.product.id !== productId)
    });
    
  
    
  } catch (error) {
    
    if (error.message.includes('401') || error.message.includes('403')) {
      localStorage.removeItem('token');
      navigate('/login');

    } else {
      alert(`❌ Error: ${error.message}`);
    }
  }
};



const handlePlaceOrder = async () => {
  if (!cart || !cart.items || cart.items.length === 0) {
    return;
  }

  //navigate('/checkout.html');
   window.location.href = '/Checkout.html';
};


  // Not authenticated
  if (!isAuthenticated()) {
    return (
      <div className="cart-page">
        <div className="cart-header">
          <h2>❌ Please login to view your cart</h2>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="cart-page">
        <div className="cart-header">
          <h2>⏳ Loading your cart...</h2>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="cart-page">
        <div className="cart-header">
          <h2>❌ Error</h2>
        </div>
        <div className="empty-cart">
          <p>{error}</p>
          <button onClick={loadCart} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty cart
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-header">
          <h2>🛒 Shopping Cart</h2>
        </div>
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <p>Your cart is empty</p>
          <p>Start adding products to your cart!</p>
          <a href="/products" className="btn btn-primary">
            Browse Products
          </a>
        </div>
      </div>
    );
  }

  // Display cart with products
  return (
    <div className="cart-page">
      <div className="cart-header">
        <h2>🛒 Shopping Cart</h2>
        <div className="cart-actions-header">
          <span className="item-count">
            ({cart.items.length} {cart.items.length === 1 ? 'item' : 'items'})
          </span>
          {cart.items.length > 0 && (
            <button onClick={clearCart} className="btn-clear-cart">
              Clear Cart
            </button>
          )}
        </div>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {cart.items.map((item) => (
            <div key={item.id} className="cart-card">
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
                <div className="product-details-left">
                  <h3 className="product-name">{item.product.name}</h3>
                  
                  <p className="product-description">
                    {item.product.description && item.product.description.length > 100
                      ? `${item.product.description.substring(0, 100)}...`
                      : item.product.description}
                  </p>
                  
                  <div className="product-meta">
                    <span className={`stock ${item.product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                      {item.product.stock > 0 
                        ? `✓ In Stock (${item.product.stock})` 
                        : '✗ Out of Stock'}
                    </span>
                    <span className="price-per-unit">
                      {item.product.price.toFixed(2)} RON each
                    </span>
                  </div>
                </div>

                <div className="product-details-right">
                  <div className="quantity-controls">
                    <label>Quantity:</label>
                    <div className="quantity-buttons">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || updatingQuantity[item.product.id]}
                        className="quantity-btn"
                      >
                        −
                      </button>
                      <span className="quantity-display">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock || updatingQuantity[item.product.id]}
                        className="quantity-btn"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="item-total">
                    <span className="item-total-label">Total:</span>
                    <span className="item-total-price">
                      {(item.product.price * item.quantity).toFixed(2)} RON
                    </span>
                  </div>

                  <button 
                    onClick={() => removeFromCart(item.product.id)}
                    className="btn btn-remove-small"
                  >
                     Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="summary-card">
            <h3>Order Summary</h3>
            
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>{calculateTotal().toFixed(2)} RON</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            
            <div className="summary-row summary-total">
              <span>Total:</span>
              <span className="total-amount">{calculateTotal().toFixed(2)} RON </span>
            </div>
            {/* Place Order */}
                <button 
                  onClick={handlePlaceOrder}
                  disabled={!cart || !cart.items || cart.items.length === 0}
                  style={{
                    width: '100%',
                    padding: '14px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: cart?.items?.length > 0 ? 'pointer' : 'not-allowed',
                    marginBottom: '12px',
                    transition: 'all 0.2s',
                    opacity: cart?.items?.length > 0 ? 1 : 0.5
                  }}
                  onMouseEnter={(e) => {
                    if (cart?.items?.length > 0) {
                      e.currentTarget.style.backgroundColor = '#059669';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#10b981';
                  }}
                >
                  Checkout
                </button>

            

            <a href="/products" className="btn btn-continue">
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;