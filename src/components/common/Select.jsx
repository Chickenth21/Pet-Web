import React from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Reusable Select Dropdown Component
 */
export default function Select({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Chọn một tùy chọn...",
  error,
  disabled = false,
  className = "",
  id,
  name
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-slate-700">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          name={name}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full appearance-none bg-white border rounded-xl py-2.5 pl-3.5 pr-10 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 disabled:bg-slate-50 disabled:text-slate-400 cursor-pointer ${
            error ? 'border-rose-400 ring-rose-500/20' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((opt) => {
            const val = typeof opt === 'object' ? opt.value : opt;
            const text = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={val} value={val}>
                {text}
              </option>
            );
          })}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
      {error && <span className="text-xs text-rose-500">{error}</span>}
    </div>
  );
}
