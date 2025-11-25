import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
// Removendo importação direta do CSS do pacote para evitar conflitos de build/resolução
// Injetaremos os estilos críticos manualmente no componente

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
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { cn } from "@/shared/utils/utils";

// Configuração do Worker via CDN para garantir compatibilidade
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

  // 2. Renderizar Página
  useEffect(() => {
    const renderPage = async () => {
      if (!pdfDoc || !canvasRef.current || !textLayerRef.current) return;

      try {
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale });
        
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const textLayerDiv = textLayerRef.current;

        if (!context) return;

        // Ajuste para High DPI (Retina displays)
        const outputScale = window.devicePixelRatio || 1;

        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        
        // Dimensões visuais (CSS)
        const displayWidth = Math.floor(viewport.width);
        const displayHeight = Math.floor(viewport.height);

        canvas.style.width = `${displayWidth}px`;
        canvas.style.height = `${displayHeight}px`;

        // Configuração da Camada de Texto
        textLayerDiv.style.width = `${displayWidth}px`;
        textLayerDiv.style.height = `${displayHeight}px`;
        textLayerDiv.style.setProperty('--scale-factor', `${scale}`);
        textLayerDiv.innerHTML = ""; // Limpar texto anterior

        const transform = outputScale !== 1 
          ? [outputScale, 0, 0, outputScale, 0, 0] 
          : undefined;

        // Cancelar renderização anterior
        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
        }

        // --- A. Renderizar Canvas (Imagem de Fundo) ---
        const renderContext = {
          canvasContext: context,
          transform,
          viewport,
        };
        
        renderTaskRef.current = page.render(renderContext);
        await renderTaskRef.current.promise;

        // --- B. Renderizar Camada de Texto (Overlay Selecionável) ---
        const textContent = await page.getTextContent();

        // Renderizar camada de texto manualmente
        // Inspirado em https://github.com/mozilla/pdf.js/blob/master/examples/components/react/src/PdfViewer.tsx
        textContent.items.forEach((item: any, index: number) => {
          const span = document.createElement('span');
          span.textContent = item.str;

          // Calcular transformações de posição e escala
          const tx = pdfjsLib.Util.transform(
            viewport.transform,
            item.transform
          );
          const style = span.style as CSSStyleDeclaration;
          style.position = 'absolute';
          style.left = `${tx[4]}px`;
          style.top = `${tx[5] - item.height}px`;
          style.fontSize = `${item.height}px`;
          style.fontFamily = item.fontName || 'sans-serif';
          style.transform = `scaleX(${tx[0]})`;

          textLayerDiv.appendChild(span);
        });

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
      {/* Styles Críticos para a Camada de Texto funcionar e Arredondamento */}
      <style>{`
        .pdf-container-wrapper {
          position: relative;
          /* Largura definida pelo conteúdo interno (canvas) */
          width: fit-content; 
          background-color: white;
          box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
          border-radius: 0.75rem; /* rounded-xl */
          overflow: hidden; /* Essencial para o border-radius funcionar no canvas */
        }

        .textLayer {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            overflow: hidden;
            line-height: 1.0;
            opacity: 1;
            z-index: 10; /* Garante que fique sobre o canvas */
            mix-blend-mode: multiply; /* Melhora visualização do texto selecionado */
        }

        .textLayer > span {
            color: transparent;
            position: absolute;
            white-space: pre;
            cursor: text;
            transform-origin: 0% 0%;
        }

        .textLayer ::selection {
            background: rgba(59, 130, 246, 0.3);
            color: transparent;
        }
        
        .textLayer > br {
            display: none;
        }
      `}</style>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-4 overflow-hidden">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground min-w-0">
            <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded text-red-600 shrink-0">
              <FileText size={16} />
            </div>
            <span className="truncate max-w-[150px]" title={fileName}>{fileName}</span>
          </div>
          
          <div className="h-4 w-px bg-border shrink-0"></div>
          
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

      {/* Área de Visualização (Scroll Container) */}
      <div className="flex-1 bg-zinc-200/50 dark:bg-zinc-950/50 overflow-auto relative w-full">
        {/* Wrapper interno para centralização e scroll correto */}
        <div className="min-h-full flex items-center justify-center p-8 w-full">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground animate-in fade-in">
              <Loader2 className="animate-spin" size={32} />
              <p className="text-sm">Carregando documento...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center gap-3 text-destructive animate-in fade-in">
              <AlertCircle size={32} />
              <p className="text-sm font-medium">{error}</p>
              <Button variant="outline" size="sm" onClick={() => window.open(url, '_blank')}>
                Abrir em nova aba
              </Button>
            </div>
          ) : (
            /* PDF Wrapper com bordas arredondadas */
            <div className="pdf-container-wrapper">
              <canvas ref={canvasRef} className="block" />
              <div ref={textLayerRef} className="textLayer" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;