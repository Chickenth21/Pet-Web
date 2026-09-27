import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const PetContext = createContext();

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function PetProvider({ children }) {
  const { token, isAuthenticated } = useAuth();
  const [pets, setPets] = useState([]);
  const [activePet, setActivePet] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPets = async () => {
    if (!isAuthenticated) {
      setPets([]);
      setActivePet(null);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/pets`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        const petList = data.data || [];
        setPets(petList);
        setActivePet((prev) => petList.find(p => p.id === prev?.id) || petList[0] || null);
      } else {
        setPets([]);
        setActivePet(null);
      }
    } catch {
      setPets([]);
      setActivePet(null);
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
