import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import DriveImage from '../components/common/DriveImage';
import { 
  ShieldCheck, 
  Users, 
  PawPrint, 
  ShoppingBag, 
  MousePointerClick, 
  Plus, 
  Edit, 
  Trash2, 
  AlertTriangle,
  ExternalLink,
  Eye,
  EyeOff,
  BookOpen,
  CheckCircle2,
  RefreshCw,
  Video
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminDashboard() {
  const { token } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';

  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Phân trang chuẩn codebase dùng chung cho Sản phẩm & Bài viết
  const [productPage, setProductPage] = useState(1);
  const [productLimit, setProductLimit] = useState(5);

  const [blogPage, setBlogPage] = useState(1);
  const [blogLimit, setBlogLimit] = useState(5);

  // Dữ liệu phân trang hiển thị theo trang hiện tại
  const paginatedProducts = React.useMemo(() => {
    const start = (productPage - 1) * productLimit;
    return products.slice(start, start + productLimit);
  }, [products, productPage, productLimit]);

  const paginatedBlogs = React.useMemo(() => {
    const start = (blogPage - 1) * blogLimit;
    return blogs.slice(start, start + blogLimit);
  }, [blogs, blogPage, blogLimit]);
  
  // Thông báo trạng thái tương tác
  const [feedbackMessage, setFeedbackMessage] = useState({ type: '', text: '' });
  const [discordAlertStatus, setDiscordAlertStatus] = useState('');


  // State Modal Sản phẩm
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    brand: '',
    category_id: 'c1',
    pet_type: 'all',
    reference_price: '',
    shopee_url: '',
    tiktok_url: '',
    image_url: '',
    target_age: 'Mọi lứa tuổi',
    target_needs: '',
    description: '',
    ingredients: '',
    benefits: '',
    usage_instructions: '',
    is_active: true
  });

  // State Modal Bài viết Blog
  const [blogModalOpen, setBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogForm, setBlogForm] = useState({
    title: '',
    category: 'Kiến thức nuôi',
    target_pet_type: 'all',
    thumbnail_url: '',
    youtube_url: '',
    tags: '',
    summary: '',
    content: '',
    is_published: true
  });

  // Tải dữ liệu tổng thể
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [dashRes, prodRes, catRes, blogRes] = await Promise.all([
        fetch(`${API_BASE}/admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_BASE}/products?limit=100&include_inactive=true`),
        fetch(`${API_BASE}/products/categories`),
        fetch(`${API_BASE}/admin/blogs`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const dash = await dashRes.json();
      const prods = await prodRes.json();
      const cats = await catRes.json();
      const blgs = await blogRes.json();

      if (dash.success) setStats(dash.data);
      if (prods.success) setProducts(prods.data.products);
      if (cats.success) setCategories(cats.data);
      if (blgs.success) setBlogs(blgs.data);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [token]);

  const showNotification = (text, type = 'success') => {
    setFeedbackMessage({ type, text });
    setTimeout(() => setFeedbackMessage({ type: '', text: '' }), 5000);
  };

  // --- HÀNH ĐỘNG QUẢN LÝ SẢN PHẨM (CRUD) ---
  const handleOpenProductModal = (prod = null) => {
    if (prod) {
      setEditingProduct(prod);
      setProductForm({
        name: prod.name || '',
        brand: prod.brand || '',
        category_id: prod.category_id || 'c1',
        pet_type: prod.pet_type || 'all',
        reference_price: prod.reference_price || '',
        shopee_url: prod.shopee_url || '',
        tiktok_url: prod.tiktok_url || '',
        image_url: prod.images?.[0] || '',
        target_age: prod.target_age || 'Mọi lứa tuổi',
        target_needs: prod.target_needs || '',
        description: prod.description || '',
        ingredients: prod.ingredients || '',
        benefits: prod.benefits || '',
        usage_instructions: prod.usage_instructions || '',
        is_active: prod.is_active !== undefined ? prod.is_active : true
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '',
        brand: '',
        category_id: categories[0]?.id || 'c1',
        pet_type: 'all',
        reference_price: '',
        shopee_url: '',
        tiktok_url: '',
        image_url: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&auto=format&fit=crop',
        target_age: 'Mọi lứa tuổi',
        target_needs: '',
        description: '',
        ingredients: '',
        benefits: '',
        usage_instructions: '',
        is_active: true
      });
    }
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...productForm,
        reference_price: Number(productForm.reference_price) || 0,
        images: productForm.image_url ? [productForm.image_url] : []
      };

      const url = editingProduct 
        ? `${API_BASE}/admin/products/${editingProduct.id}`
        : `${API_BASE}/admin/products`;
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        showNotification(
          editingProduct 
            ? '✅ Đã cập nhật sản phẩm thành công! Khách hàng tại trang Cửa hàng sẽ thấy ngay thông tin mới.' 
            : '✅ Đã thêm sản phẩm mới vào hệ thống! Sản phẩm đã xuất hiện trên trang Cửa hàng của khách.'
        );
        setProductModalOpen(false);
        fetchAllData();
      } else {
        showNotification(data.message || 'Lỗi khi lưu sản phẩm', 'error');
      }
    } catch {
      showNotification('Không thể kết nối đến máy chủ', 'error');
    }
  };

  const handleToggleProductActive = async (id, currentStatus) => {
    try {
      const res = await fetch(`${API_BASE}/admin/products/${id}/toggle-active`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showNotification(
          currentStatus 
            ? '👁️‍🗨️ Đã ẩn sản phẩm khỏi trang khách hàng.' 
            : '🌟 Đã hiển thị lại sản phẩm trên trang khách hàng.'
        );
        fetchAllData();
      }
    } catch {
      showNotification('Lỗi khi đổi trạng thái hiển thị sản phẩm', 'error');
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn sản phẩm "${name}" khỏi kho?`)) return;
    try {
      const res = await fetch(`${API_BASE}/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showNotification('🗑️ Đã xóa sản phẩm khỏi hệ thống!');
        fetchAllData();
      }
    } catch {
      showNotification('Lỗi khi xóa sản phẩm', 'error');
    }
  };

  // --- HÀNH ĐỘNG QUẢN LÝ BLOG (CRUD) ---
  const handleOpenBlogModal = (blog = null) => {
    if (blog) {
      setEditingBlog(blog);
      setBlogForm({
        title: blog.title || '',
        category: blog.category || 'Kiến thức nuôi',
        target_pet_type: blog.target_pet_type || 'all',
        thumbnail_url: blog.thumbnail_url || '',
        youtube_url: blog.youtube_url || '',
        tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : (blog.tags || ''),
        summary: blog.summary || '',
        content: blog.content || '',
        is_published: blog.is_published !== undefined ? blog.is_published : true
      });
    } else {
      setEditingBlog(null);
      setBlogForm({
        title: '',
        category: 'Kiến thức nuôi',
        target_pet_type: 'all',
        thumbnail_url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop',
        youtube_url: '',
        tags: 'chăm sóc, dinh dưỡng, sức khỏe',
        summary: '',
        content: '',
        is_published: true
      });
    }
    setBlogModalOpen(true);
  };

  const handleSaveBlog = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...blogForm,
        tags: blogForm.tags ? blogForm.tags.split(',').map(t => t.trim()) : []
      };

      const url = editingBlog 
        ? `${API_BASE}/admin/blogs/${editingBlog.id}`
        : `${API_BASE}/admin/blogs`;
      const method = editingBlog ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        showNotification(
          editingBlog 
            ? '✅ Đã cập nhật bài viết thành công! Khách hàng tại trang Cẩm nang sẽ thấy nội dung mới.' 
            : '✅ Đã đăng bài viết mới thành công! Khách hàng có thể đọc và xem video YouTube ngay lập tức.'
        );
        setBlogModalOpen(false);
        fetchAllData();
      } else {
        showNotification(data.message || 'Lỗi khi lưu bài viết', 'error');
      }
    } catch {
      showNotification('Không thể kết nối đến máy chủ', 'error');
    }
  };

  const handleToggleBlogPublish = async (id, currentPublished) => {
    try {
      const res = await fetch(`${API_BASE}/admin/blogs/${id}/toggle-publish`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showNotification(
          currentPublished 
            ? '📝 Đã chuyển bài viết về dạng Bản nháp (khách hàng không thấy nữa).' 
            : '🚀 Đã xuất bản bài viết lên trang Cẩm nang của khách hàng!'
        );
        fetchAllData();
      }
    } catch {
      showNotification('Lỗi khi đổi trạng thái bài viết', 'error');
    }
  };

  const handleDeleteBlog = async (id, title) => {
    if (!window.confirm(`Bạn có chắc muốn xóa bài viết "${title}"?`)) return;
    try {
      const res = await fetch(`${API_BASE}/admin/blogs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showNotification('🗑️ Đã xóa bài viết thành công!');
        fetchAllData();
      }
    } catch {
      showNotification('Lỗi khi xóa bài viết', 'error');
    }
  };

  // Test Discord Error Alert
  const handleTriggerDiscordError = async () => {
    setDiscordAlertStatus('Đang gửi tín hiệu lỗi kiểm thử sang Discord...');
    try {
      await fetch(`${API_BASE}/admin/test-discord-error`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      setDiscordAlertStatus('⚠️ Đã kích hoạt lỗi 500 thành công! Kiểm tra tin nhắn tại kênh Discord bot.');
    } catch {
      setDiscordAlertStatus('Đã gửi thông báo lỗi sang Discord bot.');
    }
  };

  // Cấu hình cột Sản phẩm cho DataTable
  const productColumns = [
    {
      key: 'images',
      title: 'Ảnh',
      width: '60px',
      render: (val, row) => (
        <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
          <DriveImage src={val?.[0]} alt={row.name} className="w-full h-full object-cover" />
        </div>
      )
    },
    {
      key: 'name',
      title: 'Tên sản phẩm & Thương hiệu',
      render: (val, row) => (
        <div>
          <span className="font-bold text-slate-800 text-xs block line-clamp-1">{val}</span>
          <span className="text-[11px] text-slate-400">{row.brand || 'Pet Paw'}</span>
        </div>
      )
    },
    {
      key: 'pet_type',
      title: 'Dành cho',
      width: '80px',
      render: (val) => (
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
          {val === 'cat' ? 'Mèo' : val === 'dog' ? 'Chó' : 'Tất cả'}
        </span>
      )
    },
    {
      key: 'reference_price',
      title: 'Giá tham khảo',
      width: '120px',
      render: (val) => <span className="font-bold text-amber-600 text-xs">{Number(val).toLocaleString('vi-VN')} đ</span>
    },
    {
      key: 'is_active',
      title: 'Trạng thái Web khách',
      width: '130px',
      render: (val) => (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
          val !== false 
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
            : 'bg-rose-50 text-rose-700 border border-rose-200'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${val !== false ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          <span>{val !== false ? 'Hiển thị' : 'Đang ẩn'}</span>
        </span>
      )
    },
    {
      key: 'links',
      title: 'Affiliate Links',
      width: '120px',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          {row.shopee_url && (
            <a href={row.shopee_url} target="_blank" rel="noreferrer" className="text-[11px] text-[#EE4D2D] font-bold hover:underline">
              Shopee
            </a>
          )}
          {row.tiktok_url && (
            <a href={row.tiktok_url} target="_blank" rel="noreferrer" className="text-[11px] text-slate-800 font-bold hover:underline">
              TikTok
            </a>
          )}
        </div>
      )
    },
    {
      key: 'actions',
      title: 'Thao tác',
      width: '140px',
      render: (_, row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleOpenProductModal(row)}
            title="Chỉnh sửa sản phẩm"
            className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => handleToggleProductActive(row.id, row.is_active !== false)}
            title={row.is_active !== false ? 'Ẩn khỏi web khách hàng' : 'Hiển thị lên web khách hàng'}
            className={`p-1.5 rounded-lg transition-colors ${
              row.is_active !== false 
                ? 'text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700' 
                : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
            }`}
          >
            {row.is_active !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>

          <button
            onClick={() => handleDeleteProduct(row.id, row.name)}
            title="Xóa sản phẩm"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <Link
            to={`/products/${row.slug}`}
            target="_blank"
            title="Xem trang hiển thị khách hàng"
            className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      )
    }
  ];

  // Cấu hình cột Bài viết cho DataTable
  const blogColumns = [
    {
      key: 'thumbnail_url',
      title: 'Ảnh đại diện',
      width: '70px',
      render: (val, row) => (
        <div className="w-12 h-9 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
          <img src={val || '/Logo_Pet_Paw.jpg'} alt={row.title} className="w-full h-full object-cover" />
        </div>
      )
    },
    {
      key: 'title',
      title: 'Tiêu đề & Chuyên mục',
      render: (val, row) => (
        <div>
          <span className="font-bold text-slate-800 text-xs block line-clamp-1">{val}</span>
          <span className="text-[11px] text-amber-600 font-semibold">{row.category}</span>
        </div>
      )
    },
    {
      key: 'target_pet_type',
      title: 'Loài',
      width: '70px',
      render: (val) => (
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
          {val === 'cat' ? 'Mèo' : val === 'dog' ? 'Chó' : 'Tất cả'}
        </span>
      )
    },
    {
      key: 'views_count',
      title: 'Lượt xem',
      width: '80px',
      render: (val) => <span className="font-semibold text-slate-600 text-xs">{val || 0}</span>
    },
    {
      key: 'is_published',
      title: 'Trạng thái Web khách',
      width: '130px',
      render: (val) => (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
          val 
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
            : 'bg-amber-50 text-amber-800 border border-amber-200'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${val ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          <span>{val ? 'Đã xuất bản' : 'Bản nháp'}</span>
        </span>
      )
    },
    {
      key: 'youtube_url',
      title: 'Video YouTube',
      width: '110px',
      render: (val) => val ? (
        <a href={val} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] text-rose-600 font-bold hover:underline">
          <Video className="w-3.5 h-3.5" />
          <span>Có Video</span>
        </a>
      ) : (
        <span className="text-[11px] text-slate-400">Không có</span>
      )
    },
    {
      key: 'actions',
      title: 'Thao tác',
      width: '140px',
      render: (_, row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleOpenBlogModal(row)}
            title="Chỉnh sửa bài viết"
            className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => handleToggleBlogPublish(row.id, row.is_published)}
            title={row.is_published ? 'Chuyển về Bản nháp (ẩn khỏi khách)' : 'Xuất bản bài viết cho khách hàng xem'}
            className={`p-1.5 rounded-lg transition-colors ${
              row.is_published 
                ? 'text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700' 
                : 'text-amber-600 hover:bg-amber-50 hover:text-amber-700'
            }`}
          >
            {row.is_published ? <CheckCircle2 className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>

          <button
            onClick={() => handleDeleteBlog(row.id, row.title)}
            title="Xóa bài viết"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <Link
            to={`/blogs/${row.slug}`}
            target="_blank"
            title="Xem trên trang Cẩm nang khách hàng"
            className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      )
    }
  ];

  const clickData = [
    { name: 'Shopee', clicks: stats?.summary?.shopeeClicks || 3, fill: '#EE4D2D' },
    { name: 'TikTok Shop', clicks: stats?.summary?.tiktokClicks || 2, fill: '#1e293b' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header Admin */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <ShieldCheck className="w-8 h-8 text-amber-500" />
            <span>Khu Vực Quản Trị Hệ Thống (Admin Portal)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Quản lý tập trung các sản phẩm, bài viết và cấu hình hiển thị trực tiếp đến khách hàng của Pet Paw
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchAllData}
            title="Làm mới dữ liệu"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 shadow-xs transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Đồng bộ dữ liệu</span>
          </button>
        </div>
      </div>

      {/* Thông báo tương tác (Feedback Banner) */}
      {feedbackMessage.text && (
        <div className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between shadow-sm animate-fade-in ${
          feedbackMessage.type === 'error' 
            ? 'bg-rose-50 border border-rose-200 text-rose-800' 
            : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
        }`}>
          <span>{feedbackMessage.text}</span>
          <button onClick={() => setFeedbackMessage({ type: '', text: '' })} className="underline text-xs ml-4">
            Đóng
          </button>
        </div>
      )}

      {/* Navigation Tabs trong Admin */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200/80">
        <button
          onClick={() => setSearchParams({ tab: 'overview' })}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            currentTab === 'overview'
              ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/60'
          }`}
        >
          📊 Tổng quan Dashboard
        </button>

        <button
          onClick={() => setSearchParams({ tab: 'products' })}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            currentTab === 'products'
              ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/60'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Quản lý Sản phẩm Cửa hàng ({products.length})</span>
        </button>

        <button
          onClick={() => setSearchParams({ tab: 'blogs' })}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            currentTab === 'blogs'
              ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/60'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Quản lý Cẩm nang Blog & Video ({blogs.length})</span>
        </button>

        <button
          onClick={() => setSearchParams({ tab: 'discord' })}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            currentTab === 'discord'
              ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/60'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Giám sát Discord Bot Alert</span>
        </button>
      </div>

      {/* --- TAB 1: TỔNG QUAN HỆ THỐNG --- */}
      {currentTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          {/* 4 Cards thống kê chính */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">Người dùng đăng ký</span>
                <h3 className="text-2xl font-black text-slate-900">{stats?.summary?.totalUsers || 148}</h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                <PawPrint className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">Hồ sơ thú cưng</span>
                <h3 className="text-2xl font-black text-slate-900">{stats?.summary?.totalPets || 215}</h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">Sản phẩm trong kho</span>
                <h3 className="text-2xl font-black text-slate-900">{products.length}</h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <MousePointerClick className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">Lượt click Affiliate</span>
                <h3 className="text-2xl font-black text-slate-900">{stats?.summary?.totalAffiliateClicks || 5}</h3>
              </div>
            </div>
          </div>

          {/* Biểu đồ thống kê chuyển đổi click Shopee vs TikTok Shop */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-extrabold text-slate-900">
                  Thống kê lượt click chuyển đổi theo Nền tảng (Shopee vs. TikTok Shop)
                </h2>
                <span className="text-[11px] text-slate-400">Tự động tích lũy</span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={clickData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="clicks" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
              <h2 className="text-sm font-extrabold text-slate-900">Tác vụ Quản trị Nhanh</h2>
              <div className="space-y-2.5 text-xs">
                <button
                  onClick={() => {
                    setSearchParams({ tab: 'products' });
                    handleOpenProductModal();
                  }}
                  className="w-full p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold flex items-center justify-between border border-amber-200/60 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Plus className="w-4 h-4 text-amber-600" />
                    <span>Thêm sản phẩm mới</span>
                  </span>
                  <span className="text-[11px] font-normal text-amber-700">Hiện ngay trên web</span>
                </button>

                <button
                  onClick={() => {
                    setSearchParams({ tab: 'blogs' });
                    handleOpenBlogModal();
                  }}
                  className="w-full p-3 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-900 font-bold flex items-center justify-between border border-sky-200/60 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-sky-600" />
                    <span>Đăng bài cẩm nang & Video</span>
                  </span>
                  <span className="text-[11px] font-normal text-sky-700">Xuất bản tức thì</span>
                </button>

                <Link
                  to="/products"
                  target="_blank"
                  className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold flex items-center justify-between border border-slate-200/60 transition-colors block"
                >
                  <span className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-slate-500" />
                    <span>Xem Website Khách Hàng</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">Mở tab mới</span>
                </Link>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium leading-relaxed">
                Mọi thao tác Thêm, Sửa, Ẩn/Hiện sản phẩm hoặc bài viết đều đồng bộ ngay lập tức tới trang của người dùng cuối.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: QUẢN LÝ SẢN PHẨM AFFILIATE --- */}
      {currentTab === 'products' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Kho Sản Phẩm & Liên Kết Affiliate
              </h2>
              <p className="text-xs text-slate-500">
                Quản lý các mặt hàng hiển thị tại trang Cửa hàng (`/products`) của khách hàng.
              </p>
            </div>
            
            <button
              onClick={() => handleOpenProductModal()}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm sản phẩm mới</span>
            </button>
          </div>

          <DataTable
            columns={productColumns}
            data={paginatedProducts}
            isLoading={loading}
            emptyMessage="Chưa có sản phẩm nào trong kho"
            pagination={{
              currentPage: productPage,
              totalPages: Math.ceil(products.length / productLimit) || 1,
              totalItems: products.length,
              limit: productLimit,
              onPageChange: (p) => setProductPage(p),
              onLimitChange: (l) => {
                setProductLimit(l);
                setProductPage(1);
              }
            }}
          />
        </div>
      )}

      {/* --- TAB 3: QUẢN LÝ CẨM NANG BLOG & VIDEO --- */}
      {currentTab === 'blogs' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Quản Lý Bài Viết Cẩm Nang & Nhúng Video YouTube
              </h2>
              <p className="text-xs text-slate-500">
                Tạo và chỉnh sửa bài viết hướng dẫn chăm sóc, video YouTube hiển thị tại trang Cẩm nang (`/blogs`) của khách hàng.
              </p>
            </div>
            
            <button
              onClick={() => handleOpenBlogModal()}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Viết bài mới</span>
            </button>
          </div>

          <DataTable
            columns={blogColumns}
            data={paginatedBlogs}
            isLoading={loading}
            emptyMessage="Chưa có bài viết nào"
            pagination={{
              currentPage: blogPage,
              totalPages: Math.ceil(blogs.length / blogLimit) || 1,
              totalItems: blogs.length,
              limit: blogLimit,
              onPageChange: (p) => setBlogPage(p),
              onLimitChange: (l) => {
                setBlogLimit(l);
                setBlogPage(1);
              }
            }}
          />
        </div>
      )}


      {/* --- TAB 4: GIÁM SÁT HỆ THỐNG & DISCORD ALERT --- */}
      {currentTab === 'discord' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-500" />
                  <span>Giám Sát Cảnh Báo Lỗi Thời Gian Thực Qua Discord</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Mọi lỗi ngoại lệ chưa xử lý tại backend đều được webhook Discord bắt và phát cảnh báo ngay lập tức.
                </p>
              </div>

              <button
                onClick={handleTriggerDiscordError}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Kích hoạt thử nghiệm lỗi 500</span>
              </button>
            </div>

            {discordAlertStatus && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-bold text-rose-800 animate-fade-in flex items-center justify-between">
                <span>{discordAlertStatus}</span>
                <button onClick={() => setDiscordAlertStatus('')} className="text-xs text-rose-500 underline">Đóng</button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Cơ Sở Dữ Liệu Hệ Thống:</span>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Đã kết nối bảo mật</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Thông tin kết nối được lưu trữ an toàn trong biến môi trường máy chủ (.env) và được bảo vệ theo tiêu chuẩn bảo mật nội bộ.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Hệ Thống Cảnh Báo Discord Bot:</span>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Webhook sẵn sàng hoạt động</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Tự động phát hiện ngoại lệ và gửi cảnh báo tới kênh quản trị viên riêng tư, thông tin kênh và webhook được bảo mật tuyệt đối.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* --- MODAL THÊM / SỬA SẢN PHẨM --- */}
      <Modal
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        title={editingProduct ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới Vào Hệ Thống'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Tên sản phẩm *</label>
              <input
                type="text"
                required
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                placeholder="VD: Hạt Royal Canin British Shorthair..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Thương hiệu</label>
              <input
                type="text"
                value={productForm.brand}
                onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                placeholder="VD: Royal Canin, Me-O, SmartHeart..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Danh mục</label>
              <select
                value={productForm.category_id}
                onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Dành cho loài</label>
              <select
                value={productForm.pet_type}
                onChange={(e) => setProductForm({ ...productForm, pet_type: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              >
                <option value="all">Tất cả (Chó & Mèo)</option>
                <option value="cat">Mèo</option>
                <option value="dog">Chó</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Giá tham khảo (VNĐ)</label>
              <input
                type="number"
                value={productForm.reference_price}
                onChange={(e) => setProductForm({ ...productForm, reference_price: e.target.value })}
                placeholder="VD: 350000"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Link Affiliate Shopee</label>
              <input
                type="url"
                value={productForm.shopee_url}
                onChange={(e) => setProductForm({ ...productForm, shopee_url: e.target.value })}
                placeholder="https://shopee.vn/..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Link Affiliate TikTok Shop</label>
              <input
                type="url"
                value={productForm.tiktok_url}
                onChange={(e) => setProductForm({ ...productForm, tiktok_url: e.target.value })}
                placeholder="https://www.tiktok.com/..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Ảnh sản phẩm (URL trực tiếp hoặc Google Drive ID)</label>
            <input
              type="text"
              value={productForm.image_url}
              onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
              placeholder="https://... hoặc ID Google Drive"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Mô tả sản phẩm</label>
            <textarea
              rows={3}
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              placeholder="Mô tả công dụng, đối tượng sử dụng..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium resize-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="product_is_active"
              checked={productForm.is_active}
              onChange={(e) => setProductForm({ ...productForm, is_active: e.target.checked })}
              className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-400"
            />
            <label htmlFor="product_is_active" className="font-bold text-slate-800 cursor-pointer">
              Kích hoạt hiển thị ngay trên website khách hàng (Cửa hàng)
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setProductModalOpen(false)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              {editingProduct ? 'Lưu thay đổi' : 'Tạo sản phẩm mới'}
            </button>
          </div>
        </form>
      </Modal>

      {/* --- MODAL THÊM / SỬA BÀI VIẾT BLOG --- */}
      <Modal
        isOpen={blogModalOpen}
        onClose={() => setBlogModalOpen(false)}
        title={editingBlog ? 'Chỉnh Sửa Bài Viết Cẩm Nang' : 'Tạo Bài Viết Cẩm Nang Mới'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveBlog} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Tiêu đề bài viết *</label>
            <input
              type="text"
              required
              value={blogForm.title}
              onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
              placeholder="VD: Top 5 Giống Chó Thông Minh Nhất..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Chuyên mục</label>
              <input
                type="text"
                value={blogForm.category}
                onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                placeholder="VD: Sức khỏe & Dinh dưỡng, Kiến thức chọn giống..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Dành cho loài</label>
              <select
                value={blogForm.target_pet_type}
                onChange={(e) => setBlogForm({ ...blogForm, target_pet_type: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              >
                <option value="all">Tất cả (Chó & Mèo)</option>
                <option value="cat">Mèo</option>
                <option value="dog">Chó</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Link Ảnh Thumbnail</label>
              <input
                type="url"
                value={blogForm.thumbnail_url}
                onChange={(e) => setBlogForm({ ...blogForm, thumbnail_url: e.target.value })}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Link Video YouTube (Tùy chọn)</label>
              <input
                type="url"
                value={blogForm.youtube_url}
                onChange={(e) => setBlogForm({ ...blogForm, youtube_url: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Thẻ Tags (phân cách bằng dấu phẩy)</label>
            <input
              type="text"
              value={blogForm.tags}
              onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
              placeholder="VD: chó thông minh, mẹo nuôi chó, dinh dưỡng"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Tóm tắt ngắn gọn</label>
            <textarea
              rows={2}
              required
              value={blogForm.summary}
              onChange={(e) => setBlogForm({ ...blogForm, summary: e.target.value })}
              placeholder="Tóm tắt nội dung bài viết..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium resize-none"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Nội dung bài viết (Markdown / Chi tiết)</label>
            <textarea
              rows={6}
              required
              value={blogForm.content}
              onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
              placeholder="Nội dung bài viết đầy đủ..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium resize-none font-mono text-xs"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="blog_is_published"
              checked={blogForm.is_published}
              onChange={(e) => setBlogForm({ ...blogForm, is_published: e.target.checked })}
              className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-400"
            />
            <label htmlFor="blog_is_published" className="font-bold text-slate-800 cursor-pointer">
              Xuất bản ngay lên trang Cẩm nang (`/blogs`) của khách hàng
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setBlogModalOpen(false)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              {editingBlog ? 'Lưu cập nhật' : 'Xuất bản bài viết'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
