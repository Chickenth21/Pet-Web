import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DriveImage from '../components/common/DriveImage';
import YouTubeEmbed from '../components/common/YouTubeEmbed';
import { ArrowLeft, Calendar, Eye, Share2, Tag, BookOpen } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/blogs/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPost(data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-1/2 mx-auto mb-6" />
        <div className="h-72 bg-slate-200 rounded-3xl" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Không tìm thấy bài viết</h2>
        <Link to="/blogs" className="inline-block px-4 py-2 bg-amber-500 text-white rounded-xl font-bold">
          Quay lại cẩm nang
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Quay lại */}
      <Link to="/blogs" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-amber-600 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại cẩm nang thú cưng</span>
      </Link>

      {/* Header bài viết */}
      <div className="space-y-4">
        <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold">
          {post.category}
        </span>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>{new Date(post.published_at || post.created_at).toLocaleDateString('vi-VN')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Eye className="w-4 h-4" />
            <span>{post.views_count} lượt đọc</span>
          </div>
        </div>
      </div>

      {/* Ảnh đại diện bài viết */}
      <div className="relative h-80 sm:h-96 rounded-3xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200">
        <DriveImage
          src={post.thumbnail_url}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Tóm tắt */}
      <div className="p-5 rounded-2xl bg-amber-50/60 border-l-4 border-amber-500 text-sm text-slate-700 font-medium leading-relaxed">
        {post.summary}
      </div>

      {/* Video YouTube nhúng kèm nếu có */}
      {post.youtube_url && (
        <div className="space-y-2 pt-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Video hướng dẫn trực quan từ YouTube:
          </span>
          <YouTubeEmbed url={post.youtube_url} title={post.title} />
        </div>
      )}

      {/* Nội dung bài viết */}
      <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed whitespace-pre-line space-y-4 pt-4">
        {post.content}
      </div>

      {/* Thẻ tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="pt-6 border-t border-slate-100 flex items-center gap-2 flex-wrap">
          <Tag className="w-4 h-4 text-slate-400" />
          {post.tags.map((tag, idx) => (
            <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Bài viết liên quan */}
      {post.related_posts && post.related_posts.length > 0 && (
        <div className="pt-10 border-t border-slate-200 space-y-4">
          <h3 className="font-extrabold text-lg text-slate-900">Bài viết liên quan bạn có thể quan tâm</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {post.related_posts.map((rel) => (
              <Link
                key={rel.id}
                to={`/blogs/${rel.slug}`}
                className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-amber-400 shadow-xs transition-all space-y-2 group"
              >
                <h4 className="font-bold text-xs text-slate-800 group-hover:text-amber-600 line-clamp-2">
                  {rel.title}
                </h4>
                <p className="text-[11px] text-slate-400">{new Date(rel.published_at || rel.created_at).toLocaleDateString('vi-VN')}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
