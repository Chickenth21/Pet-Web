import React, { useState } from 'react';
import Pagination from '../components/common/Pagination';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  Navigation, 
  ShieldCheck, 
  Scissors, 
  Stethoscope, 
  Search 
} from 'lucide-react';


const LOCATIONS_DATA = [
  {
    id: 1,
    name: 'Bệnh Viện Thú Y PetCare 24/7',
    type: 'clinic',
    address: '124 Hoàng Hoa Thám, Ba Đình, Hà Nội',
    district: 'Ba Đình',
    phone: '024 3823 4567',
    rating: 4.9,
    reviewsCount: 182,
    emergency24h: true,
    distance: '1.2 km',
    services: ['Cấp cứu 24/7', 'Phẫu thuật chuyên sâu', 'Xét nghiệm máu', 'Tiêm phòng vacxin']
  },
  {
    id: 2,
    name: 'Hệ Thống Thú Y 2Vet Clinic',
    type: 'clinic',
    address: '335 Kim Mã, Ba Đình, Hà Nội',
    district: 'Ba Đình',
    phone: '098 632 8822',
    rating: 4.8,
    reviewsCount: 145,
    emergency24h: true,
    distance: '2.5 km',
    services: ['Siêu âm - X-quang', 'Nội trú điều trị', 'Khám da liễu', 'Triệt sản an toàn']
  },
  {
    id: 3,
    name: 'PetSpa & Grooming House',
    type: 'spa',
    address: '56 Nguyễn Chí Thanh, Đống Đa, Hà Nội',
    district: 'Đống Đa',
    phone: '091 234 5678',
    rating: 4.9,
    reviewsCount: 96,
    emergency24h: false,
    distance: '3.1 km',
    services: ['Tắm sấy khử mùi', 'Cắt tỉa lông tạo kiểu', 'Cắt móng vệ sinh tai', 'Khách sạn thú cưng']
  },
  {
    id: 4,
    name: 'Phòng Khám Thú Y Gaia Pet Hospital',
    type: 'clinic',
    address: '38 Xuân Diệu, Tây Hồ, Hà Nội',
    district: 'Tây Hồ',
    phone: '024 3718 6969',
    rating: 4.7,
    reviewsCount: 110,
    emergency24h: false,
    distance: '4.0 km',
    services: ['Khám tổng quát', 'Nha khoa thú cưng', 'Điều trị nội trú', 'Chăm sóc mèo chuyên sâu']
  },
  {
    id: 5,
    name: 'Kimi Pet - Spa & Phụ Kiện Thú Cưng',
    type: 'spa',
    address: '126 Láng Hạ, Đống Đa, Hà Nội',
    district: 'Đống Đa',
    phone: '088 888 1234',
    rating: 4.8,
    reviewsCount: 204,
    emergency24h: false,
    distance: '3.8 km',
    services: ['Spa tắm bồn sục', 'Nhuộm lông nghệ thuật', 'Khách sạn chó mèo cao cấp']
  }
];

export default function NearbyLocations() {
  const [filterType, setFilterType] = useState('all'); // 'all' | 'clinic' | 'spa'
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [search, setSearch] = useState('');

  // Phân trang chuẩn codebase cho Địa điểm thú y & Spa
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(4);

  const filteredLocations = LOCATIONS_DATA.filter(loc => {
    if (filterType !== 'all' && loc.type !== filterType) return false;
    if (selectedDistrict !== 'all' && loc.district !== selectedDistrict) return false;
    if (search && !loc.name.toLowerCase().includes(search.toLowerCase()) && !loc.address.toLowerCase().includes(search.toLowerCase())) {
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
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedLocations.map((loc) => (
          <div
            key={loc.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-card transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                  loc.type === 'clinic'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-teal-50 text-teal-700 border border-teal-200'
                }`}>
                  {loc.type === 'clinic' ? <Stethoscope className="w-3.5 h-3.5" /> : <Scissors className="w-3.5 h-3.5" />}
                  <span>{loc.type === 'clinic' ? 'Phòng khám Thú Y' : 'Spa & Cắt tỉa'}</span>
                </span>

                {loc.emergency24h && (
                  <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-extrabold rounded-full animate-pulse">
                    Cấp cứu 24/7
                  </span>
                )}
              </div>

              <h3 className="font-extrabold text-lg text-slate-900 leading-snug mb-1">
                {loc.name}
              </h3>

              <div className="flex items-center gap-2 text-xs mb-3">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{loc.rating}</span>
                </div>
                <span className="text-slate-400">({loc.reviewsCount} đánh giá)</span>
                <span className="text-slate-300">•</span>
                <span className="font-bold text-amber-600">{loc.distance}</span>
              </div>

              <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>{loc.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <a href={`tel:${loc.phone}`} className="font-bold text-amber-700 hover:underline">
                    {loc.phone}
                  </a>
                </div>
              </div>

              {/* Dịch vụ cung cấp */}
              <div className="flex flex-wrap gap-1.5 pt-3">
                {loc.services.map((serv, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-slate-100 rounded-md text-[10px] font-medium text-slate-600">
                    {serv}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.name + ' ' + loc.address)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-slate-50 hover:bg-amber-50 hover:text-amber-700 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Chỉ đường trên Google Maps</span>
              </a>
            </div>
          </div>
        ))}
      </div>

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

