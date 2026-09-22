import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CustomerLayout from './components/layout/CustomerLayout';
import AdminLayout from './components/layout/AdminLayout';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import PetProfiles from './pages/PetProfiles';
import HealthMonitoring from './pages/HealthMonitoring';
import AIAssistant from './pages/AIAssistant';
import PetMatchmaker from './pages/PetMatchmaker';
import NearbyLocations from './pages/NearbyLocations';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import Favorites from './pages/Favorites';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <Routes>
      {/* 1. Tuyến đường phía Khách hàng (Sử dụng CustomerLayout riêng: Navbar + Outlet + Footer) */}
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/pets" element={<PetProfiles />} />
        <Route path="/health" element={<HealthMonitoring />} />
        <Route path="/ai-assistant" element={<AIAssistant />} />
        <Route path="/matchmaker" element={<PetMatchmaker />} />
        <Route path="/nearby" element={<NearbyLocations />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:slug" element={<BlogDetail />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* 2. Tuyến đường Quản trị viên (Sử dụng AdminLayout riêng: Admin Sidebar + Topbar + Phân quyền) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
}

