import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { HelpCircle, Loader2, Copy, Check, RefreshCw } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { generateQuestionsFromText, Question } from '@/shared/services/toolsService';

const QuestionGenerator: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionType, setQuestionType] = useState('mixed');
  const [difficulty, setDifficulty] = useState('medium');
  const [questionCount, setQuestionCount] = useState('5');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateQuestions = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um conteúdo para gerar questões.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const generatedQuestions = await generateQuestionsFromText(
        inputText,
        questionType,
        difficulty,
        parseInt(questionCount)
      );
      
      setQuestions(generatedQuestions);
      
      toast({
        title: "Sucesso",
        description: `${generatedQuestions.length} questões geradas com sucesso!`,
      });
    } catch (error) {
      console.error("Erro ao gerar questões:", error);
      toast({
        title: "Erro",
        description: "Erro ao gerar questões. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    const questionsText = questions.map((q, index) => {
      let text = `${index + 1}. ${q.question}\nTipo: ${q.type} | Dificuldade: ${q.difficulty}`;
      if (q.answer) {
        text += `\nResposta: ${q.answer}`;
      }
      return text;
    }).join('\n\n');

    try {
      await navigator.clipboard.writeText(questionsText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copiado!",
        description: "Questões copiadas para a área de transferência.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao copiar questões.",
        variant: "destructive",
      });
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'hard': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Múltipla Escolha': return 'text-blue-600 bg-blue-50';
      case 'Dissertativa': return 'text-purple-600 bg-purple-50';
      case 'Verdadeiro/Falso': return 'text-green-600 bg-green-50';
      case 'Completar': return 'text-orange-600 bg-orange-50';
      case 'Análise Crítica': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <HelpCircle className="mx-auto h-12 w-12 text-indigo-500 mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Gerador de Questões IA</h2>
        <p className="text-muted-foreground">
          Crie questões personalizadas baseadas em qualquer conteúdo
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configurações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Tipo de Questão:</label>
              <Select value={questionType} onValueChange={setQuestionType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mixed">Misto</SelectItem>
                  <SelectItem value="multiple">Múltipla Escolha</SelectItem>
                  <SelectItem value="essay">Dissertativa</SelectItem>
                  <SelectItem value="truefalse">Verdadeiro/Falso</SelectItem>
                  <SelectItem value="complete">Completar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Dificuldade:</label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Fácil</SelectItem>
                  <SelectItem value="medium">Médio</SelectItem>
                  <SelectItem value="hard">Difícil</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Quantidade:</label>
              <Select value={questionCount} onValueChange={setQuestionCount}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 questões</SelectItem>
                  <SelectItem value="5">5 questões</SelectItem>
                  <SelectItem value="10">10 questões</SelectItem>
                  <SelectItem value="15">15 questões</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conteúdo Base</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Cole aqui o texto, artigo ou conteúdo que servirá de base para gerar as questões..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[200px] resize-none"
          />
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-muted-foreground">
              {inputText.length} caracteres
            </span>
            <Button 
              onClick={generateQuestions} 
              disabled={isLoading || !inputText.trim()}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando Questões...
                </>
              ) : (
                <>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Gerar Questões
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Questões Geradas ({questions.length})
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateQuestions}
                  disabled={isLoading}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
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
            <div className="space-y-6">
              {questions.map((question, index) => (
                <div key={index} className="border rounded-lg p-4 bg-background">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium text-foreground">
                      Questão {index + 1}
                    </h4>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(question.type)}`}>
                        {question.type}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                        {question.difficulty === 'easy' ? 'Fácil' : question.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-foreground mb-3 leading-relaxed">
                    {question.question}
                  </p>
                  
                  {question.answer && (
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-sm font-medium text-foreground mb-1">Resposta:</p>
                      <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-sans">
                        {question.answer}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuestionGenerator;