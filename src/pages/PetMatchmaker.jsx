import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RadioGroup from '../components/common/RadioGroup';
import DriveImage from '../components/common/DriveImage';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  PawPrint,
  Tag
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function PetMatchmaker() {
  const [criteria, setCriteria] = useState({
    species: 'both',
    budgetTier: '8m_to_15m',
    livingSpace: 'apartment_medium',
    personality: 'cuddly_gentle'
  });

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/pets/matchmaker`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(criteria)
      });
      const data = await res.json();
      if (data.success) {
        setResults(data.data);
      }
    } catch {
      // Fallback local calculation
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Trắc Nghiệm Thông Minh</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">
          Gợi Ý Giống Thú Cưng Phù Hợp Nhất Với Bạn
        </h1>
        <p className="text-sm text-slate-500">
          Dựa trên ngân sách dự kiến, loài yêu thích, diện tích không gian sống và tính cách mong muốn để tìm ra người bạn bốn chân hoàn hảo nhất.
        </p>
      </div>

      {/* Form khảo sát 4 câu hỏi thiết thực */}
      <form onSubmit={handleQuizSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-8">
        
        {/* Câu 1: Giống loài */}
        <RadioGroup
          label="1. Bạn dự định đón người bạn thuộc giống loài nào?"
          value={criteria.species}
          onChange={(val) => setCriteria({ ...criteria, species: val })}
          options={[
            { value: 'dog', label: 'Chó cảnh (Trung thành & Năng động)', description: 'Thích quấn quýt, vui tươi, thích cùng bạn đi dạo và tham gia các hoạt động ngoài trời' },
            { value: 'cat', label: 'Mèo cảnh (Độc lập & Êm dịu)', description: 'Êm ái, thích sạch sẽ, ít gây tiếng ồn và không cần dắt đi dạo hàng ngày' },
            { value: 'both', label: 'Cả hai / Linh hoạt', description: 'Sẵn sàng đón cả chó hoặc mèo tùy vào mức độ hòa hợp với không gian và lối sống của bạn' }
          ]}
        />

        {/* Câu 2: Mệnh giá */}
        <RadioGroup
          label="2. Mức ngân sách (mệnh giá) bạn dự kiến chi trả để đón bé?"
          value={criteria.budgetTier}
          onChange={(val) => setCriteria({ ...criteria, budgetTier: val })}
          options={[
            { value: 'under_8m', label: 'Dưới 8.000.000 đ (Tiết kiệm)', description: 'Các bé Poodle Tiny, Mèo Ba Tư, cún mèo lai hoặc dòng thú cưng phổ thông khỏe mạnh' },
            { value: '8m_to_15m', label: '8.000.000 đ - 15.000.000 đ (Phổ biến)', description: 'Mèo Anh lông ngắn, Corgi, Golden Retriever, Munchkin, Phốc Sóc thuần chủng' },
            { value: 'above_15m', label: 'Trên 15.000.000 đ (Cao cấp)', description: 'Mèo Ragdoll Bicolor, thú cưng thuần chủng có phả hệ VKA / WCF / TICA hoặc nhập ngoại' }
          ]}
        />

        {/* Câu 3: Không gian sống */}
        <RadioGroup
          label="3. Không gian sống hiện tại của bạn như thế nào?"
          value={criteria.livingSpace}
          onChange={(val) => setCriteria({ ...criteria, livingSpace: val })}
          options={[
            { value: 'apartment_small', label: 'Căn hộ / Chung cư nhỏ (< 45m²)', description: 'Cần giống thú cưng nhỏ gọn, điềm tĩnh, ít gây tiếng ồn ảnh hưởng hàng xóm' },
            { value: 'apartment_medium', label: 'Chung cư vừa / Nhà phố (45 - 80m²)', description: 'Không gian tiêu chuẩn, thoáng mát, phù hợp với đa số các giống chó mèo tầm trung' },
            { value: 'house_garden', label: 'Nhà riêng có sân vườn (> 80m²)', description: 'Rộng rãi, lý tưởng cho các bé năng động, thích chạy nhảy và vận động tự do' }
          ]}
        />

        {/* Câu 4: Tính cách */}
        <RadioGroup
          label="4. Bạn mong muốn một người bạn bốn chân có tính cách như thế nào?"
          value={criteria.personality}
          onChange={(val) => setCriteria({ ...criteria, personality: val })}
          options={[
            { value: 'calm_independent', label: 'Điềm tĩnh & Tự lập', description: 'Ngoan ngoãn khi ở nhà một mình lúc bạn đi làm, không quậy phá đồ đạc, ít sủa kêu' },
            { value: 'cuddly_gentle', label: 'Quấn quýt & Hiền lành', description: 'Rất tình cảm, thích được ôm ấp vuốt ve, ngủ cạnh chủ, thân thiện tuyệt đối với trẻ em' },
            { value: 'active_playful', label: 'Năng động & Thông minh', description: 'Tràn đầy năng lượng, thích học trò chơi, phản xạ nhạy bén, sẵn sàng đồng hành chạy bộ' }
          ]}
        />

        <div className="pt-4 text-center">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-2xl shadow-lg shadow-amber-500/25 transition-all text-sm cursor-pointer transform hover:-translate-y-0.5"
          >
            {loading ? 'Hệ thống đang phân tích...' : 'Xem kết quả gợi ý giống thú cưng →'}
          </button>
        </div>
      </form>

      {/* Kết quả phân tích gợi ý */}
      {results && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center gap-2">
            <PawPrint className="w-6 h-6 text-amber-500" />
            <h2 className="text-2xl font-extrabold text-slate-900">
              Top các giống thú cưng lý tưởng dành riêng cho bạn:
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-card transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="relative h-48 rounded-2xl overflow-hidden mb-4 bg-slate-100">
                    <DriveImage src={item.image} alt={item.breed} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 px-3 py-1 bg-amber-500 text-white text-xs font-black rounded-full shadow-md">
                      {item.matchScore}% Phù hợp
                    </div>
                  </div>

                  <h3 className="font-extrabold text-xl text-slate-900 mb-1">{item.breed}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{item.reason}</p>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-900 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Điểm cộng: </strong>
                        <span>{item.pros.join(' • ')}</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-amber-50 text-amber-900 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Lưu ý: </strong>
                        <span>{item.cons.join(' • ')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-slate-400" />
                      Mệnh giá tham khảo:
                    </span>
                    <span className="font-bold text-amber-700">{item.priceRange}</span>
                  </div>

                  <Link
                    to={item.marketLink || '/buy-pets'}
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-sm shadow-amber-500/20 transition-all cursor-pointer"
                  >
                    <span>Xem các bé đang mở bán tại Pet Paw</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
