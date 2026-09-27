import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import DriveImage from '../components/common/DriveImage';
import Pagination from '../components/common/Pagination';
import { 
  PawPrint, 
  Search, 
  Filter, 
  Heart, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Video, 
  ArrowRight,
  PhoneCall,
  Calendar,
  Award,
  BadgeCheck
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function PetMarket() {
  const [searchParams, setSearchParams] = useSearchParams();
  const speciesFilter = searchParams.get('species') || 'all';
  const statusFilter = searchParams.get('status') || 'available';

  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBreed, setSelectedBreed] = useState('all');
  const [priceRange, setPriceRange] = useState('all'); // all, under10, 10to15, over15
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(4);

  const fetchPets = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE}/pet-sales?limit=100&include_sold=true`;
      if (speciesFilter !== 'all') url += `&species=${speciesFilter}`;
      if (statusFilter !== 'all') url += `&status=${statusFilter}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setPets(data.data.pets);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
    setCurrentPage(1);
  }, [speciesFilter, statusFilter]);

  // Bộ lọc Client-side nâng cao
  const filteredPets = React.useMemo(() => {
    return pets.filter((pet) => {
      // Tìm kiếm theo tên / giống / màu lông
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchName = pet.name?.toLowerCase().includes(q);
        const matchBreed = pet.breed?.toLowerCase().includes(q);
        const matchColor = pet.color?.toLowerCase().includes(q);
        if (!matchName && !matchBreed && !matchColor) return false;
      }

      // Giống loài
      if (selectedBreed !== 'all' && pet.breed !== selectedBreed) {
        return false;
      }

      // Khoảng giá
      const price = Number(pet.price) || 0;
      if (priceRange === 'under8' && price >= 8000000) return false;
      if (priceRange === '8to12' && (price < 8000000 || price > 12000000)) return false;
      if (priceRange === 'over12' && price <= 12000000) return false;

      return true;
    });
  }, [pets, searchTerm, selectedBreed, priceRange]);

  // Phân trang
  const paginatedPets = React.useMemo(() => {
    const start = (currentPage - 1) * limit;
    return filteredPets.slice(start, start + limit);
  }, [filteredPets, currentPage, limit]);

  const totalPages = Math.ceil(filteredPets.length / limit) || 1;

  // Lấy danh sách giống loài duy nhất để lọc
  const uniqueBreeds = React.useMemo(() => {
    const breeds = pets.map(p => p.breed).filter(Boolean);
    return ['all', ...Array.from(new Set(breeds))];
  }, [pets]);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Hero Banner Chào Mừng */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 text-white overflow-hidden pt-10 pb-16 sm:pt-12 sm:pb-20">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Kho Thú Cưng Cảnh Thuần Chủng Pet Paw</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
              Đón Bé Cưng Khỏe Mạnh, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
                100% Thuần Chủng & Bảo Hành Toàn Diện
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              Tất cả các bé cún, bé mèo tại Pet Paw đều được tuyển chọn kỹ lưỡng, đã tiêm đủ 2 mũi vaccine phòng bệnh, sổ giun định kỳ kèm cam kết bảo hành sức khỏe bằng văn bản.
            </p>

            {/* 3 Cam kết vàng */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <Link
                to="/warranty"
                className="flex items-center justify-between p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-xs transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-white">Bảo hành sức khỏe 30 ngày</span>
                </div>
                <span className="text-[10px] text-amber-400 group-hover:underline">Chi tiết →</span>
              </Link>
              <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-200">Giấy phả hệ VKA / WCF / TICA</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-200">Bác sĩ thú y hỗ trợ trọn đời</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bộ Lọc & Tìm Kiếm: Tách biệt rõ ràng, không dính sát vào hero banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-10 mb-8 relative z-10">
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xl shadow-slate-200/70 border border-slate-200/90 space-y-4">
          
          {/* Hàng 1: Tabs chọn loài & Ô tìm kiếm */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            
            {/* Phân loại loài: Tất cả, Chó cảnh, Mèo cảnh */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setSearchParams({ species: 'all' })}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  speciesFilter === 'all'
                    ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                🐾 Tất cả các bé ({pets.length})
              </button>

              <button
                onClick={() => setSearchParams({ species: 'dog' })}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  speciesFilter === 'dog'
                    ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>🐶 Chó cảnh</span>
              </button>

              <button
                onClick={() => setSearchParams({ species: 'cat' })}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  speciesFilter === 'cat'
                    ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>🐱 Mèo cảnh</span>
              </button>
            </div>

            {/* Ô tìm kiếm */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm theo tên bé, giống (Corgi, Poodle, Munchkin...)"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-amber-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Hàng 2: Bộ lọc theo Giống, Giá và Trạng thái */}
          <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Giống loài</label>
              <select
                value={selectedBreed}
                onChange={(e) => setSelectedBreed(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:bg-white focus:border-amber-500 focus:outline-none"
              >
                <option value="all">Tất cả giống loài</option>
                {uniqueBreeds.filter(b => b !== 'all').map(breed => (
                  <option key={breed} value={breed}>{breed}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Khoảng giá tham khảo</label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:bg-white focus:border-amber-500 focus:outline-none"
              >
                <option value="all">Tất cả mức giá</option>
                <option value="under8">Dưới 8.000.000 đ</option>
                <option value="8to12">Từ 8.000.000 đ - 12.000.000 đ</option>
                <option value="over12">Trên 12.000.000 đ (Có phả hệ)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Trạng thái mở bán</label>
              <select
                value={statusFilter}
                onChange={(e) => setSearchParams({ species: speciesFilter, status: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:bg-white focus:border-amber-500 focus:outline-none"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="available">🟢 Chỉ hiện bé đang tìm chủ</option>
                <option value="reserved">🟡 Bé đã có cọc</option>
                <option value="sold">⚪ Bé đã về nhà mới</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Danh Sách Thẻ Thú Cưng Mở Bán (Hiển thị 4 con / 1 hàng, có khoảng thở phía trên) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Kết quả tìm kiếm */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Hiển thị <span className="text-amber-600 font-extrabold">{filteredPets.length}</span> bé cưng sẵn sàng tìm chủ
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
              <div key={n} className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs animate-pulse space-y-3">
                <div className="w-full h-56 bg-slate-200 rounded-2xl" />
                <div className="h-4 bg-slate-200 rounded-md w-3/4" />
                <div className="h-3 bg-slate-200 rounded-md w-1/2" />
                <div className="h-8 bg-slate-200 rounded-xl" />
              </div>
            ))}
          </div>
        ) : paginatedPets.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 shadow-xs p-8 max-w-md mx-auto space-y-3">
            <PawPrint className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">Không tìm thấy bé thú cưng nào phù hợp</h3>
            <p className="text-xs text-slate-500">
              Hãy thử nới lỏng bộ lọc khoảng giá hoặc chuyển đổi danh mục giống để tìm được bé ưng ý nhất.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedBreed('all');
                setPriceRange('all');
                setSearchParams({ species: 'all', status: 'all' });
              }}
              className="mt-2 px-4 py-2 bg-amber-500 text-slate-950 rounded-xl text-xs font-bold hover:bg-amber-600 transition-colors"
            >
              Xem lại tất cả bé
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {paginatedPets.map((pet) => {
              const statusBadges = {
                available: { text: '🟢 Đang tìm chủ', cls: 'bg-emerald-500 text-white' },
                reserved: { text: '🟡 Đã nhận cọc', cls: 'bg-amber-500 text-slate-950 font-bold' },
                sold: { text: '⚪ Đã về nhà mới', cls: 'bg-slate-700 text-slate-200' }
              };
              const badge = statusBadges[pet.status] || statusBadges.available;

              return (
                <Link 
                  key={pet.id}
                  to={`/buy-pets/${pet.id}`}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-amber-300 hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer block"
                >
                  {/* Khung Ảnh đại diện cố định kích thước chuẩn (h-56), không bị co giãn/flex */}
                  <div className="relative w-full h-56 shrink-0 bg-slate-100 overflow-hidden">
                    <DriveImage
                      src={Array.isArray(pet.images) ? pet.images[0] : pet.image_url}
                      alt={pet.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Huy hiệu Trạng thái */}
                    <div className="absolute top-2.5 left-2.5">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold shadow-md shadow-black/20 ${badge.cls}`}>
                        {badge.text}
                      </span>
                    </div>

                    {/* Nhãn Giới tính & Tuổi */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                      <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase shadow-sm ${
                        pet.gender === 'female' 
                          ? 'bg-pink-500/90 text-white' 
                          : 'bg-blue-600/90 text-white'
                      }`}>
                        {pet.gender === 'female' ? '♀ Bé Cái' : '♂ Bé Đực'}
                      </span>
                      <span className="px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold">
                        {pet.age_months}th
                      </span>
                    </div>

                    {/* Huy hiệu Giấy phả hệ (nếu có) */}
                    {pet.pedigree && pet.pedigree !== 'Không giấy' && (
                      <div className="absolute bottom-2.5 left-2.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-400 text-slate-950 font-black text-[9px] shadow-md shadow-black/20">
                          <Award className="w-3 h-3" />
                          <span>Giấy {pet.pedigree}</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Thông tin cần thiết: Giống loài, Tên bé, Giá bán & Nút xem chi tiết */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                          pet.species === 'cat' 
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' 
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {pet.species === 'cat' ? 'Mèo' : 'Chó'}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500 truncate">{pet.breed}</span>
                      </div>

                      <h3 className="font-extrabold text-slate-900 text-sm line-clamp-1 group-hover:text-amber-600 transition-colors">
                        {pet.name}
                      </h3>
                    </div>

                    {/* Hàng Giá & Nút hành động */}
                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[9px] font-bold uppercase text-slate-400 block leading-tight">Giá đón bé</span>
                        <span className="text-base font-black text-amber-600 leading-tight">
                          {Number(pet.price).toLocaleString('vi-VN')} đ
                        </span>
                      </div>

                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 group-hover:bg-amber-600 text-slate-950 font-bold text-[11px] shadow-sm shadow-amber-500/20 group-hover:gap-1.5 transition-all shrink-0">
                        <span>Chi tiết</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Phân trang chuẩn Codebase */}
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => {
              setCurrentPage(p);
              window.scrollTo({ top: 350, behavior: 'smooth' });
            }}
            limit={limit}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setCurrentPage(1);
            }}
            totalItems={filteredPets.length}
          />
        </div>
      </section>

      {/* Banner Cam Kết Dịch Vụ Đón Bé */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 rounded-3xl p-8 sm:p-10 shadow-xl shadow-amber-500/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-slate-950">
            <h2 className="text-2xl sm:text-3xl font-black">
              Bạn Cần Tư Vấn Đón Bé Thú Cưng Phù Hợp?
            </h2>
            <p className="text-xs sm:text-sm font-medium text-amber-950 max-w-xl">
              Đội ngũ chuyên gia và bác sĩ thú y của Pet Paw luôn sẵn sàng hỗ trợ 24/7. Hướng dẫn chuẩn bị đồ dùng, khẩu phần ăn và đưa bé về tận nhà an toàn.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <a
              href="tel:19008888"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs rounded-2xl shadow-lg transition-all"
            >
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <span>Hotline: 1900 8888</span>
            </a>
            
            <Link
              to="/matchmaker"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/90 hover:bg-white text-slate-900 font-bold text-xs rounded-2xl shadow-sm transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Trắc nghiệm chọn giống</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
