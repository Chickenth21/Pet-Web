import React, { useState, useEffect } from 'react';
import Pagination from '../components/common/Pagination';
import DriveImage from '../components/common/DriveImage';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  Navigation, 
  ShieldCheck, 
  Scissors, 
  Stethoscope, 
  Search,
  Loader2
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function NearbyLocations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'clinic' | 'spa'
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [search, setSearch] = useState('');

  // Tải danh sách địa điểm bệnh viện và tiệm spa động từ máy chủ
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/locations?limit=100`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data?.locations)) {
          setLocations(data.data.locations);
        }
      } catch (err) {
        console.error('Lỗi khi tải danh sách địa điểm từ API:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // Phân trang chuẩn codebase cho Địa điểm thú y & Spa
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(6);

  const filteredLocations = locations.filter(loc => {
    if (filterType !== 'all' && loc.type !== filterType) return false;
    if (selectedDistrict !== 'all' && loc.district !== selectedDistrict) return false;
    if (search && !loc.name?.toLowerCase().includes(search.toLowerCase()) && !loc.address?.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  const paginatedLocations = React.useMemo(() => {
    const start = (currentPage - 1) * limit;
    return filteredLocations.slice(start, start + limit);
  }, [filteredLocations, currentPage, limit]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
          <MapPin className="w-8 h-8 text-amber-500" />
          <span>Phòng Khám Thú Y & Spa Gần Bạn</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Tra cứu nhanh danh sách các bệnh viện thú y 24/7 và cơ sở grooming uy tín lân cận để bạn luôn an tâm chăm sóc bé cưng
        </p>
      </div>

      {/* Thanh bộ lọc & tìm kiếm */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Type Selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
          {[
            { id: 'all', label: 'Tất cả địa điểm' },
            { id: 'clinic', label: '🏥 Phòng khám 24/7' },
            { id: 'spa', label: '✂️ Tiệm Grooming & Spa' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setFilterType(tab.id);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterType === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tìm kiếm */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Tìm theo tên phòng khám, đường phố..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-amber-500"
          />
        </div>
      </div>

      {/* Danh sách địa điểm */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-10 h-10 animate-spin text-amber-500 mb-3" />
          <p className="text-sm font-medium">Đang tải danh sách cơ sở thú y & spa...</p>
        </div>
      ) : filteredLocations.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 max-w-lg mx-auto space-y-3">
          <MapPin className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-lg">Chưa có cơ sở nào phù hợp</h3>
          <p className="text-xs text-slate-500">
            {search ? 'Không tìm thấy kết quả nào khớp với từ khóa tìm kiếm.' : 'Hiện chưa có phòng khám hay tiệm spa nào trong danh mục này.'}
          </p>
          {search && (
            <button
              onClick={() => { setSearch(''); setFilterType('all'); }}
              className="px-4 py-2 bg-amber-500 text-slate-950 rounded-xl text-xs font-bold hover:bg-amber-600 transition-colors cursor-pointer"
            >
              Xem tất cả cơ sở
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedLocations.map((loc) => (
            <div
              key={loc.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm hover:shadow-card transition-all flex flex-col justify-between group overflow-hidden"
            >
              <div>
                {/* Ảnh cơ sở */}
                <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-4 bg-slate-100">
                  <DriveImage
                    src={loc.image_url || loc.image}
                    alt={loc.name}
                    fallbackText={loc.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Badges trên ảnh */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 shadow-xs backdrop-blur-md ${
                      loc.type === 'clinic'
                        ? 'bg-rose-50/95 text-rose-700 border border-rose-200/90'
                        : 'bg-teal-50/95 text-teal-700 border border-teal-200/90'
                    }`}>
                      {loc.type === 'clinic' ? <Stethoscope className="w-3.5 h-3.5" /> : <Scissors className="w-3.5 h-3.5" />}
                      <span>{loc.type === 'clinic' ? 'Phòng khám Thú Y' : 'Spa & Cắt tỉa'}</span>
                    </span>
                  </div>

                  {(loc.emergency24h || loc.emergency_24h) && (
                    <span className="absolute top-3 right-3 px-2.5 py-1 bg-rose-600 text-white text-[10px] font-extrabold rounded-full shadow-md animate-pulse">
                      Cấp cứu 24/7
                    </span>
                  )}
                </div>

                <h3 className="font-extrabold text-lg text-slate-900 leading-snug mb-1 group-hover:text-amber-600 transition-colors">
                  {loc.name}
                </h3>

                <div className="flex items-center gap-2 text-xs mb-3">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{loc.rating || 5.0}</span>
                  </div>
                  <span className="text-slate-400">({loc.reviewsCount ?? loc.reviews_count ?? 0} đánh giá)</span>
                  <span className="text-slate-300">•</span>
                  <span className="font-bold text-amber-600">{loc.distance || loc.district || 'Gần bạn'}</span>
                </div>

                <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{loc.address}</span>
                  </div>
                  {loc.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                      <a href={`tel:${loc.phone}`} className="font-bold text-amber-700 hover:underline">
                        {loc.phone}
                      </a>
                    </div>
                  )}
                </div>

                {/* Dịch vụ cung cấp */}
                {((Array.isArray(loc.services) ? loc.services : (typeof loc.services === 'string' ? loc.services.split(',').map(s => s.trim()) : [])).filter(Boolean).length > 0) && (
                  <div className="flex flex-wrap gap-1.5 pt-3">
                    {(Array.isArray(loc.services) ? loc.services : (typeof loc.services === 'string' ? loc.services.split(',').map(s => s.trim()) : [])).filter(Boolean).map((serv, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-slate-100 rounded-md text-[10px] font-medium text-slate-600">
                        {serv}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.name + ' ' + loc.address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 bg-slate-50 hover:bg-amber-50 hover:text-amber-700 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Chỉ đường trên Google Maps</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Phân trang chuẩn codebase */}
      {filteredLocations.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-2 shadow-xs">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredLocations.length / limit) || 1}
            onPageChange={(p) => setCurrentPage(p)}
            limit={limit}
            onLimitChange={(l) => {
              setLimit(l);
              setCurrentPage(1);
            }}
            totalItems={filteredLocations.length}
          />
        </div>
      )}

    </div>
  );
}

