import React, { useState } from 'react';
import { usePet } from '../context/PetContext';
import Modal from '../components/common/Modal';
import Select from '../components/common/Select';
import DriveImage from '../components/common/DriveImage';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  PawPrint, 
  Activity, 
  Calendar, 
  Scale, 
  AlertTriangle,
  Heart
} from 'lucide-react';

export default function PetProfiles() {
  const { pets, activePet, setActivePet, addPet } = usePet();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    species: 'cat',
    breed: '',
    gender: 'female',
    age_months: 12,
    initial_weight: '',
    activity_level: 'medium',
    allergies: '',
    ingredients_to_avoid: '',
    health_notes: '',
    avatar_url: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.breed) {
      alert('Vui lòng điền tên và giống thú cưng!');
      return;
    }
    await addPet({
      ...formData,
      initial_weight: Number(formData.initial_weight) || 4.0,
      age_months: Number(formData.age_months) || 12
    });
    setIsModalOpen(false);
    setFormData({
      name: '',
      species: 'cat',
      breed: '',
      gender: 'female',
      age_months: 12,
      initial_weight: '',
      activity_level: 'medium',
      allergies: '',
      ingredients_to_avoid: '',
      health_notes: '',
      avatar_url: ''
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <PawPrint className="w-8 h-8 text-amber-500" />
            <span>Hồ Sơ Thú Cưng Của Tôi</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý thông tin dinh dưỡng, dị ứng và thể trạng riêng biệt cho từng bé
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm thú cưng mới</span>
        </button>
      </div>

      {/* Danh sách thẻ thú cưng */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pets.map((pet) => {
          const isActive = activePet?.id === pet.id;
          return (
            <div
              key={pet.id}
              onClick={() => setActivePet(pet)}
              className={`bg-white rounded-3xl p-6 border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isActive
                  ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-md'
                  : 'border-slate-200/80 shadow-sm hover:shadow-card'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                  Đang chọn
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <DriveImage
                      src={pet.avatar_url}
                      alt={pet.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900">{pet.name}</h3>
                    <p className="text-xs text-amber-600 font-semibold">{pet.breed}</p>
                    <span className="inline-block text-[11px] text-slate-400 mt-0.5">
                      {pet.species === 'cat' ? '🐱 Mèo' : '🐶 Chó'} • {pet.gender === 'male' ? 'Đực' : pet.gender === 'female' ? 'Cái' : 'Chưa rõ'}
                    </span>
                  </div>
                </div>

                {/* Các chỉ số tóm tắt */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Tuổi</span>
                      <span className="font-bold text-slate-700">{pet.age_months ? `${Math.floor(pet.age_months / 12)} tuổi` : '1 tuổi'}</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 flex items-center gap-2">
                    <Scale className="w-4 h-4 text-slate-400" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Cân nặng đầu</span>
                      <span className="font-bold text-slate-700">{pet.initial_weight || '4.5'} kg</span>
                    </div>
                  </div>
                </div>

                {/* Ghi chú dị ứng */}
                {pet.allergies && (
                  <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-100 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="font-bold text-rose-800">Dị ứng: </span>
                      <span className="text-rose-700">{pet.allergies}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className={`font-semibold ${isActive ? 'text-amber-600' : 'text-slate-400'}`}>
                  {isActive ? '✓ Đang kết nối AI & Thể trạng' : 'Nhấn để chọn bé này'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Thêm Thú Cưng Mới */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Thêm Hồ Sơ Thú Cưng Mới"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Tên thú cưng *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="VD: Miu, Bơ, Lu..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <Select
              label="Loài thú cưng *"
              value={formData.species}
              onChange={(val) => setFormData({ ...formData, species: val })}
              options={[
                { value: 'cat', label: '🐱 Mèo' },
                { value: 'dog', label: '🐶 Chó' }
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Giống loài *</label>
              <input
                type="text"
                required
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                placeholder="VD: Mèo Anh lông ngắn, Corgi, Poodle..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <Select
              label="Giới tính"
              value={formData.gender}
              onChange={(val) => setFormData({ ...formData, gender: val })}
              options={[
                { value: 'female', label: 'Cái' },
                { value: 'male', label: 'Đực' },
                { value: 'unknown', label: 'Chưa rõ' }
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Tuổi (tháng)</label>
              <input
                type="number"
                value={formData.age_months}
                onChange={(e) => setFormData({ ...formData, age_months: e.target.value })}
                placeholder="12"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Cân nặng ban đầu (kg)</label>
              <input
                type="number"
                step="0.1"
                value={formData.initial_weight}
                onChange={(e) => setFormData({ ...formData, initial_weight: e.target.value })}
                placeholder="4.5"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <Select
              label="Mức độ vận động"
              value={formData.activity_level}
              onChange={(val) => setFormData({ ...formData, activity_level: val })}
              options={[
                { value: 'low', label: 'Thấp (Lười vận động)' },
                { value: 'medium', label: 'Vừa phải' },
                { value: 'high', label: 'Cao (Năng động)' }
              ]}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Link ảnh (URL hoặc Google Drive ID)</label>
            <input
              type="text"
              value={formData.avatar_url}
              onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
              placeholder="https://... hoặc Google Drive link"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Tiền sử dị ứng thức ăn (nếu có)</label>
            <input
              type="text"
              value={formData.allergies}
              onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
              placeholder="VD: Hải sản, thịt bò, ngũ cốc gluten..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Ghi chú sức khỏe hoặc lịch tiêm phòng</label>
            <textarea
              rows="2"
              value={formData.health_notes}
              onChange={(e) => setFormData({ ...formData, health_notes: e.target.value })}
              placeholder="Đã tiêm 3 mũi phòng dại, triệt sản ngày..."
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
              Lưu hồ sơ
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
