import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const PetContext = createContext();

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const DEFAULT_PETS = [
  {
    id: 'pet-1',
    name: 'Miu Miu',
    species: 'cat',
    breed: 'Mèo Anh lông ngắn',
    gender: 'female',
    birth_date: '2024-04-10',
    age_months: 29,
    initial_weight: 4.8,
    activity_level: 'low',
    favorite_things: 'Thích ăn pate cá ngừ, nằm cuộn tròn trên bàn làm việc',
    allergies: 'Dị ứng bột ngũ cốc, ngứa khi ăn cá trích',
    ingredients_to_avoid: 'Ngô nghiền, gluten lúa mì',
    health_notes: 'Đã tiêm đủ 3 mũi vacxin và triệt sản',
    avatar_url: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&auto=format&fit=crop'
  },
  {
    id: 'pet-2',
    name: 'Bơ (Butter)',
    species: 'dog',
    breed: 'Corgi',
    gender: 'male',
    birth_date: '2025-01-15',
    age_months: 20,
    initial_weight: 11.2,
    activity_level: 'high',
    favorite_things: 'Chạy nhặt bóng tennis, thích ăn ức gà luộc',
    allergies: 'Không có dị ứng đặc biệt',
    ingredients_to_avoid: 'Hành tỏi, socola, nho',
    health_notes: 'Khung xương hông nhạy cảm, cần theo dõi trọng lượng tránh đè nặng cột sống',
    avatar_url: 'https://images.unsplash.com/photo-1546975490-a79abdd54533?w=600&auto=format&fit=crop'
  }
];

export function PetProvider({ children }) {
  const { token, isAuthenticated } = useAuth();
  const [pets, setPets] = useState(DEFAULT_PETS);
  const [activePet, setActivePet] = useState(DEFAULT_PETS[0]);
  const [loading, setLoading] = useState(false);

  const fetchPets = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/pets`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        setPets(data.data);
        setActivePet((prev) => data.data.find(p => p.id === prev?.id) || data.data[0]);
      }
    } catch {
      // Giữ DEFAULT_PETS
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, [token, isAuthenticated]);

  const addPet = async (petData) => {
    try {
      const res = await fetch(`${API_BASE}/pets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(petData)
      });
      const data = await res.json();
      if (data.success) {
        setPets(prev => [data.data, ...prev]);
        setActivePet(data.data);
        return { success: true };
      }
    } catch {
      // Fallback local
    }
    const mockNew = { id: 'pet-' + Date.now(), ...petData };
    setPets(prev => [mockNew, ...prev]);
    setActivePet(mockNew);
    return { success: true };
  };

  return (
    <PetContext.Provider value={{ pets, activePet, setActivePet, addPet, fetchPets, loading }}>
      {children}
    </PetContext.Provider>
  );
}

export const usePet = () => useContext(PetContext);
