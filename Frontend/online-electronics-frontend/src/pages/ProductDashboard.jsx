import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "../css/ProductDashboard.css";
import ApiService from "../service/ApiService";
import AdminHeader from '../components/AdminHeader';

const ProductDashboard = () => {
  
  const { token, role } = useContext(AuthContext);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productSpecifications, setProductSpecifications] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productStock, setProductStock] = useState("");
  const [productCategoryName, setProductCategoryName] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [productsRes, categoriesRes] = await Promise.all([
          ApiService.getAllProducts(),
          ApiService.getAllCategory(),
        ]);

        const productsArray = Array.isArray(productsRes) ? productsRes : [];
        const categoriesArray = Array.isArray(categoriesRes) ? categoriesRes : [];

        setProducts(productsArray);
        setCategories(categoriesArray);
      } catch (err) {
        console.error("❌ Error loading data:", err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setProductName("");
    setProductDescription("");
    setProductSpecifications("");
    setProductPrice("");
    setProductStock("");
    setProductCategoryName("");
    setProductImage(null);
    setImagePreview(null);
    setEditingProduct(null);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("❌ You are not logged in! Please log in.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", productName);
      formData.append("description", productDescription);
      formData.append("specifications", productSpecifications);
      formData.append("price", productPrice);
      formData.append("stock", productStock);
      formData.append("categoryName", productCategoryName);
      if (productImage) {
        formData.append("image", productImage);
      }

      const res = await axios.post(
        "http://localhost:8080/api/products/admin",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProducts([...products, res.data]);
      resetForm();
      alert("✅ Product added successfully!");
    } catch (err) {
      console.error("❌ Error adding product:", err);
      alert(`Eroare: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDeleteProduct = async (product) => {
    if (!token) {
      alert("❌ You are not logged in! Please log in.");
      return;
    }

    try {
      await axios.delete(
        `http://localhost:8080/api/products/admin/${product.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setProducts(products.filter((p) => p.id !== product.id));
      alert("✅ Product deleted successfully!");
    } catch (err) {
      console.error("❌ Error deleting product:", err);
      alert(`Eroare: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleEditClick = (product) => {
    console.log("✏ Editing product:", product);
    setEditingProduct(product);
    setProductName(product.name);
    setProductDescription(product.description);
    setProductSpecifications(product.specifications);
    setProductPrice(product.price.toString());
    setProductStock(product.stock.toString());
    setProductCategoryName(product.categoryName || "");
    setImagePreview(product.image ? `http://localhost:8080${product.image}` : null);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("❌ You are not logged in! Please log in.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", productName);
      formData.append("description", productDescription);
      formData.append("specifications", productSpecifications);
      formData.append("price", productPrice);
      formData.append("stock", productStock);
      formData.append("categoryName", productCategoryName);
      if (productImage) {
        formData.append("image", productImage);
      }

      await axios.put(
        `http://localhost:8080/api/products/admin/${editingProduct.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const freshProducts = await ApiService.getAllProducts();
      setProducts(freshProducts);

      resetForm();
      alert("✅ Product updated successfully!");
    } catch (err) {
      console.error("❌ Error updating product:", err);
      alert(`Eroare: ${err.response?.data?.message || err.message}`);
    }
  };

  if (role !== "ADMIN") {
    return (
      <div className="products-dashboard">
        <p>❌You do not have access to this dashboard. Only administrators can access this page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="products-dashboard">
        <h2>Management Products</h2>
        {error && <p className="error">Loading error: {error}</p>}
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <AdminHeader title="Product Inventory" />  

    <div className="products-dashboard">
      <h2>Product Management</h2>

      <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}>
        <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>

        <label>
          Product Name:
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </label>

        <label>
          Description:
          <textarea
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            required
          />
        </label>

        <label>
          Specifications:
          <textarea
            value={productSpecifications}
            onChange={(e) => setProductSpecifications(e.target.value)}
            required
          />
        </label>

        <label>
          Price:
          <input
            type="number"
            step="0.01"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            required
          />
        </label>

        <label>
          Stock:
          <input
            type="number"
            value={productStock}
            onChange={(e) => setProductStock(e.target.value)}
            required
          />
        </label>

        <label>
          Category:
          <select
            value={productCategoryName}
            onChange={(e) => setProductCategoryName(e.target.value)}
            required
          >
            <option value="">Select a category</option>
           {categories.map((cat) => (
           <option key={cat.name} value={cat.name}>
            {cat.name}
            </option>
        ))}

            
          </select>
        </label>

        <label>
          Image:
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>

        {imagePreview && (
          <div className="image-preview">
            <img
              src={imagePreview}
              alt="Preview"
              style={{ maxWidth: "200px", marginTop: "10px" }}
            />
          </div>
        )}

        <div className="form-buttons">
          <button type="submit" className="btn btn-add">
            {editingProduct ? "Update Product" : "Add Product"}
          </button>
          {editingProduct && (
            <button type="button" onClick={resetForm} className="btn btn-cancel">
              Cancel
            </button>
          )}
        </div>
       
      </form>
      </div>

      <div className="products-list">
        <h3>Existing Products ({products.length})</h3>

        {products.length === 0 ? (
          <p>📦 There are no products yet. Add the first product!</p>
        ) : (
          <table className="product-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    {product.image && (
                      <img
                        src={`http://localhost:8080${product.image}`}
                        alt={product.name}
                        style={{ width: "50px", height: "50px", objectFit: "cover" }}
                      />
                    )}
                  </td>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>${product.price}</td>
                  <td>{product.stock}</td>
                  <td>{product.categoryName || "N/A"}</td>
                  <td>
                    <button onClick={() => handleEditClick(product)} className="btn btn-edit">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteProduct(product)} className="btn btn-delete">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ProductDashboard;
