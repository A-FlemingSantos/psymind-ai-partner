import React, { useEffect, useRef, useState } from 'react';
import { 
  getDocument, 
  GlobalWorkerOptions, 
  version, 
  type PDFDocumentProxy,
  type RenderTask
} from 'pdfjs-dist';
import { TextLayerBuilder } from 'pdfjs-dist/web/pdf_viewer';
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

// Configure worker to load from CDN to avoid build configuration issues with Vite
// Ensure version fallback if import fails to provide it immediately
const pdfjsVersion = version || '4.8.69';
GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  url: string;
  fileName: string;
  onClose?: () => void;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ url, fileName }) => {
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [pageNum, setPageNum] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.2); // Default zoom slightly larger
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);
  
  // Refs to store render tasks so we can cancel them
  const renderTaskRef = useRef<RenderTask | null>(null);
  const textRenderTaskRef = useRef<any | null>(null); // Using any for text task as type definition can be tricky across versions
  
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Load Document
  useEffect(() => {
    const loadPdf = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const loadingTask = getDocument(url);
        const doc = await loadingTask.promise;
        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setPageNum(1);
      } catch (err) {
        console.error("Error loading PDF:", err);
        setError("Failed to load PDF document.");
      } finally {
        setIsLoading(false);
      }
    };

    if (url) {
      loadPdf();
    }
  }, [url]);

  // 2. Render Page & Text Layer
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

        // Support High DPI screens
        const outputScale = window.devicePixelRatio || 1;

        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = Math.floor(viewport.width) + "px";
        canvas.style.height = Math.floor(viewport.height) + "px";

        // Sync text layer size
        textLayerDiv.style.width = Math.floor(viewport.width) + "px";
        textLayerDiv.style.height = Math.floor(viewport.height) + "px";
        textLayerDiv.innerHTML = ""; // Clear previous text layer

        const transform = outputScale !== 1 
          ? [outputScale, 0, 0, outputScale, 0, 0] 
          : undefined;

        // Cancel previous render tasks if any
        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
        }
        if (textRenderTaskRef.current && typeof textRenderTaskRef.current.cancel === 'function') {
          textRenderTaskRef.current.cancel();
        }

        const renderContext = {
          canvasContext: context,
          transform,
          viewport,
        };

        // Render Graphics
        renderTaskRef.current = page.render(renderContext);
        await renderTaskRef.current.promise;

        // Render Text Layer (for selection)
        const textContent = await page.getTextContent();

        const textLayer = new TextLayerBuilder({
          textDivs: [],
          container: textLayerDiv,
          viewport,
        } as any);

        textLayer.setTextContent(textContent);
        const textTask = textLayer.render();
        textRenderTaskRef.current = textTask;

        await (textTask as any).promise;

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
    <div ref={containerRef} className="flex flex-col h-full bg-zinc-100/50 dark:bg-zinc-900/50 m-4 rounded-xl overflow-hidden border border-border shadow-lg group">
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
      <div className="flex-1 bg-zinc-200/50 dark:bg-zinc-950/50 overflow-auto relative flex justify-center p-8">
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
            {/* Canvas for Rendering */}
            <canvas ref={canvasRef} className="block" />
            
            {/* Text Layer for Selection */}
            <div ref={textLayerRef} className="textLayer" />
          </div>
        )}
      </div>

      {/* Global Styles for Text Layer (Scoped to this component roughly via the class) */}
      <style>{`
        .textLayer {
            position: absolute;
            text-align: initial;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            overflow: hidden;
            line-height: 1.0;
            pointer-events: none; /* Allow clicks to pass through if needed, but text selection needs pointer-events:auto on spans */
        }
        .textLayer > span {
            color: transparent;
            position: absolute;
            white-space: pre;
            cursor: text;
            transform-origin: 0% 0%;
            pointer-events: auto;
        }
        .textLayer > br {
            display: none;
        }
        /* Highlight selection */
        .textLayer ::selection {
            background: rgba(0, 111, 255, 0.3);
            color: transparent;
        }
      `}</style>
    </div>
  );
};

export default PdfViewer;