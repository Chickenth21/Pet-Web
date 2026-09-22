import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FilterBar from '../components/common/FilterBar';
import Select from '../components/common/Select';
import Pagination from '../components/common/Pagination';
import DriveImage from '../components/common/DriveImage';
import { Heart, ExternalLink, Sparkles, Filter, ShoppingBag } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Products() {
  const { token, isAuthenticated } = useAuth();
  
  // State bộ lọc
  const [search, setSearch] = useState('');
  const [petType, setPetType] = useState('all');
  const [categoryId, setCategoryId] = useState('');
  const [targetNeeds, setTargetNeeds] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(12);

  // Data state
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Load danh mục
  useEffect(() => {
    fetch(`${API_BASE}/products/categories`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setCategories(data.data);
      })
      .catch(() => {});
  }, []);

  // Load sản phẩm theo bộ lọc
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit,
        pet_type: petType,
        ...(search && { search }),
        ...(categoryId && { category_id: categoryId }),
        ...(targetNeeds && { target_needs: targetNeeds })
      });

      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`${API_BASE}/products?${params.toString()}`, { headers });
      const data = await res.json();
      if (data.success) {
        setProducts(data.data.products);
        setPagination(data.data.pagination);
      }
    } catch {
      // Mock fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, petType, categoryId, targetNeeds, currentPage, limit]);

  // Click tracking và mở sàn
  const handleAffiliateClick = async (productId, platform, url) => {
    try {
      fetch(`${API_BASE}/affiliate/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({ productId, platform })
      });
    } catch {}
    window.open(url, '_blank');
  };

  // Toggle favorite
  const handleToggleFavorite = async (productId) => {
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
        body: JSON.stringify({ productId })
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.map(p => p.id === productId ? { ...p, is_favorite: data.data.is_favorite } : p));
      }
    } catch {}
  };

  const handleResetFilters = () => {
    setSearch('');
    setPetType('all');
    setCategoryId('');
    setTargetNeeds('');
    setCurrentPage(1);
  };

  const hasActiveFilters = Boolean(search || petType !== 'all' || categoryId || targetNeeds);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Tiêu đề & Giới thiệu */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <ShoppingBag className="w-8 h-8 text-amber-500" />
            <span>Cửa Hàng Sản Phẩm Thú Cưng</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Tìm kiếm & lọc sản phẩm dinh dưỡng chính hãng kèm liên kết điều hướng trực tiếp sang Shopee / TikTok Shop
          </p>
        </div>
      </div>

      {/* FILTERBAR: Sử dụng codebase chung chuẩn hóa */}
      <FilterBar
        searchValue={search}
        onSearchChange={(val) => { setSearch(val); setCurrentPage(1); }}
        searchPlaceholder="Tìm kiếm hạt, pate, snack, sữa tắm, đồ chơi..."
        onReset={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      >
        {/* Phân loại Thú cưng */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          {[
            { val: 'all', label: 'Tất cả' },
            { val: 'cat', label: '🐱 Mèo' },
            { val: 'dog', label: '🐶 Chó' }
          ].map((item) => (
            <button
              key={item.val}
              type="button"
              onClick={() => { setPetType(item.val); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                petType === item.val
                  ? 'bg-white text-amber-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Danh mục Dropdown */}
        <div className="w-48">
          <Select
            value={categoryId}
            onChange={(val) => { setCategoryId(val); setCurrentPage(1); }}
            placeholder="Tất cả danh mục"
            options={categories.map(c => ({ value: c.id, label: c.name }))}
          />
        </div>

        {/* Nhu cầu chuyên biệt */}
        <div className="w-48">
          <Select
            value={targetNeeds}
            onChange={(val) => { setTargetNeeds(val); setCurrentPage(1); }}
            placeholder="Nhu cầu sức khỏe"
            options={[
              { value: 'Kiểm soát cân nặng', label: 'Kiểm soát cân nặng' },
              { value: 'Tăng trưởng nhanh & Miễn dịch', label: 'Cún/Mèo con phát triển' },
              { value: 'Dưỡng lông & Diệt khuẩn', label: 'Dưỡng lông & Da' },
              { value: 'Chăm sóc răng miệng', label: 'Chăm sóc răng miệng' },
              { value: 'Bổ sung nước & Kích thích ăn uống', label: 'Bổ sung nước (Pate)' }
            ]}
          />
        </div>
      </FilterBar>

      {/* Grid danh sách sản phẩm */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-3xl p-4 border border-slate-200 animate-pulse space-y-3">
              <div className="h-48 bg-slate-200 rounded-2xl w-full" />
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-200 rounded w-1/2" />
              <div className="h-8 bg-slate-200 rounded-xl w-full" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto space-y-3">
          <Sparkles className="w-12 h-12 text-amber-400 mx-auto" />
          <h3 className="font-bold text-slate-800 text-lg">Không tìm thấy sản phẩm phù hợp</h3>
          <p className="text-xs text-slate-500">Vui lòng thử thay đổi từ khóa hoặc thiết lập lại bộ lọc.</p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition-colors"
          >
            Xem toàn bộ sản phẩm
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-sm hover:shadow-card transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Ảnh & Thương hiệu */}
                <div className="relative h-48 rounded-2xl overflow-hidden mb-3 bg-slate-100">
                  <DriveImage
                    src={prod.images?.[0]}
                    alt={prod.name}
                    className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 bg-white/90 backdrop-blur-md rounded-full text-[11px] font-bold text-slate-800 shadow-xs">
                    {prod.brand}
                  </span>

                  <button
                    onClick={() => handleToggleFavorite(prod.id)}
                    className="absolute top-2.5 right-2.5 p-1.5 bg-white/90 backdrop-blur-md rounded-full text-slate-400 hover:text-rose-500 hover:bg-white shadow-xs transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${prod.is_favorite ? 'text-rose-500 fill-rose-500' : ''}`} />
                  </button>
                </div>

                <Link to={`/products/${prod.slug}`}>
                  <h3 className="font-bold text-slate-800 text-sm line-clamp-2 hover:text-amber-600 transition-colors mb-1.5" title={prod.name}>
                    {prod.name}
                  </h3>
                </Link>

                <p className="text-xs text-amber-700 bg-amber-50 inline-block px-2 py-0.5 rounded-md font-medium mb-3">
                  {prod.target_needs || 'Chăm sóc toàn diện'}
                </p>
              </div>

              {/* Giá và Nút điều hướng Affiliate Shopee / TikTok */}
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Giá tham khảo</span>
                  <span className="text-base font-extrabold text-amber-600">
                    {Number(prod.reference_price).toLocaleString('vi-VN')} đ
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-1">
                  {prod.shopee_url ? (
                    <button
                      type="button"
                      onClick={() => handleAffiliateClick(prod.id, 'shopee', prod.shopee_url)}
                      className="w-full py-2 bg-[#EE4D2D] hover:bg-[#d63f20] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-colors shadow-xs"
                      title="Chuyển sang Shopee mua hàng"
                    >
                      <span>Shopee</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  ) : (
                    <span className="w-full py-2 bg-slate-100 text-slate-400 text-xs font-medium rounded-xl text-center">
                      Shopee
                    </span>
                  )}

                  {prod.tiktok_url ? (
                    <button
                      type="button"
                      onClick={() => handleAffiliateClick(prod.id, 'tiktok', prod.tiktok_url)}
                      className="w-full py-2 bg-black hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-colors shadow-xs"
                      title="Chuyển sang TikTok Shop mua hàng"
                    >
                      <span>TikTok</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  ) : (
                    <span className="w-full py-2 bg-slate-100 text-slate-400 text-xs font-medium rounded-xl text-center">
                      TikTok
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Phân trang chuẩn Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={pagination.totalPages}
        onPageChange={(p) => setCurrentPage(p)}
        limit={limit}
        onLimitChange={(l) => { setLimit(l); setCurrentPage(1); }}
        totalItems={pagination.total}
      />

    </div>
  );
}
