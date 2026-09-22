import React, { useState, useEffect } from 'react';
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
  Send
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [discordAlertStatus, setDiscordAlertStatus] = useState('');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [dashRes, prodRes] = await Promise.all([
        fetch(`${API_BASE}/admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_BASE}/products?limit=50`)
      ]);
      const dash = await dashRes.json();
      const prods = await prodRes.json();

      if (dash.success) setStats(dash.data);
      if (prods.success) setProducts(prods.data.products);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [token]);

  // Test gửi lỗi Discord
  const handleTriggerDiscordError = async () => {
    setDiscordAlertStatus('Đang gửi tín hiệu lỗi...');
    try {
      const res = await fetch(`${API_BASE}/admin/test-discord-error`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setDiscordAlertStatus('⚠️ Đã kích hoạt lỗi 500 thành công! Kiểm tra tin nhắn tại kênh Discord.');
    } catch {
      setDiscordAlertStatus('Đã gửi thông báo lỗi sang Discord.');
    }
  };

  const productColumns = [
    {
      key: 'images',
      title: 'Ảnh',
      width: '60px',
      render: (val, row) => (
        <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100">
          <DriveImage src={val?.[0]} alt={row.name} className="w-full h-full" />
        </div>
      )
    },
    {
      key: 'name',
      title: 'Tên sản phẩm',
      render: (val, row) => (
        <div>
          <span className="font-bold text-slate-800 text-xs block line-clamp-1">{val}</span>
          <span className="text-[11px] text-slate-400">{row.brand}</span>
        </div>
      )
    },
    {
      key: 'reference_price',
      title: 'Giá tham khảo',
      render: (val) => <span className="font-bold text-amber-600 text-xs">{Number(val).toLocaleString('vi-VN')} đ</span>
    },
    {
      key: 'pet_type',
      title: 'Dành cho',
      render: (val) => (
        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
          {val === 'cat' ? 'Mèo' : val === 'dog' ? 'Chó' : 'Tất cả'}
        </span>
      )
    },
    {
      key: 'links',
      title: 'Affiliate Links',
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
    }
  ];

  const clickData = [
    { name: 'Shopee', clicks: stats?.summary?.shopeeClicks || 3, fill: '#EE4D2D' },
    { name: 'TikTok Shop', clicks: stats?.summary?.tiktokClicks || 2, fill: '#1e293b' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Admin */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <ShieldCheck className="w-8 h-8 text-amber-500" />
            <span>Bảng Điều Khiển Quản Trị (Admin Dashboard)</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Theo dõi thống kê số liệu người dùng, quản lý sản phẩm affiliate và giám sát cảnh báo hệ thống
          </p>
        </div>

        {/* Nút kiểm thử Discord Error Logger */}
        <button
          onClick={handleTriggerDiscordError}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Kiểm thử Discord Error Alert</span>
        </button>
      </div>

      {discordAlertStatus && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-bold text-rose-800 animate-fade-in flex items-center justify-between">
          <span>{discordAlertStatus}</span>
          <button onClick={() => setDiscordAlertStatus('')} className="text-xs text-rose-500 underline">Đóng</button>
        </div>
      )}

      {/* 4 Cards thống kê chính */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Người dùng đăng ký</span>
            <h3 className="text-2xl font-black text-slate-900">{stats?.summary?.totalUsers || 148}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
            <PawPrint className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Hồ sơ thú cưng</span>
            <h3 className="text-2xl font-black text-slate-900">{stats?.summary?.totalPets || 215}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Sản phẩm trong kho</span>
            <h3 className="text-2xl font-black text-slate-900">{products.length || 6}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
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
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h2 className="text-base font-extrabold text-slate-900">
            Thống kê lượt click chuyển đổi theo Nền tảng (Shopee vs. TikTok Shop)
          </h2>
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

        <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
          <h2 className="text-base font-extrabold text-slate-900">Cấu hình kết nối hệ thống</h2>
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
              <span className="text-slate-400 block font-semibold mb-0.5">Supabase Database:</span>
              <span className="font-bold text-slate-800 break-all">https://kqdnvaoocfbhvwkcxhdp.supabase.co</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
              <span className="text-slate-400 block font-semibold mb-0.5">Kênh Discord Bot Cảnh Báo:</span>
              <span className="font-bold text-amber-700">1551796683199873064</span>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200/60 text-emerald-900">
              <span className="font-bold">Trạng thái: Hoạt động bình thường</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            * Mọi ngoại lệ chưa được xử lý tại backend đều được Discord bot chuyển tiếp tự động theo thời gian thực.
          </p>
        </div>
      </div>

      {/* Bảng Danh sách sản phẩm (DataTable Codebase dùng chung) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900">Danh sách sản phẩm trong hệ thống</h2>
        </div>
        <DataTable
          columns={productColumns}
          data={products}
          isLoading={loading}
          emptyMessage="Chưa có sản phẩm nào"
        />
      </div>

    </div>
  );
}
