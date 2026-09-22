import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';

/**
 * Reusable MultiSelect Dropdown Component
 */
export default function MultiSelect({
  label,
  value = [], // mảng các giá trị được chọn
  onChange,
  options = [], // [{ value, label }]
  placeholder = "Chọn các mục...",
  error,
  disabled = false,
  className = ""
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (optValue) => {
    if (value.includes(optValue)) {
      onChange(value.filter((v) => v !== optValue));
    } else {
      onChange([...value, optValue]);
    }
  };

  const handleRemove = (optValue, e) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== optValue));
  };

  return (
    <div className={`flex flex-col gap-1.5 relative ${className}`} ref={containerRef}>
      {label && <label className="text-xs font-semibold text-slate-700">{label}</label>}

      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`min-h-[42px] w-full bg-white border rounded-xl py-1.5 pl-3 pr-9 text-sm font-medium transition-all flex flex-wrap items-center gap-1.5 cursor-pointer select-none ${
          disabled ? 'bg-slate-50 cursor-not-allowed opacity-60' : 'hover:border-slate-300'
        } ${isOpen ? 'ring-2 ring-amber-500/20 border-amber-500' : 'border-slate-200'} ${
          error ? 'border-rose-400' : ''
        }`}
      >
        {value.length === 0 ? (
          <span className="text-slate-400 text-sm">{placeholder}</span>
        ) : (
          value.map((val) => {
            const opt = options.find((o) => (typeof o === 'object' ? o.value : o) === val);
            const labelText = opt ? (typeof opt === 'object' ? opt.label : opt) : val;
            return (
              <span
                key={val}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200/60 rounded-md text-xs font-medium"
              >
                {labelText}
                <button
                  type="button"
                  onClick={(e) => handleRemove(val, e)}
                  className="hover:text-amber-900 rounded p-0.5 hover:bg-amber-200/50"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })
        )}

        <div className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 pointer-events-none">
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto py-1 divide-y divide-slate-50">
          {options.length === 0 ? (
            <div className="p-3 text-center text-xs text-slate-400">Không có tùy chọn</div>
          ) : (
            options.map((opt) => {
              const val = typeof opt === 'object' ? opt.value : opt;
              const text = typeof opt === 'object' ? opt.label : opt;
              const isSelected = value.includes(val);

              return (
                <div
                  key={val}
                  onClick={() => handleToggle(val)}
                  className={`flex items-center justify-between px-3.5 py-2 text-sm cursor-pointer transition-colors ${
                    isSelected ? 'bg-amber-50/70 text-amber-900 font-medium' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>{text}</span>
                  {isSelected && <Check className="w-4 h-4 text-amber-600" />}
                </div>
              );
            })
          )}
        </div>
      )}

      {error && <span className="text-xs text-rose-500">{error}</span>}
    </div>
  );
}
