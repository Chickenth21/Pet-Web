import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  ShoppingBag, 
  AlertTriangle, 
  ArrowLeft, 
  LogOut, 
  Menu, 
  X, 
  ExternalLink,
  Lock,
  UserCheck,
  Radio,
  BookOpen,
  PawPrint, 
  Sparkles,
  Mail,
  Key,
  Users,
  Stethoscope,
  HeartPulse
} from 'lucide-react';


export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, isAuthenticated, login, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Xử lý đăng nhập Quản trị viên bằng tài khoản thực
  const handleAdminLoginForm = async (e) => {
    e.preventDefault();
    setLoginError('');
    if (!loginEmail || !loginPassword) {
      setLoginError('Vui lòng nhập đầy đủ Email và Mật khẩu.');
      return;
    }
    setLoginLoading(true);
    const res = await login(loginEmail.trim(), loginPassword);
    if (!res.success) {
      setLoginError(res.message || 'Email hoặc mật khẩu không chính xác.');
    } else if (res.user?.role !== 'admin') {
      setLoginError('Tài khoản này không có quyền Quản trị viên (Admin).');
    }
    setLoginLoading(false);
  };

  // Màn hình Đăng nhập Quản trị viên nếu chưa xác thực quyền Admin
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-white">Đăng Nhập Quản Trị Hệ Thống</h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Khu vực dành riêng cho Quản trị viên Pet Paw. Vui lòng đăng nhập bằng tài khoản Quản trị để tiếp tục.
            </p>
            {isAuthenticated && !isAdmin && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300">
                Tài khoản hiện tại (<strong>{user?.email}</strong>) không có quyền Quản trị viên.
              </div>
            )}
          </div>

          {loginError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs font-bold text-rose-400 text-center animate-fade-in">
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLoginForm} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Email Quản trị viên</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@email.com"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Mật khẩu</label>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              {loginLoading ? (
                <span>Đang xác thực...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Xác Thực & Vào Quản Trị</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-slate-700/60 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 font-semibold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay về trang khách hàng</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab') || 'overview';

  const menuItems = [
    { id: 'overview', label: 'Tổng quan hệ thống', path: '/admin', icon: LayoutDashboard },
    { id: 'users', label: 'Phân quyền & Tài khoản', path: '/admin?tab=users', icon: Users },
    { id: 'user-pets', label: 'Hồ sơ Thú Cưng Khách', path: '/admin?tab=user-pets', icon: HeartPulse },
    { id: 'breeds', label: 'Quản lý Giống Chó & Mèo', path: '/admin?tab=breeds', icon: Sparkles },
    { id: 'pet-sales', label: 'Quản lý Thú Cưng Bán', path: '/admin?tab=pet-sales', icon: PawPrint },
    { id: 'products', label: 'Quản lý Phụ kiện & Hạt', path: '/admin?tab=products', icon: ShoppingBag },
    { id: 'blogs', label: 'Quản lý Cẩm nang Blog', path: '/admin?tab=blogs', icon: BookOpen },
    { id: 'locations', label: 'Bệnh viện & Tiệm Spa', path: '/admin?tab=locations', icon: Stethoscope },
    { id: 'discord', label: 'Giám sát & Discord Alert', path: '/admin?tab=discord', icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen flex bg-slate-100/80 text-slate-800">
      
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Admin Sidebar */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-6 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/Logo_Pet_Paw.jpg"
              alt="Pet Paw Admin"
              className="w-9 h-9 rounded-xl object-cover border border-amber-500/30"
            />
            <div>
              <span className="font-black text-sm text-white tracking-wide block">
                PET<span className="text-amber-400">PAW</span>
              </span>
              <span className="inline-block px-1.5 py-0.5 bg-amber-500/20 text-amber-400 text-[9px] font-extrabold rounded-md uppercase tracking-wider">
                Admin Portal
              </span>
            </div>
          </div>
          
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Nav Items */}
        <div className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Phân Hệ Quản Trị
          </div>
          
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = item.id === currentTab;
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/10'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}


          <div className="pt-4 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Điều Hướng
          </div>

          <Link
            to="/"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-amber-300 hover:bg-slate-800/60 transition-all group"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-0.5 transition-transform" />
            <span>Về Website Người Dùng</span>
          </Link>
        </div>

        {/* Sidebar Footer (Admin User Info) */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs shrink-0 shadow-sm">
                {user?.full_name?.charAt(0) || 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{user?.full_name || 'Quản Trị Viên'}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              title="Đăng xuất khỏi Admin"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        {/* Admin Topbar */}
        <header className="h-16 sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl bg-slate-100 hover:bg-slate-200"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span>Bảng Điều Khiển Quản Trị</span>
              </h2>
              <span className="text-[10px] text-slate-500 hidden sm:inline">Khu vực quản lý riêng biệt không bao gồm giao diện khách hàng</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Trạng thái máy chủ */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Hệ thống trực tuyến</span>
            </div>

            {/* Nút thoát về Website */}
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors border border-slate-200"
            >
              <span>Xem trang khách hàng</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 bg-slate-100/60 overflow-y-auto min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

