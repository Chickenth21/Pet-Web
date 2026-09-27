import React, { useState, useRef, useEffect } from 'react';
import { usePet } from '../../context/PetContext';
import { useAuth } from '../../context/AuthContext';
import DriveImage from './DriveImage';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  ExternalLink, 
  ShieldAlert, 
  Info, 
  RotateCcw,
  PawPrint,
  CheckCircle2,
  ChevronDown,
  MessageCircle,
  Minimize2,
  Maximize2
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AIChatWidget() {
  const { activePet, pets, setActivePet } = usePet();
  const { token, user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: `Xin chào ${user?.full_name?.split(' ').pop() || 'bạn'}! 👋 Tôi là **PetPaw AI** - Trợ lý tư vấn dinh dưỡng và chăm sóc thú cưng 24/7.\n\nTôi có thể giúp bạn:\n- Tư vấn khẩu phần hạt/pate phù hợp độ tuổi & cân nặng.\n- Thực phẩm an toàn, tránh dị ứng.\n- Giải đáp thói quen và thể trạng của bé cưng.`,
      recommendedProducts: [],
      timestamp: new Date()
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPetPicker, setShowPetPicker] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Khi đổi active pet -> Gửi lời chào cá nhân hóa
  useEffect(() => {
    if (activePet) {
      setMessages(prev => [
        ...prev,
        {
          id: 'msg-sync-' + Date.now(),
          role: 'assistant',
          content: `🐾 **Đã đồng bộ hồ sơ bé ${activePet.name}** (${activePet.breed} • ${activePet.gender === 'male' ? 'Đực' : 'Cái'} • ${activePet.initial_weight || '4.5'}kg).\n\nBạn cần AI tư vấn gì cho bé ${activePet.name} hôm nay?`,
          recommendedProducts: [],
          timestamp: new Date()
        }
      ]);
    }
  }, [activePet?.id]);

  const handleSendMessage = async (e, textToSend) => {
    if (e) e.preventDefault();
    const query = (textToSend || inputMsg).trim();
    if (!query || loading) return;

    setInputMsg('');

    const newMsg = {
      id: 'usr-' + Date.now(),
      role: 'user',
      content: query,
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
          message: query,
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
      } else {
        setMessages(prev => [
          ...prev,
          {
            id: 'err-' + Date.now(),
            role: 'assistant',
            content: data.message || 'Xin lỗi, tôi gặp sự cố khi xử lý câu hỏi. Bạn vui lòng thử lại nhé!',
            timestamp: new Date()
          }
        ]);
      }
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          role: 'assistant',
          content: 'Không thể kết nối đến máy chủ AI. Vui lòng kiểm tra lại kết nối mạng.',
          timestamp: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'msg-reset-' + Date.now(),
        role: 'assistant',
        content: `Đã làm mới cuộc hội thoại! 👋 Tôi có thể hỗ trợ gì cho bạn và ${activePet ? `bé **${activePet.name}**` : 'thú cưng'}?`,
        recommendedProducts: [],
        timestamp: new Date()
      }
    ]);
  };

  const quickPrompts = [
    'Khẩu phần ăn hôm nay?',
    'Bé biếng ăn nên làm gì?',
    'Thức ăn dị ứng cần tránh?',
    'Gợi ý hạt giàu đạm cho bé'
  ];

  return (
    <>
      {/* Floating Toggle Button ở góc màn hình bên phải */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/95 text-slate-800 text-xs font-bold shadow-lg border border-amber-200/80 hover:bg-amber-50 hover:border-amber-300 transition-all cursor-pointer backdrop-blur-xs group animate-bounce duration-1000"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 group-hover:rotate-12 transition-transform" />
            <span>AI Tư vấn 24/7</span>
          </button>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Mở AI Trợ lý"
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 cursor-pointer ${
            isOpen 
              ? 'bg-slate-900 text-white hover:bg-slate-800 rotate-90 scale-95' 
              : 'bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-400 text-slate-950 hover:shadow-amber-500/40 hover:scale-105 active:scale-95'
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <div className="relative">
              <Bot className="w-7 h-7 text-slate-950" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full animate-pulse" />
            </div>
          )}
        </button>
      </div>

      {/* Cửa sổ Chatbox nổi */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[410px] h-[580px] max-h-[82vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header của Chatbox */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white p-4 shrink-0 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-amber-400" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border border-slate-900 rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm text-white">PetPaw AI</h3>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                    Trợ lý ảo
                  </span>
                </div>
                <p className="text-[10px] text-slate-300">
                  {activePet ? `Hồ sơ: ${activePet.name} (${activePet.breed})` : 'Tư vấn dinh dưỡng & sức khỏe'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-300">
              {/* Nút reset đoạn chat */}
              <button
                onClick={handleResetChat}
                title="Làm mới trò chuyện"
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              {/* Nút đóng / thu nhỏ */}
              <button
                onClick={() => setIsOpen(false)}
                title="Đóng chatbox"
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Dải chọn nhanh Hồ Sơ Bé Cưng nếu có thú cưng */}
          {pets && pets.length > 0 && (
            <div className="bg-amber-50/80 px-3 py-1.5 border-b border-amber-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1">
                <PawPrint className="w-3.5 h-3.5 text-amber-600" />
                <span>Bé đang chọn:</span>
              </span>
              
              <div className="relative">
                <button
                  onClick={() => setShowPetPicker(!showPetPicker)}
                  className="flex items-center gap-1.5 font-bold text-amber-900 hover:text-amber-700 bg-white/80 px-2 py-0.5 rounded-lg border border-amber-200 shadow-2xs cursor-pointer text-[11px]"
                >
                  <span>{activePet?.name || 'Chọn thú cưng'}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {showPetPicker && (
                  <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-20">
                    {pets.map(p => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setActivePet(p);
                          setShowPetPicker(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-amber-50 ${
                          activePet?.id === p.id ? 'font-bold text-amber-700 bg-amber-50/50' : 'text-slate-700'
                        }`}
                      >
                        <span className="truncate">{p.name} ({p.breed})</span>
                        {activePet?.id === p.id && <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Body luồng tin nhắn */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-amber-600" />
                  </div>
                )}

                <div className={`max-w-[82%] space-y-2`}>
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-xs shadow-sm'
                        : msg.isEmergency
                        ? 'bg-rose-50 text-rose-950 border border-rose-200 rounded-tl-xs'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs shadow-2xs'
                    }`}
                  >
                    {msg.isEmergency && (
                      <div className="flex items-center gap-1.5 font-bold text-rose-600 mb-1">
                        <ShieldAlert className="w-4 h-4" />
                        <span>CẢNH BÁO KHẨN CẤP</span>
                      </div>
                    )}
                    <div className="whitespace-pre-line break-words">
                      {msg.content}
                    </div>
                  </div>

                  {/* Danh sách sản phẩm gợi ý (nếu có) */}
                  {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>Sản phẩm gợi ý cho bé</span>
                      </div>
                      <div className="space-y-1.5">
                        {msg.recommendedProducts.map((prod) => (
                          <div
                            key={prod.id || prod.name}
                            className="p-2 bg-white rounded-xl border border-slate-200 flex items-center gap-2 shadow-2xs hover:border-amber-300 transition-colors"
                          >
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                              <DriveImage
                                src={prod.image_url}
                                alt={prod.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-[11px] font-bold text-slate-900 truncate">{prod.name}</h4>
                              <p className="text-[10px] text-amber-600 font-extrabold">
                                {prod.price ? `${Number(prod.price).toLocaleString('vi-VN')} đ` : 'Liên hệ'}
                              </p>
                            </div>
                            {prod.affiliate_links?.shopee && (
                              <a
                                href={prod.affiliate_links.shopee}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors"
                                title="Xem trên Shopee"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {msg.disclaimer && (
                    <div className="text-[10px] text-slate-400 flex items-center gap-1 italic">
                      <Info className="w-3 h-3 shrink-0" />
                      <span>{msg.disclaimer}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 items-center">
                <div className="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-amber-600 animate-spin" />
                </div>
                <div className="bg-white border border-slate-200 px-3.5 py-2 rounded-2xl rounded-tl-xs shadow-2xs text-xs text-slate-500 flex items-center gap-2">
                  <span className="inline-block w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="inline-block w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="inline-block w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" />
                  <span className="text-[11px] font-medium text-slate-400 ml-1">AI đang suy nghĩ...</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-slate-50 border-t border-slate-200/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(null, prompt)}
                disabled={loading}
                className="whitespace-nowrap px-2.5 py-1 bg-white hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 text-slate-600 text-[11px] font-medium rounded-full border border-slate-200 transition-all cursor-pointer shrink-0 disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => handleSendMessage(e)}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder={`Hỏi AI về dinh dưỡng, thức ăn...`}
              disabled={loading}
              className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-amber-500 transition-colors disabled:bg-slate-100"
            />
            <button
              type="submit"
              disabled={!inputMsg.trim() || loading}
              className="p-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm shadow-amber-500/20 cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
