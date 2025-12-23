import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminHeader = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '20px',
      marginBottom: '30px',
      padding: '20px',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    }}>
      <button
        onClick={() => navigate('/admin')}
        style={{
          padding: '10px 20px',
          background: '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.3s',
          fontWeight: '500'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = '#5568d3';
          e.target.style.transform = 'translateX(-5px)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = '#667eea';
          e.target.style.transform = 'translateX(0)';
        }}
      >
        ← Back to Dashboard
      </button>
      
      <h1 style={{ 
        margin: 0, 
        flex: 1,
        fontSize: '1.8rem',
        color: '#333',
        fontWeight: '600'
      }}>
        {title}
      </h1>
    </div>
  );
};

export default AdminHeader;