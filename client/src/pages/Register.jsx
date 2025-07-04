import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';
import BASE_URL from '../utils/api';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return alert('Passwords do not match');
    }

    try {
      await axios.post(`${BASE_URL}/api/auth/register`, {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      alert('Registration successful!, please Check yuor email for verification Code');
      localStorage.setItem('pendingEmail', form.email);

      navigate('/verify', { state: { email: form.email } });

    } catch(e) {
      console.log("Error while registration:",e);
      alert('Registration failed. Try again.');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-glass-card">
        <h2 className="login-title">Register</h2>
        <p className="login-subtitle">Create a new account</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            className="login-input"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

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
      type={showPassword ? 'text' : 'password'}
      placeholder="Password"
      className="login-input password-input"
      onChange={(e) => setForm({ ...form, password: e.target.value })}
      required
    />
    <span
      className="toggle-password"
      onClick={() => setShowPassword((prev) => !prev)}
      title={showPassword ? 'Hide Password' : 'Show Password'}
    >
      {showPassword ? '🙈' : '👁️'}
    </span>
  </div>
</div>

<div className="password-wrapper">
  <div className="password-flex">
    <input
      type={showConfirmPassword ? 'text' : 'password'}
      placeholder="Confirm Password"
      className="login-input password-input"
      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
      required
    />
    <span
      className="toggle-password"
      onClick={() => setShowConfirmPassword((prev) => !prev)}
      title={showConfirmPassword ? 'Hide Password' : 'Show Password'}
    >
      {showConfirmPassword ? '🙈' : '👁️'}
    </span>
  </div>
</div>


          {form.confirmPassword && form.password !== form.confirmPassword && (
            <p style={{ color: 'salmon', fontSize: '13px', marginBottom: 10 }}>
              Passwords do not match
            </p>
          )}

          <button type="submit" className="login-btn">Sign Up</button>
        </form>
        <p className="login-footer">
          Already have an account? <a href="/">Login</a>
        </p>
      </div>
      <div className="animated-bg"></div>
    </div>
  );
};

export default Register;
