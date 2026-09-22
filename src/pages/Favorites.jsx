import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DriveImage from '../components/common/DriveImage';
import { Heart, ExternalLink, ShoppingBag, ArrowLeft } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Favorites() {
  const { token, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    fetch(`${API_BASE}/products/favorites`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setFavorites(data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token, isAuthenticated]);

  const removeFavorite = async (productId) => {
    try {
      await fetch(`${API_BASE}/products/favorites/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
      });
      setFavorites(prev => prev.filter(p => p.id !== productId));
    } catch {}
  };

  const trackAffiliate = (productId, platform, url) => {
    try {
      fetch(`${API_BASE}/affiliate/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, platform })
      });
    } catch {}
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
          <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
          <span>Sản Phẩm Bạn Đã Lưu Yêu Thích</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Dễ dàng xem lại và so sánh giá giữa Shopee & TikTok Shop cho các món đồ của bé cưng
        </p>
      </div>

      {!isAuthenticated ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-4">
          <p className="text-sm text-slate-600">Vui lòng đăng nhập để xem danh sách sản phẩm yêu thích của bạn.</p>
          <Link to="/login" className="inline-block px-5 py-2.5 bg-amber-500 text-white rounded-xl font-bold text-xs">
            Đăng nhập ngay
          </Link>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-64 bg-slate-200 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-4">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-sm text-slate-600">Bạn chưa lưu sản phẩm nào vào mục yêu thích.</p>
          <Link to="/products" className="inline-block px-5 py-2.5 bg-amber-500 text-white rounded-xl font-bold text-xs">
            Khám phá sản phẩm ngay
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favorites.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-sm hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 rounded-2xl overflow-hidden mb-3 bg-slate-100">
                  <DriveImage src={prod.images?.[0]} alt={prod.name} className="w-full h-full" />
                  <button
                    onClick={() => removeFavorite(prod.id)}
                    className="absolute top-2.5 right-2.5 p-1.5 bg-white/90 rounded-full text-rose-500 shadow-sm"
                    title="Bỏ yêu thích"
                  >
                    <Heart className="w-4 h-4 fill-rose-500" />
                  </button>
                </div>
                <Link to={`/products/${prod.slug}`}>
                  <h3 className="font-bold text-slate-800 text-sm line-clamp-2 hover:text-amber-600 mb-1.5">
                    {prod.name}
                  </h3>
                </Link>
                <p className="text-xs text-amber-700 bg-amber-50 inline-block px-2 py-0.5 rounded-md font-medium mb-3">
                  {prod.target_needs || 'Chăm sóc toàn diện'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <span className="text-base font-extrabold text-amber-600">
                  {Number(prod.reference_price).toLocaleString('vi-VN')} đ
                </span>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {prod.shopee_url && (
                    <button
                      onClick={() => trackAffiliate(prod.id, 'shopee', prod.shopee_url)}
                      className="py-2 bg-[#EE4D2D] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1"
                    >
                      Shopee <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                  {prod.tiktok_url && (
                    <button
                      onClick={() => trackAffiliate(prod.id, 'tiktok', prod.tiktok_url)}
                      className="py-2 bg-black text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1"
                    >
                      TikTok <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
