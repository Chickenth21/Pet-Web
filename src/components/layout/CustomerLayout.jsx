import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import AIChatWidget from '../common/AIChatWidget';

export default function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 relative">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {/* Floating AI Chatbox Widget ở góc màn hình bên phải */}
      <AIChatWidget />
    </div>
  );
}
