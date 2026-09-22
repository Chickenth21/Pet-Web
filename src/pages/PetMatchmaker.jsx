import React, { useState } from 'react';
import RadioGroup from '../components/common/RadioGroup';
import DriveImage from '../components/common/DriveImage';
import { 
  Sparkles, 
  Home, 
  Clock, 
  DollarSign, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  PawPrint
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function PetMatchmaker() {
  const [criteria, setCriteria] = useState({
    livingSpace: 'apartment_medium',
    roomArea: '30_to_60',
    freeTimeHours: '1_to_2h',
    hasChildren: 'yes',
    monthlyBudget: '1m_to_2m',
    sheddingTolerance: 'medium'
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
          Dựa trên diện tích phòng, thời gian biểu hàng ngày và ngân sách để tìm ra người bạn bốn chân hoàn hảo nhất.
        </p>
      </div>

      {/* Form khảo sát */}
      <form onSubmit={handleQuizSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-8">
        
        {/* Câu 1: Không gian sống */}
        <RadioGroup
          label="1. Không gian sống hiện tại của bạn là gì?"
          value={criteria.livingSpace}
          onChange={(val) => setCriteria({ ...criteria, livingSpace: val })}
          options={[
            { value: 'apartment_small', label: 'Căn hộ / Chung cư nhỏ', description: 'Không gian ấm cúng, hạn chế tiếng ồn' },
            { value: 'apartment_medium', label: 'Chung cư vừa (có ban công)', description: 'Thoáng mát, có khu vực phơi nắng' },
            { value: 'house_garden', label: 'Nhà phố / Nhà có sân vườn', description: 'Không gian rộng rãi, thoải mái chạy nhảy' }
          ]}
        />

        {/* Câu 2: Diện tích phòng */}
        <RadioGroup
          label="2. Diện tích khu vực dành cho thú cưng sinh hoạt?"
          value={criteria.roomArea}
          onChange={(val) => setCriteria({ ...criteria, roomArea: val })}
          options={[
            { value: 'under_30', label: 'Dưới 30m²', description: 'Phù hợp thú cưng nhỏ, ít chạy nhảy' },
            { value: '30_to_60', label: 'Từ 30m² - 60m²', description: 'Phù hợp đa số giống chó mèo vừa' },
            { value: 'above_60', label: 'Trên 60m²', description: 'Rộng rãi cho mọi giống thú cưng' }
          ]}
        />

        {/* Câu 3: Thời gian rảnh rỗi mỗi ngày */}
        <RadioGroup
          label="3. Thời gian bạn có thể dành để chơi đùa và chăm sóc mỗi ngày?"
          value={criteria.freeTimeHours}
          onChange={(val) => setCriteria({ ...criteria, freeTimeHours: val })}
          options={[
            { value: 'under_1h', label: 'Dưới 1 tiếng (Bận rộn)', description: 'Ưu tiên thú cưng độc lập, ít quấn chủ' },
            { value: '1_to_2h', label: '1 - 2 tiếng (Tiêu chuẩn)', description: 'Đủ thời gian vuốt ve và chải lông' },
            { value: 'above_2h', label: 'Trên 2 tiếng (Rất thoải mái)', description: 'Có thể dắt đi dạo hàng ngày và huấn luyện' }
          ]}
        />

        {/* Câu 4: Ngân sách chăm sóc hàng tháng */}
        <RadioGroup
          label="4. Ngân sách dự kiến cho hạt, pate, cát vệ sinh và tiêm phòng?"
          value={criteria.monthlyBudget}
          onChange={(val) => setCriteria({ ...criteria, monthlyBudget: val })}
          options={[
            { value: 'under_500k', label: 'Dưới 500.000 đ', description: 'Mức cơ bản, tiết kiệm' },
            { value: '1m_to_2m', label: '1.000.000 - 2.000.000 đ', description: 'Đầy đủ dinh dưỡng cao cấp và đồ chơi' },
            { value: 'above_2m', label: 'Trên 2.000.000 đ', description: 'Chăm sóc spa và thức ăn ngoại nhập tốt nhất' }
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

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Chi phí ước tính:</span>
                  <span className="font-bold text-amber-700">{item.monthlyCost}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
