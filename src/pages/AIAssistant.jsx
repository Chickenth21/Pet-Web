import React, { useState, useRef, useEffect } from 'react';
import { usePet } from '../context/PetContext';
import { useAuth } from '../context/AuthContext';
import DriveImage from '../components/common/DriveImage';
import { 
  Bot, 
  Send, 
  Sparkles, 
  ExternalLink, 
  ShieldAlert, 
  Info, 
  RotateCcw,
  PawPrint,
  CheckCircle2
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AIAssistant() {
  const { activePet, pets, setActivePet } = usePet();
  const { token, user } = useAuth();
  
  const [messages, setMessages] = useState([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: `Xin chào ${user?.full_name?.split(' ').pop() || 'bạn'}! 👋 Tôi là **PetPaw AI** - Trợ lý tư vấn chăm sóc và dinh dưỡng cho thú cưng.\n\nTôi đã đồng bộ thông tin của bé **${activePet?.name || 'thú cưng'}** (${activePet?.breed || ''}). Bạn có thể hỏi tôi về:\n- Khẩu phần hạt/pate phù hợp độ tuổi và cân nặng.\n- Thực phẩm an toàn, tránh dị ứng.\n- Cách xử lý khi bé lười ăn hoặc tăng cân nhanh.`,
      recommendedProducts: [],
      timestamp: new Date()
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Đổi active pet -> Reset chào hỏi
  useEffect(() => {
    if (activePet) {
      setMessages([
        {
          id: 'msg-sync-' + Date.now(),
          role: 'assistant',
          content: `🐾 **Đã chuyển sang hồ sơ của bé ${activePet.name}** (${activePet.breed} • ${activePet.gender === 'male' ? 'Đực' : 'Cái'}).\n\n- Thể trạng ban đầu: ${activePet.initial_weight || '4.5'} kg\n- Tiền sử dị ứng: ${activePet.allergies || 'Không có'}\n\nBạn cần tư vấn gì cho bé ${activePet.name} hôm nay?`,
          recommendedProducts: [],
          timestamp: new Date()
        }
      ]);
    }
  }, [activePet?.id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMsg.trim() || loading) return;

    const userText = inputMsg.trim();
    setInputMsg('');

    const newMsg = {
      id: 'usr-' + Date.now(),
      role: 'user',
      content: userText,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMsg]);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({
          message: userText,
          petId: activePet?.id,
          userId: user?.id
        })
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [
          ...prev,
          {
            id: 'ai-' + Date.now(),
            role: 'assistant',
            content: data.data.reply,
            recommendedProducts: data.data.recommendedProducts || [],
            isEmergency: data.data.isEmergency,
            disclaimer: data.data.disclaimer,
            timestamp: new Date()
          }
        ]);
      }
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: 'ai-err-' + Date.now(),
          role: 'assistant',
          content: `Xin lỗi bạn, kết nối trợ lý AI tạm thời bị gián đoạn. Về cơ bản với bé ${activePet?.name}, hãy đảm bảo cung cấp đủ nước và khẩu phần ăn cân đối nhé!`,
          recommendedProducts: [],
          timestamp: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const trackAffiliate = (productId, platform, url) => {
    try {
      fetch(`${API_BASE}/affiliate/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, platform })
      });
    } catch {}
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-4 h-[calc(100vh-5rem)] flex flex-col">
      
      {/* Header AI Chatbox */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-slate-900 text-base">PetPaw AI Assistant</h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Trực tuyến
              </span>
            </div>
            <p className="text-xs text-slate-500">Tư vấn dinh dưỡng & chăm sóc thú cưng cá nhân hóa</p>
          </div>
        </div>

        {/* Đổi nhanh thú cưng trong lúc chat */}
        {pets.length > 0 && (
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-2xl border border-slate-200">
            <span className="text-xs text-slate-500 font-medium">Bé đang chat:</span>
            <select
              value={activePet?.id}
              onChange={(e) => {
                const p = pets.find(item => item.id === e.target.value);
                if (p) setActivePet(p);
              }}
              className="bg-transparent text-xs font-bold text-amber-900 focus:outline-none cursor-pointer"
            >
              {pets.map(pet => (
                <option key={pet.id} value={pet.id}>
                  {pet.name} ({pet.breed})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Vùng Tin Nhắn Chat */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isAi = msg.role === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}
            >
              {isAi && (
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-1">
                  <PawPrint className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] sm:max-w-[75%] space-y-3 ${
                isAi ? 'text-slate-800' : 'text-right'
              }`}>
                {/* Bubble tin nhắn */}
                <div className={`p-4 rounded-3xl text-sm leading-relaxed ${
                  isAi
                    ? msg.isEmergency
                      ? 'bg-rose-50 border border-rose-200 text-rose-900 shadow-sm'
                      : 'bg-slate-50 border border-slate-100 shadow-xs'
                    : 'bg-amber-500 text-white font-medium rounded-br-none shadow-sm'
                }`}>
                  <div className="whitespace-pre-line">{msg.content}</div>
                </div>

                {/* Danh sách sản phẩm AI gợi ý từ Database */}
                {isAi && msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wide">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Sản phẩm phù hợp gợi ý từ kho:</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {msg.recommendedProducts.map((prod) => (
                        <div
                          key={prod.id}
                          className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs flex items-center gap-3 hover:border-amber-300 transition-colors"
                        >
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                            <DriveImage
                              src={prod.images?.[0]}
                              alt={prod.name}
                              className="w-full h-full"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-slate-800 truncate" title={prod.name}>
                              {prod.name}
                            </h4>
                            <p className="text-xs font-black text-amber-600">
                              {Number(prod.reference_price).toLocaleString('vi-VN')} đ
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {prod.shopee_url && (
                                <button
                                  onClick={() => trackAffiliate(prod.id, 'shopee', prod.shopee_url)}
                                  className="text-[10px] font-bold text-[#EE4D2D] hover:underline inline-flex items-center gap-0.5"
                                >
                                  Shopee <ExternalLink className="w-2.5 h-2.5" />
                                </button>
                              )}
                              {prod.tiktok_url && (
                                <button
                                  onClick={() => trackAffiliate(prod.id, 'tiktok', prod.tiktok_url)}
                                  className="text-[10px] font-bold text-slate-900 hover:underline inline-flex items-center gap-0.5"
                                >
                                  TikTok <ExternalLink className="w-2.5 h-2.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Disclaimer y tế */}
                {isAi && (
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <ShieldAlert className="w-3 h-3 text-amber-500 shrink-0" />
                    <span>Tham khảo khoa học, không thay thế khám bác sĩ thú y trực tiếp.</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs italic pl-11">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]" />
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.4s]" />
            <span>PetPaw AI đang suy nghĩ...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input gửi tin nhắn */}
      <form onSubmit={handleSendMessage} className="relative shrink-0">
        <input
          type="text"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          placeholder={`Hỏi AI về thức ăn, cân nặng hoặc chăm sóc cho ${activePet?.name || 'thú cưng'}...`}
          disabled={loading}
          className="w-full py-3.5 pl-5 pr-14 bg-white border border-slate-200 rounded-2xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
        />
        <button
          type="submit"
          disabled={!inputMsg.trim() || loading}
          className="absolute right-2 top-2 bottom-2 px-3.5 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 text-white rounded-xl flex items-center justify-center transition-all cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
