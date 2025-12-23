import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ApiService from "../service/ApiService";  
import  "../css/ProductPage.css";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await ApiService.getProductById(id);
        console.log("Product loaded:", data);
        setProduct(data);
      } catch (err) {
        console.error("Error loading product:", err);
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  if (loading) return <p>⏳ Loading...</p>;
  if (error) return <p style={{ color: "red" }}>❌ Error: {error}</p>;
  if (!product) return <p>❌ Product not found</p>;

  return (
    <div className="product-page">
      <div className="product-details">
        {product.image && (
          <img 
            src={`http://localhost:8080${product.image}`}   /* 🔥 corect */
            alt={product.name} 
            className="product-image"
          />
        )}
        
        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="product-description">{product.description}</p>
          
          {product.specifications && (
            <div className="product-specs">
              <h3>Specifications:</h3>
              <p>{product.specifications}</p>
            </div>
          )}
          
          <p className="product-price">Price: {product.price} RON</p>
          
          <p className="product-stock">
            Stock: {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
          </p>
          
          {product.categoryName && (
            <p className="product-category">Category: {product.categoryName}</p>
          )}
          
          <button 
            className="btn-add-to-cart"
            disabled={product.stock === 0}
          >
            {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
