import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Heart, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Cột 1: Thông tin thương hiệu */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <img
                src="/Logo_Pet_Paw.jpg"
                alt="Logo Pet Paw"
                className="w-10 h-10 rounded-xl object-cover"
              />
              <span className="font-extrabold text-xl text-white tracking-tight">
                PET<span className="text-amber-400">PAW</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Nền tảng hỗ trợ chủ nuôi chó mèo toàn diện: tư vấn dinh dưỡng AI thông minh, theo dõi thể trạng sức khỏe khoa học và kết nối sản phẩm chính hãng qua Shopee & TikTok Shop.
            </p>
          </div>

          {/* Cột 2: Tính năng nổi bật */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Tính năng</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/health" className="hover:text-amber-400 transition-colors">Theo dõi sức khỏe & BCS</Link></li>
              <li><Link to="/ai-assistant" className="hover:text-amber-400 transition-colors">Trợ lý AI tư vấn dinh dưỡng</Link></li>
              <li><Link to="/matchmaker" className="hover:text-amber-400 transition-colors">Gợi ý giống thú cưng phù hợp</Link></li>
              <li><Link to="/products" className="hover:text-amber-400 transition-colors">Kho sản phẩm Shopee & TikTok Shop</Link></li>
              <li><Link to="/nearby" className="hover:text-amber-400 transition-colors">Phòng khám thú y & Spa gần bạn</Link></li>
            </ul>
          </div>

          {/* Cột 3: Cẩm nang & Kiến thức */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Cẩm nang & Bệnh lý</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/blogs" className="hover:text-amber-400 transition-colors">Top giống chó thông minh</Link></li>
              <li><Link to="/blogs" className="hover:text-amber-400 transition-colors">Phòng ngừa nấm da mùa mưa</Link></li>
              <li><Link to="/blogs" className="hover:text-amber-400 transition-colors">Dấu hiệu nhận biết béo phì</Link></li>
              <li><Link to="/blogs" className="hover:text-amber-400 transition-colors">Video hướng dẫn chăm sóc thú cưng</Link></li>
            </ul>
          </div>

          {/* Cột 4: Miễn trừ trách nhiệm y tế */}
          <div className="space-y-3 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
            <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wide">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Lưu ý Y Tế Quan Trọng</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-300">
              Các thông tin, kết quả đánh giá thể trạng và lời khuyên từ AI chỉ mang tính chất định hướng tham khảo. Trong các tình huống cấp bách hoặc triệu chứng bất thường, bạn cần đưa thú cưng tới các bác sĩ thú y chuyên khoa để được chẩn đoán trực tiếp.
            </p>
          </div>
        </div>

        {/* Bản quyền */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Pet Paw Project. Phát triển với tình yêu thương dành cho thú cưng <Heart className="w-3.5 h-3.5 inline text-rose-500 fill-rose-500" /></p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Affiliate Partner Shopee & TikTok <ExternalLink className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
