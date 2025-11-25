import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { CheckCircle, Loader2, Copy, Check, AlertCircle } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';

interface Correction {
  original: string;
  corrected: string;
  type: 'grammar' | 'spelling' | 'style';
  explanation: string;
}

const TextCorrector: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [correctedText, setCorrectedText] = useState('');
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const correctText = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um texto para corrigir.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulação de API de IA - substitua pela sua implementação real
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockCorrectedText = inputText.replace(/\b(voce|vc)\b/gi, 'você')
                                        .replace(/\b(nao|naum)\b/gi, 'não')
                                        .replace(/\b(pq|porque)\b/gi, 'por que');
      
      const mockCorrections: Correction[] = [
        {
          original: 'voce',
          corrected: 'você',
          type: 'spelling',
          explanation: 'Correção ortográfica: adição do acento circunflexo'
        },
        {
          original: 'nao',
          corrected: 'não',
          type: 'spelling',
          explanation: 'Correção ortográfica: adição do til'
        }
      ];
      
      setCorrectedText(mockCorrectedText);
      setCorrections(mockCorrections);
      
      toast({
        title: "Sucesso",
        description: `Texto corrigido! ${mockCorrections.length} correções encontradas.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao corrigir texto. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(correctedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copiado!",
        description: "Texto corrigido copiado para a área de transferência.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao copiar texto.",
        variant: "destructive",
      });
    }
  };

  const getCorrectionIcon = (type: string) => {
    switch (type) {
      case 'grammar':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'spelling':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'style':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Corretor de Texto IA</h2>
        <p className="text-muted-foreground">
          Corrija gramática, ortografia e estilo com inteligência artificial
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Texto Original</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Digite ou cole o texto que você deseja corrigir..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[200px] resize-none"
          />
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-muted-foreground">
              {inputText.length} caracteres
            </span>
            <Button 
              onClick={correctText} 
              disabled={isLoading || !inputText.trim()}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Corrigindo...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Corrigir Texto
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {correctedText && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Texto Corrigido
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="ml-2"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg mb-4">
              <pre className="whitespace-pre-wrap text-sm text-foreground font-sans">
                {correctedText}
              </pre>
            </div>
            
            {corrections.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Correções Realizadas:</h4>
                {corrections.map((correction, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-background rounded-lg border">
                    {getCorrectionIcon(correction.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="line-through text-red-500 text-sm">
                          {correction.original}
                        </span>
                        <span className="text-muted-foreground">→</span>
                        <span className="text-green-600 text-sm font-medium">
                          {correction.corrected}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {correction.explanation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TextCorrector;