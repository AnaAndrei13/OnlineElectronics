import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {  FaShoppingCart, FaUser, FaHeart } from "react-icons/fa";
import '../css/Navbar.css';


const Navbar = () => {
  const { token, role, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
     <div className="navbar-top">
        <div className="navbar-logo">
          <Link to="/">OnlineElectro</Link>
        </div>

        <div className="navbar-actions">
          <button className="cart-btn" onClick={() => navigate("/cart")}><FaShoppingCart /> </button>
          <button className="favorite-btn" onClick={() => navigate("/wishlist")}><FaHeart /> </button>
           <button className="user-btn"onClick={() => navigate("/userinfo")}><FaUser /></button>
          {token ? (
          <>
            <span className="user-role">{role}</span>
              <Link 
                to="/" 
                onClick={handleLogout} 
                className="logout-btn"
              >   Logout
              </Link>
           
         </>
         ) : (
         <>
            <Link to="/login" className="login-btn">Login</Link>
            <Link to="/register" className="register-btn">| Register</Link>
           
    </>
  )}
        </div>

      </div>

      <div className="navbar-links">
        <Link to="/"> Home </Link>
        <Link to="/products"> Shop </Link>
        <Link to="/about">About </Link>
      </div>

    </nav>
  );
};

export default Navbar;
