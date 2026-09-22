import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePet } from '../../context/PetContext';
import DriveImage from '../common/DriveImage';
import UserProfileModal from '../user/UserProfileModal';
import ChangePasswordModal from '../user/ChangePasswordModal';
import { 
  Home,
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
  User,
  PawPrint,
  KeyRound
} from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { pets, activePet, setActivePet } = usePet();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [petDropdownOpen, setPetDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  const navItems = [
    { label: 'Trang chủ', path: '/', icon: Home },
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 xl:gap-4">
          
          {/* Logo & Tên dự án */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <img
              src="/Logo_Pet_Paw.jpg"
              alt="Logo Pet Paw"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover shadow-xs group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="font-black text-lg sm:text-xl text-slate-900 leading-none tracking-tight">
                PET<span className="text-amber-500">PAW</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase mt-1 hidden xl:block">
                Chăm sóc & Dinh dưỡng
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 shrink-0">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-xl text-xs xl:text-sm font-medium whitespace-nowrap shrink-0 transition-all duration-150 ${
                    active
                      ? 'bg-amber-500/10 text-amber-900 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 bg-rose-500 text-white text-[10px] font-extrabold rounded-full leading-none animate-pulse shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Active Pet Switcher & User Profile */}
          <div className="hidden sm:flex items-center gap-2 xl:gap-2.5 shrink-0">
            
            {/* Bộ chọn Thú cưng đang kích hoạt (Active Pet) */}
            {isAuthenticated && pets.length > 0 && (
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setPetDropdownOpen(!petDropdownOpen);
                    setUserDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 px-2.5 py-1.5 bg-amber-50/90 hover:bg-amber-100/80 border border-amber-200/80 rounded-xl transition-all cursor-pointer group shrink-0 shadow-xs"
                  title={activePet ? `Đang chọn: ${activePet.name}` : 'Chọn thú cưng'}
                >
                  <img
                    src={activePet?.avatar_url || '/Logo_Pet_Paw.jpg'}
                    alt={activePet?.name || 'Pet'}
                    className="w-6 h-6 rounded-full object-cover ring-2 ring-amber-300 shrink-0"
                  />
                  <div className="text-left leading-tight hidden md:block">
                    <span className="text-[9px] text-amber-700 uppercase font-bold block leading-none">Thú cưng</span>
                    <span className="text-xs font-bold text-amber-950 truncate max-w-[70px] xl:max-w-[90px] block leading-tight">
                      {activePet?.name}
                    </span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-amber-700 transition-transform shrink-0 ${petDropdownOpen ? 'rotate-180' : 'group-hover:translate-y-0.5'}`} />
                </button>

                {/* Overlay đóng dropdown khi bấm ra ngoài */}
                {petDropdownOpen && (
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setPetDropdownOpen(false)}
                  />
                )}

                {/* Dropdown danh sách thú cưng */}
                {petDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 z-50 animate-fade-in">
                    <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase flex items-center justify-between">
                      <span>Hồ sơ thú cưng</span>
                      <span className="text-amber-600 text-[10px]">{pets.length} bé</span>
                    </div>
                    <div className="max-h-60 overflow-y-auto divide-y divide-slate-50">
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
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold truncate">{pet.name}</p>
                            <p className="text-[10px] text-slate-400 truncate">{pet.breed || 'Chưa rõ giống'}</p>
                          </div>
                          {activePet?.id === pet.id && (
                            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="pt-1.5 mt-1 border-t border-slate-100 px-2">
                      <Link
                        to="/pets"
                        onClick={() => setPetDropdownOpen(false)}
                        className="block text-center py-1.5 text-xs text-amber-600 font-semibold hover:bg-amber-50 rounded-xl transition-colors"
                      >
                        + Quản lý tất cả thú cưng
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Yêu thích */}
            <Link
              to="/favorites"
              className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors shrink-0"
              title="Sản phẩm yêu thích"
            >
              <Heart className="w-5 h-5" />
            </Link>

            {/* Admin Portal Button */}
            {isAdmin && (
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 xl:px-3 xl:py-1.5 bg-slate-900 text-amber-300 rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs shrink-0"
                title="Bảng điều khiển Quản trị viên"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Admin</span>
              </Link>
            )}

            {/* User Account / Avatar Dropdown */}
            {isAuthenticated ? (
              <div className="relative shrink-0 pl-1.5 border-l border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setUserDropdownOpen(!userDropdownOpen);
                    setPetDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 p-1 rounded-2xl hover:bg-slate-100/80 transition-all cursor-pointer group shrink-0"
                  title={`Tài khoản: ${user?.full_name || 'Người dùng'}`}
                >
                  {user?.avatar_url ? (
                    <DriveImage
                      src={user.avatar_url}
                      alt={user.full_name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-400 shadow-xs shrink-0"
                      fallbackText="U"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-white flex items-center justify-center font-bold text-xs shadow-xs group-hover:scale-105 transition-transform shrink-0">
                      {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <span className="text-xs font-semibold text-slate-700 group-hover:text-amber-600 hidden md:inline truncate max-w-[85px]">
                    {user?.full_name?.split(' ').pop()}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 transition-transform shrink-0 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Overlay đóng dropdown khi click bên ngoài */}
                {userDropdownOpen && (
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setUserDropdownOpen(false)}
                  />
                )}

                {/* Dropdown Menu Tài khoản Người Dùng */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 z-50 animate-fade-in">
                    {/* Header thông tin người dùng */}
                    <div className="px-3.5 py-2.5 border-b border-slate-100 flex items-center gap-3">
                      {user?.avatar_url ? (
                        <DriveImage
                          src={user.avatar_url}
                          alt={user.full_name}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-300 shrink-0"
                          fallbackText="U"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                          {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate leading-tight">{user?.full_name || 'Người dùng'}</p>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5 leading-none">{user?.email}</p>
                        <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 text-[9px] font-extrabold uppercase rounded-md bg-amber-100 text-amber-800 leading-none">
                          {user?.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}
                        </span>
                      </div>
                    </div>

                    {/* Danh sách các lựa chọn thao tác */}
                    <div className="py-1 px-2 space-y-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          setProfileModalOpen(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-900 transition-colors cursor-pointer text-left"
                      >
                        <User className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Thông tin người dùng</span>
                      </button>

                      <Link
                        to="/pets"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-900 transition-colors"
                      >
                        <PawPrint className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Thú cưng của tôi</span>
                      </Link>

                      <Link
                        to="/favorites"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-rose-50 hover:text-rose-900 transition-colors"
                      >
                        <Heart className="w-4 h-4 text-rose-500 shrink-0" />
                        <span>Danh sách yêu thích</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          setPasswordModalOpen(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-900 transition-colors cursor-pointer text-left"
                      >
                        <KeyRound className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Đổi mật khẩu</span>
                      </button>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200/80 transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                          <span>Bảng điều khiển Admin</span>
                        </Link>
                      )}
                    </div>

                    {/* Nút đăng xuất */}
                    <div className="pt-1 mt-1 border-t border-slate-100 px-2">
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
                      >
                        <LogOut className="w-4 h-4 shrink-0" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 shadow-sm shadow-amber-500/20 transition-all shrink-0"
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
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle Menu"
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
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
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

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-1.5">
            {isAuthenticated ? (
              <>
                {/* Thông tin người dùng thu nhỏ trên mobile */}
                <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-xl mb-1">
                  {user?.avatar_url ? (
                    <DriveImage
                      src={user.avatar_url}
                      alt={user.full_name}
                      className="w-9 h-9 rounded-full object-cover ring-1 ring-amber-400 shrink-0"
                      fallbackText="U"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{user?.full_name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setProfileModalOpen(true);
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 font-semibold hover:bg-amber-50 rounded-xl text-left cursor-pointer"
                >
                  <User className="w-4 h-4 text-amber-600" />
                  <span>Thông tin người dùng</span>
                </button>

                <Link
                  to="/pets"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 font-semibold hover:bg-amber-50 rounded-xl"
                >
                  <PawPrint className="w-4 h-4 text-amber-600" />
                  <span>Thú cưng của tôi</span>
                </Link>

                <Link
                  to="/favorites"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 font-semibold hover:bg-rose-50 rounded-xl"
                >
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>Danh sách yêu thích</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setPasswordModalOpen(true);
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 font-semibold hover:bg-amber-50 rounded-xl text-left cursor-pointer"
                >
                  <KeyRound className="w-4 h-4 text-amber-600" />
                  <span>Đổi mật khẩu</span>
                </button>

                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-900 font-semibold bg-slate-100 rounded-xl"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-500" />
                    <span>Bảng điều khiển Quản trị (Admin)</span>
                  </Link>
                )}

                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-rose-600 font-semibold hover:bg-rose-50 rounded-xl cursor-pointer text-left mt-1 border-t border-slate-100"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Đăng xuất</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2.5 bg-amber-500 text-white font-bold rounded-xl shadow-xs hover:bg-amber-600"
              >
                Đăng nhập tài khoản
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Modal Quản lý thông tin tài khoản */}
      <UserProfileModal 
        isOpen={profileModalOpen} 
        onClose={() => setProfileModalOpen(false)} 
      />

      {/* Modal Đổi mật khẩu */}
      <ChangePasswordModal 
        isOpen={passwordModalOpen} 
        onClose={() => setPasswordModalOpen(false)} 
      />
    </header>
  );
}
