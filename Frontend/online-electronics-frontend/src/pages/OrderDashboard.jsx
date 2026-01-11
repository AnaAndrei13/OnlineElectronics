import React, { useState, useEffect } from 'react';
import { FaBox, FaEye, FaRedo, FaFilter, FaTimes, FaTimesCircle } from 'react-icons/fa';
import AdminHeader from '../components/AdminHeader';

const OrdersDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');

  const API_URL = 'http://localhost:8080/api/orders';

  const statusColors = {
    PENDING: { bg: '#fef3c7', color: '#92400e' },
    PROCESSING: { bg: '#dbeafe', color: '#1e40af' },
    PAID: { bg: '#bbf7d0', color: '#166534' },
    SHIPPED: { bg: '#e9d5ff', color: '#6b21a8' },
    DELIVERED: { bg: '#d1fae5', color: '#065f46' },
    CANCELLED: { bg: '#fee2e2', color: '#991b1b' }
  };

  const statusLabels = {
    PENDING: 'Pending',
    PROCESSING: 'Processing',
    PAID: 'Paid',
    SHIPPED: 'Shipped',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled'
  };

  useEffect(() => {
    fetchOrdersByUser();
  }, []);

  const fetchOrdersByUser = async () => {
    if (!selectedUserId) {
      setError('Enter userId');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/user/${selectedUserId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        setError('Nu sunteți autentificat. Vă rugăm să vă autentificați.');
        setOrders([]);
        return;
      }

      if (response.status === 403) {
        setError('Nu aveți permisiunea să vizualizați aceste comenzi.');
        setOrders([]);
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        setOrders([]);
     
      }
    } catch (err) {
      setError('Could not load orders: ' + err.message);
      console.error('Fetch error:', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/${orderId}/status?status=${newStatus}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.status === 401) {
        alert('You are not authenticated');
        return;
      }

      if (response.status === 403) {
        alert('You do not have permission to update the status');
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const updatedOrder = await response.json();
      
      setOrders(orders.map(order => 
        order.id === orderId ? updatedOrder : order
      ));
      
      alert('Status updated successfully!');
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/${orderId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.status === 401) {
        alert('You are not authenticated');
        return;
      }

      if (response.status === 400) {
        const errorText = await response.text();
        alert(errorText);
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const cancelledOrder = await response.json();
      
      setOrders(orders.map(order => 
        order.id === orderId ? cancelledOrder : order
      ));
      
      alert('Order cancelled successfully!');
    } catch (err) {
      alert('Error cancelling order: ' + err.message);
    }
  };

  const viewOrderDetails = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/details/${orderId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.status === 401) {
        alert('You are not authenticated');
        return;
      }

      if (response.status === 403 || response.status === 404) {
        const errorText = await response.text();
        alert(errorText);
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const orderData = await response.json();
      setSelectedOrder(orderData);
      setShowModal(true);
    } catch (err) {
      alert('Error loading details: ' + err.message);
    }
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <AdminHeader title="Order Inventory" />  
    <div style={styles.container}>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin { animation: spin 1s linear infinite; }
      `}</style>

      <div style={styles.maxWidth}>
        {/* Header */}
        <div style={styles.headerCard}>
          <div style={styles.headerTop}>
            <div style={styles.headerTitle}>
              <FaBox style={styles.headerIcon} />
              <h1 style={styles.h1}>Management Orders</h1>
            </div>
          </div>

          {/* User ID Input */}
          <div style={styles.userIdSection}>
            <input
              type="number"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              placeholder="Enter userId"
              style={styles.input}
            />
            <button
              onClick={fetchOrdersByUser}
              disabled={!selectedUserId || loading}
              style={{
                ...styles.primaryButton,
                ...((!selectedUserId || loading) && styles.disabledButton)
              }}
            >
              <FaRedo className={loading ? 'spin' : ''} style={styles.buttonIcon} />
              Load Orders
            </button>
          </div>
         </div>
          {/* Filters */}
          {orders.length > 0 && (
            <div style={styles.filters}>
              <div style={styles.filterLabel}>
                <FaFilter style={styles.filterIcon} />
                <span style={styles.filterText}>Filter:</span>
              </div>
              {['all', 'PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  style={{
                    ...styles.filterButton,
                    ...(filterStatus === status ? styles.filterButtonActive : styles.filterButtonInactive)
                  }}
                >
                  {status === 'all' ? 'All' : statusLabels[status]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div style={styles.errorBox}>
            <p style={styles.errorText}>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div style={styles.loadingCard}>
            <FaRedo className="spin" style={styles.loadingIcon} />
            <p style={styles.loadingText}>Load orders...</p>
          </div>
        )}

        {/* Orders Table */}
        {!loading && (
          <div style={styles.tableCard}>
            {filteredOrders.length === 0 ? (
              <div style={styles.emptyState}>
                <FaBox style={styles.emptyIcon} />
                <p style={styles.emptyText}>
                  {selectedUserId ? 'No orders for this user' : 'Select a user to view orders'}
                </p>
              </div>
            ) : (
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead style={styles.thead}>
                    <tr>
                      <th style={styles.th}>ID</th>
                      <th style={styles.th}>Total</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Created Date</th>
                      <th style={styles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} style={styles.tr}>
                        <td style={styles.td}>#{order.id}</td>
                        <td style={styles.tdBold}>
                          {order.totalPrice ? `${order.totalPrice.toFixed(2)} RON` : 'N/A'}
                        </td>
                        <td style={styles.td}>
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            style={{
                              ...styles.statusSelect,
                              backgroundColor: statusColors[order.status]?.bg || '#f3f4f6',
                              color: statusColors[order.status]?.color || '#374151'
                            }}
                          >
                            {Object.entries(statusLabels).map(([value, label]) => (
                              <option key={value} value={value}>{label}</option>
                            ))}
                          </select>
                        </td>
                        <td style={styles.td}>
                          {formatDate(order.createdAt)}
                        </td>
                        <td style={styles.td}>
                          <div style={styles.actions}>
                            <button
                              onClick={() => viewOrderDetails(order.id)}
                              style={styles.actionButton}
                              title="View details"
                            >
                              <FaEye style={styles.actionIcon} />
                            </button>
                            <button
                              onClick={() => cancelOrder(order.id)}
                              disabled={order.status === 'DELIVERED' || order.status === 'CANCELLED'}
                              style={{
                                ...styles.actionButton,
                                color: '#dc2626',
                                ...(order.status === 'DELIVERED' || order.status === 'CANCELLED' ? styles.disabledActionButton : {})
                              }}
                              title="Cancel order"
                            >
                              <FaTimesCircle style={styles.actionIcon} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Order Details */}
      {showModal && selectedOrder && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Order details #{selectedOrder.id}</h2>
              <button
                onClick={() => setShowModal(false)}
                style={styles.closeButton}
              >
                <FaTimes style={styles.closeIcon} />
              </button>
            </div>
            
            <div style={styles.modalContent}>
              <div style={styles.grid2}>
                <div style={styles.infoBlock}>
                  <p style={styles.infoLabel}>Status</p>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: statusColors[selectedOrder.status]?.bg || '#f3f4f6',
                    color: statusColors[selectedOrder.status]?.color || '#374151'
                  }}>
                    {statusLabels[selectedOrder.status]}
                  </span>
                </div>
                <div style={styles.infoBlock}>
                  <p style={styles.infoLabel}>Order Total</p>
                  <p style={styles.totalPrice}>
                    {selectedOrder.totalPrice ? `${selectedOrder.totalPrice.toFixed(2)} RON` : 'N/A'}
                  </p>
                </div>
                <div style={styles.infoBlock}>
                  <p style={styles.infoLabel}>Created Date</p>
                  <p style={styles.infoValue}>{formatDate(selectedOrder.createdAt)}</p>
                </div>
                <div style={styles.infoBlock}>
                  <p style={styles.infoLabel}>Last Updated</p>
                  <p style={styles.infoValue}>{formatDate(selectedOrder.updatedAt)}</p>
                </div>
              </div>

              {selectedOrder.user && (
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>Customer Information</h3>
                  <div style={styles.grid2}>
                    <div style={styles.infoBlock}>
                      <p style={styles.infoLabel}>Name</p>
                      <p style={styles.infoValue}>{selectedOrder.user.firstName} {selectedOrder.user.lastName}</p>
                    </div>
                    <div style={styles.infoBlock}>
                      <p style={styles.infoLabel}>Email</p>
                      <p style={styles.infoValue}>{selectedOrder.user.email || 'N/A'}</p>
                    </div>
                    <div style={styles.infoBlock}>
                      <p style={styles.infoLabel}>Phone</p>
                      <p style={styles.infoValue}>{selectedOrder.user.phoneNumber || 'N/A'}</p>
                    </div>
                    <div style={styles.infoBlock}>
                      <p style={styles.infoLabel}>Address</p>
                      <p style={styles.infoValue}>{selectedOrder.user.address || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>Ordered Products</h3>
                  <div style={styles.itemsList}>
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} style={styles.orderItem}>
                        <div style={styles.itemInfo}>
                          <p style={styles.itemName}>
                            {item.product?.name || 'Unknown product'}
                          </p>
                          <p style={styles.itemDetails}>
                            Quantity: {item.quantity} × {item.priceAtPurchase ? `${item.priceAtPurchase.toFixed(2)} RON` : 'N/A'}
                          </p>
                        </div>
                        <p style={styles.itemTotal}>
                          {item.priceAtPurchase && item.quantity ? `${(item.priceAtPurchase * item.quantity).toFixed(2)} RON` : 'N/A'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    padding: '24px'
  },
  maxWidth: {
    maxWidth: '1280px',
    margin: '0 auto'
  },
  headerCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    padding: '24px',
    marginBottom: '24px'
  },
  headerTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px'
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  headerIcon: {
    width: '32px',
    height: '32px',
    color: '#764ba2'
  },
  h1: {
    fontSize: '30px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: 0
  },
  userIdSection: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px'
  },
  input: {
    flex: 1,
    padding: '10px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none'
  },
  primaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 24px',
    backgroundColor: '#764ba2',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s'
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed'
  },
  buttonIcon: {
    width: '16px',
    height: '16px'
  },
  filters: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap'
  },
  filterLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  filterIcon: {
    width: '20px',
    height: '20px',
    color: '#4b5563'
  },
  filterText: {
    color: '#374151',
    fontWeight: '500'
  },
  filterButton: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s'
  },
  filterButtonActive: {
    backgroundColor: '#764ba2',
    color: 'white'
  },
  filterButtonInactive: {
    backgroundColor: '#f3f4f6',
    color: '#374151'
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#991b1b',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px'
  },
  errorText: {
    fontWeight: '500',
    margin: 0
  },
  loadingCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    padding: '48px',
    textAlign: 'center'
  },
  loadingIcon: {
    width: '48px',
    height: '48px',
    color: '#2563eb',
    margin: '0 auto 16px'
  },
  loadingText: {
    color: '#4b5563'
  },
  tableCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  },
  emptyState: {
    padding: '48px',
    textAlign: 'center'
  },
  emptyIcon: {
    width: '64px',
    height: '64px',
    color: '#d1d5db',
    margin: '0 auto 16px'
  },
  emptyText: {
    color: '#6b7280',
    fontSize: '18px'
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  thead: {
    backgroundColor: '#f9fafb',
    borderBottom: '1px solid #e5e7eb'
  },
  th: {
    padding: '16px 24px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '600',
    color: '#4b5563',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  tr: {
    borderBottom: '1px solid #e5e7eb',
    transition: 'background-color 0.2s'
  },
  td: {
    padding: '16px 24px',
    fontSize: '14px',
    color: '#374151'
  },
  tdBold: {
    padding: '16px 24px',
    fontSize: '14px',
    color: '#111827',
    fontWeight: '600'
  },
  statusSelect: {
    padding: '4px 12px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer'
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  actionButton: {
    padding: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    color: '#2563eb',
    transition: 'background-color 0.2s'
  },
  disabledActionButton: {
    opacity: 0.5,
    cursor: 'not-allowed'
  },
  actionIcon: {
    width: '16px',
    height: '16px'
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    zIndex: 50
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '8px',
    maxWidth: '768px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto'
  },
  modalHeader: {
    padding: '24px',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    backgroundColor: 'white'
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: 0
  },
  closeButton: {
    padding: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  closeIcon: {
    width: '24px',
    height: '24px'
  },
  modalContent: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '24px'
  },
  infoBlock: {
    display: 'flex',
    flexDirection: 'column'
  },
  infoLabel: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '4px'
  },
  infoValue: {
    fontWeight: '600',
    color: '#111827',
    fontSize: '16px'
  },
  statusBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '9999px',
    fontSize: '14px',
    fontWeight: '600',
    width: 'fit-content'
  },
  totalPrice: {
    fontWeight: 'bold',
    color: '#111827',
    fontSize: '24px'
  },
  section: {
    borderTop: '1px solid #e5e7eb',
    paddingTop: '24px'
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '16px',
    fontSize: '18px'
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  orderItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px'
  },
  itemInfo: {
    flex: 1
  },
  itemName: {
    fontWeight: '600',
    color: '#111827',
    margin: '0 0 4px 0'
  },
  itemDetails: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0
  },
  itemTotal: {
    fontWeight: 'bold',
    color: '#111827',
    fontSize: '18px',
    margin: 0
  }
};

export default OrdersDashboard;