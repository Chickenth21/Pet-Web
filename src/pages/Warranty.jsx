import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  HeartHandshake, 
  Syringe, 
  Gift, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Crown, 
  PhoneCall, 
  Globe, 
  MessageCircle, 
  FileText, 
  Camera, 
  Video, 
  Receipt, 
  Stethoscope, 
  Check, 
  X, 
  ChevronRight, 
  HelpCircle,
  Copy,
  Clock,
  Send,
  ArrowRight,
  Info
} from 'lucide-react';
import Modal from '../components/common/Modal';

export default function Warranty() {
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [claimSubmitted, setClaimSubmitted] = useState(false);
  const [claimForm, setClaimForm] = useState({
    customerName: '',
    phone: '',
    petName: '',
    receiveDate: '',
    warrantyPackage: 'standard',
    symptoms: '',
    clinicName: ''
  });

  const handleCopyPhone = () => {
    navigator.clipboard.writeText('0939863696');
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const handleClaimSubmit = (e) => {
    e.preventDefault();
    setClaimSubmitted(true);
    setTimeout(() => {
      setClaimModalOpen(false);
      setClaimSubmitted(false);
      setClaimForm({
        customerName: '',
        phone: '',
        petName: '',
        receiveDate: '',
        warrantyPackage: 'standard',
        symptoms: '',
        clinicName: ''
      });
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      {/* 1. BREADCRUMB */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Link to="/" className="hover:text-amber-600 transition-colors">Trang chủ</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link to="/buy-pets" className="hover:text-amber-600 transition-colors">Mua Thú Cưng</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold">Chính sách bảo hành</span>
          </nav>
        </div>
      </div>

      {/* 2. HERO BANNER */}
      <section className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white overflow-hidden py-14 sm:py-20">
        {/* Pattern Background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px]" />
        
        {/* Glow Orb */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider shadow-inner">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>PEACE OF MIND – SỰ AN TÂM TRỌN VẸN</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15]">
              Chính sách bảo hành minh bạch, có trách nhiệm –{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200">
                Chỉ có tại Pet Paw
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-2xl">
              Chúng tôi hiểu rằng mỗi bé cún, bé mèo là một thành viên quý giá trong gia đình bạn. Pet Paw cam kết bảo vệ sức khỏe bé cưng toàn diện, hỗ trợ viện phí minh bạch và bảo đảm thuần chủng trọn đời.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <a
                href="#upgrade-packages"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all transform hover:-translate-y-0.5"
              >
                <span>Xem các gói bảo hành</span>
                <ChevronRight className="w-4 h-4" />
              </a>

              <a
                href="#claim-guide"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm backdrop-blur-md transition-all"
              >
                <FileText className="w-4 h-4 text-amber-300" />
                <span>Cách gửi yêu cầu bảo hành</span>
              </a>

              <button
                onClick={() => setClaimModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-600/25 transition-all"
              >
                <Stethoscope className="w-4 h-4" />
                <span>Nộp hồ sơ bảo hành online</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 4 CAM KẾT VÀNG CỐT LÕI (4 Core Guarantees) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-10 relative z-10 mb-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Card 1 */}
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/60 border border-slate-200/80 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="inline-block px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-extrabold text-[11px] rounded-full border border-emerald-200">
                30 Ngày
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Bảo hành sức khỏe 30 ngày</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bệnh nguy hiểm: <strong>Care, Parvo</strong> (chó), <strong>Giảm bạch cầu, FIV</strong> (mèo). Hỗ trợ <strong>50% viện phí</strong> hoặc đổi bé mới.
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-slate-100 flex items-center text-[11px] font-bold text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
              <span>Bảo vệ tối đa sức khỏe bé</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/60 border border-slate-200/80 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div className="inline-block px-2.5 py-0.5 bg-amber-50 text-amber-700 font-extrabold text-[11px] rounded-full border border-amber-200">
                Trọn Đời
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Cam kết thuần chủng trọn đời</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>100% thuần chủng</strong>. Phát hiện không thuần chủng hoặc lai tạp – <strong>hoàn tiền 100%</strong> hoặc đổi trả bất kỳ lúc nào.
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-slate-100 flex items-center text-[11px] font-bold text-amber-600">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
              <span>Đầy đủ phả hệ VKA / WCF</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/60 border border-slate-200/80 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <Syringe className="w-6 h-6" />
              </div>
              <div className="inline-block px-2.5 py-0.5 bg-blue-50 text-blue-700 font-extrabold text-[11px] rounded-full border border-blue-200">
                100% Chi Phí
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Đồng hành 100% 2 mũi tiêm đầu</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pet Paw chi trả <strong>toàn bộ chi phí 2 mũi vaccine đầu tiên</strong>. Khách chỉ cần cung cấp hóa đơn phòng khám thú y.
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-slate-100 flex items-center text-[11px] font-bold text-blue-600">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
              <span>Chi trả nhanh qua STK</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/60 border border-slate-200/80 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <Gift className="w-6 h-6" />
              </div>
              <div className="inline-block px-2.5 py-0.5 bg-purple-50 text-purple-700 font-extrabold text-[11px] rounded-full border border-purple-200">
                Đặc Quyền
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Hậu mãi trọn đời VIP</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Giảm 15%</strong> spa/hotel, <strong>15%</strong> phụ kiện gói ≥ 3tr, <strong>giảm ngay 1.000.000đ</strong> khi đón pet mới tiếp theo.
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-slate-100 flex items-center text-[11px] font-bold text-purple-600">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
              <span>Áp dụng toàn quốc</span>
            </div>
          </div>

        </div>
      </section>

      {/* 4. CHI TIẾT BẢO HÀNH STANDARD (Mặc định Miễn phí) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          
          {/* Header */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Gói Mặc Định Khi Đón Bé</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                Chi tiết Bảo hành Standard
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Miễn phí cho mọi khách hàng mua pet tại Pet Paw
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-right">
              <span className="text-[11px] text-slate-300 uppercase font-semibold block">Mức phí bảo hành</span>
              <span className="text-xl font-extrabold text-amber-400">0 VNĐ (MIỄN PHÍ)</span>
            </div>
          </div>

          {/* Nội dung chi tiết 2 khối A & B */}
          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Khối A: Bệnh nguy hiểm – 30 ngày */}
            <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-sm">
                    A
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">Bệnh nguy hiểm – 30 ngày</h3>
                    <p className="text-[11px] text-slate-500">Phạm vi Care, Parvo / Giảm bạch cầu, FIV</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-rose-50 text-rose-600 font-extrabold text-xs rounded-full border border-rose-200">
                  30 Ngày
                </span>
              </div>

              <div className="space-y-3 text-xs leading-relaxed text-slate-700">
                <div className="p-3 bg-white rounded-xl border border-slate-200/60 space-y-1">
                  <span className="font-bold text-slate-900 block">📌 Phạm vi áp dụng:</span>
                  <p>Care, Parvo (đối với chó) / Giảm bạch cầu, FIV (đối với mèo).</p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200/60 space-y-1">
                  <span className="font-bold text-slate-900 block">⏱️ Thời gian bảo hành:</span>
                  <p><strong>30 ngày</strong> kể từ ngày quý khách nhận bé từ Pet Paw.</p>
                </div>

                <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200/80 space-y-1.5">
                  <span className="font-extrabold text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Trường hợp 1 – Bé khỏi bệnh:
                  </span>
                  <p className="text-slate-700">
                    Pet Paw thanh toán <strong>50% viện phí</strong> (tối đa <strong>5 triệu đồng</strong>, không bao gồm phí xét nghiệm chẩn đoán).
                  </p>
                </div>

                <div className="p-3.5 bg-rose-50/60 rounded-xl border border-rose-200/80 space-y-1.5">
                  <span className="font-extrabold text-rose-800 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    Trường hợp 2 – Tử vong do bệnh nguy hiểm:
                  </span>
                  <p className="text-slate-700">
                    Tử vong do Care, Parvo (chó) / Giảm bạch cầu, FIV (mèo): <strong>Đổi bé mới giá trị tương đương</strong> + <strong>miễn phí ship 63 tỉnh</strong>. Nếu khách chọn bé giá cao hơn, chỉ cần thanh toán chênh lệch.
                  </p>
                </div>
              </div>
            </div>

            {/* Khối B: Bệnh thông thường – 5 ngày */}
            <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-sm">
                    B
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">Bệnh thông thường – 5 ngày</h3>
                    <p className="text-[11px] text-slate-500">Đau mắt, nấm, da liễu, viêm phổi, dị tật</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-amber-50 text-amber-700 font-extrabold text-xs rounded-full border border-amber-200">
                  5 Ngày
                </span>
              </div>

              <div className="space-y-3 text-xs leading-relaxed text-slate-700">
                <div className="p-3 bg-white rounded-xl border border-slate-200/60 space-y-1">
                  <span className="font-bold text-slate-900 block">📌 Phạm vi áp dụng:</span>
                  <p>Đau mắt, nấm, viêm da, viêm phổi, các dị tật có thể nhìn thấy bằng mắt thường.</p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200/60 space-y-1">
                  <span className="font-bold text-slate-900 block">⏱️ Thời gian bảo hành:</span>
                  <p><strong>5 ngày</strong> kể từ thời điểm nhận bé.</p>
                </div>

                <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200/80 space-y-1.5">
                  <span className="font-extrabold text-blue-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    Trường hợp 1 – Đổi bé mới:
                  </span>
                  <p className="text-slate-700">
                    <strong>Đổi bé mới</strong> giá trị tương đương + <strong>miễn phí ship toàn quốc</strong> nếu phát hiện dị tật hoặc bệnh bẩm sinh không thể chữa khỏi.
                  </p>
                </div>

                <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200/80 space-y-1.5">
                  <span className="font-extrabold text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Trường hợp 2 – Hỗ trợ viện phí:
                  </span>
                  <p className="text-slate-700">
                    Pet Paw <strong>đồng hành 50% viện phí</strong> (tối đa <strong>5 triệu đồng</strong>, không bao gồm phí xét nghiệm chẩn đoán).
                  </p>
                </div>

                <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-amber-900 text-[11px] flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Lưu ý:</strong> Quá 5 ngày không phản hồi hoặc thông báo, Pet Paw có quyền từ chối giải quyết các triệu chứng bệnh thông thường.
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. NÂNG CẤP BẢO VỆ VỚI BẢO HÀNH CAO CẤP (3 Gói So Sánh) */}
      <section id="upgrade-packages" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 scroll-mt-20">
        
        {/* Tiêu đề mục */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-800 text-xs font-bold uppercase tracking-wider">
            <Crown className="w-3.5 h-3.5 text-amber-600" />
            <span>ĐẶC QUYỀN DUY NHẤT TẠI PET PAW</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Nâng cấp bảo vệ với Bảo hành Cao cấp
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Duy nhất tại Pet Paw – Bảo hành <strong className="text-slate-900">MỌI BỆNH LÝ</strong> lên đến 1 năm. Bảo bọc bé cưng trọn vẹn từng giai đoạn phát triển.
          </p>
        </div>

        {/* 3 Cột Gói Bảo Hành */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          
          {/* Gói 1: Standard */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
                  Tiêu chuẩn
                </span>
                <span className="text-xs font-semibold text-slate-400">Mặc định</span>
              </div>

              <h3 className="text-2xl font-black text-slate-900">Standard</h3>
              <p className="text-xs text-slate-500 mt-1">Gói cơ bản an tâm đón bé</p>

              <div className="my-6 pb-6 border-b border-slate-100">
                <div className="text-3xl font-black text-slate-900">Miễn phí</div>
                <div className="text-xs font-semibold text-emerald-600 mt-1">30 ngày bảo vệ</div>
              </div>

              {/* Danh sách quyền lợi */}
              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Phạm vi: <strong className="text-slate-900">Bệnh nguy hiểm</strong> (Care, Parvo, Giảm bạch cầu, FIV)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Phí bệnh viện: <strong className="text-slate-900">50%</strong> (tối đa 5 triệu đồng - KHÔNG bao gồm xét nghiệm)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Đồng hành 2 mũi tiêm đầu: <strong className="text-slate-900">100%</strong></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Giảm spa/hotel: <strong className="text-slate-900">15%</strong></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Giảm phụ kiện ≥ 3tr: <strong className="text-slate-900">15%</strong></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Mua pet mới: <strong className="text-slate-900">Giảm 1,000,000 VND</strong></span>
                </li>
              </ul>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100">
              <Link
                to="/buy-pets"
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Xem thú cưng áp dụng</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Gói 2: Gold ⭐ (Nổi bật nhất) */}
          <div className="bg-gradient-to-b from-amber-500/10 via-white to-amber-500/5 rounded-3xl p-6 sm:p-7 border-2 border-amber-400 shadow-xl shadow-amber-500/10 flex flex-col justify-between relative transform lg:-translate-y-2">
            
            {/* Badge Highlight */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[11px] font-black rounded-full shadow-md uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
              <span>Được chọn nhiều nhất</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
                  Bảo vệ 6 tháng
                </span>
                <span className="text-xs font-bold text-amber-600">⭐ Phổ biến</span>
              </div>

              <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>Gold</span>
                <span className="text-amber-500">⭐</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">Bảo hành mọi bệnh lý trong nửa năm</p>

              <div className="my-6 pb-6 border-b border-amber-200/80">
                <div className="text-3xl font-black text-amber-600">+25% giá bé</div>
                <div className="text-xs font-semibold text-slate-700 mt-1">6 tháng (182 ngày) an tâm tuyệt đối</div>
              </div>

              {/* Danh sách quyền lợi */}
              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-start gap-2.5 font-bold text-slate-900">
                  <Check className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>Phạm vi: <span className="text-amber-700 font-extrabold uppercase">MỌI BỆNH LÝ</span> (Không giới hạn)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>Trợ cấp khám chữa: <strong className="text-slate-900">2 lần × 500k</strong></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>Đồng hành 2 mũi tiêm đầu: <strong className="text-slate-900">100%</strong></span>
                </li>
                <li className="flex items-start gap-2.5 font-semibold text-slate-900">
                  <Check className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>Giảm spa/hotel: <strong className="text-amber-700 font-extrabold">20%</strong> (Nâng cấp)</span>
                </li>
                <li className="flex items-start gap-2.5 font-semibold text-slate-900">
                  <Check className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>Giảm phụ kiện ≥ 3tr: <strong className="text-amber-700 font-extrabold">20%</strong> (Nâng cấp)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>Mua pet mới: <strong className="text-slate-900">Giảm 1,000,000 VND</strong></span>
                </li>
                <li className="flex items-start gap-2.5 text-amber-800 font-medium">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>Ưu tiên hỗ trợ riêng từ Bác sĩ thú y trực ban</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 mt-6 border-t border-amber-200/80">
              <button
                onClick={() => {
                  setClaimForm(prev => ({ ...prev, warrantyPackage: 'gold' }));
                  setClaimModalOpen(true);
                }}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <span>Đăng ký tư vấn gói Gold</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Gói 3: Premium 🏆 */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                  VIP 1 Năm
                </span>
                <span className="text-xs font-bold text-purple-600">🏆 Tối đa</span>
              </div>

              <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>Premium</span>
                <span className="text-amber-500">🏆</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">Đồng hành trọn vẹn suốt năm đầu đời</p>

              <div className="my-6 pb-6 border-b border-slate-100">
                <div className="text-3xl font-black text-purple-600">+35% giá bé</div>
                <div className="text-xs font-semibold text-slate-700 mt-1">1 năm (365 ngày) bảo hộ toàn diện</div>
              </div>

              {/* Danh sách quyền lợi */}
              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-start gap-2.5 font-bold text-slate-900">
                  <Check className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>Phạm vi: <span className="text-purple-700 font-extrabold uppercase">MỌI BỆNH LÝ</span> (365 ngày)</span>
                </li>
                <li className="flex items-start gap-2.5 font-bold text-slate-900">
                  <Check className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>Trợ cấp khám chữa: <strong className="text-purple-700">4 lần × 500k</strong> (2.000.000đ)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>Đồng hành 2 mũi tiêm đầu: <strong className="text-slate-900">100%</strong></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>Giảm spa/hotel: <strong className="text-slate-900">20%</strong></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>Giảm phụ kiện ≥ 3tr: <strong className="text-slate-900">20%</strong></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>Mua pet mới: <strong className="text-slate-900">Giảm 1,000,000 VND</strong></span>
                </li>
                <li className="flex items-start gap-2.5 text-purple-800 font-medium">
                  <Crown className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>Bác sĩ thú y riêng tư vấn khẩu phần dinh dưỡng định kỳ</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100">
              <button
                onClick={() => {
                  setClaimForm(prev => ({ ...prev, warrantyPackage: 'premium' }));
                  setClaimModalOpen(true);
                }}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Đăng ký tư vấn gói Premium</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 6. CÁCH YÊU CẦU BẢO HÀNH (4 Hồ sơ bắt buộc + Phương thức gửi) */}
      <section id="claim-guide" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 scroll-mt-20">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 space-y-10">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Cách yêu cầu bảo hành nhanh chóng
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Để thủ tục xử lý và bồi hoàn diễn ra minh bạch, quý khách vui lòng chuẩn bị 4 chứng từ dưới đây:
            </p>
          </div>

          {/* 4 Chứng từ BẮT BUỘC (Grid 4 thẻ) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Camera className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-500 text-white shadow-xs">
                  Bắt buộc
                </span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                1. Chụp ảnh bé & chi tiết bệnh
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Chụp rõ toàn thân bé cưng và cận cảnh các dấu hiệu lâm sàng (mắt, mũi, phân, vùng da tổn thương...).
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Video className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-500 text-white shadow-xs">
                  Bắt buộc
                </span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                2. Quay video bé & chi tiết bệnh
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Quay video tối thiểu 15 - 30 giây thể hiện trạng thái vận động, tiếng thở hoặc hành vi bất thường của bé.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-500 text-white shadow-xs">
                  Bắt buộc
                </span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                3. Báo cáo xét nghiệm từ thú y
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Phiếu kết quả xét nghiệm / que test (Care, Parvo, FPV...) có đóng dấu hoặc chữ ký của bác sĩ thú y.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Receipt className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-500 text-white shadow-xs">
                  Bắt buộc
                </span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                4. Hóa đơn thanh toán thú y
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hóa đơn viện phí hoặc phiếu thu hợp lệ từ phòng khám thú y để Pet Paw thực hiện chi trả 50% hoặc bồi hoàn.
              </p>
            </div>

          </div>

          {/* Kênh Gửi Thông Tin */}
          <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
                  Kênh tiếp nhận 24/7
                </span>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                  Gửi thông tin bảo hành qua đâu?
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Đội ngũ Bác sĩ thú y của Pet Paw trực tiếp hỗ trợ giải quyết hồ sơ trong 15 - 30 phút.
                </p>
              </div>

              <button
                onClick={() => setClaimModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer whitespace-nowrap"
              >
                <Send className="w-4 h-4" />
                <span>Mở Form Gửi Hồ Sơ Ngay</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-700">
              
              {/* Hotline */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Hotline Khẩn Cấp</span>
                    <a href="tel:0939863696" className="font-black text-base text-amber-400 hover:underline">
                      0939 863 696
                    </a>
                  </div>
                </div>
                <button
                  onClick={handleCopyPhone}
                  title="Sao chép số"
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              {/* Website */}
              <div className="flex items-center p-4 rounded-xl bg-slate-800/80 border border-slate-700 gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Website Chính Thức</span>
                  <span className="font-black text-base text-white">petpaw.vn</span>
                </div>
              </div>

              {/* Zalo */}
              <div className="flex items-center p-4 rounded-xl bg-slate-800/80 border border-slate-700 gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Zalo Thú Y Hỗ Trợ</span>
                  <a
                    href="https://zalo.me"
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-xs text-emerald-400 hover:underline inline-flex items-center gap-1"
                  >
                    <span>Nhắn Zalo Ngay</span>
                    <ChevronRight className="w-3 h-3" />
                  </a>
                </div>
              </div>

            </div>

            {copiedPhone && (
              <div className="text-center text-xs text-amber-400 font-semibold animate-pulse">
                ✓ Đã sao chép số Hotline: 0939 863 696
              </div>
            )}
          </div>

        </div>
      </section>

      {/* 7. FAQ CÁC CÂU HỎI THƯỜNG GẶP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 space-y-6">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-6 h-6 text-amber-600" />
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Giải đáp thắc mắc về Bảo hành thú cưng
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="text-amber-600">Q:</span>
                Bé cưng trước khi về nhà mới đã được tiêm chủng như thế nào?
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Tất cả các bé trước khi giao đến tay khách hàng đều được tiêm tối thiểu 2 mũi vaccine phòng bệnh (Care, Parvo đối với cún; Giảm bạch cầu đối với mèo) kèm tẩy giun định kỳ và có sổ theo dõi sức khỏe đóng dấu thú y.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="text-amber-600">Q:</span>
                Nếu tôi ở tỉnh xa thì quy trình hỗ trợ viện phí hoặc đổi bé thế nào?
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Pet Paw hỗ trợ trên toàn bộ 63 tỉnh thành. Quý khách chỉ cần đưa bé đến phòng khám thú y gần nhất, chụp kết quả test và hóa đơn gửi qua Zalo/Hotline, chúng tôi sẽ chuyển khoản 50% viện phí hoặc sắp xếp gửi bé mới miễn phí ship.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="text-amber-600">Q:</span>
                Gói bảo hành Gold và Premium bảo vệ "MỌI bệnh lý" bao gồm những gì?
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Bao gồm toàn bộ bệnh truyền nhiễm nguy hiểm, bệnh đường hô hấp, tiêu hóa, cảm sốt, da liễu, viêm tai... cùng các đợt trợ cấp khám chữa bệnh trực tiếp (2 lần × 500k cho gói Gold, 4 lần × 500k cho gói Premium).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="text-amber-600">Q:</span>
                Chính sách chi trả 100% 2 mũi tiêm đầu tiên được nhận như thế nào?
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Sau khi đón bé và đưa bé đi tiêm 2 mũi vaccine theo đúng lịch hẹn trong sổ tiêm, quý khách chỉ cần chụp ảnh sổ tiêm kèm hóa đơn phòng khám gửi về Zalo Hotline, Pet Paw sẽ hoàn trả 100% chi phí tiêm chủng vào STK của quý khách.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. MODAL NỘP YÊU CẦU BẢO HÀNH ONLINE */}
      <Modal
        isOpen={claimModalOpen}
        onClose={() => setClaimModalOpen(false)}
        title="Nộp Hồ Sơ Yêu Cầu Bảo Hành Trực Tuyến"
        size="md"
      >
        {claimSubmitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-black text-slate-900">
              Đã tiếp nhận yêu cầu bảo hành thành công!
            </h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              Chuyên viên thú y Pet Paw sẽ liên hệ với bạn qua SĐT <strong>{claimForm.phone}</strong> trong vòng 15 phút để hướng dẫn xử lý và chuyển viện phí.
            </p>
          </div>
        ) : (
          <form onSubmit={handleClaimSubmit} className="space-y-4 text-xs">
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-amber-900 leading-relaxed">
              💡 Vui lòng chuẩn bị sẵn: Ảnh chụp, video triệu chứng bệnh và hóa đơn phòng khám thú y.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Họ và tên của bạn *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={claimForm.customerName}
                  onChange={(e) => setClaimForm({ ...claimForm, customerName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Số điện thoại liên hệ *</label>
                <input
                  type="tel"
                  required
                  placeholder="09xx xxx xxx"
                  value={claimForm.phone}
                  onChange={(e) => setClaimForm({ ...claimForm, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên bé cún / bé mèo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Bé Corgi Mochi"
                  value={claimForm.petName}
                  onChange={(e) => setClaimForm({ ...claimForm, petName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ngày nhận bé *</label>
                <input
                  type="date"
                  required
                  value={claimForm.receiveDate}
                  onChange={(e) => setClaimForm({ ...claimForm, receiveDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Gói bảo hành đã đăng ký *</label>
              <select
                value={claimForm.warrantyPackage}
                onChange={(e) => setClaimForm({ ...claimForm, warrantyPackage: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
              >
                <option value="standard">Gói Standard (Miễn phí 30 ngày)</option>
                <option value="gold">Gói Gold ⭐ (Bảo hành 6 tháng mọi bệnh)</option>
                <option value="premium">Gói Premium 🏆 (Bảo hành 1 năm mọi bệnh)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Phòng khám thú y đang điều trị (nếu có)</label>
              <input
                type="text"
                placeholder="Ví dụ: Bệnh viện thú y PetCare, 124 Nguyễn Thị Minh Khai..."
                value={claimForm.clinicName}
                onChange={(e) => setClaimForm({ ...claimForm, clinicName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Mô tả triệu chứng bệnh của bé *</label>
              <textarea
                required
                rows={3}
                placeholder="Mô tả các biểu hiện: bỏ ăn, nôn, sốt, ho, tiêu chảy hoặc kết quả xét nghiệm test kit..."
                value={claimForm.symptoms}
                onChange={(e) => setClaimForm({ ...claimForm, symptoms: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setClaimModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black shadow-md transition-colors"
              >
                Gửi Hồ Sơ Ngay
              </button>
            </div>
          </form>
        )}
      </Modal>

    </div>
  );
}
