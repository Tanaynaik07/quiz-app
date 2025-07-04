import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Quiz from './pages/Quiz';
import Result from './pages/Result';
import AdminAdd from './pages/AdminAdd';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import QuizMenu from './components/QuizMenu';
import VerifyOtp from './pages/VerifyOtp';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/quiz" element={<QuizMenu />} />
        <Route path="/quiz/:topic" element={<Quiz />} />
        <Route
          path="/admin/add"
          element={
            <ProtectedAdminRoute>
              <AdminAdd />
            </ProtectedAdminRoute>
          }
        />
        <Route path="/verify" element={<VerifyOtp />} />

        <Route path="/result" element={<Result />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
