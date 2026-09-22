import React from 'react';

/**
 * Reusable RadioGroup / Segmented Card Component
 */
export default function RadioGroup({
  label,
  value,
  onChange,
  options = [], // [{ value, label, description, icon }]
  layout = 'grid', // 'grid' | 'vertical' | 'horizontal'
  disabled = false,
  className = ""
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <span className="text-xs font-semibold text-slate-700">{label}</span>}

      <div
        className={`gap-2.5 ${
          layout === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
            : layout === 'horizontal'
            ? 'flex flex-wrap'
            : 'flex flex-col'
        }`}
      >
        {options.map((opt) => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const text = typeof opt === 'object' ? opt.label : opt;
          const desc = typeof opt === 'object' ? opt.description : null;
          const Icon = typeof opt === 'object' ? opt.icon : null;
          const isSelected = value === val;

          return (
            <div
              key={val}
              onClick={() => !disabled && onChange(val)}
              className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                isSelected
                  ? 'bg-amber-50/50 border-amber-500 shadow-sm shadow-amber-500/10'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {/* Radio Circle */}
              <div
                className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                  isSelected ? 'border-amber-500' : 'border-slate-300'
                }`}
              >
                {isSelected && <div className="w-2 h-2 rounded-full bg-amber-500" />}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {Icon && <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-600' : 'text-slate-400'}`} />}
                  <span className={`text-sm font-semibold ${isSelected ? 'text-amber-950' : 'text-slate-800'}`}>
                    {text}
                  </span>
                </div>
                {desc && <p className="text-xs text-slate-500 mt-1 leading-relaxed">{desc}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
