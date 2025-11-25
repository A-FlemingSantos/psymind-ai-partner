import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { FileText, Loader2, Copy, Check } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { summarizeText } from '@/shared/services/toolsService';

const TextSummarizer: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateSummary = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um texto para resumir.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const summaryResult = await summarizeText(inputText);
      setSummary(summaryResult);
      toast({
        title: "Sucesso",
        description: "Resumo gerado com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao gerar resumo:", error);
      toast({
        title: "Erro",
        description: "Erro ao gerar resumo. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copiado!",
        description: "Resumo copiado para a área de transferência.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao copiar texto.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <FileText className="mx-auto h-12 w-12 text-blue-500 mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Resumidor de Texto IA</h2>
        <p className="text-muted-foreground">
          Cole seu texto e obtenha um resumo inteligente gerado por IA
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Texto Original</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Cole aqui o texto que você deseja resumir..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[200px] resize-none"
          />
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-muted-foreground">
              {inputText.length} caracteres
            </span>
            <Button 
              onClick={generateSummary} 
              disabled={isLoading || !inputText.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando Resumo...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Gerar Resumo
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {summary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Resumo Gerado
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
            <div className="bg-muted p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm text-foreground font-sans">
                {summary}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TextSummarizer;