import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, Check, X, Plus } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Reusable Search-Select Component (Combobox)
 * Cho phép tìm kiếm, lọc và chọn nhanh giống thú cưng chuẩn hóa,
 * đồng thời hỗ trợ nhập giống tùy biến linh hoạt.
 */
export default function SearchSelect({
  label,
  value = '',
  onChange,
  species = 'all', // 'dog', 'cat', 'all'
  placeholder = 'Tìm kiếm hoặc chọn giống thú cưng...',
  allowCustom = true,
  required = false,
  error = '',
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value || '');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);

  // Đồng bộ khi prop value hoặc query thay đổi từ bên ngoài
  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  // Tải danh sách giống từ API theo loài
  useEffect(() => {
    let isMounted = true;
    const fetchBreeds = async () => {
      setLoading(true);
      try {
        const url = species && species !== 'all' 
          ? `${API_BASE}/breeds?species=${species}&limit=100` 
          : `${API_BASE}/breeds?limit=100`;
        const res = await fetch(url);
        const data = await res.json();
        if (isMounted && data.success && data.data?.breeds) {
          setOptions(data.data.breeds);
        }
      } catch {
        // Fallback im lặng nếu offline
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBreeds();
    return () => { isMounted = false; };
  }, [species]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lọc danh sách theo từ khóa tìm kiếm
  const filteredOptions = options.filter(opt => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      opt.name.toLowerCase().includes(q) ||
      (opt.origin && opt.origin.toLowerCase().includes(q)) ||
      (opt.temperament && opt.temperament.toLowerCase().includes(q))
    );
  });

  const handleSelectOption = (optName) => {
    setQuery(optName);
    onChange(optName);
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val);
    if (!isOpen) setIsOpen(true);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setQuery('');
    onChange('');
  };

  const isExactMatch = options.some(opt => opt.name.toLowerCase() === query.trim().toLowerCase());

  return (
    <div ref={wrapperRef} className={`relative flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-slate-700 block">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      {/* Input container */}
      <div 
        className={`relative flex items-center bg-slate-50 border rounded-xl transition-all ${
          isOpen ? 'bg-white border-amber-500 ring-2 ring-amber-500/20 shadow-xs' : 'border-slate-200 hover:border-slate-300'
        } ${error ? 'border-rose-400 ring-2 ring-rose-500/20' : ''}`}
      >
        <div className="pl-3.5 pr-1.5 text-slate-400 pointer-events-none">
          <Search className="w-4 h-4" />
        </div>

        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          required={required && !query}
          className="w-full py-2.5 pl-1.5 pr-16 bg-transparent text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
        />

        <div className="absolute right-2.5 flex items-center gap-1">
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200/60 transition-colors"
              title="Xóa lựa chọn"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
          >
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-amber-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Dropdown Options Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-64 overflow-y-auto animate-fade-in divide-y divide-slate-100">
          
          {loading ? (
            <div className="p-4 text-center text-xs text-slate-400">
              Đang tải danh sách giống...
            </div>
          ) : filteredOptions.length > 0 ? (
            <div className="p-1 space-y-0.5">
              {filteredOptions.map((opt) => {
                const isSelected = value === opt.name;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectOption(opt.name)}
                    className={`w-full px-3.5 py-2 rounded-xl text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected 
                        ? 'bg-amber-500/10 text-amber-900 font-bold' 
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm shrink-0">
                        {opt.species === 'cat' ? '🐱' : '🐶'}
                      </span>
                      <div className="truncate">
                        <span className="font-semibold block truncate">{opt.name}</span>
                        {opt.origin && (
                          <span className="text-[10px] text-slate-400 block font-normal truncate">
                            {opt.origin} {opt.temperament ? `• ${opt.temperament.split(',')[0]}` : ''}
                          </span>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-amber-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-3 text-center text-xs text-slate-400">
              Không tìm thấy giống khớp với từ khóa "{query}"
            </div>
          )}

          {/* Tùy chọn nhập giống tùy biến ngoài danh mục */}
          {allowCustom && query.trim() && !isExactMatch && (
            <div className="p-1.5 bg-slate-50/80">
              <button
                type="button"
                onClick={() => handleSelectOption(query.trim())}
                className="w-full px-3 py-2 rounded-xl text-left text-xs text-amber-800 bg-amber-50 hover:bg-amber-100/80 font-bold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Sử dụng giống tùy chọn: "<strong>{query.trim()}</strong>"</span>
              </button>
            </div>
          )}

        </div>
      )}

      {error && <span className="text-xs text-rose-500">{error}</span>}
    </div>
  );
}
