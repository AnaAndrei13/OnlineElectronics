import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; 
import { AuthContext } from "../context/AuthContext";
import "../css/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
   const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const success = await loginUser(email, password);

    if (success) {
      // wait
      setTimeout(() => {
    
        const userRole = localStorage.getItem('role');
        
        console.log('User role after login:', userRole);

        if (userRole === 'ADMIN' || userRole === 'ROLE_ADMIN') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }, 100);
    } else {
      setMessage({ type: 'error', text: 'Incorrect email or password' });
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
         <h2>Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>

          <button type="submit">Login</button>
        </form>

        {message && (
          <div className={`login-message ${message.type}`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}