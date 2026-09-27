import React, { useState, useRef } from 'react';
import { UploadCloud, X, Loader2, Sparkles, Image as ImageIcon, Trash2, CheckCircle2 } from 'lucide-react';
import DriveImage from './DriveImage';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * ImageUploader Component:
 * - Tiếp nhận file ảnh gốc từ máy người dùng qua FormData
 * - Gửi lên Backend Express (Multer in-memory) -> Sharp nén sang .webp (giảm ~90% dung lượng) -> Upload Cloudflare R2
 * - Nhận về URL public và lưu vào State
 */
export default function ImageUploader({
  images = [],
  onChange,
  multiple = true,
  maxFiles = 8,
  folder = 'pets',
  label = 'Tải ảnh lên (Tự động nén WebP siêu nhẹ qua Cloudflare R2)'
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [uploadStats, setUploadStats] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFilesSelected = async (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    // Reset input
    e.target.value = '';

    setUploading(true);
    setError(null);
    setUploadStats(null);

    try {
      if (multiple) {
        // Upload nhiều file
        const formData = new FormData();
        selectedFiles.forEach((file) => {
          formData.append('images', file);
        });
        formData.append('folder', folder);

        setUploadProgress(`Đang tải & nén ${selectedFiles.length} ảnh sang WebP...`);

        const res = await fetch(`${API_BASE}/upload/images`, {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (!data.success) {
          throw new Error(data.message || 'Lỗi khi tải ảnh lên');
        }

        const uploadedUrls = data.data.map(item => item.url);
        const combined = [...images.filter(Boolean), ...uploadedUrls].slice(0, maxFiles);
        onChange(combined);

        // Thống kê nén ảnh
        const totalOrig = data.data.reduce((acc, cur) => acc + (cur.originalSize || 0), 0);
        const totalComp = data.data.reduce((acc, cur) => acc + (cur.compressedSize || 0), 0);
        const savedPercent = totalOrig > 0 ? (((totalOrig - totalComp) / totalOrig) * 100).toFixed(0) : 90;

        setUploadStats({
          count: data.data.length,
          savedPercent,
          origMB: (totalOrig / (1024 * 1024)).toFixed(2),
          compKB: (totalComp / 1024).toFixed(0)
        });
      } else {
        // Upload 1 file
        const file = selectedFiles[0];
        const formData = new FormData();
        formData.append('image', file);
        formData.append('folder', folder);

        setUploadProgress('Đang nén sang WebP & đẩy lên R2...');

        const res = await fetch(`${API_BASE}/upload/image`, {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (!data.success) {
          throw new Error(data.message || 'Lỗi khi tải ảnh lên');
        }

        onChange(data.data.url);
        setUploadStats({
          count: 1,
          savedPercent: data.data.savingsPercent || '90%',
          origMB: ((data.data.originalSize || 0) / (1024 * 1024)).toFixed(2),
          compKB: ((data.data.compressedSize || 0) / 1024).toFixed(0)
        });
      }
    } catch (err) {
      console.error('[Upload Error]:', err);
      setError(err.message || 'Không thể tải ảnh lên. Vui lòng kiểm tra lại kết nối!');
    } finally {
      setUploading(false);
      setUploadProgress('');
    }
  };

  const handleRemove = (index) => {
    if (multiple) {
      const next = images.filter((_, i) => i !== index);
      onChange(next);
    } else {
      onChange('');
    }
  };

  const handleSetCover = (index) => {
    if (!multiple || index === 0) return;
    const next = [...images];
    const target = next.splice(index, 1)[0];
    next.unshift(target);
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4 text-amber-600" />
          <span>{label}</span>
        </label>
        {multiple && (
          <span className="text-[11px] font-medium text-slate-400">
            {images.filter(Boolean).length}/{maxFiles} ảnh
          </span>
        )}
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFilesSelected}
        accept="image/*"
        multiple={multiple}
        className="hidden"
      />

      {/* Upload Dropzone / Button */}
      <div
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all cursor-pointer select-none ${
          uploading
            ? 'border-amber-400 bg-amber-50/50'
            : 'border-slate-300 hover:border-amber-500 hover:bg-amber-50/20 bg-white'
        }`}
      >
        {uploading ? (
          <div className="flex flex-col items-center justify-center py-2 space-y-2">
            <Loader2 className="w-7 h-7 text-amber-600 animate-spin" />
            <p className="text-xs font-bold text-amber-900">{uploadProgress}</p>
            <span className="text-[10px] text-amber-700 font-medium">
              Multer (RAM) ➔ Sharp (Nén WebP ~90%) ➔ Cloudflare R2
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-2 space-y-1.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-2xs">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">
                Nhấn để chọn ảnh từ máy tính hoặc kéo thả vào đây
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Chấp nhận JPG, PNG, WebP, HEIC (Tự động nén WebP siêu nhẹ, chuẩn SEO & load nhanh)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Thông báo nén ảnh thành công */}
      {uploadStats && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-200/80 rounded-xl text-emerald-800 text-[11px] flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Đã nén và lưu {uploadStats.count} ảnh WebP thành công!
            </span>
          </div>
          <span className="font-extrabold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
            Tiết kiệm {uploadStats.savedPercent}% dung lượng
          </span>
        </div>
      )}

      {/* Lỗi nếu có */}
      {error && (
        <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center justify-between">
          <span>⚠️ {error}</span>
          <button type="button" onClick={() => setError(null)} className="p-1 text-rose-500 hover:text-rose-700">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Danh sách ảnh đã upload (Preview Gallery) */}
      {multiple && images.filter(Boolean).length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="flex flex-wrap gap-2.5">
            {images.filter(Boolean).map((url, idx) => (
              <div
                key={idx}
                className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-100 group shadow-2xs"
              >
                <DriveImage src={url} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                
                {/* Badge Ảnh bìa */}
                {idx === 0 && (
                  <div className="absolute top-0 inset-x-0 bg-amber-500 text-slate-950 text-[9px] font-black text-center py-0.5 shadow-xs uppercase tracking-wider">
                    BÌA
                  </div>
                )}

                {/* Overlay actions */}
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                  {idx !== 0 && (
                    <button
                      type="button"
                      onClick={() => handleSetCover(idx)}
                      title="Đặt làm ảnh bìa"
                      className="p-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition-transform hover:scale-110 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    title="Xóa ảnh này"
                    className="p-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-transform hover:scale-110 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 italic">
            * Di chuột vào ảnh để bấm xóa hoặc đặt làm ảnh bìa chính (Ảnh đầu tiên).
          </p>
        </div>
      )}

      {/* Trường hợp Single Image (1 ảnh đại diện) */}
      {!multiple && Boolean(Array.isArray(images) ? images[0] : images) && (
        <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-100 group shadow-sm">
          <DriveImage 
            src={Array.isArray(images) ? images[0] : images} 
            alt="Preview" 
            className="w-full h-full object-cover" 
          />
          <button
            type="button"
            onClick={() => handleRemove(0)}
            className="absolute top-1 right-1 p-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm"
            title="Xóa ảnh"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
