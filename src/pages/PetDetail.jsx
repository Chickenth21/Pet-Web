import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DriveImage from '../components/common/DriveImage';
import Modal from '../components/common/Modal';
import { 
  PawPrint, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  Check,
  Video, 
  Award, 
  BadgeCheck, 
  Calendar, 
  PhoneCall, 
  MessageCircle, 
  Sparkles,
  ChevronRight,
  ArrowRight,
  AlertCircle,
  Clock,
  Heart
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function PetDetail() {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [relatedPets, setRelatedPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  // Modal liên hệ / Đặt lịch xem bé
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('interest'); // 'interest' | 'schedule'
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    date: '',
    note: ''
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  useEffect(() => {
    const fetchPetAndRelated = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/pet-sales/${id}`);
        const data = await res.json();
        if (data.success && data.data) {
          const currentPet = data.data;
          setPet(currentPet);
          setSelectedImage(0);

          // Lấy các bé cùng giống / cùng loài gợi ý bên dưới
          try {
            const relRes = await fetch(`${API_BASE}/pet-sales?species=${currentPet.species}&limit=12&include_sold=false`);
            const relData = await relRes.json();
            if (relData.success && relData.data?.pets) {
              // Lọc bỏ bé hiện tại và lấy tối đa 4 bé
              const filtered = relData.data.pets
                .filter(p => p.id !== currentPet.id)
                .slice(0, 4);
              setRelatedPets(filtered);
            }
          } catch {
            // Không chặn trang nếu lỗi gợi ý
          }
        }
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    };

    fetchPetAndRelated();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const images = React.useMemo(() => {
    if (!pet) return [];
    if (Array.isArray(pet.images) && pet.images.length > 0) return pet.images;
    if (pet.image_url) return [pet.image_url];
    return ['https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800&auto=format&fit=crop'];
  }, [pet]);

  // Trích xuất YouTube Embed URL nếu có
  const getEmbedVideoUrl = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? `https://www.youtube-nocookie.com/embed/${match[1]}` : null;
  };

  const videoEmbed = pet ? getEmbedVideoUrl(pet.video_url) : null;

  const handleOpenModal = (mode = 'interest') => {
    setModalMode(mode);
    setContactModalOpen(true);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.phone) {
      alert('Vui lòng nhập số điện thoại để chuyên viên Pet Paw liên hệ hỗ trợ!');
      return;
    }
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactModalOpen(false);
      setContactForm({ name: '', phone: '', date: '', note: '' });
      alert(
        modalMode === 'schedule'
          ? `🎉 Đã ghi nhận lịch hẹn xem bé ${pet?.name}! Chuyên viên sẽ gọi điện xác nhận giờ hẹn với bạn trong 15 phút.`
          : `🎉 Cảm ơn bạn đã quan tâm đến bé ${pet?.name}! Tư vấn viên Pet Paw sẽ gọi điện tư vấn và gửi thêm video hình ảnh qua Zalo/SĐT cho bạn.`
      );
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <PawPrint className="w-10 h-10 text-amber-500 animate-bounce mx-auto" />
          <p className="text-xs font-bold text-slate-500">Đang tải thông tin bé cưng...</p>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-md text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-base font-extrabold text-slate-900">Không tìm thấy thông tin bé thú cưng</h2>
          <p className="text-xs text-slate-500">Bé cưng có thể đã về nhà mới hoặc liên kết không tồn tại.</p>
          <Link
            to="/buy-pets"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Xem các bé khác đang tìm chủ</span>
          </Link>
        </div>
      </div>
    );
  }

  const speciesName = pet.species === 'cat' ? 'Mèo' : 'Chó';
  const genderText = pet.gender === 'female' ? 'Cái' : 'Đực';

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-800 pb-20">
      
      {/* 1. Breadcrumb điều hướng bám sát ảnh mẫu */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <Link to="/" className="hover:text-slate-800 transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <Link 
            to={`/buy-pets?species=${pet.species}`} 
            className="hover:text-slate-800 transition-colors"
          >
            {speciesName}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-900 font-semibold">{pet.name}</span>
        </nav>
      </div>

      {/* 2. Phần Hero Chi tiết bé (2 Cột bám sát ảnh mẫu) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* CỘT TRÁI: Gallery ảnh dọc + ảnh chính (7 Cột) */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4 items-start">
            
            {/* Dải thumbnail xếp dọc bên trái */}
            {images.length > 1 && (
              <div className="flex sm:flex-col gap-3 w-full sm:w-20 shrink-0 overflow-x-auto sm:overflow-y-auto max-h-[580px] no-scrollbar py-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      selectedImage === idx 
                        ? 'border-amber-500 ring-2 ring-amber-400/30 shadow-sm scale-102' 
                        : 'border-slate-200/80 hover:border-slate-300 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <DriveImage src={img} alt={`${pet.name} thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Khung ảnh chính to bo góc mềm mại */}
            <div className="flex-1 w-full relative aspect-4/5 sm:aspect-square md:aspect-4/5 rounded-3xl overflow-hidden bg-white shadow-xs border border-slate-200/60">
              <DriveImage
                src={images[selectedImage]}
                alt={pet.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* CỘT PHẢI: Thông tin bé & Đặt lịch (5 Cột bám sát ảnh mẫu) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Huy hiệu trạng thái */}
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                <span>• CÓ SẴN</span>
              </span>
            </div>

            {/* Tên bé & Dòng phụ */}
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {pet.name}
              </h1>
              <p className="text-sm font-medium text-slate-500">
                {pet.breed} · {genderText} · {pet.age_months} tháng
              </p>
            </div>

            {/* Đoạn giới thiệu tính cách */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
              {pet.description || `Bạn muốn một bé cưng nhỏ xinh, ngoan ngoãn, khỏe mạnh và tràn đầy năng lượng? Bé ${pet.name} chính là sự kết hợp tuyệt vời nhất! Với bộ lông xinh xắn, mắt sáng lanh lợi, tính tình quấn chủ...`}
            </p>

            {/* Dòng bảo chứng xã hội */}
            <p className="text-xs text-slate-400 font-medium">
              Đã có 200+ bé {pet.breed} về với gia đình qua Pet Paw
            </p>

            {/* Khối giá bán lớn & Ghi chú đi kèm */}
            <div className="pt-2">
              <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {Number(pet.price).toLocaleString('vi-VN')}đ
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Đã bao gồm: 2 mũi vaccine, sổ tiêm, giấy tờ thuần chủng
              </p>
            </div>

            {/* 3 Nút Hành Động bám sát ảnh mẫu */}
            <div className="space-y-3 pt-2">
              {/* Nút 1: Tôi quan tâm bé */}
              <button
                onClick={() => handleOpenModal('interest')}
                disabled={pet.status === 'sold'}
                className="w-full py-4 px-6 bg-[#181f26] hover:bg-slate-800 active:scale-[0.99] text-white font-bold text-sm rounded-full transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {pet.status === 'sold' ? 'Bé đã về nhà mới' : `Tôi quan tâm bé ${pet.name}`}
              </button>

              {/* Nút 2: Đặt lịch đến xem bé */}
              <button
                onClick={() => handleOpenModal('schedule')}
                disabled={pet.status === 'sold'}
                className="w-full py-3.5 px-6 border border-slate-300 bg-[#faf6f0] hover:bg-[#f5eee3] active:scale-[0.99] text-slate-800 font-bold text-sm rounded-full transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Đặt lịch đến xem bé
              </button>

              {/* Nút 3: Link Zalo */}
              <div className="text-center pt-1">
                <a
                  href="https://zalo.me"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Nhắn Zalo với Pet Paw</span>
                </a>
              </div>
            </div>

            {/* 3 Cam kết vàng có dấu tick xanh */}
            <div className="pt-4 border-t border-slate-200/80 space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs text-slate-700 font-semibold">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Bảo hành sức khỏe 30 ngày (Care, Parvo, Giảm bạch cầu)</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-700 font-semibold">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Thuần chủng trọn đời 100%</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-700 font-semibold">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Đồng hành 100% 2 mũi tiêm đầu tiên</span>
              </div>
              <div className="pt-1">
                <Link
                  to="/warranty"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Xem chi tiết chính sách bảo hành Standard & Gói nâng cấp →</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 3. Phần "Về bé [Tên bé]" - Thông số chi tiết & Video */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-slate-200/80">
        <h2 className="text-2xl font-black text-slate-900 mb-6">
          Về bé {pet.name}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Bảng thông số chi tiết */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Thông Tin Sức Khỏe & Pháp Lý Chi Tiết
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Giống loài & Dòng</span>
                <span className="font-extrabold text-slate-900 text-sm">{pet.breed}</span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Giới tính & Độ tuổi</span>
                <span className="font-extrabold text-slate-900 text-sm">{genderText} · {pet.age_months} tháng tuổi</span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Màu sắc lông</span>
                <span className="font-extrabold text-slate-900 text-sm">{pet.color || 'Tiêu chuẩn'}</span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Chứng nhận phả hệ</span>
                <span className="font-extrabold text-amber-700 text-sm">
                  {pet.pedigree && pet.pedigree !== 'Không giấy' ? `Có giấy ${pet.pedigree}` : 'Không kèm giấy phả hệ'}
                </span>
              </div>

              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl sm:col-span-2 space-y-1 text-emerald-900">
                <span className="text-[10px] font-bold uppercase text-emerald-700 block">Lịch sử tiêm phòng vắc-xin</span>
                <span className="font-bold text-sm block">{pet.vaccination_status || 'Đã tiêm 2 mũi vắc-xin phòng bệnh, sổ giun định kỳ'}</span>
              </div>

              <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl sm:col-span-2 space-y-1 text-amber-900">
                <span className="text-[10px] font-bold uppercase text-amber-700 block">Chính sách bảo hành sức khỏe</span>
                <span className="font-bold text-sm block">{pet.health_warranty || 'Bảo hành 30 ngày Care & Parvo bằng văn bản cam kết'}</span>
              </div>

              {pet.microchip_id && (
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 sm:col-span-2 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Mã số Microchip định danh</span>
                  <span className="font-mono font-bold text-slate-800 text-sm">{pet.microchip_id}</span>
                </div>
              )}
            </div>
          </div>

          {/* Video thực tế bé vui đùa (nếu có) */}
          <div className="lg:col-span-5 space-y-4">
            {videoEmbed ? (
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-rose-600">
                  <Video className="w-5 h-5" />
                  <h3 className="font-extrabold text-sm text-slate-900">Video Thực Tế Bé Đang Vui Đùa</h3>
                </div>
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 shadow-inner">
                  <iframe
                    src={videoEmbed}
                    title={`Video thực tế bé ${pet.name}`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs text-center space-y-3">
                <PawPrint className="w-10 h-10 text-amber-400 mx-auto" />
                <h4 className="font-bold text-sm text-slate-900">Muốn Xem Video Trực Tiếp Của Bé?</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Nhắn tin qua Zalo hoặc gọi Hotline để nhân viên quay video cận cảnh bé đang ăn uống, chạy nhảy theo yêu cầu của bạn.
                </p>
                <a
                  href="tel:19008888"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                  <span>Hotline: 1900 8888</span>
                </a>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* 4. Gợi Ý Các Giống / Bé Tương Tự (4 con 1 hàng bám sát yêu cầu) */}
      {relatedPets.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
            <div>
              <span className="text-xs font-bold uppercase text-amber-600 tracking-wider block mb-1">
                Gợi Ý Dành Cho Bạn
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Các Bé {speciesName} Cảnh Tương Tự Đang Tìm Chủ
              </h2>
            </div>

            <Link
              to={`/buy-pets?species=${pet.species}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 transition-colors shrink-0"
            >
              <span>Xem tất cả bé {speciesName.toLowerCase()}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Lưới 4 thẻ / 1 hàng */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {relatedPets.map((relPet) => {
              const statusBadges = {
                available: { text: '🟢 Đang tìm chủ', cls: 'bg-emerald-500 text-white' },
                reserved: { text: '🟡 Đã nhận cọc', cls: 'bg-amber-500 text-slate-950 font-bold' },
                sold: { text: '⚪ Đã về nhà mới', cls: 'bg-slate-700 text-slate-200' }
              };
              const badge = statusBadges[relPet.status] || statusBadges.available;

              return (
                <Link
                  key={relPet.id}
                  to={`/buy-pets/${relPet.id}`}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-amber-300 hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer block"
                >
                  {/* Khung ảnh cố định kích thước h-52 */}
                  <div className="relative w-full h-52 shrink-0 bg-slate-100 overflow-hidden">
                    <DriveImage
                      src={Array.isArray(relPet.images) ? relPet.images[0] : relPet.image_url}
                      alt={relPet.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    <div className="absolute top-2.5 left-2.5">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold shadow-md shadow-black/20 ${badge.cls}`}>
                        {badge.text}
                      </span>
                    </div>

                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                      <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase shadow-sm ${
                        relPet.gender === 'female' ? 'bg-pink-500/90 text-white' : 'bg-blue-600/90 text-white'
                      }`}>
                        {relPet.gender === 'female' ? '♀ Bé Cái' : '♂ Bé Đực'}
                      </span>
                      <span className="px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold">
                        {relPet.age_months}th
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-slate-500">{relPet.breed}</span>
                      <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm line-clamp-1 group-hover:text-amber-600 transition-colors">
                        {relPet.name}
                      </h3>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[9px] font-bold uppercase text-slate-400 block leading-tight">Giá chính thức</span>
                        <span className="text-base font-black text-amber-600 leading-tight">
                          {Number(relPet.price).toLocaleString('vi-VN')} đ
                        </span>
                      </div>

                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 group-hover:text-amber-700 transition-colors">
                        <span>Chi tiết</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Modal Quan Tâm / Đặt Lịch Hẹn Đến Xem Bé */}
      <Modal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        title={modalMode === 'schedule' ? `Đặt Lịch Đến Xem Bé ${pet.name}` : `Đăng Ký Quan Tâm Bé ${pet.name}`}
      >
        <form onSubmit={handleContactSubmit} className="space-y-4">
          <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0">
              <DriveImage src={images[0]} alt={pet.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-xs text-slate-900 truncate">{pet.name}</h4>
              <p className="text-[11px] text-slate-500">{pet.breed} · {genderText} · {pet.age_months} tháng</p>
              <p className="text-xs font-black text-amber-600">{Number(pet.price).toLocaleString('vi-VN')} đ</p>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Họ và tên của bạn *</label>
            <input
              type="text"
              required
              value={contactForm.name}
              onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
              placeholder="Ví dụ: Nguyễn Văn An"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Số điện thoại liên hệ (có Zalo) *</label>
            <input
              type="tel"
              required
              value={contactForm.phone}
              onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
              placeholder="Ví dụ: 0987 654 321"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          {modalMode === 'schedule' && (
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Thời gian dự kiến đến xem bé</label>
              <input
                type="datetime-local"
                value={contactForm.date}
                onChange={(e) => setContactForm({ ...contactForm, date: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Ghi chú thêm</label>
            <textarea
              rows={2}
              value={contactForm.note}
              onChange={(e) => setContactForm({ ...contactForm, note: e.target.value })}
              placeholder="Bạn muốn xem thêm video, hỏi về tiêm chủng hoặc hỗ trợ vận chuyển..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setContactModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={contactSubmitted}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 cursor-pointer disabled:opacity-50"
            >
              {contactSubmitted ? 'Đang gửi...' : modalMode === 'schedule' ? 'Xác Nhận Đặt Lịch' : 'Gửi Yêu Cầu'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
