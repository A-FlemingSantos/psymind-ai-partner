declare module 'pdfjs-dist/web/pdf_viewer' {
  export class TextLayerBuilder {
    constructor(options: any);
    setTextContent(textContent: any): void;
    render(): { promise: Promise<void> };
  }
}
