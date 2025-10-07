import React, { useState } from 'react';
import { login } from '../../services/api';
import './LoginPage.css';

function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const data = await login(form);
      console.log('Logged in:', data.user);
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <div className="image-container">
          <img src="/mother child.jpg" alt="Mother and Child" className="side-image" />
          <div className="image-overlay">
            <img src="/gdoh.jpeg" alt="GDOH Logo" className="login-logo" />
            <h1>Maternal & Child Health Portal</h1>
            <p>Supporting healthy mothers and children through technology</p>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <h2>Welcome Back</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
            {error && <p className="error">{error}</p>}
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
