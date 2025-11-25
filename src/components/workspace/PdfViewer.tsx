import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
// Importante: Importar o worker explicitamente ou configurar via CDN como feito abaixo
// Se houver erros de build, o CDN é a abordagem mais segura para Vite sem config extra

import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2, 
  Download, 
  Loader2,
  FileText,
  AlertCircle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// Configuração do Worker via CDN para garantir compatibilidade
// Usamos a versão instalada no package.json ou um fallback
const pdfjsVersion = pdfjsLib.version || '4.8.69';
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  url: string;
  fileName: string;
  onClose?: () => void;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ url, fileName }) => {
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [pageNum, setPageNum] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.2);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Refs para controle de cancelamento de tarefas
  const renderTaskRef = useRef<pdfjsLib.RenderTask | null>(null);

  // 1. Carregar Documento
  useEffect(() => {
    const loadPdf = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const loadingTask = pdfjsLib.getDocument(url);
        const doc = await loadingTask.promise;
        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setPageNum(1);
      } catch (err) {
        console.error("Erro ao carregar PDF:", err);
        setError("Não foi possível carregar o documento PDF.");
      } finally {
        setIsLoading(false);
      }
    };

    if (url) {
      loadPdf();
    }
  }, [url]);

  // 2. Renderizar Página (Canvas + Text Layer)
  useEffect(() => {
    const renderPage = async () => {
      if (!pdfDoc || !canvasRef.current || !textLayerRef.current) return;

      try {
        const page = await pdfDoc.getPage(pageNum);
        
        // Viewport padrão (scale 1.0 para cálculos base)
        const viewport = page.getViewport({ scale });
        
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const textLayerDiv = textLayerRef.current;

        if (!context) return;

        // --- Configuração High DPI para o Canvas ---
        const outputScale = window.devicePixelRatio || 1;

        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        
        // Estilos CSS para tamanho visual
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        // Limpar e dimensionar a camada de texto para bater com o canvas
        textLayerDiv.style.width = `${Math.floor(viewport.width)}px`;
        textLayerDiv.style.height = `${Math.floor(viewport.height)}px`;
        textLayerDiv.innerHTML = ""; // Limpa texto anterior
        
        // Adicionar variável CSS para escala correta do texto
        textLayerDiv.style.setProperty('--scale-factor', `${scale}`);

        const transform = outputScale !== 1 
          ? [outputScale, 0, 0, outputScale, 0, 0] 
          : undefined;

        // Cancelar renderização anterior se houver
        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
        }

        // --- Renderizar Canvas (Imagem) ---
        const renderContext = {
          canvasContext: context,
          transform,
          viewport,
        };
        
        renderTaskRef.current = page.render(renderContext);
        await renderTaskRef.current.promise;

        // --- Renderizar Camada de Texto (Seleção) ---
        const textContent = await page.getTextContent();

        // Importa dinamicamente TextLayerBuilder do pdfjs-dist/web/pdf_viewer
        const { TextLayerBuilder } = await import('pdfjs-dist/web/pdf_viewer');

        // Cria e renderiza a camada de texto
        const textLayer = new TextLayerBuilder({
          textLayerDiv: textLayerDiv,
          pageIndex: pageNum - 1,
          viewport: viewport,
          enhanceTextSelection: true,
        });

        textLayer.setTextContent(textContent);
        await textLayer.render();

      } catch (err: any) {
        if (err.name !== 'RenderingCancelledException') {
          console.error("Render error:", err);
        }
      }
    };

    renderPage();
  }, [pdfDoc, pageNum, scale]);

  const changePage = (offset: number) => {
    setPageNum(prev => Math.min(Math.max(1, prev + offset), numPages));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div ref={containerRef} className="flex flex-col h-full bg-zinc-100/50 dark:bg-zinc-950/50 m-4 rounded-xl overflow-hidden border border-border shadow-lg group">
      {/* Styles Específicos para a Camada de Texto do PDF.js */}
      <style>{`
        .pdf-viewer-container .textLayer {
            position: absolute;
            text-align: initial;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            overflow: hidden;
            line-height: 1.0;
            opacity: 0.2; /* Torna o texto levemente visível para debug, ou 0 para invisível */
            transform-origin: 0 0;
        }

        .pdf-viewer-container .textLayer > span {
            color: transparent;
            position: absolute;
            white-space: pre;
            cursor: text;
            transform-origin: 0% 0%;
        }

        .pdf-viewer-container .textLayer ::selection {
            background: rgba(0, 0, 255, 0.3); /* Cor azul padrão de seleção */
            color: transparent;
        }
        
        /* Garante que br não quebre o layout absoluto */
        .pdf-viewer-container .textLayer > br {
            display: none;
        }
      `}</style>

      {/* Custom Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-4 overflow-hidden">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground min-w-0">
            <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded text-red-600 shrink-0">
              <FileText size={16} />
            </div>
            <span className="truncate max-w-[150px]" title={fileName}>{fileName}</span>
          </div>
          
          <div className="h-4 w-px bg-border shrink-0"></div>
          
          {/* Pagination */}
          <div className="flex items-center gap-1 bg-muted/50 rounded-md p-0.5 shrink-0">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7" 
              onClick={() => changePage(-1)} 
              disabled={pageNum <= 1 || isLoading}
            >
              <ChevronLeft size={14} />
            </Button>
            <span className="text-xs font-mono w-20 text-center tabular-nums text-foreground">
              {isLoading ? '-' : `${pageNum} / ${numPages}`}
            </span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7" 
              onClick={() => changePage(1)} 
              disabled={pageNum >= numPages || isLoading}
            >
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>

        {/* Zoom & Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => setScale(s => Math.max(0.5, s - 0.2))}>
            <ZoomOut size={16} />
          </Button>
          <span className="text-xs font-mono w-10 text-center text-muted-foreground select-none">{Math.round(scale * 100)}%</span>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => setScale(s => Math.min(3, s + 0.2))}>
            <ZoomIn size={16} />
          </Button>
          
          <Separator orientation="vertical" className="h-4 mx-2" />
          
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => window.open(url, '_blank')}>
            <Download size={16} />
          </Button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 bg-zinc-200/50 dark:bg-zinc-950/50 overflow-auto relative flex justify-center p-8 pdf-viewer-container">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground animate-in fade-in">
            <Loader2 className="animate-spin" size={32} />
            <p className="text-sm">Carregando documento...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-destructive animate-in fade-in">
            <AlertCircle size={32} />
            <p className="text-sm font-medium">{error}</p>
            <Button variant="outline" size="sm" onClick={() => window.open(url, '_blank')}>
              Abrir em nova aba
            </Button>
          </div>
        ) : (
          <div className="relative shadow-2xl transition-transform duration-200 ease-out origin-top h-fit bg-white" style={{ width: 'fit-content' }}>
            {/* Canvas for Rendering (Visual) */}
            <canvas ref={canvasRef} className="block" />
            
            {/* Text Layer for Selection (Invisible Overlay) */}
            <div ref={textLayerRef} className="textLayer" />
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfViewer;