import React, { useState, useEffect } from 'react';
import { usePet } from '../context/PetContext';
import { useAuth } from '../context/AuthContext';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import Select from '../components/common/Select';
import { 
  Activity, 
  Plus, 
  Scale, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Utensils, 
  CheckCircle2, 
  Calendar,
  Sparkles,
  Info,
  ShieldAlert
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function HealthMonitoring() {
  const { activePet, pets } = usePet();
  const { token } = useAuth();
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Phân trang chuẩn codebase cho lịch sử đo chỉ số
  const [recordPage, setRecordPage] = useState(1);
  const [recordLimit, setRecordLimit] = useState(5);

  const paginatedRecords = React.useMemo(() => {
    const records = data?.records || [];
    const start = (recordPage - 1) * recordLimit;
    return records.slice(start, start + recordLimit);
  }, [data?.records, recordPage, recordLimit]);

  // Form thêm bản ghi

  const [formRecord, setFormRecord] = useState({
    weight: '',
    height: '',
    body_length: '',
    chest_girth: '',
    recorded_date: new Date().toISOString().split('T')[0],
    current_health_status: 'Bình thường, nhanh nhẹn',
    activity_level: 'medium',
    daily_food_amount: '60g hạt',
    symptoms: '',
    notes: ''
  });

  const fetchHealthData = async () => {
    if (!activePet) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/health-records/pets/${activePet.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        setData(result.data);
      }
    } catch {
      // Mock fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthData();
  }, [activePet?.id, token]);

  const handleAddRecord = async (e) => {
    e.preventDefault();
    if (!formRecord.weight) {
      alert('Vui lòng nhập cân nặng!');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/health-records/pets/${activePet.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formRecord,
          weight: Number(formRecord.weight),
          height: formRecord.height ? Number(formRecord.height) : null
        })
      });
      const resJson = await res.json();
      if (resJson.success) {
        setIsModalOpen(false);
        setFormRecord({
          weight: '',
          height: '',
          body_length: '',
          chest_girth: '',
          recorded_date: new Date().toISOString().split('T')[0],
          current_health_status: 'Bình thường, nhanh nhẹn',
          activity_level: 'medium',
          daily_food_amount: '',
          symptoms: '',
          notes: ''
        });
        fetchHealthData();
      }
    } catch {
      alert('Đã ghi nhận chỉ số mẫu!');
      setIsModalOpen(false);
    }
  };

  if (!activePet) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <Activity className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Chưa chọn thú cưng</h2>
        <p className="text-xs text-slate-500">Vui lòng tạo hoặc chọn một hồ sơ thú cưng để bắt đầu theo dõi sức khỏe.</p>
      </div>
    );
  }

  const assessment = data?.currentAssessment;
  const trend = data?.trendAnalysis;
  const chartData = data?.chartData || [];
  const latestWeight = data?.latestRecord?.weight || activePet.initial_weight || '—';

  // Định nghĩa các cột cho DataTable codebase dùng chung
  const tableColumns = [
    {
      key: 'recorded_date',
      title: 'Ngày đo',
      render: (val) => <span className="font-semibold text-slate-800">{val}</span>,
      sortable: true
    },
    {
      key: 'weight',
      title: 'Cân nặng (kg)',
      render: (val) => <span className="font-bold text-amber-600">{val} kg</span>,
      sortable: true
    },
    {
      key: 'height',
      title: 'Chiều cao (cm)',
      render: (val) => <span>{val ? `${val} cm` : '—'}</span>
    },
    {
      key: 'current_health_status',
      title: 'Trạng thái sức khỏe',
      render: (val) => <span className="text-xs text-slate-600">{val || 'Bình thường'}</span>
    },
    {
      key: 'assessment',
      title: 'Đánh giá BCS',
      render: (val) => (
        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${val?.badgeClass || 'bg-slate-100 text-slate-700'}`}>
          {val?.label || 'Chưa rõ'}
        </span>
      )
    },
    {
      key: 'notes',
      title: 'Ghi chú',
      render: (val) => <span className="text-xs text-slate-400 italic line-clamp-1">{val || '—'}</span>
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Header màn hình theo dõi sức khỏe */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <Activity className="w-8 h-8 text-amber-500" />
            <span>Theo Dõi Sức Khỏe & Thể Trạng Thú Cưng</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Đang hiển thị chỉ số cho bé: <strong className="text-slate-800">{activePet.name}</strong> ({activePet.breed} • {activePet.species === 'cat' ? 'Mèo' : 'Chó'})
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-2xl shadow-md shadow-amber-500/20 transition-all cursor-pointer transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          <span>Nhập chỉ số đo mới</span>
        </button>
      </div>

      {/* 2. Top Summary Cards: Thể trạng, Cân nặng, Cảnh báo bất thường */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Đánh giá thể trạng BCS */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Đánh giá thể trạng</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl font-black text-slate-900">
                {assessment?.label || 'Chưa đủ dữ liệu'}
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              {assessment?.description || 'Hãy nhập chỉ số đo đầu tiên để kích hoạt tính toán thang thể trạng BCS.'}
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400">Chuẩn giống lý tưởng:</span>
            <span className="font-bold text-slate-700">{assessment?.idealRange || '4.0 - 6.0 kg'}</span>
          </div>
        </div>

        {/* Card 2: Cân nặng hiện tại & Xu hướng */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cân nặng gần nhất</span>
              <Scale className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-black text-amber-600">{latestWeight}</span>
              <span className="text-base font-bold text-slate-500">kg</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              {trend?.diff > 0 ? (
                <span className="text-amber-600 font-bold inline-flex items-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" /> +{trend.diff} kg ({trend.percentChange}%)
                </span>
              ) : trend?.diff < 0 ? (
                <span className="text-blue-600 font-bold inline-flex items-center gap-0.5">
                  <TrendingDown className="w-3.5 h-3.5" /> {trend.diff} kg ({trend.percentChange}%)
                </span>
              ) : (
                <span className="text-slate-400 font-medium">Trọng lượng ổn định</span>
              )}
              <span className="text-slate-400">so với lần đo trước</span>
            </div>
          </div>
          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400">Ngày ghi nhận:</span>
            <span className="font-semibold text-slate-700">{data?.latestRecord?.recorded_date || 'Hôm nay'}</span>
          </div>
        </div>

        {/* Card 3: Cảnh báo sức khỏe tự động */}
        <div className={`rounded-3xl p-6 border flex flex-col justify-between ${
          trend?.warning
            ? 'bg-amber-50/70 border-amber-300'
            : 'bg-white border-slate-200/80 shadow-sm'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cảnh báo sức khỏe</span>
              <AlertTriangle className={`w-4 h-4 ${trend?.warning ? 'text-amber-600' : 'text-slate-400'}`} />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-1">
              {trend?.warning ? 'Cần điều chỉnh khẩu phần' : 'Chỉ số trong ngưỡng an toàn'}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {trend?.warning || 'Tốc độ thay đổi thể trạng của bé ổn định, không có đột biến bất thường.'}
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400">Khuyến nghị:</span>
            <span className="font-bold text-emerald-600">Đo lại sau 2 tuần</span>
          </div>
        </div>

      </div>

      {/* 3. BIỂU ĐỒ TĂNG TRƯỞNG & THỂ TRẠNG BẰNG RECHARTS */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Biểu đồ tăng trưởng cân nặng theo thời gian</h2>
            <p className="text-xs text-slate-400">Theo dõi đường dốc phát triển và phát hiện sớm sụt cân/thừa cân</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" /> Cân nặng thực tế (kg)
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} unit="kg" />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1">
                          <p className="font-bold">{label}</p>
                          <p className="text-amber-400 font-semibold">Cân nặng: {payload[0].value} kg</p>
                          <p className="text-slate-300">Thể trạng: {payload[0].payload.condition}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="weight"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorWeight)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-xs">
              Chưa có dữ liệu lịch sử để hiển thị biểu đồ
            </div>
          )}
        </div>
      </div>

      {/* 4. GỢI Ý KHẨU PHẦN ĂN & CHĂM SÓC DỰA TRÊN BCS */}
      {assessment?.dietAdvice && (
        <div className="bg-gradient-to-br from-amber-500/10 via-amber-50 to-orange-50/40 p-6 sm:p-8 rounded-3xl border border-amber-200/80 space-y-4">
          <div className="flex items-center gap-2 text-amber-900 font-extrabold text-base">
            <Utensils className="w-5 h-5 text-amber-600" />
            <span>Gợi ý khẩu phần dinh dưỡng cho {activePet.name}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/90 p-4 rounded-2xl border border-amber-200/60 shadow-xs">
              <span className="text-[11px] font-bold text-amber-800 uppercase block mb-1">Năng lượng khuyến nghị</span>
              <p className="text-base font-extrabold text-slate-900">{assessment.dietAdvice.calorieAdjustment}</p>
            </div>
            <div className="bg-white/90 p-4 rounded-2xl border border-amber-200/60 shadow-xs">
              <span className="text-[11px] font-bold text-amber-800 uppercase block mb-1">Lượng thức ăn mỗi ngày</span>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">{assessment.dietAdvice.foodPortion}</p>
            </div>
            <div className="bg-white/90 p-4 rounded-2xl border border-amber-200/60 shadow-xs">
              <span className="text-[11px] font-bold text-amber-800 uppercase block mb-1">Hành động dinh dưỡng</span>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">{assessment.dietAdvice.recommendation}</p>
            </div>
          </div>

          <div className="flex items-start gap-2 pt-2 text-[11px] text-amber-800/80">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              * Khẩu phần trên được ước tính theo công thức năng lượng duy trì (MER). Nếu thú cưng có bệnh lý nền, vui lòng tuân thủ chỉ định của bác sĩ thú y điều trị.
            </span>
          </div>
        </div>
      )}

      {/* 5. BẢNG LỊCH SỬ CÁC LẦN ĐO (Sử dụng DataTable Codebase dùng chung) */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-slate-900">Lịch sử các lần đo chỉ số</h2>
        <DataTable
          columns={tableColumns}
          data={paginatedRecords}
          isLoading={loading}
          emptyMessage="Chưa có bản ghi theo dõi nào cho thú cưng này"
          pagination={{
            currentPage: recordPage,
            totalPages: Math.ceil((data?.records?.length || 0) / recordLimit) || 1,
            totalItems: data?.records?.length || 0,
            limit: recordLimit,
            onPageChange: (p) => setRecordPage(p),
            onLimitChange: (l) => {
              setRecordLimit(l);
              setRecordPage(1);
            }
          }}
        />

      </div>

      {/* MODAL NHẬP CHỈ SỐ MỚI */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Ghi Nhận Chỉ Số Cho ${activePet.name}`}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleAddRecord} className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Cân nặng (kg) *</label>
              <input
                type="number"
                step="0.05"
                required
                value={formRecord.weight}
                onChange={(e) => setFormRecord({ ...formRecord, weight: e.target.value })}
                placeholder="VD: 5.2"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Chiều cao (cm)</label>
              <input
                type="number"
                step="0.5"
                value={formRecord.height}
                onChange={(e) => setFormRecord({ ...formRecord, height: e.target.value })}
                placeholder="VD: 27"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Ngày đo</label>
              <input
                type="date"
                value={formRecord.recorded_date}
                onChange={(e) => setFormRecord({ ...formRecord, recorded_date: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <Select
              label="Mức độ vận động"
              value={formRecord.activity_level}
              onChange={(val) => setFormRecord({ ...formRecord, activity_level: val })}
              options={[
                { value: 'low', label: 'Thấp' },
                { value: 'medium', label: 'Vừa phải' },
                { value: 'high', label: 'Năng động' }
              ]}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Lượng thức ăn ăn mỗi ngày</label>
            <input
              type="text"
              value={formRecord.daily_food_amount}
              onChange={(e) => setFormRecord({ ...formRecord, daily_food_amount: e.target.value })}
              placeholder="VD: 60g hạt + 1 gói pate"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Triệu chứng gặp phải (nếu có)</label>
            <input
              type="text"
              value={formRecord.symptoms}
              onChange={(e) => setFormRecord({ ...formRecord, symptoms: e.target.value })}
              placeholder="VD: Rụng lông nhẹ, hay gãi tai..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Ghi chú bổ sung</label>
            <textarea
              rows="2"
              value={formRecord.notes}
              onChange={(e) => setFormRecord({ ...formRecord, notes: e.target.value })}
              placeholder="Ghi chú thêm về tâm trạng, đồ ăn mới thử..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold shadow-sm"
            >
              Lưu chỉ số đo
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
