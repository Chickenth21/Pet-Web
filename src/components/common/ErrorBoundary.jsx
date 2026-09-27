import React from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Global Error Boundary Component
 * Bắt mọi lỗi render của React, hiển thị màn hình fallback chuyên nghiệp thay vì màn trắng,
 * và tự động gửi log lỗi chi tiết về backend để chuyển tiếp sang Discord.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      reported: false
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    this.reportErrorToDiscord(error, errorInfo);
  }

  async reportErrorToDiscord(error, errorInfo) {
    try {
      const user = JSON.parse(localStorage.getItem('petpaw_user') || 'null');
      
      const payload = {
        message: error?.message || 'Lỗi không xác định tại React Component',
        stack: error?.stack || '',
        componentStack: errorInfo?.componentStack || '',
        url: window.location.href,
        userAgent: navigator.userAgent,
        userEmail: user?.email || 'Chưa đăng nhập'
      };

      await fetch(`${API_BASE}/errors/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      this.setState({ reported: true });
    } catch (err) {
      console.error('[ErrorBoundary] Không thể gửi log lỗi về server:', err);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-slate-800 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            
            {/* Header Icon */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-black text-white">Đã Xảy Ra Sự Cố Hiển Thị Giao Diện</h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Giao diện gặp ngoại lệ chưa được xử lý thay vì bị treo màn hình trắng.
                </p>
              </div>
            </div>

            {/* Thông báo trạng thái Discord */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2.5 text-xs text-amber-300 font-semibold">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                {this.state.reported 
                  ? '✅ Đã tự động gửi thông báo lỗi chi tiết đến kênh Discord Quản trị viên!' 
                  : '⏳ Đang truyền tải thông tin sự cố đến hệ thống giám sát Discord...'}
              </span>
            </div>

            {/* Chi tiết lỗi kỹ thuật */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Chi tiết lỗi kỹ thuật (Debug Info):
              </span>
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-700 font-mono text-xs text-rose-300 overflow-x-auto max-h-48 leading-relaxed whitespace-pre-wrap">
                {this.state.error?.toString()}
                {this.state.errorInfo?.componentStack}
              </div>
            </div>

            {/* Các nút hành động khắc phục */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Tải Lại Trang (Reload)</span>
              </button>

              <button
                onClick={this.handleGoHome}
                className="w-full sm:w-auto flex-1 py-3 px-4 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Về Trang Chủ Khách Hàng</span>
              </button>
            </div>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
