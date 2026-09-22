import React from 'react';

/**
 * Reusable YouTube Video Embed Component
 * Phân tích link YouTube tự động và nhúng responsive 16:9
 */
export default function YouTubeEmbed({ url, title = "Video hướng dẫn", className = "" }) {
  if (!url) return null;

  // Trích xuất YouTube Video ID
  const getYouTubeId = (link) => {
    try {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = link.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
    } catch {
      return null;
    }
  };

  const videoId = getYouTubeId(url);
  if (!videoId) return null;

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden shadow-md bg-slate-950 aspect-video border border-slate-200/50 ${className}`}>
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
