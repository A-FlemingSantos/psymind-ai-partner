import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronLeft, 
  Share, 
  Trash2, 
  Type, 
  X, 
  Bold, 
  Italic, 
  List, 
  Code, 
  Plus, 
  FilePlus,
  MoreHorizontal,
  Bot,
  CornerDownLeft,
  Loader2,
  Copy,
  ThumbsUp,
  ArrowLeft,
  Eye,
  PenLine,
  FileSearch,
  FileText,
  FileSpreadsheet,
  FileChartPie,
  File,
  MessageCircle,
  Image as ImageIcon,
  Music,
  Video,
  FileIcon,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  Download,
  Maximize2,
  Minimize2,
  ChevronLeft as PrevIcon,
  ChevronRight as NextIcon,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Grid,
  List as ListIcon,
  Search
} from 'lucide-react';
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Separator } from "@/shared/components/ui/separator";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/shared/components/ui/select";
import { cn } from "@/shared/utils";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Slider } from "@/shared/components/ui/slider"; 
// Importação atualizada para usar o serviço específico do Editor
import { sendMessageToEditor, ChatMessage } from '@/shared/utils/gemini-editor';
import { PdfViewer } from '@/features/workspace';

interface UploadedFile {
  id: string;
  name: string;
  type: 'pdf' | 'text' | 'image' | 'audio' | 'video' | 'other';
  file: File; 
  previewUrl?: string;
}

const Editor: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Título do Documento
  const [title, setTitle] = useState("Página sem título");
  
  useEffect(() => {
    if (location.state?.initialTitle) {
      setTitle(location.state.initialTitle);
    }
  }, [location.state]);

  // Conteúdo do Editor
  const [content, setContent] = useState("");
  const [isPreviewMode, setIsPreviewMode] = useState(false); 
  
  // Estados do Sidebar e Chat
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sidebarView, setSidebarView] = useState<'chat' | 'sources'>('chat'); 

  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  
  // Tab System State
  const [openFiles, setOpenFiles] = useState<string[]>(['main']); 
  const [activeTabId, setActiveTabId] = useState<string>('main');

  // Viewer Specific States
  const [imageZoom, setImageZoom] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [textTheme, setTextTheme] = useState<'light' | 'dark'>('light');
  const [textContent, setTextContent] = useState<string>(""); 
  const [isLoadingText, setIsLoadingText] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); 

  // Auto-scroll para a última mensagem
  useEffect(() => {
    if (isSidebarOpen && sidebarView === 'chat' && hasStartedChat) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isSidebarOpen, hasStartedChat, sidebarView]);

  // Effect to load text content when active tab changes to a text file
  useEffect(() => {
    const loadTextContent = async () => {
      const activeFile = uploadedFiles.find(f => f.id === activeTabId);
      if (activeFile && (activeFile.type === 'text' || activeFile.type === 'other') && activeFile.previewUrl) {
        setIsLoadingText(true);
        try {
          const response = await fetch(activeFile.previewUrl);
          const text = await response.text();
          setTextContent(text);
        } catch (error) {
          console.error("Error reading text file:", error);
          setTextContent("Erro ao carregar conteúdo do arquivo.");
        } finally {
          setIsLoadingText(false);
        }
      } else {
        setTextContent("");
      }
    };

    if (activeTabId !== 'main') {
        loadTextContent();
    }
  }, [activeTabId, uploadedFiles]);

  const handleToolbarAction = (e: React.MouseEvent, action: string) => {
    e.preventDefault();
    const textarea = document.getElementById('editor-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    let newText = content;
    let insertion = '';

    switch (action) {
      case 'bold': insertion = `**${selectedText || 'texto em negrito'}**`; break;
      case 'italic': insertion = `*${selectedText || 'texto em itálico'}*`; break;
      case 'list': insertion = `\n- ${selectedText || 'item da lista'}`; break;
      case 'code': insertion = `\`${selectedText || 'código'}\``; break;
    }

    if (insertion) {
      newText = content.substring(0, start) + insertion + content.substring(end);
      setContent(newText);
    }
  };

  // Função para aplicar o texto da IA ao editor
  const handleApplyToEditor = (text: string) => {
    setContent(text);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: chatInput };
    setMessages(prev => [...prev, userMessage]);
    setChatInput("");
    setHasStartedChat(true);
    setIsTyping(true);

    try {
      const responseText = await sendMessageToEditor(messages, userMessage.content, content);
      const aiMessage: ChatMessage = { role: 'ai', content: responseText };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      const errorMessage: ChatMessage = { role: 'ai', content: "Desculpe, ocorreu um erro ao processar sua solicitação." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Função para abrir a sidebar de fontes
  const openSources = () => {
    setSidebarView('sources');
    setIsSidebarOpen(true);
  };

  // Função para alternar o chat
  const toggleChat = () => {
    if (isSidebarOpen && sidebarView === 'chat') {
      setIsSidebarOpen(false);
    } else {
      setSidebarView('chat');
      setIsSidebarOpen(true);
    }
  };

  // Handler para acionar o input de arquivo
  const handleAddSourcesClick = () => {
    fileInputRef.current?.click();
  };

  // Handler (opcional) para quando um arquivo é selecionado
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles: UploadedFile[] = Array.from(files)
        .map(file => {
          let type: UploadedFile['type'] = 'other';
          if (file.type === 'application/pdf') type = 'pdf';
          else if (file.type.startsWith('text/') || file.name.endsWith('.md') || file.name.endsWith('.txt') || file.name.endsWith('.json') || file.name.endsWith('.js') || file.name.endsWith('.ts')) type = 'text';
          else if (file.type.startsWith('image/')) type = 'image';
          else if (file.type.startsWith('audio/')) type = 'audio';
          else if (file.type.startsWith('video/')) type = 'video';
          
          return {
            id: Math.random().toString(36).substring(2, 9),
            name: file.name,
            type,
            file,
            previewUrl: URL.createObjectURL(file)
          };
        });
      
      setUploadedFiles(prev => [...prev, ...newFiles]);
      event.target.value = '';
    }
  };

  const handleRemoveFile = (id: string) => {
    setUploadedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove?.previewUrl) {
        URL.revokeObjectURL(fileToRemove.previewUrl);
      }
      return prev.filter(f => f.id !== id);
    });
    
    if (openFiles.includes(id)) {
      handleCloseTab(id);
    }
  };

  const handleOpenFile = (fileId: string) => {
    if (!openFiles.includes(fileId)) {
      setOpenFiles(prev => [...prev, fileId]);
    }
    setActiveTabId(fileId);
    // Reset states
    setImageZoom(1);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleCloseTab = (tabId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (tabId === 'main') return; 

    const newOpenFiles = openFiles.filter(id => id !== tabId);
    setOpenFiles(newOpenFiles);

    if (activeTabId === tabId) {
      const index = openFiles.indexOf(tabId);
      const newActiveId = newOpenFiles[index - 1] || 'main';
      setActiveTabId(newActiveId);
    }
  };

  const getFileIcon = (type: UploadedFile['type']) => {
    switch (type) {
      case 'pdf':
      case 'text': return <FileText size={20} />;
      case 'image': return <ImageIcon size={20} />;
      case 'audio': return <Music size={20} />;
      case 'video': return <Video size={20} />;
      default: return <File size={20} />;
    }
  };

  const getFileColorClass = (type: UploadedFile['type']) => {
    switch (type) {
      case 'pdf': return 'bg-red-50 dark:bg-red-900/20 text-red-500';
      case 'text': return 'bg-blue-50 dark:bg-blue-900/20 text-blue-500';
      case 'image': return 'bg-purple-50 dark:bg-purple-900/20 text-purple-500';
      case 'audio': return 'bg-pink-50 dark:bg-pink-900/20 text-pink-500';
      case 'video': return 'bg-orange-50 dark:bg-orange-900/20 text-orange-500';
      default: return 'bg-gray-50 dark:bg-gray-900/20 text-gray-500';
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // --- Custom Viewers ---

  const renderImageViewer = (file: UploadedFile) => (
    <div className="flex flex-col h-full bg-zinc-50/50 dark:bg-zinc-950/50 rounded-xl overflow-hidden shadow-sm border border-border/50 m-4 relative group">
      <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-black/70 backdrop-blur-md text-white rounded-full p-1.5 flex gap-2 shadow-lg">
          <button onClick={() => setImageZoom(z => Math.max(0.1, z - 0.1))} className="p-1.5 hover:bg-white/20 rounded-full transition-colors"><ZoomOut size={16} /></button>
          <span className="text-xs font-medium w-8 flex items-center justify-center">{Math.round(imageZoom * 100)}%</span>
          <button onClick={() => setImageZoom(z => Math.min(3, z + 0.1))} className="p-1.5 hover:bg-white/20 rounded-full transition-colors"><ZoomIn size={16} /></button>
          <div className="w-px bg-white/20 my-1 mx-0.5"></div>
          <button onClick={() => window.open(file.previewUrl, '_blank')} className="p-1.5 hover:bg-white/20 rounded-full transition-colors"><Download size={16} /></button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto flex items-center justify-center p-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat">
        <div 
          className="relative shadow-2xl rounded-lg overflow-hidden transition-transform duration-200 ease-out"
          style={{ transform: `scale(${imageZoom})` }}
        >
          <img 
            src={file.previewUrl} 
            alt={file.name} 
            className="max-w-full max-h-[80vh] object-contain" 
          />
        </div>
      </div>
      <div className="bg-card/80 backdrop-blur-sm border-t border-border p-2 text-center text-xs text-muted-foreground">
        {file.name}
      </div>
    </div>
  );

  const renderAudioViewer = (file: UploadedFile) => {
    const toggleAudio = () => {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    };

    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
        setDuration(audioRef.current.duration || 0);
      }
    };

    const handleSeek = (value: number[]) => {
      if (audioRef.current) {
        audioRef.current.currentTime = value[0];
        setCurrentTime(value[0]);
      }
    };

    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 p-8 m-4 rounded-xl border border-border/50">
        <div className="bg-card w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl border border-white/50 dark:border-zinc-800 flex flex-col items-center gap-8 relative overflow-hidden">
          
          {/* Custom Visualizer Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-pink-500/5 to-transparent pointer-events-none"></div>
          
          {/* Album Art / Visualizer */}
          <div className="relative group cursor-pointer" onClick={toggleAudio}>
            <div className={cn(
              "w-56 h-56 rounded-full bg-gradient-to-br from-pink-100 to-orange-100 dark:from-pink-900/30 dark:to-orange-900/20 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)] transition-all duration-700 ease-in-out",
              isPlaying && "scale-105 shadow-[0_0_40px_rgba(236,72,153,0.2)]"
            )}>
              <div className={cn("w-48 h-48 rounded-full bg-card flex items-center justify-center shadow-sm z-10 transition-transform", isPlaying && "scale-95")}>
                 <Music size={64} className={cn("text-pink-400 transition-colors duration-500", isPlaying ? "text-pink-500" : "text-pink-300")} />
              </div>
              {/* Simulated Waveform Ring */}
              <div className={cn("absolute inset-0 rounded-full border-[3px] border-pink-500/20 border-dashed animate-spin-slow", isPlaying ? "opacity-100" : "opacity-0")}></div>
            </div>
          </div>

          {/* Track Info */}
          <div className="text-center space-y-2 z-10 w-full px-4">
            <h3 className="font-serif text-2xl font-semibold text-foreground truncate w-full" title={file.name}>
              {file.name}
            </h3>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Audio Preview</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full space-y-2 z-10">
            <Slider 
              value={[currentTime]} 
              max={duration || 100} 
              step={1} 
              onValueChange={handleSeek}
              className="cursor-pointer" 
            />
            <div className="flex justify-between text-[10px] font-medium text-muted-foreground tabular-nums">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration || 0)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-8 z-10">
             <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
               <PrevIcon size={24} />
             </Button>
             <Button 
                size="icon" 
                className="h-16 w-16 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black shadow-xl hover:scale-105 transition-all active:scale-95"
                onClick={toggleAudio}
             >
               {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
             </Button>
             <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
               <NextIcon size={24} />
             </Button>
          </div>

          <audio 
            ref={audioRef} 
            src={file.previewUrl} 
            className="hidden" 
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)} 
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
          />
        </div>
      </div>
    );
  };

  const renderVideoViewer = (file: UploadedFile) => {
    const toggleVideo = () => {
      if (videoRef.current) {
        if (isPlaying) videoRef.current.pause();
        else videoRef.current.play();
        setIsPlaying(!isPlaying);
      }
    };

    const handleTimeUpdate = () => {
      if (videoRef.current) {
        setCurrentTime(videoRef.current.currentTime);
        setDuration(videoRef.current.duration || 0);
      }
    };

    const handleSeek = (value: number[]) => {
      if (videoRef.current) {
        videoRef.current.currentTime = value[0];
        setCurrentTime(value[0]);
      }
    };

    return (
      <div className="flex flex-col h-full bg-zinc-950 m-4 rounded-xl overflow-hidden shadow-2xl border border-zinc-800 relative group">
        {/* Custom Header Overlay */}
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-between items-center pointer-events-none">
          <span className="text-sm font-medium text-white/90 truncate shadow-sm pointer-events-auto">{file.name}</span>
          <div className="flex gap-2 pointer-events-auto">
            <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-white/10 h-8 w-8" onClick={() => window.open(file.previewUrl, '_blank')}>
              <Download size={16} />
            </Button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center bg-black relative cursor-pointer" onClick={toggleVideo}>
          <video 
            ref={videoRef}
            src={file.previewUrl} 
            className="max-w-full max-h-full shadow-lg"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleTimeUpdate}
            controls={false} 
          />
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 shadow-2xl transition-transform hover:scale-110">
                <Play size={40} fill="white" className="text-white ml-2" />
              </div>
            </div>
          )}
        </div>

        {/* Custom Controls Bar */}
        <div className="bg-zinc-900 border-t border-zinc-800 p-4 flex items-center gap-4 z-20">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleVideo}
            className="text-white hover:bg-white/10 hover:text-white shrink-0"
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
          </Button>
          
          <div className="flex-1 flex items-center gap-2">
             <span className="text-[10px] text-zinc-400 tabular-nums w-10 text-right">{formatTime(currentTime)}</span>
             <Slider 
               value={[currentTime]} 
               max={duration || 100} 
               step={1} 
               onValueChange={handleSeek}
               className="cursor-pointer" 
             />
             <span className="text-[10px] text-zinc-400 tabular-nums w-10">{formatTime(duration || 0)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-zinc-400 shrink-0">
            <Volume2 size={18} />
            <div className="w-20">
               <Slider defaultValue={[80]} max={100} step={1} />
            </div>
          </div>

          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white shrink-0" onClick={() => videoRef.current?.requestFullscreen()}>
            <Maximize2 size={18} />
          </Button>
        </div>
      </div>
    );
  };

  const renderTextViewer = (file: UploadedFile) => (
    <div className={cn("flex flex-col h-full m-4 rounded-xl overflow-hidden border border-border shadow-sm transition-colors duration-300", textTheme === 'dark' ? "bg-[#1e1e1e]" : "bg-white")}>
      <div className={cn("flex items-center justify-between px-6 py-3 border-b transition-colors duration-300", textTheme === 'dark' ? "bg-[#252526] border-[#333]" : "bg-zinc-50 border-border")}>
        <div className="flex items-center gap-2">
          <FileIcon size={16} className="text-blue-500" />
          <span className={cn("text-sm font-mono", textTheme === 'dark' ? "text-zinc-400" : "text-zinc-600")}>{file.name}</span>
        </div>
        <div className="flex gap-2 items-center">
           <div className="flex bg-black/5 dark:bg-white/5 rounded-lg p-0.5">
             <button 
               onClick={() => setTextTheme('light')}
               className={cn("p-1.5 rounded-md transition-all", textTheme === 'light' ? "bg-white shadow-sm text-yellow-600" : "text-muted-foreground hover:text-foreground")}
             >
               <Sun size={14} />
             </button>
             <button 
               onClick={() => setTextTheme('dark')}
               className={cn("p-1.5 rounded-md transition-all", textTheme === 'dark' ? "bg-zinc-700 shadow-sm text-blue-400" : "text-muted-foreground hover:text-foreground")}
             >
               <Moon size={14} />
             </button>
           </div>
           <Separator orientation="vertical" className="h-4 mx-1" />
           <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.open(file.previewUrl, '_blank')}>
             <Download size={14} />
           </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto flex relative">
        {/* Line Numbers Simulation */}
        <div className={cn("w-12 py-8 flex flex-col items-end pr-4 font-mono text-xs select-none opacity-50 border-r", textTheme === 'dark' ? "bg-[#1e1e1e] border-[#333] text-zinc-600" : "bg-zinc-50 border-border text-zinc-400")}>
          {Array.from({length: 50}).map((_, i) => <div key={i} className="leading-relaxed">{i + 1}</div>)}
        </div>
        
        <div className={cn("flex-1 p-8 font-mono text-sm leading-relaxed overflow-auto whitespace-pre-wrap", textTheme === 'dark' ? "text-zinc-300" : "text-zinc-800")}>
          {isLoadingText ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="animate-spin text-muted-foreground" />
            </div>
          ) : (
            textContent || <span className="opacity-50 italic">Arquivo vazio ou impossível de ler.</span>
          )}
        </div>
      </div>
    </div>
  );

  const renderFileViewer = () => {
    const activeFile = uploadedFiles.find(f => f.id === activeTabId);
    
    if (!activeFile) return <div className="flex items-center justify-center h-full text-muted-foreground">Arquivo não encontrado</div>;

    switch (activeFile.type) {
      case 'image': return renderImageViewer(activeFile);
      case 'audio': return renderAudioViewer(activeFile);
      case 'video': return renderVideoViewer(activeFile);
      case 'pdf': return <PdfViewer url={activeFile.previewUrl || ""} fileName={activeFile.name} />;
      case 'text': return renderTextViewer(activeFile);
      default: return (
        <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
          <File size={64} strokeWidth={1} />
          <p>Pré-visualização não disponível para este tipo de arquivo.</p>
          <Button variant="outline" onClick={() => window.open(activeFile.previewUrl, '_blank')}>
            Baixar Arquivo
          </Button>
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen bg-background font-sans text-foreground overflow-hidden">
      
      {/* Main Area (Editor + Tabs + Viewer) */}
      <div className="flex-1 flex flex-col h-full transition-all duration-300 relative min-w-0">
        
        {/* Top Header */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-border/40 shrink-0">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/workspace')}
              className="text-muted-foreground hover:text-foreground shrink-0"
            >
              <ChevronLeft size={20} />
            </Button>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-serif font-semibold bg-transparent border-none shadow-none focus-visible:ring-0 px-0 h-auto w-full max-w-md placeholder:text-muted-foreground/50 truncate"
              placeholder="Página sem título"
            />
          </div>

          <div className="flex items-center gap-1 text-muted-foreground shrink-0 ml-2">
            <Button variant="ghost" size="sm" className="gap-2 h-9 px-3 text-xs font-medium hidden sm:flex">
              <FilePlus size={16} />
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 h-9 px-3 text-xs font-medium">
              <Share size={16} />
              <span className="hidden sm:inline">Compartilhar</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive/80 hover:text-destructive">
              <Trash2 size={16} />
            </Button>
            <Separator orientation="vertical" className="h-6 mx-2" />
            
            {/* Botão Alternável: Fontes <-> Conversa */}
            {sidebarView === 'sources' && isSidebarOpen ? (
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2 h-9 px-3 text-xs font-medium bg-accent text-accent-foreground"
                onClick={toggleChat}
              >
                <MessageCircle size={16} />
                <span className="hidden sm:inline">Conversa</span>
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn("gap-2 h-9 px-3 text-xs font-medium", sidebarView === 'sources' && isSidebarOpen && "bg-accent text-accent-foreground")}
                onClick={openSources}
              >
                <FileSearch size={16} />
                <span className="hidden sm:inline">Fontes</span>
              </Button>
            )}

            <Button 
              variant="ghost" 
              size="icon" 
              className={cn("h-9 w-9 ml-2 transition-colors", isSidebarOpen && sidebarView === 'chat' && "bg-accent text-accent-foreground")}
              onClick={toggleChat}
            >
              {isSidebarOpen && sidebarView === 'chat' ? <MoreHorizontal size={18} /> : <Bot size={18} />}
            </Button>
          </div>
        </header>

        {/* Tabs Bar */}
        <div className="flex items-center px-2 border-b border-border/40 bg-muted/10 overflow-x-auto no-scrollbar shrink-0 h-10">
          <div 
            onClick={() => setActiveTabId('main')}
            className={cn(
              "flex items-center gap-2 px-4 h-full text-xs font-medium border-r border-border/20 cursor-pointer transition-colors min-w-[120px] max-w-[200px]",
              activeTabId === 'main' 
                ? "bg-background text-foreground border-t-2 border-t-orange-500" 
                : "text-muted-foreground hover:bg-muted/20 hover:text-foreground"
            )}
          >
            <PenLine size={14} className="shrink-0" />
            <span className="truncate">Documento Principal</span>
          </div>

          {openFiles.map(fileId => {
            if (fileId === 'main') return null;
            const file = uploadedFiles.find(f => f.id === fileId);
            if (!file) return null;

            return (
              <div 
                key={file.id}
                onClick={() => setActiveTabId(file.id)}
                className={cn(
                  "flex items-center gap-2 px-4 h-full text-xs font-medium border-r border-border/20 cursor-pointer transition-colors group min-w-[120px] max-w-[200px]",
                  activeTabId === file.id 
                    ? "bg-background text-foreground border-t-2 border-t-orange-500" 
                    : "text-muted-foreground hover:bg-muted/20 hover:text-foreground"
                )}
              >
                <span className="shrink-0 opacity-70">{getFileIcon(file.type)}</span>
                <span className="truncate">{file.name}</span>
                <button 
                  onClick={(e) => handleCloseTab(file.id, e)}
                  className="ml-auto p-0.5 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Content Area: Editor OR Viewer */}
        <div className="flex-1 overflow-hidden relative bg-background">
          {activeTabId === 'main' ? (
            <div className="flex flex-col h-full">
              {/* Toolbar (Only visible in Editor Mode) */}
              <div className="px-6 py-3 border-b border-border/40 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar shrink-0 bg-background">
                <div className="flex items-center gap-2">
                  <Select defaultValue="paragraph">
                    <SelectTrigger className="w-[120px] h-8 border-none bg-transparent focus:ring-0 text-xs font-medium text-muted-foreground hover:bg-accent/50">
                      <SelectValue placeholder="Estilo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paragraph">Parágrafo</SelectItem>
                      <SelectItem value="h1">Título 1</SelectItem>
                      <SelectItem value="h2">Título 2</SelectItem>
                      <SelectItem value="h3">Título 3</SelectItem>
                    </SelectContent>
                  </Select>

                  <Separator orientation="vertical" className="h-5" />

                  <div className="flex items-center gap-0.5">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => handleToolbarAction(e, 'bold')} title="Negrito (**texto**)">
                      <Bold size={14} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => handleToolbarAction(e, 'italic')} title="Itálico (*texto*)">
                      <Italic size={14} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => handleToolbarAction(e, 'list')} title="Lista (- item)">
                      <List size={14} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => handleToolbarAction(e, 'code')} title="Código (`código`)">
                      <Code size={14} />
                    </Button>
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn("gap-2 h-8 text-xs font-medium", isPreviewMode && "bg-accent text-accent-foreground")}
                  onClick={() => setIsPreviewMode(!isPreviewMode)}
                >
                  {isPreviewMode ? (
                    <>
                      <PenLine size={14} />
                      Editar
                    </>
                  ) : (
                    <>
                      <Eye size={14} />
                      Visualizar
                    </>
                  )}
                </Button>
              </div>

              {/* Editor Canvas */}
              <div className="flex-1 overflow-y-auto bg-background">
                <div className="max-w-3xl mx-auto py-12 px-8 min-h-full">
                  {isPreviewMode ? (
                    <div className="prose prose-lg prose-zinc dark:prose-invert max-w-none prose-headings:font-serif prose-p:leading-relaxed cursor-text min-h-[60vh]" onClick={() => setIsPreviewMode(false)}>
                      {content ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {content}
                        </ReactMarkdown>
                      ) : (
                        <span className="text-muted-foreground/40">Nada para visualizar...</span>
                      )}
                    </div>
                  ) : (
                    <textarea
                      id="editor-textarea"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Começar a digitar... (Use Markdown para formatar)"
                      className="w-full h-full min-h-[60vh] bg-transparent resize-none border-none outline-none text-base leading-relaxed placeholder:text-muted-foreground/40 focus:ring-0 font-mono text-sm md:text-base"
                    />
                  )}
                </div>
              </div>
            </div>
          ) : (
            // Viewer Mode
            renderFileViewer()
          )}
        </div>
      </div>

      {/* Right Chat Sidebar */}
      {isSidebarOpen && (
        <div className="w-[400px] border-l border-border bg-card/50 backdrop-blur-sm flex flex-col h-full animate-in slide-in-from-right-10 duration-300 shadow-xl z-10 shrink-0">
          
          {/* VIEW: SOURCES */}
          {sidebarView === 'sources' ? (
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-border/40 bg-background/50">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsSidebarOpen(false)}
                  className="text-muted-foreground hover:text-foreground h-8 w-8"
                >
                  <X size={18} />
                </Button>
                <span className="text-sm font-medium text-foreground">Fontes</span>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={handleAddSourcesClick}>
                  <Plus size={18} />
                </Button>
              </div>

              {/* Sources Content */}
              <div className="flex-1 flex flex-col p-6 overflow-y-auto animate-in fade-in duration-500">
                
                {uploadedFiles.length === 0 ? (
                  // Empty State
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    {/* Illustration */}
                    <div className="bg-blue-100/80 dark:bg-blue-900/20 rounded-[2.5rem] p-10 mb-8 w-full aspect-square max-w-[280px] grid grid-cols-2 gap-4 place-items-center">
                      <div className="bg-background p-4 rounded-2xl shadow-sm text-red-500 dark:text-red-400 flex items-center justify-center w-16 h-16">
                        <FileText size={32} strokeWidth={1.5} />
                      </div>
                      <div className="bg-background p-4 rounded-2xl shadow-sm text-blue-500 dark:text-blue-400 flex items-center justify-center w-16 h-16">
                        <File size={32} strokeWidth={1.5} />
                      </div>
                      <div className="bg-background p-4 rounded-2xl shadow-sm text-green-500 dark:text-green-400 flex items-center justify-center w-16 h-16">
                        <FileSpreadsheet size={32} strokeWidth={1.5} />
                      </div>
                      <div className="bg-background p-4 rounded-2xl shadow-sm text-orange-500 dark:text-orange-400 flex items-center justify-center w-16 h-16">
                        <FileChartPie size={32} strokeWidth={1.5} />
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-8 leading-relaxed max-w-[260px]">
                      Carregue PDFs, documentos ou outros arquivos — usarei esses dados para fazer edições mais úteis.
                    </p>

                    <Button 
                      className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full px-8 py-6 font-medium hover:opacity-90 shadow-lg shadow-zinc-500/20 dark:shadow-none transition-all transform hover:-translate-y-0.5"
                      onClick={handleAddSourcesClick}
                    >
                      Adicionar fontes
                    </Button>
                  </div>
                ) : (
                  // List of Files
                  <div className="space-y-3">
                    {uploadedFiles.map((file) => (
                      <div 
                        key={file.id} 
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl border shadow-sm hover:shadow-md transition-all group cursor-pointer",
                          activeTabId === file.id ? "bg-accent border-orange-200 dark:border-orange-800" : "bg-card border-border hover:border-orange-100 dark:hover:border-orange-900/30"
                        )}
                        onClick={() => handleOpenFile(file.id)}
                      >
                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", getFileColorClass(file.type))}>
                          {getFileIcon(file.type)}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-sm font-medium text-foreground truncate" title={file.name}>{file.name}</p>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">{file.type}</p>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFile(file.id);
                          }}
                          className="p-2 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all"
                          title="Remover arquivo"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    
                    <div className="mt-4 flex justify-center">
                      <Button 
                        variant="outline" 
                        className="gap-2 rounded-full"
                        onClick={handleAddSourcesClick}
                      >
                        <Plus size={16} />
                        Adicionar mais
                      </Button>
                    </div>
                  </div>
                )}

                {/* Hidden File Input */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".pdf,.txt,.md,.png,.jpg,.jpeg,.webp,.mp3,.wav,.mp4" // Supported file types
                  onChange={handleFileChange}
                  multiple
                />

                <p className="text-xs text-muted-foreground/60 mt-auto pt-12 text-center">
                  Os anexos do chat não são exibidos aqui
                </p>
              </div>
            </div>
          ) : (
            /* VIEW: CHAT */
            <div className="flex flex-col h-full">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-border/40 bg-background/50">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsSidebarOpen(false)}
                  className="text-muted-foreground hover:text-foreground h-8 w-8"
                >
                  <X size={18} />
                </Button>
                <span className="text-sm font-medium text-muted-foreground">Conversa</span>
                <div className="w-8" />
              </div>

              {/* Sidebar Content Area */}
              <div className="flex-1 overflow-y-auto p-6 bg-background/30">
                {!hasStartedChat ? (
                  // Estado Inicial (Onboarding)
                  <div className="space-y-6 animate-in fade-in duration-500">
                    <div>
                      <h3 className="font-serif text-xl font-semibold mb-2">Sua página está pronta</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Esse é seu espaço para debate, rascunho e iteração. Estou aqui para ajudar ao longo do caminho.
                      </p>
                    </div>

                    {/* Illustration Placeholder */}
                    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-border p-8 flex flex-col items-center justify-center text-center shadow-sm py-12">
                      <div className="relative mb-4">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium rounded">I think I can contribute</span>
                        <div className="absolute -bottom-4 right-0 transform translate-y-1/2 translate-x-1/2">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black dark:text-white drop-shadow-md">
                            <path d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z" fill="currentColor" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-4">
                      <div className="flex gap-3 items-start">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-foreground/40 shrink-0" />
                        <div>
                          <h4 className="text-sm font-semibold mb-1">Trabalhe em um espaço focado</h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Não é mais necessário colar em outro documento, podemos trabalhar juntos aqui mesmo.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3 items-start">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-foreground/40 shrink-0" />
                        <div>
                          <h4 className="text-sm font-semibold mb-1">Aqui quando você precisar</h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Faça perguntas ou obtenha comentários sobre seções específicas quando estiver com dificuldades.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3 items-start">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-foreground/40 shrink-0" />
                        <div>
                          <h4 className="text-sm font-semibold mb-1">Traga suas fontes</h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Carregue PDFs e documentos para me ajudar a entender seu tópico e fazer edições melhores.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Estado de Chat Ativo
                  <div className="space-y-6">
                    {messages.map((msg, idx) => (
                      <div 
                        key={idx} 
                        className={cn(
                          "flex animate-in slide-in-from-bottom-2 duration-300 w-full",
                          msg.role === 'user' ? "justify-end" : "justify-start"
                        )}
                      >
                        {/* Balão de Mensagem */}
                        <div className={cn(
                          "text-sm leading-relaxed group relative",
                          msg.role === 'user' 
                            ? "bg-peach-200 text-zinc-900 font-medium rounded-2xl px-4 py-2 shadow-sm max-w-[85%]" 
                            : "w-full text-foreground px-1 text-justify" 
                        )}>
                          {msg.role === 'ai' ? (
                            <div className="prose prose-sm prose-zinc dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-muted prose-pre:rounded-lg prose-a:text-orange-500 break-words">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {msg.content}
                              </ReactMarkdown>
                            </div>
                          ) : (
                            <span className="whitespace-pre-wrap break-words">{msg.content}</span>
                          )}

                          {/* Ações da Mensagem (apenas para IA) */}
                          {msg.role === 'ai' && (
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 mt-2 items-center">
                              <button 
                                className="p-1.5 hover:bg-accent rounded text-muted-foreground hover:text-foreground"
                                onClick={() => navigator.clipboard.writeText(msg.content)}
                                title="Copiar"
                              >
                                <Copy size={14} />
                              </button>
                              <button 
                                className="p-1.5 hover:bg-accent rounded text-muted-foreground hover:text-foreground"
                                title="Útil"
                              >
                                <ThumbsUp size={14} />
                              </button>
                              {/* Botão de Aplicar ao Editor */}
                              <button
                                className="flex items-center gap-1.5 px-2 py-1 ml-1 text-xs font-medium bg-peach-100 dark:bg-peach-900/30 text-orange-700 dark:text-orange-300 rounded-md hover:bg-peach-200 dark:hover:bg-peach-900/50 transition-colors"
                                onClick={() => handleApplyToEditor(msg.content)}
                                title="Substituir conteúdo do editor"
                              >
                                <ArrowLeft size={12} />
                                Aplicar ao Editor
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex items-center animate-in fade-in px-1">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                          <span className="text-xs">PsyMind está digitando...</span>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} className="h-1" />
                  </div>
                )}
              </div>

              {/* Sidebar Footer (Input) */}
              <div className="p-4 pt-2 bg-background/80 backdrop-blur-sm border-t border-border/40">
                <div className="flex flex-col gap-2">
                  {!hasStartedChat && (
                    <div className="flex justify-center animate-out fade-out duration-200">
                      <span className="text-[10px] text-muted-foreground/70">O PsyMind pode cometer erros.</span>
                    </div>
                  )}
                  <div className="relative flex items-center">
                    <Button variant="ghost" size="icon" className="absolute left-1 h-8 w-8 text-muted-foreground hover:text-foreground shrink-0">
                      <Plus size={18} />
                    </Button>
                    <Input 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Mensagem para o PsyMind" 
                      disabled={isTyping}
                      className="pl-10 pr-10 py-5 rounded-xl border-border/60 bg-background shadow-sm focus-visible:ring-1 focus-visible:ring-orange-200 transition-all"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-1 h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
                      disabled={!chatInput.trim() || isTyping}
                      onClick={handleSendMessage}
                    >
                      {isTyping ? <Loader2 size={16} className="animate-spin" /> : <CornerDownLeft size={16} />}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Editor;