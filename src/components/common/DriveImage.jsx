import React, { useState } from 'react';
import { PawPrint } from 'lucide-react';

/**
 * Component hiển thị ảnh thông minh:
 * Hỗ trợ link trực tiếp, link Google Drive hoặc fileId Google Drive
 */
export default function DriveImage({
  src,
  alt = "Ảnh Pet Paw",
  className = "",
  fallbackText = "Pet Paw"
}) {
  const [hasError, setHasError] = useState(false);

  // Phân tích và chuẩn hóa Google Drive link sang link hiển thị trực tiếp
  const resolveImageUrl = (input) => {
    if (!input) return null;

    // Kiểm tra nếu là Google Drive ID hoặc Link
    const driveRegex = /(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|lh3\.googleusercontent\.com\/d\/)([a-zA-Z0-9_-]+)/;
    const match = input.match(driveRegex);
    if (match && match[1]) {
      // Dùng Google User Content proxy để tải ảnh nhanh và không bị chặn CORS/hotlink
      return `https://lh3.googleusercontent.com/d/${match[1]}`;
    }

    // Nếu là chuỗi fileId thuần (không có dấu gạch chéo và độ dài điển hình 28-44 ký tự)
    if (/^[a-zA-Z0-9_-]{25,45}$/.test(input)) {
      return `https://lh3.googleusercontent.com/d/${input}`;
    }

    return input;
  };

  const finalSrc = resolveImageUrl(src);

  if (!finalSrc || hasError) {
    return (
      <div className={`bg-gradient-to-br from-amber-50 to-orange-100 flex flex-col items-center justify-center text-amber-500/80 select-none ${className}`}>
        <PawPrint className="w-8 h-8 opacity-70 mb-1" />
        <span className="text-[11px] font-semibold text-amber-800/70">{fallbackText}</span>
      </div>
    );
  }

  return (
    <img
      src={finalSrc}
      alt={alt}
      onError={() => setHasError(true)}
      loading="lazy"
      className={`object-cover ${className}`}
    />
  );
}
