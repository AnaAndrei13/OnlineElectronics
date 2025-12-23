import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", JSON.stringify(decoded, null, 2));
        
        // Extract role 
        const userRole = decoded.role || decoded.authorities?.[0] || decoded.auth;
        
        setRole(userRole);
        setUser({
          email: decoded.sub || decoded.email,
          role: userRole,
          exp: decoded.exp
        });

        // Save role in localStorage for quick access
        localStorage.setItem('role', userRole);

      } catch (err) {
        console.error("Token invalid", err);
        setRole(null);
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("role");
      }
    } else {
      setRole(null);
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  const loginUser = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", { 
        email, 
        password 
      });
      
      const newToken = res.data.token || res.data.jwt || res.data.accessToken || res.data;
      
      if (!newToken) {
        throw new Error("Token missing from response");
      }

      localStorage.setItem("token", newToken);
      setToken(newToken);

      return { success: true, token: newToken };
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      return { success: false, error: err.response?.data?.message || "Login failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole(null);
    setUser(null);
  };

  const isAuthenticated = () => {
    if (!token || !user) return false;
    
    //Check if the token has expired
    const currentTime = Date.now() / 1000;
    if (user.exp && user.exp < currentTime) {
      logout();
      return false;
    }
    
    return true;
  };

  const isAdmin = () => {
    return role === 'ADMIN' || role === 'ROLE_ADMIN';
  };

  return (
    <AuthContext.Provider value={{ 
      token, 
      role, 
      user,
      loading,
      loginUser, 
      logout,
      isAuthenticated,
      isAdmin
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};