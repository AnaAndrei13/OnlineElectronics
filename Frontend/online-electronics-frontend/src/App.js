
import './css/App.css';
import { BrowserRouter, Routes, Route} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from  "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import About from "./pages/About";
import CategoryDashboard from "./pages/CategoryDashboard";
import ProductDashboard from "./pages/ProductDashboard";
import ProductsCatalog from "./pages/ProductsCatalog";
import AdminPage from "./admin/AdminPage"
import  AdminRoute  from "./service/AdminRoute";
import ProductPage from "./pages/ProductPage";
import Wishlist from './pages/Wishlist';

function App() {
  const { token } = useContext(AuthContext);

 return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
           <Route path="/products" element={<ProductsCatalog />} />
            <Route path="/products/:id" element={<ProductPage />} /> 
           <Route path="/about" element ={<About/>} />
            <Route path="/wishlist/" element={<Wishlist />} />
          
        </Route>

        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

         {/* Just ADMIN*/}
        <Route path="/admin/categories" element={<CategoryDashboard />} />
        <Route path='/admin' element={<AdminRoute><AdminPage /></AdminRoute>} />
        <Route path="/admin/products" element={<ProductDashboard/>} />
      
      </Routes>
    </BrowserRouter>
  );
}

export default App;