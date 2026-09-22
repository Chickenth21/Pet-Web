import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('petpaw_user');
    return saved ? JSON.parse(saved) : {
      id: '22222222-2222-2222-2222-222222222222',
      full_name: 'Nguyễn Văn An',
      email: 'khachhang@petpaw.vn',
      role: 'user'
    };
  });
  const [token, setToken] = useState(() => localStorage.getItem('petpaw_token') || 'demo-token');
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setUser(data.data.user);
      setToken(data.data.token);
      localStorage.setItem('petpaw_user', JSON.stringify(data.data.user));
      localStorage.setItem('petpaw_token', data.data.token);
      return { success: true };
    } catch (err) {
      // Demo mock fallback if offline
      if (email === 'admin@petpaw.vn') {
        const adminUser = { id: '11111111-1111-1111-1111-111111111111', full_name: 'Quản Trị Viên Pet Paw', email, role: 'admin' };
        setUser(adminUser);
        setToken('admin-token');
        localStorage.setItem('petpaw_user', JSON.stringify(adminUser));
        return { success: true };
      }
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, full_name) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setUser(data.data.user);
      setToken(data.data.token);
      localStorage.setItem('petpaw_user', JSON.stringify(data.data.user));
      localStorage.setItem('petpaw_token', data.data.token);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('petpaw_user');
    localStorage.removeItem('petpaw_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading, isAuthenticated: !!user, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
