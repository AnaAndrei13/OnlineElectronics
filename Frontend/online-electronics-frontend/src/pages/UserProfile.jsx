import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaShoppingBag, FaCalendar, FaSpinner } from 'react-icons/fa';

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: ''
  });

  const [orderHistory, setOrderHistory] = useState([]);

  // Load user info
  useEffect(() => {
    fetchUserInfo();
    fetchOrderHistory();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.get('http://localhost:8080/api/users/profile', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`, 
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
      });
    
      const user = await response.data;
  
      
      const formattedData = {
        fullName:  user.fullName || 'Utilizator',
        email: user.email || '',
        phone: user.phone || user.phoneNumber || '',
        address: user.address ||  ''
      };
      
      
      setUserData(formattedData);
    } catch (err) {
      console.error('❌ Eroare la încărcarea datelor:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderHistory = async () => {
    try {
      setLoading(true);
      console.log('🛒 Fetching orders for authenticated user');
      const token = localStorage.getItem('token');
      
      const response = await axios.get('http://localhost:8080/api/orders/my-orders', {
       method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`, 
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
      });
      
      const orders = await response.data;
      
      setOrderHistory(orders);
    } catch (err) {
      console.error('❌ Eroare la încărcarea comenzilor:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }; 

  const getStatusColor = (status) => {
    const statusColors = {
      'PENDING': 'linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%)',
      'PAID': 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
      'SHIPPED': 'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)',
      'DELIVERED': 'linear-gradient(135deg, #55efc4 0%, #00b894 100%)',
      'CANCELLED': 'linear-gradient(135deg, #ff7675 0%, #d63031 100%)'
    };
    return statusColors[status] || 'linear-gradient(135deg, #dfe6e9 0%, #b2bec3 100%)';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '20px',
          textAlign: 'center',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
        }}>
          <FaSpinner style={{
            fontSize: '48px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{marginTop: '20px', color: '#64748b', fontSize: '18px'}}>
            Loading data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '20px',
          textAlign: 'center',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          maxWidth: '500px'
        }}>
          <div style={{fontSize: '48px', marginBottom: '20px'}}>⚠️</div>
          <h2 style={{color: '#1e293b', marginBottom: '10px'}}>Error</h2>
          <p style={{color: '#64748b', fontSize: '16px'}}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '40px 20px'
    }}>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '1.5rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '30px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
              color: 'white',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
            }}>
              <FaUser />
            </div>
            <div style={{flex: 1}}>
              <h1 style={{
                margin: '0 0 0.5rem 0',
                fontSize: '2rem',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {userData.fullName || 'User'}
              </h1>
              <p style={{
                margin: 0,
                color: '#64748b',
                fontSize: '1.1rem'
              }}>
                {userData.email}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setActiveTab('personal')}
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '1.25rem 1.5rem',
              background: activeTab === 'personal' 
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                : 'white',
              border: activeTab === 'personal' ? 'none' : '2px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '600',
              color: activeTab === 'personal' ? 'white' : '#64748b',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: activeTab === 'personal' 
                ? '0 6px 20px rgba(102, 126, 234, 0.4)' 
                : '0 2px 8px rgba(0,0,0,0.06)'
            }}
          >
            Personal Data
          </button>
          
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '1.25rem 1.5rem',
              background: activeTab === 'orders' 
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                : 'white',
              border: activeTab === 'orders' ? 'none' : '2px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '600',
              color: activeTab === 'orders' ? 'white' : '#64748b',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: activeTab === 'orders' 
                ? '0 6px 20px rgba(102, 126, 234, 0.4)' 
                : '0 2px 8px rgba(0,0,0,0.06)'
            }}
          >
            Order History ({orderHistory.length})
          </button> 
        </div>

        {/* Content */}
        {activeTab === 'personal' && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            border: '1px solid #e2e8f0'
          }}>
            <h2 style={{
              margin: '0 0 1.5rem 0',
              color: '#1e293b',
              fontSize: '1.5rem',
              fontWeight: '700'
            }}>
              Personal Information
            </h2>

            <div style={{
              display: 'grid',
              gap: '1.5rem'
            }}>
              {/* Name */}
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.75rem',
                  color: '#64748b',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  <FaUser /> Full Name
                </label>
                <div style={{
                  padding: '1rem 1.25rem',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  color: '#1e293b',
                  fontWeight: '500',
                  border: '1px solid #e2e8f0'
                }}>
                  {userData.fullName}
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.75rem',
                  color: '#64748b',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  <FaEnvelope /> Email
                </label>
                <div style={{
                  padding: '1rem 1.25rem',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  color: '#1e293b',
                  fontWeight: '500',
                  border: '1px solid #e2e8f0'
                }}>
                  {userData.email}
                </div>
              </div>

              {/* Phone */}
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.75rem',
                  color: '#64748b',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  <FaPhone /> Phone
                </label>
                <div style={{
                  padding: '1rem 1.25rem',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  color: userData.phone ? '#1e293b' : '#94a3b8',
                  fontWeight: '500',
                  border: '1px solid #e2e8f0'
                }}>
                  {userData.phone || 'Not set'}
                </div>
              </div>

              {/* Address */}
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.75rem',
                  color: '#64748b',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  <FaMapMarkerAlt /> Address
                </label>
                <div style={{
                  padding: '1rem 1.25rem',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  color: userData.address ? '#1e293b' : '#94a3b8',
                  fontWeight: '500',
                  border: '1px solid #e2e8f0'
                }}>
                  {userData.address || 'Not set'}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'orders' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            {orderHistory.length === 0 ? (
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '4rem 2rem',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                border: '1px solid #e2e8f0'
              }}>
                <FaShoppingBag style={{
                  fontSize: '64px',
                  color: '#cbd5e1',
                  marginBottom: '1.5rem'
                }} />
                <h3 style={{
                  color: '#64748b',
                  margin: '0 0 0.5rem 0',
                  fontSize: '1.25rem'
                }}>
                  No orders yet
                </h3>
                <p style={{color: '#94a3b8', margin: 0}}>
                  Your order history will appear here
                </p>
              </div>
            ) : (
              orderHistory.map((order) => (
                <div
                  key={order.id}
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '2rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(102, 126, 234, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.5rem',
                    paddingBottom: '1.5rem',
                    borderBottom: '2px solid #f1f5f9',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}>
                    <div>
                      <h3 style={{
                        margin: '0 0 0.5rem 0',
                        color: '#1e293b',
                        fontSize: '1.25rem',
                        fontWeight: '700'
                      }}>
                        Order #{order.id}
                      </h3>
                      <p style={{
                        margin: 0,
                        color: '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem'
                      }}>
                        <FaCalendar /> {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div style={{
                      padding: '0.625rem 1.25rem',
                      background: getStatusColor(order.status),
                      color: 'white',
                      borderRadius: '20px',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}>
                      {order.status}
                    </div>
                  </div>

                  <div style={{marginBottom: '1.5rem'}}>
                    {order.items && order.items.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '1rem 0',
                          borderBottom: idx < order.items.length - 1 ? '1px solid #f1f5f9' : 'none',
                          gap: '1rem'
                        }}
                      >
                        <div style={{flex: 1}}>
                          <div style={{
                            fontWeight: '600',
                            color: '#1e293b',
                            marginBottom: '0.25rem'
                          }}>
                            {item.product?.name || item.productName || 'Product'}
                          </div>
                          <div style={{
                            color: '#64748b',
                            fontSize: '0.875rem'
                          }}>
                            Quantity: {item.quantity}
                          </div>
                        </div>
                        <div style={{
                          fontWeight: '700',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          fontSize: '1.125rem',
                          whiteSpace: 'nowrap'
                        }}>
                          {(item.priceAtPurchase * item.quantity).toFixed(2)} RON
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '1.5rem',
                    borderTop: '2px solid #f1f5f9'
                  }}>
                    <div style={{
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: '#64748b'
                    }}>
                      Total
                    </div>
                    <div style={{
                      fontSize: '1.75rem',
                      fontWeight: '800',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>
                      {order.totalPrice?.toFixed(2)} RON 
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )} 
      </div>
    </div>
  );
}