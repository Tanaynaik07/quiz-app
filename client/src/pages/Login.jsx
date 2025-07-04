import React,{ useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../styles/login.css";
import BASE_URL from '../utils/api';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, form, {
        withCredentials: true,
      });
      localStorage.setItem('token', res.data.token);
      navigate('/quiz');
    } catch(e){
      console.error("Login error:", e);
      alert('Login failed. Check credentials.');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-glass-card">
        <h2 className="login-title">Login</h2>
        <p className="login-subtitle">Access your quizzes</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="login-input"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <div className="password-wrapper">
  <div className="password-flex">
    <input
      type={showPassword ? "text" : "password"}
      placeholder="Password"
      className="login-input password-input"
      onChange={(e) => setForm({ ...form, password: e.target.value })}
      required
    />
    <span
      className="toggle-password"
      onClick={() => setShowPassword((prev) => !prev)}
      title={showPassword ? "Hide Password" : "Show Password"}
    >
      {showPassword ? "🙈" : "👁️"}
    </span>
  </div>
</div>


          <button type="submit" className="login-btn">Log In</button>
        </form>
        <p className="login-footer">
          Don’t have an account? <a href="/register">Register</a>
        </p>
      </div>
      <div className="animated-bg"></div>
    </div>
  );
};

export default Login;
