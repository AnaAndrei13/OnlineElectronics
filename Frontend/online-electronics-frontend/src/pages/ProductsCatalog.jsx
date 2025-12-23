import React, { useState, useEffect } from 'react';
import ApiService from '../service/ApiService';
import { Link } from "react-router-dom";

const ProductsCatalog = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          ApiService.getAllProducts(),
          ApiService.getAllCategory()
        ]);
        
        setProducts(productsData || []);
        const cats = ['All', ...(categoriesData || []).map(c => c.name)];
        setCategories(cats);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  const filteredProducts = products.filter(product => {
    const matchCategory = selectedCategory === 'All' || product.categoryName === selectedCategory;
    const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) goToPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) goToPage(currentPage - 1);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Loading products...
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '1400px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: '700',
          color: '#1a1a1a',
          marginBottom: '10px'
        }}>
          Our Products
        </h1>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>
          Discover our collection of premium electronics
        </p>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        marginBottom: '30px',
        flexWrap: 'wrap',
        background: '#f8f9fa',
        padding: '20px',
        borderRadius: '12px'
      }}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: '1',
            minWidth: '250px',
            padding: '12px 16px',
            fontSize: '1rem',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            outline: 'none'
          }}
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: '12px 16px',
            fontSize: '1rem',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            backgroundColor: 'white',
            cursor: 'pointer',
            outline: 'none',
            minWidth: '150px'
          }}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div style={{ 
        marginBottom: '20px',
        fontSize: '0.95rem',
        color: '#666',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        
        {totalPages > 1 && (
          <span>
            Page {currentPage} of {totalPages}
          </span>
        )}
      </div>

      {filteredProducts.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#999',
          fontSize: '1.1rem'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📦</div>
          No products found. Try adjusting your filters.
        </div>
      ) : (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
            marginBottom: '40px'
          }}>
            {currentProducts.map(product => (
              <Link 
                  key={product.id} 
                  to={`/products/${product.id}`} 
                  style={{ textDecoration: "none", color: "inherit" }}
                >
              <div
                key={product.id}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative'
                }}
              >
                {product.stock < 10 && (
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: product.stock === 0 ? '#dc3545' : '#ff9800',
                    color: 'white',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    zIndex: 1
                  }}>
                    {product.stock === 0 ? 'Out of stock' : `Only ${product.stock} left`}
                  </div>
                )}

                <div style={{
                  width: '100%',
                  height: '200px',
                  overflow: 'hidden',
                  backgroundColor: '#f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '10px'
                }}>
                  <img
                    src={`http://localhost:8080${product.image}`}
                    alt={product.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain'
                    }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                  />
                </div>

                <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <span style={{
                    display: 'inline-block',
                    fontSize: '0.7rem',
                    color: '#007bff',
                    backgroundColor: '#e7f3ff',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    marginBottom: '6px',
                    width: 'fit-content',
                    fontWeight: '500'
                  }}>
                    {product.categoryName}
                  </span>

                  <h3 style={{
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    marginBottom: '6px',
                    lineHeight: '1.3',
                    minHeight: '2.4rem'
                  }}>
                    {product.name}
                  </h3>

                  <p style={{
                    fontSize: '0.8rem',
                    color: '#666',
                    marginBottom: '10px',
                    lineHeight: '1.4',
                    flex: 1
                  }}>
                    {product.description}
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 'auto',
                    paddingTop: '10px',
                    borderTop: '1px solid #f0f0f0'
                  }}>
                    <div style={{
                      fontSize: '1.3rem',
                      fontWeight: '700',
                      color: '#890f92ff'
                    }}>
                      {product.price.toFixed(2)} RON
                    </div>
                    
                    <button
                      disabled={product.stock === 0}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: product.stock === 0 ? '#ccc' : '#764ba2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                        opacity: product.stock === 0 ? 0.6 : 1
                      }}
                      onClick={() => {
                        if (product.stock > 0) {
                          alert(`Added "${product.name}" to cart!`);
                        }
                      }}
                    >
                      {product.stock === 0 ? 'Unavailable' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              marginTop: '40px',
              marginBottom: '40px',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                style={{
                  padding: '10px 16px',
                  border: '2px solid #e0e0e0',
                  backgroundColor: currentPage === 1 ? '#f5f5f5' : 'white',
                  color: currentPage === 1 ? '#999' : '#333',
                  borderRadius: '8px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '600'
                }}
              >
                ← Previous
              </button>

              {getPageNumbers().map((page, index) => (
                page === '...' ? (
                  <span key={`ellipsis-${index}`} style={{
                    padding: '10px 16px',
                    color: '#999',
                    fontSize: '0.95rem'
                  }}>
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    style={{
                      padding: '10px 16px',
                      minWidth: '44px',
                      border: '2px solid',
                      borderColor: currentPage === page ? '#764ba2' : '#e0e0e0',
                      backgroundColor: currentPage === page ? '#764ba2' : 'white',
                      color: currentPage === page ? 'white' : '#333',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                      fontWeight: currentPage === page ? '700' : '600'
                    }}
                  >
                    {page}
                  </button>
                )
              ))}

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                style={{
                  padding: '10px 16px',
                  border: '2px solid #e0e0e0',
                  backgroundColor: currentPage === totalPages ? '#f5f5f5' : 'white',
                  color: currentPage === totalPages ? '#999' : '#333',
                  borderRadius: '8px',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '600'
                }}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductsCatalog;