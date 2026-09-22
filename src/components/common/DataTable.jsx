import React, { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, PawPrint } from 'lucide-react';
import Pagination from './Pagination';

/**
 * Reusable DataTable Component (Chuẩn codebase toàn dự án)
 * @param {Array} columns - Danh sách cột: [{ key, title, render, sortable, width, align }]
 * @param {Array} data - Dữ liệu bảng
 * @param {boolean} isLoading - Trạng thái tải dữ liệu
 * @param {string} emptyMessage - Thông báo khi không có dữ liệu
 * @param {object} pagination - Cấu hình phân trang { currentPage, totalPages, totalItems, limit, onPageChange, onLimitChange }
 */
export default function DataTable({
  columns = [],
  data = [],
  isLoading = false,
  emptyMessage = "Không có dữ liệu hiển thị",
  pagination = null,
  className = "",
  onRowClick = null
}) {
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortOrder]);

  return (
    <div className={`bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col ${className}`}>
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-sm border-collapse">
          {/* Table Header */}
          <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  className={`py-3.5 px-4 ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'}`}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => handleSort(col.key)}
                      className="inline-flex items-center gap-1.5 hover:text-amber-600 transition-colors group cursor-pointer focus:outline-none"
                    >
                      <span>{col.title}</span>
                      {sortKey === col.key ? (
                        sortOrder === 'asc' ? (
                          <ArrowUp className="w-3.5 h-3.5 text-amber-600" />
                        ) : (
                          <ArrowDown className="w-3.5 h-3.5 text-amber-600" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-500 opacity-60" />
                      )}
                    </button>
                  ) : (
                    <span>{col.title}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {isLoading ? (
              // Skeleton Rows
              Array.from({ length: 5 }).map((_, rIdx) => (
                <tr key={`skeleton-${rIdx}`} className="animate-pulse">
                  {columns.map((col, cIdx) => (
                    <td key={`skel-td-${cIdx}`} className="py-4 px-4">
                      <div className="h-4 bg-slate-200 rounded-md w-3/4"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 px-4 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                    <PawPrint className="w-10 h-10 text-amber-300 stroke-[1.5]" />
                    <p className="font-medium text-slate-500">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedData.map((row, rIdx) => (
                <tr
                  key={row.id || `row-${rIdx}`}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`transition-colors hover:bg-amber-50/40 ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {columns.map((col) => (
                    <td
                      key={`td-${col.key}`}
                      className={`py-3.5 px-4 align-middle ${
                        col.align === 'center'
                          ? 'text-center'
                          : col.align === 'right'
                          ? 'text-right'
                          : 'text-left'
                      }`}
                    >
                      {col.render ? col.render(row[col.key], row, rIdx) : row[col.key] ?? '—'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang tích hợp */}
      {pagination && (
        <div className="border-t border-slate-100 bg-white">
          <Pagination {...pagination} />
        </div>
      )}
    </div>
  );
}
