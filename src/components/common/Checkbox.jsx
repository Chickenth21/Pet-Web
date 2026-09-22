import React from 'react';
import { Check } from 'lucide-react';

/**
 * Reusable Animated Checkbox Component
 */
export default function Checkbox({
  label,
  description,
  checked = false,
  onChange,
  disabled = false,
  id,
  className = ""
}) {
  return (
    <label
      htmlFor={id}
      className={`inline-flex items-start gap-2.5 cursor-pointer select-none group ${
        disabled ? 'cursor-not-allowed opacity-50' : ''
      } ${className}`}
    >
      <div className="relative flex items-center justify-center mt-0.5">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
            checked
              ? 'bg-amber-500 border-amber-500 shadow-sm shadow-amber-500/30'
              : 'border-slate-300 bg-white group-hover:border-slate-400'
          }`}
        >
          {checked && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
        </div>
      </div>

      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span className="text-sm font-medium text-slate-800 group-hover:text-slate-900 leading-tight">
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-slate-500 mt-0.5">{description}</span>
          )}
        </div>
      )}
    </label>
  );
}
