// src/components/ProtectedAdminRoute.jsx
import React,{ useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import BASE_URL from '../utils/api';

const ProtectedAdminRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(null); // null = loading, false = blocked

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return setIsAdmin(false);

      try {
        const res = await fetch(`${BASE_URL}/api/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.role === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch {
        setIsAdmin(false);
      }
    };

    fetchUser();
  }, []);

  if (isAdmin === null) return <div>Loading...</div>; // optional loader
  if (!isAdmin) {
//   localStorage.removeItem("token"); // or localStorage.clear();
alert("Access denied. Admins only.");
  return <Navigate to="/quiz" replace />;
}


  return children;
};

export default ProtectedAdminRoute;
