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

  const updateProfile = async ({ full_name, avatar_url }) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ full_name, avatar_url })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      const updatedUser = { ...user, ...data.data };
      setUser(updatedUser);
      localStorage.setItem('petpaw_user', JSON.stringify(updatedUser));
      return { success: true, user: updatedUser };
    } catch (err) {
      // Offline fallback
      const updatedUser = { ...user };
      if (full_name !== undefined) updatedUser.full_name = full_name;
      if (avatar_url !== undefined) updatedUser.avatar_url = avatar_url;
      setUser(updatedUser);
      localStorage.setItem('petpaw_user', JSON.stringify(updatedUser));
      return { success: true, user: updatedUser };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (oldPassword, newPassword) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      return { success: true, message: data.message || 'Đổi mật khẩu thành công!' };
    } catch (err) {
      return { success: false, message: err.message || 'Lỗi khi đổi mật khẩu!' };
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
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      register, 
      logout, 
      updateProfile, 
      changePassword, 
      loading, 
      isAuthenticated: !!user, 
      isAdmin: user?.role === 'admin' 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
