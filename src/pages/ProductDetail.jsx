import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DriveImage from '../components/common/DriveImage';
import { 
  ExternalLink, 
  Heart, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowLeft, 
  Sparkles,
  Share2
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function ProductDetail() {
  const { slug } = useParams();
  const { token, isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setLoading(true);
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    fetch(`${API_BASE}/products/${slug}`, { headers })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProduct(data.data);
          setActiveImage(0);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug, token]);

  const handleAffiliateClick = async (platform, url) => {
    try {
      fetch(`${API_BASE}/affiliate/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({ productId: product.id, platform })
      });
    } catch {}
    window.open(url, '_blank');
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để lưu sản phẩm vào danh sách yêu thích!');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/products/favorites/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId: product.id })
      });
      const data = await res.json();
      if (data.success) {
        setProduct(prev => ({ ...prev, is_favorite: data.data.is_favorite }));
      }
    } catch {}
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-1/3 mx-auto mb-6" />
        <div className="h-64 bg-slate-200 rounded-3xl max-w-2xl mx-auto" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Không tìm thấy sản phẩm</h2>
        <Link to="/products" className="inline-block px-4 py-2 bg-amber-500 text-white rounded-xl font-bold">
          Quay lại cửa hàng
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : ['/Logo_Pet_Paw.jpg'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Breadcrumb quay lại */}
      <Link to="/products" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-amber-600 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại danh sách sản phẩm</span>
      </Link>

      {/* Thông tin chính sản phẩm */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
        
        {/* Cột Trái: Thư viện ảnh */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative h-96 rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/60 shadow-inner">
            <DriveImage
              src={images[activeImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-4 left-4 px-3.5 py-1 bg-white/95 backdrop-blur-md rounded-full text-xs font-extrabold text-slate-800 shadow-sm">
              {product.brand}
            </span>
          </div>

          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImage === idx ? 'border-amber-500 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <DriveImage src={img} alt="thumb" className="w-full h-full" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Cột Phải: Chi tiết và Nút mua Affiliate */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-amber-50 border border-amber-200/80 rounded-full text-xs font-bold text-amber-800">
                {product.pet_type === 'cat' ? 'Dành cho Mèo' : product.pet_type === 'dog' ? 'Dành cho Chó' : 'Chó & Mèo'}
              </span>
              <button
                onClick={handleToggleFavorite}
                className="p-2 border border-slate-200 rounded-xl text-slate-500 hover:text-rose-500 transition-colors"
                title="Lưu yêu thích"
              >
                <Heart className={`w-5 h-5 ${product.is_favorite ? 'text-rose-500 fill-rose-500' : ''}`} />
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-amber-600">
                {Number(product.reference_price).toLocaleString('vi-VN')} đ
              </span>
              <span className="text-xs text-slate-400 font-medium">Giá bán tham khảo thị trường</span>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>

            {/* Đặc điểm phù hợp */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase block">Độ tuổi phù hợp</span>
                <span className="text-xs font-bold text-slate-800">{product.target_age || 'Mọi lứa tuổi'}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase block">Nhu cầu dinh dưỡng</span>
                <span className="text-xs font-bold text-slate-800">{product.target_needs || 'Chăm sóc thường nhật'}</span>
              </div>
            </div>
          </div>

          {/* KHU VỰC ĐIỀU HƯỚNG MUA HÀNG TRỰC TIẾP QUA SHOPEE & TIKTOK SHOP */}
          <div className="pt-6 border-t border-slate-100 space-y-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block">
              Chọn nền tảng mua hàng (Nhận voucher sàn):
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {product.shopee_url ? (
                <button
                  type="button"
                  onClick={() => handleAffiliateClick('shopee', product.shopee_url)}
                  className="py-3.5 px-4 bg-[#EE4D2D] hover:bg-[#d63f20] text-white font-extrabold rounded-2xl shadow-md shadow-[#EE4D2D]/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
                >
                  <span>Mua trên Shopee</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              ) : (
                <div className="py-3.5 px-4 bg-slate-100 text-slate-400 font-medium rounded-2xl text-center text-xs">
                  Shopee đang cập nhật liên kết
                </div>
              )}

              {product.tiktok_url ? (
                <button
                  type="button"
                  onClick={() => handleAffiliateClick('tiktok', product.tiktok_url)}
                  className="py-3.5 px-4 bg-black hover:bg-slate-800 text-white font-extrabold rounded-2xl shadow-md shadow-black/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
                >
                  <span>Mua trên TikTok Shop</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              ) : (
                <div className="py-3.5 px-4 bg-slate-100 text-slate-400 font-medium rounded-2xl text-center text-xs">
                  TikTok Shop đang cập nhật liên kết
                </div>
              )}
            </div>

            <p className="text-[11px] text-slate-400 text-center">
              * Khi bấm mua, bạn sẽ được chuyển trực tiếp sang gian hàng chính hãng để thanh toán an toàn và bảo mật.
            </p>
          </div>

        </div>
      </div>

      {/* Thông tin chuyên sâu: Thành phần, Công dụng, Hướng dẫn & Cảnh báo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span>Thành phần nguyên liệu</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
            {product.ingredients || 'Thịt gia cầm sấy khô, protein thực vật, gạo, dầu cá hồi, vitamin và khoáng chất vi lượng.'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Công dụng & Lợi ích</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
            {product.benefits || 'Cân bằng vi sinh đường ruột, dưỡng lông mượt óng ả, bảo vệ xương khớp và kiểm soát mùi phân hiệu quả.'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            <span>Hướng dẫn & Lưu ý</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
            {product.usage_instructions || 'Cho ăn trực tiếp theo khối lượng khuyến cáo in trên bao bì. Luôn chuẩn bị sẵn bát nước sạch.'}
          </p>
        </div>

      </div>

    </div>
  );
}
