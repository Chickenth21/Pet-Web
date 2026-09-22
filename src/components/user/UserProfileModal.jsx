import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../context/AuthContext';
import DriveImage from '../common/DriveImage';
import { 
  X, 
  User, 
  Mail, 
  Image as ImageIcon, 
  ShieldCheck, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Sparkles
} from 'lucide-react';

export default function UserProfileModal({ isOpen, onClose }) {
  const { user, updateProfile } = useAuth();
  
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user && isOpen) {
      setFullName(user.full_name || '');
      setAvatarUrl(user.avatar_url || '');
      setMessage({ type: '', text: '' });
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setMessage({ type: 'error', text: 'Họ và tên không được để trống!' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await updateProfile({
        full_name: fullName.trim(),
        avatar_url: avatarUrl.trim()
      });

      if (result.success) {
        setMessage({ type: 'success', text: 'Cập nhật thông tin tài khoản thành công!' });
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setMessage({ type: 'error', text: result.message || 'Không thể cập nhật thông tin!' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Đã có lỗi xảy ra. Vui lòng thử lại!' });
    } finally {
      setLoading(false);
    }
  };

  const formattedDate = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Thành viên thân thiết';

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all my-auto max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="relative bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 px-6 py-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Thông tin tài khoản</h3>
              <p className="text-xs text-amber-100 mt-0.5">Quản lý hồ sơ cá nhân và ảnh đại diện Pet Paw</p>
            </div>
          </div>
        </div>

        {/* Nội dung form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Thông báo kết quả */}
          {message.text && (
            <div className={`p-3.5 rounded-2xl text-xs flex items-center gap-2.5 ${
              message.type === 'success' 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span className="font-medium">{message.text}</span>
            </div>
          )}

          {/* Xem trước ảnh đại diện */}
          <div className="flex items-center gap-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="relative">
              {avatarUrl ? (
                <DriveImage
                  src={avatarUrl}
                  alt={fullName}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-400 shadow-sm"
                  fallbackText="Avatar"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-white flex items-center justify-center font-bold text-2xl shadow-sm">
                  {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 p-1 bg-amber-500 rounded-lg text-white shadow-xs">
                <Sparkles className="w-3 h-3" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 text-sm truncate">{fullName || 'Người dùng'}</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800">
                  <ShieldCheck className="w-3 h-3" />
                  {user?.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate mt-0.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Tham gia: {formattedDate}
              </p>
            </div>
          </div>

          {/* Email (Read-only) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Địa chỉ Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={user?.email || ''}
                readOnly
                disabled
                className="w-full pl-10 pr-24 py-2.5 bg-slate-100 text-slate-500 rounded-xl text-sm font-medium border border-slate-200 cursor-not-allowed select-none"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                  Đã xác thực
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Email được dùng làm định danh đăng nhập và không thể thay đổi.</p>
          </div>

          {/* Họ và tên */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Họ và tên <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nhập họ và tên của bạn"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-white text-slate-800 rounded-xl text-sm font-medium border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
              />
            </div>
          </div>

          {/* Ảnh đại diện (Link hoặc GG Drive) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Link ảnh đại diện
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <ImageIcon className="w-4 h-4" />
              </div>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://... hoặc link chia sẻ Google Drive"
                className="w-full pl-10 pr-4 py-2.5 bg-white text-slate-800 rounded-xl text-sm font-medium border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Hỗ trợ link ảnh trực tiếp (JPG, PNG, WebP) hoặc link chia sẻ công khai từ Google Drive.
            </p>
          </div>

          {/* Nút hành động */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-sm font-bold shadow-md shadow-amber-500/25 hover:shadow-lg hover:shadow-amber-500/35 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{loading ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
