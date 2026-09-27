import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, ExternalLink, X } from 'lucide-react';

export default function GoogleAuthButton({ mode = 'login', onError }) {
  const navigate = useNavigate();
  const { loginWithGoogle, loading } = useAuth();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const googleBtnRef = useRef(null);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!googleClientId) return;

    // Tải Google Identity Services SDK chính thức
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleCredentialResponse,
          auto_select: false
        });

        // Vẽ nút chuẩn của Google nếu có container
        if (googleBtnRef.current) {
          window.google.accounts.id.renderButton(googleBtnRef.current, {
            theme: 'outline',
            size: 'large',
            text: mode === 'register' ? 'signup_with' : 'signin_with',
            shape: 'pill',
            width: googleBtnRef.current.offsetWidth || 340,
            locale: 'vi'
          });
        }
      }
    };
    document.body.appendChild(script);

    return () => {
      try {
        document.body.removeChild(script);
      } catch {
        // Unmounted
      }
    };
  }, [googleClientId, mode]);

  const handleCredentialResponse = async (response) => {
    setIsProcessing(true);
    try {
      const res = await loginWithGoogle({ credential: response.credential });
      if (res.success) {
        navigate('/');
      } else {
        if (onError) onError(res.message);
      }
    } catch (err) {
      if (onError) onError(err.message || 'Lỗi kết nối xác thực Google');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCustomButtonClick = () => {
    if (googleClientId && window.google?.accounts?.id) {
      // Mở bảng chọn tài khoản Google chính thức
      window.google.accounts.id.prompt();
    } else {
      // Chưa cấu hình Client ID -> Hiện hướng dẫn ngắn gọn để nhập
      setShowGuideModal(true);
    }
  };

  return (
    <>
      {/* Nếu đã có Client ID, hiển thị trực tiếp container của Google SDK */}
      {googleClientId ? (
        <div className="w-full flex justify-center">
          <div ref={googleBtnRef} className="w-full flex justify-center min-h-[44px]"></div>
        </div>
      ) : (
        /* Nút phong cách UI chung của dự án */
        <button
          type="button"
          onClick={handleCustomButtonClick}
          disabled={loading || isProcessing}
          className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-200/90 shadow-sm hover:shadow transition-all flex items-center justify-center gap-3 cursor-pointer group"
        >
          {/* Logo Google SVG */}
          <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>

          <span>
            {isProcessing 
              ? 'Đang kết nối Google...' 
              : mode === 'register' 
                ? 'Đăng ký bằng Google' 
                : 'Tiếp tục với Google'}
          </span>
        </button>
      )}

      {/* Modal Hướng Dẫn Kích Hoạt Bảng Chọn Tài Khoản Google Thật */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <h3 className="font-black text-slate-900 text-sm">Cần Mã Google Client ID</h3>
              </div>
              <button 
                onClick={() => setShowGuideModal(false)}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Để Google có thể mở cửa sổ <strong>"Chọn tài khoản Google của bạn"</strong> (lấy email, tên và ảnh đại diện thật của bạn), Google bắt buộc ứng dụng phải khai báo mã định danh <strong>Client ID</strong>.
            </p>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2">
              <span className="font-bold text-slate-800 block">Cách kích hoạt ngay:</span>
              <ol className="list-decimal pl-4 space-y-1 text-slate-600 text-[11px] leading-relaxed">
                <li>Mở file <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-slate-800 font-bold">client/.env</code></li>
                <li>Thêm dòng:
                  <div className="mt-1 p-2 bg-slate-900 text-amber-300 font-mono text-[10px] rounded-lg select-all">
                    VITE_GOOGLE_CLIENT_ID=mã_google_client_id_của_bạn
                  </div>
                </li>
                <li>Google sẽ tự động hiển thị bảng chọn tài khoản của chính bạn!</li>
              </ol>
            </div>

            <div className="flex items-center justify-between pt-2">
              <a
                href="https://console.cloud.google.com/apis/credentials"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1"
              >
                <span>Tạo Client ID trên Google Cloud</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors"
              >
                Đã hiểu
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
