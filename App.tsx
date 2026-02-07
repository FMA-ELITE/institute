
import React, { useState, useEffect, useRef } from 'react';
import { AcademicLevel, Course, Faculty, EnrollmentData, LibraryItem, NewsItem } from './types';
import { COURSES, FACULTY, LIBRARY_ITEMS, NEWS_ITEMS } from './data';
import { GoogleGenAI } from "@google/genai";

// --- AI Service ---
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Utility to generate a high-fidelity institutional visual using Gemini 2.5 Flash Image.
 */
const generateInstitutionalVisual = async (prompt: string): Promise<string | null> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `Create a high-fidelity institutional academic visual: ${prompt}. Style: prestigious, polished, high-contrast, cinematic lighting, corporate-academic, 8k resolution.`,
          },
        ],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("AI Image Generation failed:", error);
    return null;
  }
};

// --- Visualization Components ---

/**
 * A specialized image component that can auto-generate visuals if the source is missing
 * or allow manual "AI Synchronization" for unique institutional branding.
 */
const SmartImage: React.FC<{ 
  src: string; 
  alt: string; 
  prompt?: string; 
  className?: string; 
  autoGenerate?: boolean;
}> = ({ src, alt, prompt, className, autoGenerate = false }) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    const newVisual = await generateInstitutionalVisual(prompt);
    if (newVisual) {
      setCurrentSrc(newVisual);
      setHasError(false);
    }
    setIsGenerating(false);
  };

  const handleError = () => {
    setHasError(true);
    if (autoGenerate && prompt && !isGenerating) {
      handleGenerate();
    }
  };

  return (
    <div className={`relative overflow-hidden group/smartimg ${className}`}>
      {isGenerating ? (
        <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm flex flex-col items-center justify-center z-10">
          <span className="material-symbols-outlined spin text-accent text-4xl mb-2">auto_awesome</span>
          <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white">Developing Visual...</span>
        </div>
      ) : null}
      
      <img 
        src={currentSrc} 
        alt={alt} 
        onError={handleError}
        className={`w-full h-full object-cover transition-all duration-700 ${isGenerating ? 'opacity-30 blur-sm' : 'opacity-100 blur-0'}`} 
      />

      {prompt && !isGenerating && (
        <button 
          onClick={handleGenerate}
          className="absolute bottom-4 right-4 bg-accent/90 hover:bg-accent text-white p-2 rounded-full shadow-2xl transition-all opacity-0 group-hover/smartimg:opacity-100 active:scale-90 z-20"
          title="Synchronize Academic Visual (AI)"
        >
          <span className="material-symbols-outlined text-sm">auto_awesome</span>
        </button>
      )}

      {hasError && !isGenerating && (
        <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center p-6 text-center">
          <span className="material-symbols-outlined text-gray-300 text-5xl mb-4">image_not_supported</span>
          <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-4">Source Unreachable</p>
          {prompt && (
            <button 
              onClick={handleGenerate}
              className="bg-primary text-white px-4 py-2 text-[8px] font-black uppercase tracking-[0.3em] rounded-sm"
            >
              Generate AI Visual
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const LiveStockTicker: React.FC = () => {
  const [tickerData, setTickerData] = useState([
    { symbol: 'EUR/USD', price: 1.0842, change: 0.0012, up: true },
    { symbol: 'BTC/USD', price: 64231.50, change: 1240.20, up: true },
    { symbol: 'ETH/USD', price: 3452.12, change: -24.50, up: false },
    { symbol: 'GBP/JPY', price: 191.45, change: 0.54, up: true },
    { symbol: 'XAU/USD', price: 2315.80, change: 12.30, up: true },
    { symbol: 'SPX 500', price: 5240.10, change: -15.40, up: false },
    { symbol: 'USD/JPY', price: 151.22, change: -0.12, up: false },
    { symbol: 'SOL/USD', price: 142.60, change: 5.40, up: true },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerData(current => 
        current.map(item => {
          const move = (Math.random() - 0.5) * (item.price * 0.001);
          const newPrice = item.price + move;
          return {
            ...item,
            price: newPrice,
            change: item.change + (move * 0.1),
            up: move >= 0
          };
        })
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const TickerItem: React.FC<{ item: typeof tickerData[number] }> = ({ item }) => (
    <div className="flex items-center gap-6 px-10 border-r border-white/10 h-full">
      <span className="text-[10px] font-black tracking-[0.2em] text-accent uppercase">{item.symbol}</span>
      <span className="text-[12px] font-mono font-bold text-white">
        {item.price.toLocaleString(undefined, { minimumFractionDigits: item.symbol.includes('/') && !item.symbol.includes('BTC') ? 4 : 2, maximumFractionDigits: item.symbol.includes('/') && !item.symbol.includes('BTC') ? 4 : 2 })}
      </span>
      <div className={`flex items-center gap-1 ${item.up ? 'text-green-400' : 'text-red-400'}`}>
        <span className="material-symbols-outlined text-[14px]">{item.up ? 'arrow_drop_up' : 'arrow_drop_down'}</span>
        <span className="text-[10px] font-mono font-bold">{Math.abs(item.change).toFixed(2)}</span>
      </div>
    </div>
  );

  return (
    <div className="ticker-container fixed bottom-0 left-0 right-0 z-[55] bg-primary/95 backdrop-blur-md border-t border-accent/30 h-12 overflow-hidden flex items-center">
      <div className="absolute left-0 top-0 bottom-0 bg-primary z-10 px-4 flex items-center border-r border-accent/20">
        <span className="text-[8px] font-black text-accent uppercase tracking-[0.3em] whitespace-nowrap">Live Institutional Stream</span>
      </div>
      <div className="animate-marquee whitespace-nowrap">
        {tickerData.map((item, idx) => (
          <TickerItem key={`orig-${idx}`} item={item} />
        ))}
        {tickerData.map((item, idx) => (
          <TickerItem key={`dup-${idx}`} item={item} />
        ))}
      </div>
    </div>
  );
};

const SyllabusTimeline: React.FC<{ syllabus: string[] }> = ({ syllabus }) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="relative py-6">
      <div className="absolute left-[7px] top-0 bottom-0 w-px bg-accent/20"></div>
      <div className="space-y-10">
        {syllabus.map((item, idx) => (
          <div 
            key={item} 
            className="relative flex items-start gap-8 group cursor-default"
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className={`z-10 w-4 h-4 rounded-full border-2 transition-all duration-500 flex items-center justify-center ${
              hovered === idx ? 'bg-accent border-accent scale-150 shadow-[0_0_20px_rgba(184,146,74,0.6)]' : 'bg-marble border-accent/40 scale-100'
            }`}>
               {hovered === idx && <div className="w-1 h-1 bg-white rounded-full"></div>}
            </div>
            <div className="flex flex-col">
              <span className={`text-[9px] font-black uppercase tracking-[0.3em] transition-colors duration-500 mb-1 ${
                hovered === idx ? 'text-accent' : 'text-gray-400'
              }`}>PHASE 0{idx + 1}</span>
              <span className={`text-[12px] font-bold uppercase tracking-widest transition-all duration-500 leading-tight ${
                hovered === idx ? 'text-primary translate-x-2' : 'text-gray-500'
              }`}>{item}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ReadingMatrix: React.FC<{ readingList: string[] }> = ({ readingList }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="relative h-64 w-full bg-slate-50/50 rounded-sm overflow-hidden flex items-end justify-around p-8 border border-accent/10 shadow-inner group/matrix">
      <div className="absolute inset-0 hero-texture opacity-[0.03]"></div>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 right-0 h-px bg-accent/5"></div>
        <div className="absolute top-2/4 left-0 right-0 h-px bg-accent/5"></div>
        <div className="absolute top-3/4 left-0 right-0 h-px bg-accent/5"></div>
      </div>

      {readingList.map((book, idx) => {
        const baseHeight = 35 + (idx * 15);
        const variation = Math.sin(idx * 2) * 10;
        const finalHeight = Math.min(95, Math.max(20, baseHeight + variation));
        
        return (
          <div 
            key={book}
            className="relative group flex flex-col items-center flex-1 mx-1 h-full justify-end"
            onMouseEnter={() => setActiveIndex(idx)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {activeIndex === idx && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-56 bg-primary text-white p-4 rounded-sm text-[10px] font-serif italic z-50 shadow-[0_20px_40px_rgba(0,0,0,0.3)] animate-in fade-in slide-in-from-bottom-2 duration-300 pointer-events-none border border-accent/30">
                <span className="text-accent block mb-1 font-sans font-black text-[8px] uppercase tracking-widest not-italic">Institutional Source</span>
                {book}
              </div>
            )}
            <div 
              className={`w-full max-w-[32px] transition-all duration-700 ease-out relative overflow-hidden rounded-t-[1px] ${
                activeIndex === idx 
                  ? 'bg-accent opacity-100 shadow-[0_-5px_20px_rgba(184,146,74,0.3)]' 
                  : 'bg-primary/10 opacity-40 group-hover/matrix:opacity-20'
              }`}
              style={{ height: `${finalHeight}%` }}
            >
               <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-black/10"></div>
            </div>
            <div className={`mt-4 transition-all duration-500 ${activeIndex === idx ? 'opacity-100 scale-110' : 'opacity-40 scale-100'}`}>
               <div className="w-1 h-1 bg-accent rounded-full mx-auto mb-2"></div>
               <div className="text-[8px] font-black text-primary uppercase tracking-tighter">BK-{String(idx + 1).padStart(2, '0')}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// --- Certificate Components ---

const CertificateModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
}> = ({ isOpen, onClose, course }) => {
  const [userName, setUserName] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const downloadCertificate = () => {
    const canvas = canvasRef.current;
    if (!canvas || !course) return;
    const link = document.createElement('a');
    link.download = `GTI_Certificate_${course.id}_${userName.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const drawCertificate = () => {
    const canvas = canvasRef.current;
    if (!canvas || !course) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = 1200;
    canvas.height = 848;
    ctx.fillStyle = '#fcfcfc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 40;
    ctx.strokeStyle = '#001a33';
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#b8924a';
    ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);
    ctx.fillStyle = '#001a33';
    ctx.font = 'bold 32px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('GLOBAL TRADING INSTITUTE', canvas.width / 2, 140);
    ctx.fillStyle = '#b8924a';
    ctx.font = '900 12px Inter';
    ctx.fillText('INSTITUTIONAL ACADEMIC DIVISION', canvas.width / 2, 165);
    ctx.fillStyle = '#001a33';
    ctx.font = 'italic 72px "Playfair Display"';
    ctx.fillText('Certificate of Completion', canvas.width / 2, 280);
    ctx.font = 'bold italic 64px "Playfair Display"';
    ctx.fillText(userName || '[CANDIDATE NAME]', canvas.width / 2, 450);
    ctx.font = 'bold 36px Inter';
    ctx.fillStyle = '#b8924a';
    ctx.fillText(course.title.toUpperCase(), canvas.width / 2, 590);
  };

  useEffect(() => {
    if (showPreview && isOpen && course) {
      const timer = setTimeout(drawCertificate, 100);
      return () => clearTimeout(timer);
    }
  }, [showPreview, userName, isOpen, course]);

  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-primary/95 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-4xl rounded-sm shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-marble">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-accent text-3xl">workspace_premium</span>
            <h2 className="font-display text-2xl font-bold text-primary">Academic Certification Terminal</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-accent transition-colors">
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>
        </div>
        <div className="p-10 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {!showPreview ? (
            <div className="max-w-md mx-auto py-12 text-center">
              <span className="material-symbols-outlined text-6xl text-accent mb-8">edit_square</span>
              <h3 className="text-2xl font-bold text-primary mb-4 tracking-tight">Enter Candidate Credentials</h3>
              <input 
                type="text" 
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Full Academic Name..."
                className="w-full bg-marble border-gray-100 p-4 text-center text-lg focus:border-accent focus:ring-0 rounded-sm mb-6"
                autoFocus
              />
              <button onClick={() => setShowPreview(true)} className="w-full bg-primary text-white py-5 rounded-sm font-black uppercase tracking-[0.4em] text-xs shadow-xl">Generate Preview</button>
            </div>
          ) : (
            <div className="space-y-10">
              <canvas ref={canvasRef} className="w-full h-auto border border-accent/20" style={{ aspectRatio: '1200/848' }} />
              <div className="flex gap-4 justify-center">
                <button onClick={() => setShowPreview(false)} className="px-12 py-5 border border-primary text-primary text-[10px] font-black uppercase tracking-[0.4em]">Edit</button>
                <button onClick={downloadCertificate} className="px-12 py-5 bg-accent text-white text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl">Download</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Library Components ---

const LibraryItemModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  item: LibraryItem | null;
}> = ({ isOpen, onClose, item }) => {
  if (!isOpen || !item) return null;
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-primary/95 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="flex flex-col md:flex-row h-full">
          <div className="md:w-1/2">
             <SmartImage src={item.coverImage} alt={item.title} prompt={item.visualPrompt} className="h-full" />
          </div>
          <div className="md:w-1/2 p-10 flex flex-col justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold text-primary mb-2 leading-tight">{item.title}</h2>
              <p className="text-gray-400 text-[10px] font-black uppercase mb-10">By {item.author} • {item.year}</p>
              <p className="text-gray-600 font-serif italic text-sm leading-relaxed">{item.description}</p>
            </div>
            <button onClick={onClose} className="w-full bg-primary text-white py-5 rounded-sm font-black uppercase tracking-[0.4em] text-[10px]">Close Abstract</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Helper Components ---

const Navbar: React.FC<{ onNavigate: (page: string) => void, currentPage: string }> = ({ onNavigate, currentPage }) => {
  return (
    <nav className="sticky top-0 z-50 bg-primary/98 border-b border-accent/20 px-4 md:px-8 py-4 md:py-6 shadow-2xl transition-all backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate('home')}>
          <div className="bg-accent/10 border border-accent/30 p-2 rounded shadow-inner">
            <span className="material-symbols-outlined text-accent text-2xl md:text-3xl">account_balance</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-white font-display text-lg md:text-2xl font-black leading-none tracking-tight">GLOBAL TRADING INSTITUTE</h1>
            <span className="text-accent text-[7px] md:text-[9px] uppercase font-black tracking-[0.4em] mt-1 opacity-80">Institutional Academic Standard</span>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-10">
          {['Curriculum', 'Library', 'Research', 'Portal'].map((item) => (
            <button
              key={item}
              onClick={() => onNavigate(item.toLowerCase())}
              className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:text-white pb-1.5 border-b-2 ${
                currentPage === item.toLowerCase() ? 'text-accent border-accent' : 'text-gray-400 border-transparent hover:border-accent/30'
              }`}
            >
              {item}
            </button>
          ))}
          <button onClick={() => onNavigate('admissions')} className="bg-accent hover:bg-yellow-700 text-white px-10 py-3 rounded-sm text-[11px] font-black uppercase tracking-[0.2em] shadow-xl">Enroll Now</button>
        </div>
      </div>
    </nav>
  );
};

const Footer: React.FC = () => (
  <footer className="bg-primary text-white border-t border-accent/20 pt-20 pb-14 mb-12">
    <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
      <div className="col-span-1">
        <div className="flex items-center gap-4 mb-8">
          <span className="material-symbols-outlined text-accent text-3xl">account_balance</span>
          <span className="font-display text-2xl font-bold tracking-tight">GTI Academic</span>
        </div>
        <p className="text-gray-400 text-sm leading-relaxed mb-10 font-serif italic">The global benchmark for financial market education.</p>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-8 pt-12 border-t border-white/5 text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">
      © 2024 GLOBAL TRADING INSTITUTE. THE WORLD STANDARD IN FINANCIAL EDUCATION.
    </div>
  </footer>
);

const AIAssistant: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{role: 'user' | 'model', text: string, grounding?: any[], image?: string}[]>([]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, isThinking]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsThinking(true);

        try {
            const ai = getAI();
            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: userMsg,
                config: {
                    systemInstruction: `You are the Global Trading Institute Dean of Studies. You provide elite academic insights.
                    
                    ACADEMIC MANDATE:
                    - You MUST perform real-time research via Google Search.
                    - Tone: Authority, Academic, Professional.
                    - If asked for a "visual" or "diagram" or "representation" of a concept, generate a visual.`,
                    tools: [{ googleSearch: {} }],
                    thinkingConfig: { thinkingBudget: 32768 }
                }
            });

            const text = response.text || "Synchronisation interrupted.";
            const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
            
            let generatedImage = undefined;
            if (text.toLowerCase().includes("visual") || text.toLowerCase().includes("image") || text.toLowerCase().includes("diagram")) {
              generatedImage = await generateInstitutionalVisual(text.slice(0, 200));
            }

            setMessages(prev => [...prev, { role: 'model', text, grounding, image: generatedImage }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'model', text: "Security synchronization failed." }]);
        } finally {
            setIsThinking(false);
        }
    };

    const renderMessageContent = (text: string) => {
      const parts = text.split(/(\[.*?\])/g);
      return parts.map((part, i) => {
        if (part.startsWith('[') && part.endsWith(']')) {
          const section = part.slice(1, -1).toLowerCase();
          const validSections = ['curriculum', 'library', 'research', 'portal', 'home', 'admissions'];
          if (validSections.includes(section)) {
            return (
              <button 
                key={i} 
                onClick={() => onNavigate(section)}
                className="text-accent font-black underline decoration-accent/30 hover:decoration-accent transition-all px-1 mx-0.5"
              >
                {part.slice(1, -1)}
              </button>
            );
          }
        }
        return part;
      });
    };

    return (
        <>
            <button onClick={() => setIsOpen(true)} className="fixed bottom-16 right-6 z-[60] bg-accent hover:bg-yellow-700 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all group">
                <span className="material-symbols-outlined text-3xl">neurology</span>
            </button>
            {isOpen && (
                <div className="fixed bottom-32 right-6 w-[calc(100vw-3rem)] md:w-[450px] h-[600px] max-h-[80vh] z-[70] bg-primary border border-accent/30 shadow-2xl flex flex-col overflow-hidden rounded-sm">
                    <div className="p-5 bg-secondary/50 border-b border-accent/20 flex justify-between items-center">
                        <h3 className="text-white font-display font-bold">Office of the Dean</h3>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white"><span className="material-symbols-outlined">close</span></button>
                    </div>
                    <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-6 bg-slate-950 custom-scrollbar">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[90%] p-5 rounded-sm text-sm leading-relaxed ${m.role === 'user' ? 'bg-accent/10 border border-accent/20 text-white font-serif italic' : 'bg-white/5 border border-white/10 text-gray-300'}`}>
                                    {renderMessageContent(m.text)}
                                    {m.image && (
                                      <div className="mt-4 rounded-sm overflow-hidden border border-accent/30 shadow-2xl">
                                        <img src={m.image} alt="AI Generated Visual" className="w-full h-auto" />
                                      </div>
                                    )}
                                    {m.grounding && (
                                      <div className="mt-4 pt-4 border-t border-white/10 space-y-1">
                                        {m.grounding.map((chunk, idx) => chunk.web && (
                                          <a key={idx} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="block text-[10px] text-gray-500 hover:text-accent truncate">
                                            • {chunk.web.title || chunk.web.uri}
                                          </a>
                                        ))}
                                      </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 bg-secondary/30 border-t border-accent/20">
                        <div className="flex gap-2">
                            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Academic query..." className="flex-grow bg-black/50 border border-white/10 p-3 text-white text-sm rounded-sm" />
                            <button onClick={handleSend} className="bg-accent text-white px-4 rounded-sm"><span className="material-symbols-outlined">send</span></button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

const EnrollmentModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  prefillMajor?: string; 
  prefillLevel?: string;
  prefillIntent?: string;
}> = ({ isOpen, onClose, prefillMajor, prefillLevel, prefillIntent }) => {
  const [formData, setFormData] = useState<EnrollmentData>({
    fullName: '', email: '', phone: '', intendedMajor: 'Forex Markets', currentLevel: 'Beginner', statementOfIntent: '', submissionDate: new Date().toISOString()
  });
  const [submitted, setSubmitted] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState('');
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({ ...prev, intendedMajor: prefillMajor || prev.intendedMajor, currentLevel: prefillLevel || prev.currentLevel, statementOfIntent: prefillIntent || '' }));
      setSubmitted(false);
    }
  }, [isOpen, prefillMajor, prefillLevel, prefillIntent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setConfirmationEmail("Institutional acknowledgment protocol synchronized. Welcome to GTI.");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-primary/95 backdrop-blur-sm" onClick={() => onClose()}></div>
      <div className={`relative bg-white w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden`}>
        <div className="p-10 border-b border-accent/20 flex justify-between items-center">
            <h2 className="font-display text-3xl font-bold text-primary">Academic Portal</h2>
            <button onClick={() => onClose()} className="text-gray-400 hover:text-accent"><span className="material-symbols-outlined text-3xl">close</span></button>
        </div>
        <div className="p-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
            {submitted ? (
                <div className="space-y-10 py-4 text-center">
                    <span className="material-symbols-outlined text-6xl text-accent">verified</span>
                    <h3 className="text-3xl font-display font-bold text-primary">Application Synchronized</h3>
                    <p className="font-serif italic text-sm">{confirmationEmail}</p>
                    <button onClick={() => onClose()} className="bg-primary text-white py-4 px-12 rounded-sm font-black uppercase tracking-[0.4em] text-[10px]">Close Terminal</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                    <input required placeholder="Full Name" name="fullName" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full border-gray-100" />
                    <input required placeholder="Secure Email" type="email" name="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border-gray-100" />
                    <textarea required placeholder="Statement of Intent" rows={6} value={formData.statementOfIntent} onChange={e => setFormData({...formData, statementOfIntent: e.target.value})} className="w-full border-gray-100" />
                    <button type="submit" className="w-full bg-primary text-white py-5 rounded-sm font-black uppercase tracking-[0.4em] text-xs">Submit Application</button>
                </form>
            )}
        </div>
      </div>
    </div>
  );
};

const HomePage: React.FC<{ onNavigate: (page: string, prefill?: any) => void }> = ({ onNavigate }) => (
  <div className="page-transition">
    <header className="relative h-[90vh] flex items-center overflow-hidden bg-primary">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/60 to-transparent z-10"></div>
        <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2070" alt="Finance Hall" className="w-full h-full object-cover opacity-60 mix-blend-overlay" />
        <div className="absolute inset-0 hero-texture z-0 opacity-40"></div>
      </div>
      <div className="relative z-20 max-w-7xl mx-auto px-8 w-full">
        <div className="max-w-5xl">
          <div className="inline-flex items-center gap-5 px-8 py-3 rounded-sm bg-accent/10 border border-accent/50 text-accent text-[11px] font-black uppercase tracking-[0.5em] mb-14 shadow-2xl">
            <span className="material-symbols-outlined text-xl">workspace_premium</span> Institutional Standard
          </div>
          <h1 className="font-display text-5xl md:text-9xl text-white font-bold leading-[0.9] mb-10 md:mb-14 tracking-tighter">Absolute <br/><span className="italic text-accent">Market Sovereignty</span></h1>
          <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-14 md:mb-20 max-w-3xl font-serif italic">Elite pathway for mastering the global flow of value.</p>
          <div className="flex gap-6">
            <button onClick={() => onNavigate('admissions')} className="bg-accent text-white px-12 py-5 rounded-sm font-black text-xs uppercase tracking-[0.5em]">Begin Application</button>
            <button onClick={() => onNavigate('curriculum')} className="bg-white/5 border border-white/20 text-white px-12 py-5 rounded-sm font-black text-xs uppercase tracking-[0.5em]">Explore Catalog</button>
          </div>
        </div>
      </div>
    </header>

    <section className="py-24 md:py-40 bg-marble relative">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-24">
            <span className="text-accent font-black uppercase tracking-[0.4em] text-[12px] mb-8 block">THE ACADEMIC JOURNEY</span>
            <h2 className="font-display text-6xl md:text-[84px] font-bold text-primary mb-12 tracking-tight leading-none">Structured Mastery</h2>
            <div className="flex items-start">
               <div className="w-[1.5px] h-24 bg-accent/30 mr-10 mt-2 self-stretch"></div>
               <p className="text-gray-500 text-2xl md:text-3xl leading-relaxed font-serif italic max-w-4xl">Our curriculum is designed to bridge the gap between academic theory and market execution.</p>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {COURSES.map((course) => (
            <div key={course.id} className="group bg-white rounded-none border border-gray-100 hover:border-accent/50 hover:shadow-2xl transition-all flex flex-col">
              <div className="h-64 relative">
                <SmartImage src={course.image} alt={course.title} prompt={course.visualPrompt} className="h-full" autoGenerate />
                <div className="absolute top-0 right-0">
                  <span className="bg-primary text-white px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.25em]">{course.level.toUpperCase()}</span>
                </div>
              </div>
              <div className="p-10 flex-grow">
                <p className="text-[10px] font-black text-accent uppercase tracking-[0.4em] mb-5">{course.id}</p>
                <h3 className="font-display text-2xl font-bold text-primary mb-8 leading-tight">{course.title}</h3>
                <button onClick={() => onNavigate('curriculum')} className="w-full text-[10px] font-black uppercase tracking-[0.4em] text-primary flex items-center justify-center gap-4 border-t border-gray-100 pt-8 group-hover:text-accent">View Track Details <span className="material-symbols-outlined">expand_circle_right</span></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-24 md:py-40 bg-primary text-white">
      <div className="max-w-7xl mx-auto px-8">
        <h2 className="font-display text-5xl md:text-7xl font-bold mb-12">Elite Faculty</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {FACULTY.map(f => (
            <div key={f.name} className="flex flex-col xl:flex-row gap-12 items-stretch group bg-white/5 p-10 border border-white/5 hover:border-accent/30 transition-all">
              <div className="w-full xl:w-64 flex-shrink-0">
                <SmartImage src={f.image} alt={f.name} prompt={f.visualPrompt} className="aspect-square grayscale group-hover:grayscale-0" autoGenerate />
              </div>
              <div className="flex-grow space-y-6">
                <div>
                  <h4 className="text-white font-display text-4xl font-bold mb-2">{f.name}</h4>
                  <p className="text-accent text-xs font-black uppercase tracking-[0.4em]">{f.title}</p>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed font-serif italic">{f.bio}</p>
                <button onClick={() => onNavigate('admissions')} className="bg-accent text-white py-4 px-10 text-[10px] font-black uppercase tracking-widest rounded-sm">Schedule Meeting</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

const CurriculumPage: React.FC<{ 
  onEnroll: (major: string, level: string) => void;
  onRequestCertificate: (course: Course) => void;
}> = ({ onEnroll, onRequestCertificate }) => {
  return (
    <div className="py-24 md:py-40 max-w-7xl mx-auto px-8 page-transition">
      <h2 className="font-display text-5xl md:text-8xl font-bold text-primary mb-12 tracking-tighter">Academic Directory</h2>
      <div className="space-y-32">
        {COURSES.map((course, idx) => (
          <div key={course.id} className={`flex flex-col ${idx % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-16 md:gap-24 items-start`}>
            <div className="lg:w-1/2 relative">
              <SmartImage src={course.image} alt={course.title} prompt={course.visualPrompt} className="aspect-video shadow-2xl" autoGenerate />
              <div className="absolute top-8 right-8 flex flex-col items-end gap-2">
                <span className="bg-primary text-white px-6 py-2 text-[10px] font-black uppercase tracking-[0.4em]">{course.level}</span>
                <span className="bg-accent text-white px-6 py-2 text-[10px] font-black uppercase tracking-[0.4em]">{course.credits} Credits</span>
              </div>
            </div>
            <div className="lg:w-1/2">
              <p className="text-accent font-black text-[10px] uppercase mb-6">{course.id}</p>
              <h3 className="font-display text-4xl md:text-5xl font-bold text-primary mb-8 tracking-tight">{course.title}</h3>
              <p className="text-gray-600 text-lg md:text-xl font-serif italic mb-12">{course.description}</p>
              <div className="flex gap-4 items-center">
                <button onClick={() => onRequestCertificate(course)} className="px-6 py-4 border border-accent text-accent text-[10px] font-black uppercase hover:bg-accent hover:text-white transition-all">Get Certificate</button>
                <button onClick={() => onEnroll(course.title, course.level)} className="bg-primary text-white px-8 py-4 text-[10px] font-black uppercase shadow-xl">Enroll Now</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LibraryPage: React.FC<{ onItemClick: (item: LibraryItem) => void }> = ({ onItemClick }) => (
  <div className="py-24 md:py-40 max-w-7xl mx-auto px-8 page-transition">
    <h2 className="font-display text-5xl md:text-8xl font-bold text-primary mb-12 tracking-tighter">The GTI Library</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
      {LIBRARY_ITEMS.map((item) => (
        <div key={item.id} className="group cursor-pointer transition-all duration-300" onClick={() => onItemClick(item)}>
          <div className="relative aspect-[3/4] mb-8 overflow-hidden bg-gray-100 shadow-2xl group-hover:-translate-y-2">
            <SmartImage src={item.coverImage} alt={item.title} prompt={item.visualPrompt} className="h-full" autoGenerate />
            <div className="absolute bottom-8 left-8 right-8">
              <span className="bg-accent text-white px-4 py-1.5 text-[9px] font-black uppercase inline-block mb-3 shadow-xl">{item.type}</span>
              <h3 className="text-white font-display text-xl font-bold leading-tight">{item.title}</h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ResearchLab: React.FC = () => {
    const [urls, setUrls] = useState<string[]>(['']);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [results, setResults] = useState<{url: string, analysis: string}[]>([]);
    const addUrl = () => setUrls([...urls, '']);
    const updateUrl = (i: number, val: string) => { const next = [...urls]; next[i] = val; setUrls(next); };
    const analyzeBatch = async () => {
        const valid = urls.filter(u => u.trim());
        if (valid.length === 0) return;
        setIsAnalyzing(true);
        setResults([]);
        try {
            const ai = getAI();
            const tempResults: {url: string, analysis: string}[] = [];
            for (const url of valid) {
                const response = await ai.models.generateContent({
                    model: 'gemini-3-pro-preview',
                    contents: `Analyze: ${url}`,
                    config: { systemInstruction: "Senior Quantitative Analyst.", thinkingConfig: { thinkingBudget: 32768 } }
                });
                tempResults.push({ url, analysis: response.text || "No signal." });
                setResults([...tempResults]);
            }
        } catch (error) { console.error(error); } finally { setIsAnalyzing(false); }
    };
    return (
        <div className="py-24 md:py-40 max-w-7xl mx-auto px-8 page-transition">
            <h2 className="font-display text-5xl md:text-8xl font-bold text-primary mb-12 tracking-tighter">Research Terminal</h2>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div className="lg:col-span-4 p-8 bg-primary rounded-sm shadow-2xl">
                    <div className="space-y-4 mb-8">
                        {urls.map((url, i) => (
                            <input key={i} value={url} onChange={e => updateUrl(i, e.target.value)} placeholder="Stream URL..." className="w-full bg-black/50 border border-white/10 p-3 text-white text-[11px]" />
                        ))}
                    </div>
                    <button onClick={addUrl} className="text-accent text-[10px] font-black uppercase mb-6 block">Add Source</button>
                    <button onClick={analyzeBatch} disabled={isAnalyzing} className="w-full bg-accent text-white py-5 rounded-sm font-black uppercase text-[10px]">{isAnalyzing ? "Processing..." : "Start Analysis"}</button>
                </div>
                <div className="lg:col-span-8 bg-white border border-gray-100 p-12 space-y-12">
                    {results.map((r, i) => (
                        <div key={i} className="animate-in slide-in-from-bottom-4 bg-marble p-8 border-l-4 border-accent/40">
                            <p className="text-[9px] font-black uppercase text-gray-400 mb-4">Source: {r.url}</p>
                            <div className="font-serif italic text-lg text-gray-700 whitespace-pre-wrap">{r.analysis}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- Main App ---

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
  const [selectedCourseForCertificate, setSelectedCourseForCertificate] = useState<Course | null>(null);
  const [selectedLibraryItem, setSelectedLibraryItem] = useState<LibraryItem | null>(null);
  const [modalPrefills, setModalPrefills] = useState<{ major?: string; level?: string; intent?: string }>({});

  const handleNavigate = (page: string, prefill?: { major?: string; level?: string; intent?: string }) => {
    if (page === 'admissions') { setModalPrefills(prefill || {}); setIsModalOpen(true); } 
    else { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  };
  const handleEnroll = (title: string, level: string) => handleNavigate('admissions', { major: title, level });
  const handleRequestCertificate = (course: Course) => { setSelectedCourseForCertificate(course); setIsCertificateModalOpen(true); };
  const handleLibraryItemClick = (item: LibraryItem) => { setSelectedLibraryItem(item); setIsLibraryModalOpen(true); };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-accent selection:text-white bg-marble">
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} />
      <main className="flex-grow">
        {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
        {currentPage === 'curriculum' && <CurriculumPage onEnroll={handleEnroll} onRequestCertificate={handleRequestCertificate} />}
        {currentPage === 'library' && <LibraryPage onItemClick={handleLibraryItemClick} />}
        {currentPage === 'research' && <ResearchLab />}
        {currentPage === 'portal' && (
          <div className="h-[90vh] flex flex-col items-center justify-center text-center px-10">
            <span className="material-symbols-outlined text-8xl text-accent mb-12">lock_person</span>
            <h2 className="font-display text-6xl font-bold mb-10">Institutional Clearance Required</h2>
          </div>
        )}
      </main>
      <AIAssistant onNavigate={handleNavigate} />
      <LiveStockTicker />
      <Footer />
      <EnrollmentModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setModalPrefills({}); }} prefillMajor={modalPrefills.major} prefillLevel={modalPrefills.level} prefillIntent={modalPrefills.intent} />
      <CertificateModal isOpen={isCertificateModalOpen} onClose={() => setIsCertificateModalOpen(false)} course={selectedCourseForCertificate} />
      <LibraryItemModal isOpen={isLibraryModalOpen} onClose={() => setIsLibraryModalOpen(false)} item={selectedLibraryItem} />
    </div>
  );
};

export default App;
