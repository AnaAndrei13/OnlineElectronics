import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "../css/CategoriesDashboard.css";
import ApiService from "../service/ApiService";
import AdminHeader from '../components/AdminHeader';

const CategoryDashboard = () => {
const { token, role } = useContext(AuthContext);
const [categoryName, setCategoryName] = useState("");
const [categoryDescription, setCategoryDescription] = useState("");
const [categories, setCategories] = useState([]);
const [editingCategory, setEditingCategory] = useState(null);


 useEffect(() => {
  const loadCategories = async () => {
    try {
      console.log("Loading categories...");
      const res = await ApiService.getAllCategory();
      console.log(" Categories loaded:", res);
      setCategories(res);
    } catch (err) {
      console.error(" Error fetching categories:", err);
      console.error(" Error response:", err.response?.data);
      console.error(" Error status:", err.response?.status);
      console.error(" Error message:", err.message);
    }
  };
  loadCategories();
}, [token]);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8080/api/categories",
        { name: categoryName,
          description: categoryDescription
         },
        { headers: { Authorization: `Bearer ${token}` } }
      );
     setCategories([...categories, res.data]);
     setCategoryName("");
     setCategoryDescription("");
    } catch (err) {
      console.error("Error adding category:", err);
    }
  };

const handleDeleteCategory = async (cat) => {
  console.log(" DELETE BUTTON CLICKED");
  console.log(" Category object:", cat);
  console.log(" Token:", token);
  console.log(" Role:", role);
  console.log(" Category name to delete:", cat.name);
  
  if (!token) {
    console.error(" NO TOKEN!");
    alert("Nu ești autentificat! Loghează-te din nou.");
    return;
  }
  
  if (!cat.name) {
    console.error(" NO CATEGORY NAME!");
    return;
  }
  
  try {
    console.log("Sending DELETE request...");
    const response = await axios.delete(
      `http://localhost:8080/api/categories/${encodeURIComponent(cat.name)}`,
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log(" DELETE successful:", response.data);
    console.log(" Updating categories list...");
    setCategories(categories.filter(c => c.name !== cat.name));
    console.log(" Categories updated!");
  } catch (err) {
    console.error(" DELETE ERROR:", err);
    console.error(" Error response:", err.response?.data);
    console.error(" Error status:", err.response?.status);
    alert(`Eroare: ${err.response?.data?.message || err.message}`);
  }
};

const handleEditClick = (cat) => {
  console.log(" Editing category:", cat);
  setEditingCategory(cat);
  setCategoryName(cat.name);
  setCategoryDescription(cat.description);
};

const handleUpdateCategory = async (e) => {
  e.preventDefault();
  
  console.log("📝 Updating category:", editingCategory.name);
  console.log("📦 New data:", { name: categoryName, description: categoryDescription });
  
  try {
    await ApiService.updateCategory(editingCategory.name, {
      name: categoryName,
      description: categoryDescription,
    });
    
    console.log(" Update successful! Reloading categories...");
    
    
    const freshCategories = await ApiService.getAllCategory();
    setCategories(freshCategories);
    
    console.log(" Categories reloaded from database!");
    
    // Reset from
    setEditingCategory(null);
    setCategoryName("");
    setCategoryDescription("");
    
  } catch (err) {
    console.error(" Error updating category:", err);
    alert("Failed to update category!");
  }
};

  if (role !== "ADMIN") {
    return <p>You do not have access to this dashboard.</p>;
  }

  return (
   
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <AdminHeader title="Category Inventory" />  
    <div className="categories-dashboard">
      <h2>Management Categories</h2>

      <form onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory}>
        <h3>{editingCategory ? '✏️ Edit Category' : '➕ Add New Category'}</h3>
        <label>
          CategoryName:
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
        </label>
        <label>
          Description:
          <input
            type="text"
            value={categoryDescription}
            onChange={(e) => setCategoryDescription(e.target.value)}
          />
        </label>
        <button type="submit" className="btn btn-add">Add category</button>
      </form>
      </div>
      <ul className="category-list">
        {categories.map((cat) => (
          <li key={cat.name}>
            <span>{cat.name} - {cat.description}</span>
            <button onClick={() => handleDeleteCategory(cat)} className="btn btn-delete">Remove</button>
            <button onClick={() => handleEditClick(cat)} className="btn btn-edit">Edit</button>
          </li>
        ))}
      </ul>
    </div>
    

  );
};

export default CategoryDashboard;
