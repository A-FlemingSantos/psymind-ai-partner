import React, { useState } from 'react';
import { Quote, Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { generateReflection, generateReflectionAnalysis } from '@/shared/services';

interface Reflection {
  text: string;
  author: string;
  category: string;
}

const ReflectionGenerator: React.FC = () => {
  const [reflection, setReflection] = useState<Reflection | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [category, setCategory] = useState<string>('geral');
  const [loading, setLoading] = useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  const categories = [
    { value: 'geral', label: 'Geral' },
    { value: 'estudos', label: 'Estudos' },
    { value: 'motivação', label: 'Motivação' },
    { value: 'perseverança', label: 'Perseverança' },
    { value: 'autoconhecimento', label: 'Autoconhecimento' },
    { value: 'crescimento', label: 'Crescimento Pessoal' }
  ];

  const generateNewReflection = async () => {
    setLoading(true);
    setAnalysis('');
    try {
      const result = await generateReflection(category === 'geral' ? null : category);
      setReflection(result);
    } catch (error) {
      console.error('Erro ao gerar reflexão:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAnalysis = async () => {
    if (!reflection) return;
    
    setLoadingAnalysis(true);
    try {
      const result = await generateReflectionAnalysis(reflection);
      setAnalysis(result);
    } catch (error) {
      setAnalysis('Erro ao gerar análise');
    } finally {
      setLoadingAnalysis(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Quote className="text-purple-500" size={24} />
          Gerador de Reflexões
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Categoria</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={generateNewReflection}
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading ? (
              <RefreshCw className="animate-spin" size={16} />
            ) : (
              <Sparkles size={16} />
            )}
            {loading ? 'Gerando...' : 'Gerar Reflexão'}
          </Button>
        </div>

        {reflection && (
          <div className="space-y-4">
            <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <blockquote className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3 italic">
                "{reflection.text}"
              </blockquote>
              <cite className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                — {reflection.author}
              </cite>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={getAnalysis}
                disabled={loadingAnalysis}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Quote size={16} />
                {loadingAnalysis ? 'Analisando...' : 'Como aplicar no dia a dia?'}
              </Button>
            </div>

            {analysis && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Aplicação Prática</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">{analysis}</p>
              </div>
            )}
          </div>
        )}

        {!reflection && (
          <div className="text-center py-8 text-muted-foreground">
            <Quote size={48} className="mx-auto mb-4 opacity-50" />
            <p>Clique em "Gerar Reflexão" para receber uma frase inspiradora</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReflectionGenerator;