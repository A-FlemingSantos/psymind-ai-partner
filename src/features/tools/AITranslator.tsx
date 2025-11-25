import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Languages, Loader2, Copy, Check, ArrowUpDown, Volume2 } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { translateText } from '@/shared/services/toolsService';

const languages = [
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'en', name: 'Inglês', flag: '🇺🇸' },
  { code: 'es', name: 'Espanhol', flag: '🇪🇸' },
  { code: 'fr', name: 'Francês', flag: '🇫🇷' },
  { code: 'de', name: 'Alemão', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'ja', name: 'Japonês', flag: '🇯🇵' },
  { code: 'ko', name: 'Coreano', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinês', flag: '🇨🇳' },
  { code: 'ru', name: 'Russo', flag: '🇷🇺' },
  { code: 'el', name: 'Grego', flag: '🇬🇷' },
  { code: 'la', name: 'Latim', flag: '🏛️' }
];

const AITranslator: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [fromLanguage, setFromLanguage] = useState('pt');
  const [toLanguage, setToLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um texto para traduzir.",
        variant: "destructive",
      });
      return;
    }

    if (fromLanguage === toLanguage) {
      toast({
        title: "Erro",
        description: "Selecione idiomas diferentes para tradução.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const translation = await translateText(inputText, fromLanguage, toLanguage);
      setTranslatedText(translation);
      toast({
        title: "Sucesso",
        description: "Texto traduzido com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao traduzir:", error);
      toast({
        title: "Erro",
        description: "Erro ao traduzir texto. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const swapLanguages = () => {
    const temp = fromLanguage;
    setFromLanguage(toLanguage);
    setToLanguage(temp);
    
    if (translatedText) {
      setInputText(translatedText);
      setTranslatedText('');
    }
  };

  const speakText = () => {
    if (!translatedText) return;
    const utterance = new window.SpeechSynthesisUtterance(translatedText);
    utterance.lang = toLanguage;
    window.speechSynthesis.speak(utterance);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(translatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copiado!",
        description: "Tradução copiada para a área de transferência.",
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
        <Languages className="mx-auto h-12 w-12 text-purple-500 mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Tradutor IA</h2>
        <p className="text-muted-foreground">
          Traduções inteligentes com contexto e nuances culturais
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuração de Idiomas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground mb-2 block">De:</label>
              <Select value={fromLanguage} onValueChange={setFromLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={swapLanguages}
              className="mt-6"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
            
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground mb-2 block">Para:</label>
              <Select value={toLanguage} onValueChange={setToLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Texto Original</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Digite ou cole o texto que você deseja traduzir..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[200px] resize-none"
          />
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-muted-foreground">
              {inputText.length} caracteres
            </span>
            <Button 
              onClick={handleTranslate} 
              disabled={isLoading || !inputText.trim()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Traduzindo...
                </>
              ) : (
                <>
                  <Languages className="mr-2 h-4 w-4" />
                  Traduzir
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {translatedText && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Tradução
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={speakText}
                  aria-label="Ouvir tradução"
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="ml-0"
                  aria-label="Copiar tradução"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm text-foreground font-sans">
                {translatedText}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AITranslator;