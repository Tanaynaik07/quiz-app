import React,{ useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/login.css';
import BASE_URL from '../utils/api';

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const emailFromState = location.state?.email || localStorage.getItem('pendingEmail');
    if (emailFromState) {
      setEmail(emailFromState);
      localStorage.setItem('pendingEmail', emailFromState);
    } else {
      alert("Email not found. Please register again.");
      navigate('/register');
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${BASE_URL}/api/auth/verify`, {
        email,
        otp,
      });

      alert(res.data.message || "Verified!");
      localStorage.removeItem('pendingEmail');
      navigate('/'); // back to login
    } catch (err) {
      alert(err.response?.data?.error || "Invalid or expired OTP.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-glass-card">
        <h2 className="login-title">Verify OTP</h2>
        <p className="login-subtitle">Enter the 6-digit OTP sent to <br /><b>{email}</b></p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter OTP"
            className="login-input"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            required
          />
          <button type="submit" className="login-btn">Verify</button>
        </form>
        <p className="login-footer">
          Didn't receive it? <a href="/register">Register again</a>
        </p>
      </div>
      <div className="animated-bg"></div>
    </div>
  );
};

export default VerifyOtp;
