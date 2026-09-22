import React from 'react';
import { Search, X, RotateCcw, Filter } from 'lucide-react';

/**
 * Common FilterBar Component
 * @param {string} searchValue - Từ khóa tìm kiếm
 * @param {function} onSearchChange - Callback đổi từ khóa
 * @param {string} searchPlaceholder - Placeholder thanh tìm kiếm
 * @param {ReactNode} children - Các bộ lọc bổ sung (Select, Checkbox, Range)
 * @param {function} onReset - Callback làm mới bộ lọc
 * @param {boolean} hasActiveFilters - Trạng thái đang có bộ lọc hoạt động
 */
export default function FilterBar({
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Tìm kiếm theo tên, thương hiệu, nhu cầu...",
  children,
  onReset,
  hasActiveFilters = false,
  className = ""
}) {
  return (
    <div className={`bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col gap-3.5 ${className}`}>
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Thanh tìm kiếm */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          />
          {searchValue && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Nút làm mới */}
        {onReset && hasActiveFilters && (
          <button
            onClick={onReset}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-rose-200 bg-rose-50/60 text-rose-700 text-xs font-semibold hover:bg-rose-100 transition-colors shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Xóa bộ lọc</span>
          </button>
        )}
      </div>

      {/* Các thành phần lọc bổ sung (Drop-downs / Category chips / Slider) */}
      {children && (
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 shrink-0">
            <Filter className="w-3.5 h-3.5 text-amber-500" />
            <span>Lọc theo:</span>
          </div>
          <div className="flex-1 flex flex-wrap items-center gap-2.5">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
