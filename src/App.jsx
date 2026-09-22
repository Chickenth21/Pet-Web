import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

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
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar />
      <main className="flex-1">
        <Routes>
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
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
