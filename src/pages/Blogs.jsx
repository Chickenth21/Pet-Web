import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DriveImage from '../components/common/DriveImage';
import FilterBar from '../components/common/FilterBar';
import Pagination from '../components/common/Pagination';
import { BookOpen, Calendar, Eye, ArrowRight, Tag } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Blogs() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 6,
        ...(search && { search }),
        ...(selectedCategory && { category: selectedCategory })
      });
      const res = await fetch(`${API_BASE}/blogs?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setPosts(data.data.posts);
        setPagination(data.data.pagination);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [search, selectedCategory, currentPage]);

  const categories = [
    'Kiến thức chọn giống',
    'Sức khỏe & Dinh dưỡng',
    'Phòng bệnh thú y',
    'Huấn luyện & Hành vi'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
          <BookOpen className="w-8 h-8 text-amber-500" />
          <span>Cẩm Nang Kiến Thức Thú Cưng</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Top các giống chó thông minh, thân thiện và cập nhật liên tục các bệnh thường gặp để chủ nuôi chủ động phòng ngừa
        </p>
      </div>

      {/* FilterBar Codebase dùng chung */}
      <FilterBar
        searchValue={search}
        onSearchChange={(val) => { setSearch(val); setCurrentPage(1); }}
        searchPlaceholder="Tìm kiếm bài viết theo tiêu đề, triệu chứng, giống chó..."
        onReset={() => { setSearch(''); setSelectedCategory(''); setCurrentPage(1); }}
        hasActiveFilters={Boolean(search || selectedCategory)}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => { setSelectedCategory(''); setCurrentPage(1); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              !selectedCategory ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất cả chủ đề
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                selectedCategory === cat ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </FilterBar>

      {/* Grid bài viết */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-3xl p-4 border border-slate-200 animate-pulse space-y-3">
              <div className="h-48 bg-slate-200 rounded-2xl w-full" />
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-200 rounded w-full" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto">
          <p className="text-slate-500 text-sm">Không tìm thấy bài viết phù hợp với tiêu chí của bạn.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              to={`/blogs/${post.slug}`}
              className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-card transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <DriveImage
                    src={post.thumbnail_url}
                    alt={post.title}
                    className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full shadow-sm">
                    {post.category}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-extrabold text-slate-900 text-base group-hover:text-amber-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {post.summary}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(post.published_at || post.created_at).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{post.views_count} lượt xem</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Phân trang */}
      <Pagination
        currentPage={currentPage}
        totalPages={pagination.totalPages}
        onPageChange={(p) => setCurrentPage(p)}
        limit={6}
        totalItems={pagination.total}
      />

    </div>
  );
}
