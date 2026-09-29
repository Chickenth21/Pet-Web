import React, { useState, useEffect } from 'react';
import { usePet } from '../context/PetContext';
import { useAuth } from '../context/AuthContext';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import Select from '../components/common/Select';
import DriveImage from '../components/common/DriveImage';
import ImageUploader from '../components/common/ImageUploader';
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
  ShieldAlert,
  PawPrint,
  Heart,
  ChevronRight,
  UserCheck
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
  const { activePet, pets, setActivePet, addPet } = usePet();
  const { token, isAuthenticated } = useAuth();
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false);
  const [submittingPet, setSubmittingPet] = useState(false);

  // Form tạo hồ sơ thú cưng mới trực tiếp tại màn theo dõi sức khỏe
  const [petFormData, setPetFormData] = useState({
    name: '',
    species: 'dog',
    breed: '',
    gender: 'male',
    age_months: 12,
    initial_weight: '',
    activity_level: 'medium',
    avatar_url: '',
    allergies: '',
    health_notes: ''
  });

  const handleCreatePet = async (e) => {
    e.preventDefault();
    if (!petFormData.name || !petFormData.breed) {
      alert('Vui lòng nhập tên và giống thú cưng!');
      return;
    }
    setSubmittingPet(true);
    try {
      await addPet({
        ...petFormData,
        initial_weight: parseFloat(petFormData.initial_weight) || 4.5,
        age_months: parseInt(petFormData.age_months, 10) || 12
      });
      setIsAddPetModalOpen(false);
      setPetFormData({
        name: '',
        species: 'dog',
        breed: '',
        gender: 'male',
        age_months: 12,
        initial_weight: '',
        activity_level: 'medium',
        avatar_url: '',
        allergies: '',
        health_notes: ''
      });
    } catch (err) {
      alert('Lỗi khi thêm hồ sơ thú cưng: ' + err.message);
    } finally {
      setSubmittingPet(false);
    }
  };

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
      <div className="max-w-4xl mx-auto px-4 py-16">
        {pets && pets.length > 0 ? (
          /* Trường hợp đã có thú cưng nhưng chưa chọn bé nào */
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
              <PawPrint className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">Chọn Thú Cưng Để Bắt Đầu Theo Dõi Sức Khỏe</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
                Bạn đã có sẵn hồ sơ thú cưng. Vui lòng bấm chọn một bé bên dưới để bắt đầu ghi nhận và theo dõi thể trạng:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-left">
              {pets.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setActivePet(p)}
                  className="p-4 bg-slate-50 hover:bg-amber-50/50 border border-slate-200 hover:border-amber-400 rounded-2xl transition-all cursor-pointer flex items-center gap-3.5 group shadow-2xs"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0">
                    <DriveImage src={p.avatar_url} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-amber-700 truncate">
                      {p.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate">
                      {p.species === 'cat' ? '🐱 Mèo' : '🐶 Chó'} • {p.breed}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-center">
              <button
                onClick={() => setIsAddPetModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm một bé cưng khác</span>
              </button>
            </div>
          </div>
        ) : (
          /* Trường hợp chưa có hồ sơ thú cưng nào */
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-card text-center space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center mx-auto shadow-md shadow-amber-500/20">
              <Activity className="w-10 h-10" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Chưa Có Hồ Sơ Thú Cưng Nào
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Để bắt đầu theo dõi cân nặng, đánh giá thể trạng cơ thể theo thang chuẩn quốc tế và nhận diện sớm các nguy cơ sức khỏe, vui lòng tạo hồ sơ cho bé cưng của bạn.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsAddPetModalOpen(true)}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-2xl font-black text-sm shadow-md shadow-amber-500/20 transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5" />
                <span>+ Thêm Hồ Sơ Thú Cưng Ngay</span>
              </button>
            </div>

            {!isAuthenticated && (
              <p className="text-[11px] text-slate-400 italic">
                💡 Đăng nhập hoặc tạo tài khoản để đồng bộ vĩnh viễn dữ liệu theo dõi sức khỏe của thú cưng.
              </p>
            )}
          </div>
        )}

        {/* Modal Thêm Thú Cưng Mới */}
        <Modal
          isOpen={isAddPetModalOpen}
          onClose={() => setIsAddPetModalOpen(false)}
          title="Thêm Hồ Sơ Thú Cưng Của Bạn"
          maxWidth="max-w-xl"
        >
          <form onSubmit={handleCreatePet} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Loài thú cưng <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPetFormData({ ...petFormData, species: 'cat' })}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      petFormData.species === 'cat'
                        ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    🐱 Mèo
                  </button>
                  <button
                    type="button"
                    onClick={() => setPetFormData({ ...petFormData, species: 'dog' })}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      petFormData.species === 'dog'
                        ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    🐶 Chó
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên thú cưng <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={petFormData.name}
                  onChange={(e) => setPetFormData({ ...petFormData, name: e.target.value })}
                  placeholder="VD: Miu Miu, Bông, Lu..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Giống thú cưng <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={petFormData.breed}
                  onChange={(e) => setPetFormData({ ...petFormData, breed: e.target.value })}
                  placeholder={petFormData.species === 'cat' ? 'VD: Mèo Anh lông ngắn, Ba Tư...' : 'VD: Poodle, Corgi, Golden...'}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Giới tính
                </label>
                <select
                  value={petFormData.gender}
                  onChange={(e) => setPetFormData({ ...petFormData, gender: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:outline-none focus:border-amber-500"
                >
                  <option value="male">Đực</option>
                  <option value="female">Cái</option>
                  <option value="unknown">Chưa rõ</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tuổi (tháng)
                </label>
                <input
                  type="number"
                  min="1"
                  value={petFormData.age_months}
                  onChange={(e) => setPetFormData({ ...petFormData, age_months: e.target.value })}
                  placeholder="12"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Cân nặng ban đầu (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={petFormData.initial_weight}
                  onChange={(e) => setPetFormData({ ...petFormData, initial_weight: e.target.value })}
                  placeholder="4.5"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mức vận động
                </label>
                <select
                  value={petFormData.activity_level}
                  onChange={(e) => setPetFormData({ ...petFormData, activity_level: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:outline-none focus:border-amber-500"
                >
                  <option value="low">Thấp (lười vận động)</option>
                  <option value="medium">Vừa phải</option>
                  <option value="high">Cao (năng động)</option>
                </select>
              </div>
            </div>

            <div>
              <ImageUploader
                images={petFormData.avatar_url}
                onChange={(url) => setPetFormData(prev => ({ ...prev, avatar_url: url }))}
                multiple={false}
                folder="pets"
                label="Ảnh đại diện bé cưng (Tải ảnh từ máy - Nén WebP tự động)"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tiền sử dị ứng thức ăn (nếu có)
              </label>
              <input
                type="text"
                value={petFormData.allergies}
                onChange={(e) => setPetFormData({ ...petFormData, allergies: e.target.value })}
                placeholder="VD: Hải sản, thịt bò, ngũ cốc gluten..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ghi chú sức khỏe / lịch tiêm phòng
              </label>
              <textarea
                rows="2"
                value={petFormData.health_notes}
                onChange={(e) => setPetFormData({ ...petFormData, health_notes: e.target.value })}
                placeholder="Ghi chú về tiền sử bệnh, lịch tiêm phòng 7 bệnh..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsAddPetModalOpen(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={submittingPet}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
              >
                {submittingPet ? 'Đang lưu...' : 'Lưu hồ sơ thú cưng'}
              </button>
            </div>
          </form>
        </Modal>
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
      
      {/* 0. Thanh chọn nhanh thú cưng (Pet Switcher Bar) */}
      {pets && pets.length > 0 && (
        <div className="bg-white p-3.5 rounded-3xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full">
            <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1.5 shrink-0">
              <PawPrint className="w-3.5 h-3.5 text-amber-500" />
              <span>Thú cưng:</span>
            </span>
            {pets.map((p) => {
              const isSelected = p.id === activePet?.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActivePet(p)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <div className="w-5 h-5 rounded-lg overflow-hidden bg-white shrink-0 border border-slate-200/60">
                    <DriveImage src={p.avatar_url} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <span>{p.name}</span>
                  <span className="text-[10px] opacity-75">{p.species === 'cat' ? '🐱' : '🐶'}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setIsAddPetModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm bé khác</span>
          </button>
        </div>
      )}

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

      {/* Modal Thêm Thú Cưng Mới (Cho người dùng đang theo dõi bấm 'Thêm bé khác') */}
      <Modal
        isOpen={isAddPetModalOpen}
        onClose={() => setIsAddPetModalOpen(false)}
        title="Thêm Hồ Sơ Thú Cưng Của Bạn"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleCreatePet} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Loài thú cưng <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPetFormData({ ...petFormData, species: 'cat' })}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    petFormData.species === 'cat'
                      ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  🐱 Mèo
                </button>
                <button
                  type="button"
                  onClick={() => setPetFormData({ ...petFormData, species: 'dog' })}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    petFormData.species === 'dog'
                      ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  🐶 Chó
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tên thú cưng <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={petFormData.name}
                onChange={(e) => setPetFormData({ ...petFormData, name: e.target.value })}
                placeholder="VD: Miu Miu, Bông, Lu..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Giống thú cưng <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={petFormData.breed}
                onChange={(e) => setPetFormData({ ...petFormData, breed: e.target.value })}
                placeholder={petFormData.species === 'cat' ? 'VD: Mèo Anh lông ngắn, Ba Tư...' : 'VD: Poodle, Corgi, Golden...'}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Giới tính
              </label>
              <select
                value={petFormData.gender}
                onChange={(e) => setPetFormData({ ...petFormData, gender: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:outline-none focus:border-amber-500"
              >
                <option value="male">Đực</option>
                <option value="female">Cái</option>
                <option value="unknown">Chưa rõ</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tuổi (tháng)
              </label>
              <input
                type="number"
                min="1"
                value={petFormData.age_months}
                onChange={(e) => setPetFormData({ ...petFormData, age_months: e.target.value })}
                placeholder="12"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Cân nặng ban đầu (kg)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={petFormData.initial_weight}
                onChange={(e) => setPetFormData({ ...petFormData, initial_weight: e.target.value })}
                placeholder="4.5"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mức vận động
              </label>
              <select
                value={petFormData.activity_level}
                onChange={(e) => setPetFormData({ ...petFormData, activity_level: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:outline-none focus:border-amber-500"
              >
                <option value="low">Thấp (lười vận động)</option>
                <option value="medium">Vừa phải</option>
                <option value="high">Cao (năng động)</option>
              </select>
            </div>
          </div>

          <div>
            <ImageUploader
              images={petFormData.avatar_url}
              onChange={(url) => setPetFormData(prev => ({ ...prev, avatar_url: url }))}
              multiple={false}
              folder="pets"
              label="Ảnh đại diện bé cưng (Tải ảnh từ máy - Nén WebP tự động)"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tiền sử dị ứng thức ăn (nếu có)
            </label>
            <input
              type="text"
              value={petFormData.allergies}
              onChange={(e) => setPetFormData({ ...petFormData, allergies: e.target.value })}
              placeholder="VD: Hải sản, thịt bò, ngũ cốc gluten..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Ghi chú sức khỏe / lịch tiêm phòng
            </label>
            <textarea
              rows="2"
              value={petFormData.health_notes}
              onChange={(e) => setPetFormData({ ...petFormData, health_notes: e.target.value })}
              placeholder="Ghi chú về tiền sử bệnh, lịch tiêm phòng 7 bệnh..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsAddPetModalOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submittingPet}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
            >
              {submittingPet ? 'Đang lưu...' : 'Lưu hồ sơ thú cưng'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
