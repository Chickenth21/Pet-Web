import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePet } from '../../context/PetContext';
import { 
  ShoppingBag, 
  Activity, 
  Bot, 
  Sparkles, 
  MapPin, 
  BookOpen, 
  ShieldCheck, 
  Menu, 
  X, 
  Heart,
  ChevronDown,
  LogOut,
  User
} from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { pets, activePet, setActivePet } = usePet();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [petDropdownOpen, setPetDropdownOpen] = useState(false);

  const navItems = [
    { label: 'Trang chủ', path: '/' },
    { label: 'Cửa hàng', path: '/products', icon: ShoppingBag },
    { label: 'Theo dõi thể trạng', path: '/health', icon: Activity },
    { label: 'AI Trợ lý', path: '/ai-assistant', icon: Bot, badge: 'Hot' },
    { label: 'Gợi ý chọn thú', path: '/matchmaker', icon: Sparkles },
    { label: 'Gần bạn', path: '/nearby', icon: MapPin },
    { label: 'Cẩm nang Blog', path: '/blogs', icon: BookOpen }
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Tên dự án */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <img
              src="/Logo_Pet_Paw.jpg"
              alt="Logo Pet Paw"
              className="w-10 h-10 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-lg text-slate-900 leading-none tracking-tight">
                PET<span className="text-amber-500">PAW</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase mt-0.5">
                Chăm sóc & Dinh dưỡng
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all relative ${
                    active
                      ? 'bg-amber-50 text-amber-900 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  {Icon && <Icon className={`w-4 h-4 ${active ? 'text-amber-600' : 'text-slate-400'}`} />}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 bg-rose-500 text-white text-[10px] font-extrabold rounded-full animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Active Pet Switcher & User Profile */}
          <div className="hidden sm:flex items-center gap-2.5">
            
            {/* Bộ chọn Thú cưng đang kích hoạt (Active Pet) */}
            {isAuthenticated && pets.length > 0 && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setPetDropdownOpen(!petDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-amber-50/80 hover:bg-amber-100/70 border border-amber-200/80 rounded-xl transition-all cursor-pointer group"
                >
                  <img
                    src={activePet?.avatar_url || '/Logo_Pet_Paw.jpg'}
                    alt={activePet?.name}
                    className="w-6 h-6 rounded-full object-cover border border-amber-300"
                  />
                  <div className="text-left leading-none">
                    <span className="text-[10px] text-amber-700 uppercase font-bold block">Thú cưng</span>
                    <span className="text-xs font-semibold text-amber-950 truncate max-w-[80px] block">
                      {activePet?.name}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-amber-700 group-hover:translate-y-0.5 transition-transform" />
                </button>

                {/* Dropdown danh sách thú cưng */}
                {petDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fade-in">
                    <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase">
                      Chọn hồ sơ thú cưng
                    </div>
                    {pets.map((pet) => (
                      <div
                        key={pet.id}
                        onClick={() => {
                          setActivePet(pet);
                          setPetDropdownOpen(false);
                        }}
                        className={`flex items-center gap-2.5 px-3 py-2 cursor-pointer transition-colors ${
                          activePet?.id === pet.id ? 'bg-amber-50 text-amber-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <img
                          src={pet.avatar_url || '/Logo_Pet_Paw.jpg'}
                          alt={pet.name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs truncate">{pet.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{pet.breed}</p>
                        </div>
                      </div>
                    ))}
                    <div className="pt-1 mt-1 border-t border-slate-100 px-2">
                      <Link
                        to="/pets"
                        onClick={() => setPetDropdownOpen(false)}
                        className="block text-center py-1.5 text-xs text-amber-600 font-semibold hover:bg-amber-50 rounded-lg"
                      >
                        + Quản lý thú cưng
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Yêu thích */}
            <Link
              to="/favorites"
              className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
              title="Sản phẩm yêu thích"
            >
              <Heart className="w-5 h-5" />
            </Link>

            {/* Admin Portal Button */}
            {isAdmin && (
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin</span>
              </Link>
            )}

            {/* User Account / Login */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <Link to="/profile" className="flex items-center gap-2 text-slate-700 hover:text-amber-600">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center font-bold text-amber-800 text-xs">
                    {user?.full_name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-xs font-semibold hidden md:inline truncate max-w-[90px]">
                    {user?.full_name?.split(' ').pop()}
                  </span>
                </Link>
                <button
                  onClick={logout}
                  title="Đăng xuất"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 shadow-sm shadow-amber-500/20 transition-all"
              >
                <User className="w-3.5 h-3.5" />
                <span>Đăng nhập</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-2 animate-fade-in shadow-xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium ${
                  isActive(item.path) ? 'bg-amber-50 text-amber-900 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {Icon && <Icon className="w-4 h-4 text-amber-600" />}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 bg-rose-500 text-white text-[10px] font-extrabold rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              to="/pets"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-amber-700 font-semibold"
            >
              🐾 Hồ sơ thú cưng của tôi
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-800 font-semibold"
              >
                <ShieldCheck className="w-4 h-4 text-amber-500" /> Bảng điều khiển Quản trị (Admin)
              </Link>
            )}
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm text-rose-600 font-semibold"
              >
                <LogOut className="w-4 h-4" /> Đăng xuất ({user?.full_name})
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2.5 bg-amber-500 text-white font-bold rounded-xl"
              >
                Đăng nhập tài khoản
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
