import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api/farmers';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    phone: '',
    password: '',
    name: '',
    region: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (isLogin) {
        const res = await axios.post(`${API_BASE}/login/`, {
          phone: form.phone,
          password: form.password,
        });
        localStorage.setItem('token', res.data.token);
        setSuccess('Login successful!');
      } else {
        const res = await axios.post(`${API_BASE}/register/`, {
          phone: form.phone,
          password: form.password,
          name: form.name,
          region: form.region,
        });
        localStorage.setItem('token', res.data.token);
        setSuccess('Signup successful!');
      }
    } catch (err) {
      setError(err.response?.data?.error || JSON.stringify(err.response?.data) || 'Something went wrong');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? 'Farmer Login' : 'Farmer Signup'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
          {!isLogin && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
              <input
                type="text"
                name="region"
                placeholder="Region"
                value={form.region}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </>
          )}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            {isLogin ? 'Login' : 'Signup'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            className="text-green-700 hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Don't have an account? Signup" : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
} 