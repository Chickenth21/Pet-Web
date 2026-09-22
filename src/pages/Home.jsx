import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, 
  Activity, 
  Sparkles, 
  ShoppingBag, 
  ArrowRight, 
  Heart, 
  ShieldCheck, 
  TrendingUp, 
  MapPin, 
  ExternalLink,
  ChevronRight,
  Award
} from 'lucide-react';
import DriveImage from '../components/common/DriveImage';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, blogRes] = await Promise.all([
          fetch(`${API_BASE}/products?limit=4`),
          fetch(`${API_BASE}/blogs?limit=3`)
        ]);
        const prods = await prodRes.json();
        const blogs = await blogRes.json();
        if (prods.success) setFeaturedProducts(prods.data.products);
        if (blogs.success) setRecentBlogs(blogs.data.posts);
      } catch {
        // Mock data handled gracefully
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const trackClick = async (productId, platform, url) => {
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
    <div className="flex flex-col gap-16 pb-20">
      
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden pt-10 sm:pt-16 pb-12 bg-gradient-to-b from-amber-100/50 via-amber-50/20 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-200/60 border border-amber-300 text-amber-900 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Nền tảng Chăm sóc & Mua sắm Thú Cưng Thông Minh</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Dành trọn yêu thương cho <span className="text-amber-500 underline decoration-amber-300 decoration-wavy decoration-2">bé cưng</span> của bạn
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Tư vấn sức khỏe bằng <strong>AI thông minh</strong>, theo dõi thể trạng tăng trưởng qua biểu đồ và mua sắm sản phẩm chính hãng nhận ưu đãi qua <strong>Shopee & TikTok Shop</strong>.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/health"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5"
                >
                  <Activity className="w-5 h-5" />
                  <span>Theo dõi thể trạng ngay</span>
                </Link>

                <Link
                  to="/ai-assistant"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl font-bold shadow-sm transition-all"
                >
                  <Bot className="w-5 h-5 text-amber-600" />
                  <span>Hỏi AI Trợ Lý</span>
                </Link>
              </div>

              {/* Badges tin cậy */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-amber-200/50 max-w-lg mx-auto lg:mx-0">
                <div className="flex flex-col items-center lg:items-start">
                  <span className="text-2xl font-black text-slate-900">100%</span>
                  <span className="text-xs text-slate-500">Chuẩn khoa học</span>
                </div>
                <div className="flex flex-col items-center lg:items-start">
                  <span className="text-2xl font-black text-slate-900">24/7</span>
                  <span className="text-xs text-slate-500">AI Trợ lý tức thì</span>
                </div>
                <div className="flex flex-col items-center lg:items-start">
                  <span className="text-2xl font-black text-slate-900">Shopee/TikTok</span>
                  <span className="text-xs text-slate-500">Mua sắm tiện lợi</span>
                </div>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute -inset-4 bg-gradient-to-r from-amber-400 to-orange-400 rounded-3xl blur-2xl opacity-30 animate-pulse" />
                <div className="relative bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 flex flex-col gap-4">
                  <div className="relative h-64 rounded-2xl overflow-hidden shadow-inner">
                    <img
                      src="/Logo_Pet_Paw.jpg"
                      alt="Pet Paw Hero"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-amber-900 shadow-sm flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-500" /> Top Đề Xuất Chăm Sóc
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/60">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white font-bold">
                        AI
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Bạn chưa biết nuôi giống nào?</h4>
                        <p className="text-xs text-slate-500">Chỉ 1 phút làm trắc nghiệm</p>
                      </div>
                    </div>
                    <Link
                      to="/matchmaker"
                      className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      Bắt đầu
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CÁC TÍNH NĂNG CHỦ ĐẠO (Features Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Hệ sinh thái chăm sóc toàn diện
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Mọi công cụ bạn cần để nuôi dạy một bé cún hay bé mèo khỏe mạnh, hạnh phúc và tràn đầy năng lượng.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card hover:shadow-hover transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Đánh giá thể trạng BCS</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Theo dõi cân nặng định kỳ, tính toán chỉ số thiếu cân hay béo phì theo chuẩn khoa học và vẽ biểu đồ tăng trưởng.
            </p>
            <Link to="/health" className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-700 mt-4">
              Khám phá <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card hover:shadow-hover transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">AI Assistant thông minh</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Đọc hiểu hồ sơ dị ứng và tuổi của từng bé để tư vấn thực đơn, chọn đồ chơi và cảnh báo y tế chuẩn xác.
            </p>
            <Link to="/ai-assistant" className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700 mt-4">
              Hỏi ngay <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card hover:shadow-hover transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Affiliate Shopee & TikTok</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Lọc sản phẩm đa tiêu chí và chuyển hướng 1-chạm sang Shopee hoặc TikTok Shop để áp mã giảm giá tiện lợi.
            </p>
            <Link to="/products" className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 mt-4">
              Xem sản phẩm <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card hover:shadow-hover transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Phòng khám & Spa lân cận</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tra cứu nhanh các bệnh viện thú y 24/7 và cơ sở chăm sóc spa uy tín gần nơi ở của bạn khi cần thiết.
            </p>
            <Link to="/nearby" className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700 mt-4">
              Tìm gần bạn <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* 3. SẢN PHẨM NỔI BẬT (Affiliate Shopee / TikTok) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Sản phẩm chăm sóc thịnh hành</h2>
            <p className="text-xs text-slate-500 mt-1">Sản phẩm tuyển chọn với liên kết chính hãng trên Shopee & TikTok Shop</p>
          </div>
          <Link to="/products" className="inline-flex items-center gap-1 text-sm font-bold text-amber-600 hover:text-amber-700">
            Xem tất cả <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((prod) => (
            <div key={prod.id} className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-sm hover:shadow-card transition-all flex flex-col justify-between">
              <div>
                <div className="relative h-48 rounded-2xl overflow-hidden mb-3 bg-slate-100">
                  <DriveImage
                    src={prod.images?.[0]}
                    alt={prod.name}
                    className="w-full h-full"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 bg-white/90 backdrop-blur-md rounded-full text-[11px] font-bold text-slate-800 shadow-xs">
                    {prod.brand}
                  </span>
                </div>
                <h3 className="font-bold text-slate-800 text-sm line-clamp-2 mb-1.5" title={prod.name}>
                  {prod.name}
                </h3>
                <p className="text-xs text-slate-400 mb-3">{prod.target_needs || 'Chăm sóc toàn diện'}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Giá tham khảo</span>
                  <span className="text-base font-extrabold text-amber-600">
                    {Number(prod.reference_price).toLocaleString('vi-VN')} đ
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-1">
                  {prod.shopee_url && (
                    <button
                      onClick={() => trackClick(prod.id, 'shopee', prod.shopee_url)}
                      className="w-full py-2 bg-[#EE4D2D] hover:bg-[#d63f20] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-colors"
                    >
                      <span>Shopee</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                  {prod.tiktok_url && (
                    <button
                      onClick={() => trackClick(prod.id, 'tiktok', prod.tiktok_url)}
                      className="w-full py-2 bg-black hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-colors"
                    >
                      <span>TikTok</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CẨM NANG & BLOG MỚI NHẤT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Cẩm nang & Phòng ngừa bệnh</h2>
            <p className="text-xs text-slate-500 mt-1">Kiến thức chuyên sâu từ các bác sĩ thú y và chuyên gia dinh dưỡng</p>
          </div>
          <Link to="/blogs" className="inline-flex items-center gap-1 text-sm font-bold text-amber-600 hover:text-amber-700">
            Xem cẩm nang <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentBlogs.map((blog) => (
            <Link
              key={blog.id}
              to={`/blogs/${blog.slug}`}
              className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-card transition-all group flex flex-col"
            >
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <DriveImage
                  src={blog.thumbnail_url}
                  alt={blog.title}
                  className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full shadow-sm">
                  {blog.category}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-2 group-hover:text-amber-600 transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                    {blog.summary}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
                  <span>{new Date(blog.published_at || blog.created_at).toLocaleDateString('vi-VN')}</span>
                  <span className="font-semibold text-amber-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Đọc tiếp →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
