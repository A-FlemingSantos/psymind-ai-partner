import React, { useState, useEffect } from 'react';
import { GraduationCap, Calculator, BookOpen, Target, ArrowLeft, School, Languages, History, Globe, Zap, Beaker, Dna, PenTool, Mic, Headphones, Palette, Users, Code, Telescope, Trophy, Calendar, Clock, BarChart3, FileText, Timer, TrendingUp, Award, CheckCircle } from 'lucide-react';
import { 
  generateExamStrategy, 
  generateStudyPlan, 
  explainTopic, 
  generatePracticeQuestions, 
  generateStudySchedule, 
  generateMockExam, 
  analyzePerformance,
  generateBibliography,
  generateMotivationalCoach,
  generateQuickQuestions,
  generateEssayQuestions,
  generateChallengeQuestions,
  generateFeynmanMethod,
  generateSpacedRepetition,
  generateMindMaps,
  generatePersonalizedPomodoro,
  generateAssociationTechnique,
  generateStrategicSummaries,
  generateMemorizationTechniques,
  analyzeSisuProuniFeasibility
} from '@/shared/services';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Progress } from '@/shared/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { useToast } from '@/shared/hooks/use-toast';
import { Loader2, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { sendMessageToGemini } from '@/shared/utils/gemini';

const ExamPrep: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [studyProgress, setStudyProgress] = useState<{[key: string]: number}>({});
  const [examDate, setExamDate] = useState('');
  const [studyHoursPerDay, setStudyHoursPerDay] = useState('4');
  const [isGeneratingQuickMock, setIsGeneratingQuickMock] = useState(false);
  const [isGeneratingFullMock, setIsGeneratingFullMock] = useState(false);
  const { toast } = useToast();
  
  // Estados para o modal de resposta da IA
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);

  // Função auxiliar para enviar mensagem e abrir modal
  const sendMessageAndShowModal = async (prompt: string, title?: string) => {
    setIsLoadingResponse(true);
    setIsModalOpen(true);
    setModalTitle(title || 'Resposta da IA');
    setModalContent('');

    try {
      // Chama a IA
      const history = [{
        role: 'user' as const,
        content: prompt
      }];
      
      const aiResponse = await sendMessageToGemini(history, prompt, 'Advisor', 'empático e acolhedor');
      
      setModalContent(aiResponse);
      return { success: true, response: aiResponse };
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      const errorMessage = `⚠️ **Erro ao processar solicitação**\n\n${error instanceof Error ? error.message : 'Erro desconhecido'}\n\nPor favor, tente novamente.`;
      setModalContent(errorMessage);
      return { success: false, error };
    } finally {
      setIsLoadingResponse(false);
    }
  };


  useEffect(() => {
    if (selectedExam && selectedSubject) {
      const saved = localStorage.getItem(`progress_${selectedExam.name}_${selectedSubject}`);
      if (saved) {
        setStudyProgress(JSON.parse(saved));
      }
    }
  }, [selectedExam?.name, selectedSubject]);

  // ENEM Calculator States
  const [scores, setScores] = useState({
    linguagens: '',
    humanas: '',
    natureza: '',
    matematica: '',
    redacao: ''
  });
  const [desiredCourse, setDesiredCourse] = useState('');
  const [category, setCategory] = useState('Ampla Concorrência');
  const [result, setResult] = useState<number | null>(null);

  const categories = [
    {
      id: 'international',
      title: 'Internacionais',
      icon: '🌍',
      exams: [
        {
          name: 'SAT',
          fullName: 'Scholastic Assessment Test',
          subjects: ['Reading', 'Writing & Language', 'Math (No Calculator)', 'Math (Calculator)']
        },
        {
          name: 'ACT',
          fullName: 'American College Testing',
          subjects: ['English', 'Math', 'Reading', 'Science', 'Writing (Optional)']
        },
        {
          name: 'TOEFL',
          fullName: 'Test of English as a Foreign Language',
          subjects: ['Reading', 'Listening', 'Speaking', 'Writing']
        },
        {
          name: 'IELTS',
          fullName: 'International English Language Testing System',
          subjects: ['Listening', 'Reading', 'Writing', 'Speaking']
        },
        {
          name: 'IB',
          fullName: 'International Baccalaureate',
          subjects: ['Language and Literature', 'Language Acquisition', 'Individuals and Societies', 'Sciences', 'Mathematics', 'The Arts']
        }
      ]
    },
    {
      id: 'national',
      title: 'Nacionais',
      icon: '🇧🇷',
      exams: [
        {
          name: 'ENEM',
          fullName: 'Exame Nacional do Ensino Médio',
          subjects: ['Linguagens', 'Ciências Humanas', 'Ciências da Natureza', 'Matemática', 'Redação']
        },
        {
          name: 'SAEB',
          fullName: 'Sistema de Avaliação da Educação Básica',
          subjects: ['Língua Portuguesa', 'Matemática']
        },
        {
          name: 'Encceja',
          fullName: 'Certificação de Competências',
          subjects: ['Ciências da Natureza', 'Matemática', 'Linguagens e Códigos', 'Ciências Humanas']
        },
        {
          name: 'Calculadora ENEM',
          fullName: 'Simulador SiSU/ProUni',
          isCalculator: true
        }
      ]
    },
    {
      id: 'regional',
      title: 'Regionais',
      icon: '🏛️',
      exams: [
        {
          name: 'FUVEST',
          fullName: 'USP',
          subjects: ['Português', 'Matemática', 'História', 'Geografia', 'Física', 'Química', 'Biologia', 'Inglês']
        },
        {
          name: 'COMVEST',
          fullName: 'Unicamp',
          subjects: ['Português e Literaturas', 'Matemática', 'História', 'Geografia', 'Física', 'Química', 'Biologia', 'Inglês']
        },
        {
          name: 'VUNESP',
          fullName: 'Unesp',
          subjects: ['Linguagens', 'Ciências Humanas', 'Ciências da Natureza', 'Matemática']
        },
        {
          name: 'UERJ',
          fullName: 'Universidade do Estado do Rio de Janeiro',
          subjects: ['Linguagens', 'Matemática', 'Ciências da Natureza', 'Ciências Humanas', 'Redação']
        },
        {
          name: 'UFRGS',
          fullName: 'Universidade Federal do Rio Grande do Sul',
          subjects: ['Física', 'Literatura', 'Língua Estrangeira', 'Português', 'Redação', 'Biologia', 'Química', 'Geografia', 'História', 'Matemática']
        },
        {
          name: 'UEL',
          fullName: 'Universidade Estadual de Londrina',
          subjects: ['Português', 'Matemática', 'História', 'Geografia', 'Física', 'Química', 'Biologia', 'Inglês']
        },
        {
          name: 'UEM',
          fullName: 'Universidade Estadual de Maringá',
          subjects: ['Português', 'Matemática', 'História', 'Geografia', 'Física', 'Química', 'Biologia', 'Inglês']
        },
        {
          name: 'UFPR',
          fullName: 'Universidade Federal do Paraná',
          subjects: ['Português', 'Matemática', 'História', 'Geografia', 'Física', 'Química', 'Biologia', 'Inglês']
        },
        {
          name: 'UFSC',
          fullName: 'Universidade Federal de Santa Catarina',
          subjects: ['Português', 'Matemática', 'História', 'Geografia', 'Física', 'Química', 'Biologia', 'Redação']
        },
        {
          name: 'UFRJ',
          fullName: 'Universidade Federal do Rio de Janeiro',
          subjects: ['Português', 'Matemática', 'História', 'Geografia', 'Física', 'Química', 'Biologia', 'Inglês']
        },
        {
          name: 'UFF',
          fullName: 'Universidade Federal Fluminense',
          subjects: ['Português', 'Matemática', 'História', 'Geografia', 'Física', 'Química', 'Biologia', 'Inglês']
        },
        {
          name: 'UFMG',
          fullName: 'Universidade Federal de Minas Gerais',
          subjects: ['Português', 'Matemática', 'História', 'Geografia', 'Física', 'Química', 'Biologia', 'Inglês']
        },
        {
          name: 'UnB',
          fullName: 'Universidade de Brasília',
          subjects: ['Português', 'Matemática', 'História', 'Geografia', 'Física', 'Química', 'Biologia', 'Inglês']
        },
        {
          name: 'UFBA',
          fullName: 'Universidade Federal da Bahia',
          subjects: ['Português', 'Matemática', 'História', 'Geografia', 'Física', 'Química', 'Biologia', 'Inglês']
        },
        {
          name: 'UFC',
          fullName: 'Universidade Federal do Ceará',
          subjects: ['Português', 'Matemática', 'História', 'Geografia', 'Física', 'Química', 'Biologia', 'Inglês']
        },
        {
          name: 'UFPE',
          fullName: 'Universidade Federal de Pernambuco',
          subjects: ['Português', 'Matemática', 'História', 'Geografia', 'Física', 'Química', 'Biologia', 'Inglês']
        }
      ]
    },
    {
      id: 'olympiads',
      title: 'Olimpíadas',
      icon: '🏆',
      exams: [
        { name: 'OBMEP', fullName: 'Matemática', subjects: ['Aritmética', 'Álgebra', 'Geometria', 'Combinatória'] },
        { name: 'OBA', fullName: 'Astronomia', subjects: ['Sistema Solar', 'Estrelas', 'Galáxias', 'Cosmologia'] },
        { name: 'OBI', fullName: 'Informática', subjects: ['Algoritmos', 'Programação', 'Estruturas de Dados', 'Lógica'] },
        { name: 'OBF', fullName: 'Física', subjects: ['Mecânica', 'Termodinâmica', 'Eletromagnetismo', 'Óptica'] },
        { name: 'OBQ', fullName: 'Química', subjects: ['Química Geral', 'Orgânica', 'Físico-Química', 'Analítica'] },
        { name: 'ONC', fullName: 'Ciências', subjects: ['Biologia', 'Física', 'Química', 'Astronomia'] }
      ]
    }
  ];

  const examTopics: { [key: string]: string[] } = {
    'Matemática': [
      'Aritmética Básica (Frações, Decimais, Porcentagem)',
      'Funções (1º e 2º Grau, Exponencial, Logarítmica)',
      'Geometria Plana (Áreas, Perímetros, Ângulos)',
      'Geometria Espacial (Volumes, Prismas, Cilindros)',
      'Estatística (Média, Moda, Mediana, Desvio Padrão)',
      'Probabilidade e Análise Combinatória',
      'Trigonometria (Triângulo Retângulo, Ciclo Trigonométrico)',
      'Matemática Financeira (Juros Simples e Compostos)'
    ],
    'Linguagens': [
      'Interpretação de Texto e Gêneros Textuais',
      'Variação Linguística e Funções da Linguagem',
      'Movimentos Literários (Romantismo, Modernismo, etc.)',
      'Gramática (Sintaxe, Morfologia, Semântica)',
      'Artes e Vanguardas Europeias',
      'Educação Física e Cultura Corporal',
      'Tecnologias da Informação e Comunicação'
    ],
    'Ciências Humanas': [
      'História do Brasil (Colônia, Império, República)',
      'História Geral (Antiguidade, Idade Média, Moderna, Contemporânea)',
      'Geografia Física (Clima, Relevo, Hidrografia)',
      'Geografia Humana (População, Urbanização, Agricultura)',
      'Geopolítica e Globalização',
      'Filosofia (Antiga, Moderna, Contemporânea, Ética)',
      'Sociologia (Cultura, Trabalho, Desigualdade, Instituições)'
    ],
    'Ciências da Natureza': [
      'Física: Mecânica (Cinemática, Dinâmica, Energia)',
      'Física: Eletricidade e Magnetismo',
      'Física: Termologia e Óptica',
      'Química: Geral e Inorgânica (Atomística, Ligações, Funções)',
      'Química: Físico-Química (Soluções, Termoquímica, Cinética)',
      'Química: Orgânica (Cadeias, Funções, Reações)',
      'Biologia: Citologia e Metabolismo Energético',
      'Biologia: Genética e Evolução',
      'Biologia: Ecologia e Meio Ambiente'
    ],
    'Redação': [
      'Estrutura do Texto Dissertativo-Argumentativo',
      'Competência 1: Norma Culta',
      'Competência 2: Compreensão do Tema e Tipo Textual',
      'Competência 3: Seleção e Organização de Argumentos',
      'Competência 4: Coesão Textual',
      'Competência 5: Proposta de Intervenção',
      'Repertório Sociocultural',
      'Análise de Temas Anteriores'
    ]
  };

  const getTopicsForSubject = (subjectName: string): string[] => {
    return examTopics[subjectName] || ['Conteúdo Programático Geral', 'Resolução de Questões', 'Revisão de Conceitos'];
  };

  const handleCalculateSimple = async () => {
    const values = Object.values(scores).map(val => parseFloat(val) || 0);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / 5;
    setResult(avg);

    if (desiredCourse) {
      try {
        const analysis = await analyzeSisuProuniFeasibility(scores, desiredCourse, category);
        const prompt = `🎓 ANÁLISE DE VIABILIDADE SISU/PROUNI\n\n${analysis}`;
        await sendMessageAndShowModal(prompt, `Análise SiSU/ProUni`);
      } catch (error) {
        console.error('Erro ao analisar viabilidade:', error);
      }
    }
  };

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value === '' || (parseFloat(value) >= 0 && parseFloat(value) <= 1000)) {
      setScores(prev => ({ ...prev, [name]: value }));
    }
  };

  if (showCalculator) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowCalculator(false)}>
              <ArrowLeft size={16} />
            </Button>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="text-blue-500" size={24} />
              Calculadora ENEM
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="linguagens"
              placeholder="Linguagens"
              type="number"
              value={scores.linguagens}
              onChange={handleScoreChange}
            />
            <Input
              name="humanas"
              placeholder="Ciências Humanas"
              type="number"
              value={scores.humanas}
              onChange={handleScoreChange}
            />
            <Input
              name="natureza"
              placeholder="Ciências da Natureza"
              type="number"
              value={scores.natureza}
              onChange={handleScoreChange}
            />
            <Input
              name="matematica"
              placeholder="Matemática"
              type="number"
              value={scores.matematica}
              onChange={handleScoreChange}
            />
            <Input
              name="redacao"
              placeholder="Redação"
              type="number"
              value={scores.redacao}
              onChange={handleScoreChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Curso Almejado (ex: Medicina)"
              value={desiredCourse}
              onChange={(e) => setDesiredCourse(e.target.value)}
            />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ampla Concorrência">Ampla Concorrência</SelectItem>
                <SelectItem value="Escola Pública (EP)">Escola Pública (EP)</SelectItem>
                <SelectItem value="Preto, Pardo ou Indígena (PPI)">Preto, Pardo ou Indígena (PPI)</SelectItem>
                <SelectItem value="Pessoas com Deficiência (PcD)">Pessoas com Deficiência (PcD)</SelectItem>
                <SelectItem value="Baixa Renda">Baixa Renda</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {result && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Sua Média Simples:</h4>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{result.toFixed(2)}</p>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                *Esta é uma média simples. O SiSU e ProUni podem usar pesos diferentes.
              </p>
            </div>
          )}

          <Button onClick={handleCalculateSimple} className="w-full">
            {desiredCourse ? 'Calcular e Analisar com IA' : 'Calcular Média'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!selectedCategory) {
    return (
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="text-blue-500" size={24} />
            Preparatório para Vestibulares
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant="outline"
                className="h-24 flex flex-col items-center gap-2 hover:bg-accent"
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="font-medium">{cat.title}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!selectedExam) {
    const categoryData = categories.find(c => c.id === selectedCategory);
    return (
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setSelectedCategory(null)}>
              <ArrowLeft size={16} />
            </Button>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">{categoryData?.icon}</span>
              {categoryData?.title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryData?.exams.map((exam, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full h-16 flex items-center justify-between p-4"
                onClick={() => {
                  if (exam.isCalculator) {
                    setShowCalculator(true);
                  } else {
                    setSelectedExam(exam);
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <School className="text-blue-500" size={20} />
                  <div className="text-left">
                    <div className="font-medium">{exam.name}</div>
                    <div className="text-sm text-muted-foreground">{exam.fullName}</div>
                  </div>
                </div>
                {exam.isCalculator ? <Calculator size={20} /> : <Target size={20} />}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!selectedSubject) {
    return (
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setSelectedExam(null)}>
              <ArrowLeft size={16} />
            </Button>
            <CardTitle>
              {selectedExam.name} - {selectedExam.fullName}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className={`${selectedExam.subjects.length % 3 !== 0 ? 'flex flex-wrap justify-center gap-4' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'}`}>
            {selectedExam.subjects.map((subject: string, index: number) => {
              const getSubjectIcon = (subjectName: string) => {
                const lower = subjectName.toLowerCase();
                if (lower.includes('math') || lower.includes('matemática') || lower.includes('calculator')) return Calculator;
                if (lower.includes('reading') || lower.includes('literature') || lower.includes('português') || lower.includes('linguagens')) return BookOpen;
                if (lower.includes('writing') || lower.includes('redação')) return PenTool;
                if (lower.includes('listening')) return Headphones;
                if (lower.includes('speaking')) return Mic;
                if (lower.includes('english') || lower.includes('inglês') || lower.includes('language')) return Languages;
                if (lower.includes('história') || lower.includes('history')) return History;
                if (lower.includes('geografia') || lower.includes('geography') || lower.includes('societies')) return Globe;
                if (lower.includes('física') || lower.includes('physics') || lower.includes('mecânica') || lower.includes('eletromagnetismo')) return Zap;
                if (lower.includes('química') || lower.includes('chemistry') || lower.includes('orgânica')) return Beaker;
                if (lower.includes('biologia') || lower.includes('biology') || lower.includes('natureza') || lower.includes('sciences')) return Dna;
                if (lower.includes('arts') || lower.includes('artes')) return Palette;
                if (lower.includes('humanas') || lower.includes('individuals')) return Users;
                if (lower.includes('algoritmos') || lower.includes('programação') || lower.includes('informática')) return Code;
                if (lower.includes('astronomia') || lower.includes('sistema solar') || lower.includes('estrelas')) return Telescope;
                if (lower.includes('aritmética') || lower.includes('álgebra') || lower.includes('geometria')) return Calculator;
                return BookOpen;
              };
              
              const getSubjectColor = (subjectName: string) => {
                const lower = subjectName.toLowerCase();
                if (lower.includes('math') || lower.includes('matemática') || lower.includes('calculator')) return 'bg-red-100 hover:bg-red-200 border-red-200 dark:bg-red-900/30 dark:hover:bg-red-800/40 dark:border-red-800/50 text-red-900 dark:text-red-100';
                if (lower.includes('reading') || lower.includes('literature') || lower.includes('português') || lower.includes('linguagens')) return 'bg-blue-100 hover:bg-blue-200 border-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800/40 dark:border-blue-800/50 text-blue-900 dark:text-blue-100';
                if (lower.includes('writing') || lower.includes('redação')) return 'bg-purple-100 hover:bg-purple-200 border-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-800/40 dark:border-purple-800/50 text-purple-900 dark:text-purple-100';
                if (lower.includes('listening') || lower.includes('speaking')) return 'bg-pink-100 hover:bg-pink-200 border-pink-200 dark:bg-pink-900/30 dark:hover:bg-pink-800/40 dark:border-pink-800/50 text-pink-900 dark:text-pink-100';
                if (lower.includes('english') || lower.includes('inglês') || lower.includes('language')) return 'bg-indigo-100 hover:bg-indigo-200 border-indigo-200 dark:bg-indigo-900/30 dark:hover:bg-indigo-800/40 dark:border-indigo-800/50 text-indigo-900 dark:text-indigo-100';
                if (lower.includes('história') || lower.includes('history')) return 'bg-amber-100 hover:bg-amber-200 border-amber-200 dark:bg-amber-900/30 dark:hover:bg-amber-800/40 dark:border-amber-800/50 text-amber-900 dark:text-amber-100';
                if (lower.includes('geografia') || lower.includes('geography') || lower.includes('societies')) return 'bg-green-100 hover:bg-green-200 border-green-200 dark:bg-green-900/30 dark:hover:bg-green-800/40 dark:border-green-800/50 text-green-900 dark:text-green-100';
                if (lower.includes('física') || lower.includes('physics') || lower.includes('mecânica') || lower.includes('eletromagnetismo')) return 'bg-yellow-100 hover:bg-yellow-200 border-yellow-200 dark:bg-yellow-900/30 dark:hover:bg-yellow-800/40 dark:border-yellow-800/50 text-yellow-900 dark:text-yellow-100';
                if (lower.includes('química') || lower.includes('chemistry') || lower.includes('orgânica')) return 'bg-orange-100 hover:bg-orange-200 border-orange-200 dark:bg-orange-900/30 dark:hover:bg-orange-800/40 dark:border-orange-800/50 text-orange-900 dark:text-orange-100';
                if (lower.includes('biologia') || lower.includes('biology') || lower.includes('natureza') || lower.includes('sciences')) return 'bg-emerald-100 hover:bg-emerald-200 border-emerald-200 dark:bg-emerald-900/30 dark:hover:bg-emerald-800/40 dark:border-emerald-800/50 text-emerald-900 dark:text-emerald-100';
                if (lower.includes('arts') || lower.includes('artes')) return 'bg-rose-100 hover:bg-rose-200 border-rose-200 dark:bg-rose-900/30 dark:hover:bg-rose-800/40 dark:border-rose-800/50 text-rose-900 dark:text-rose-100';
                if (lower.includes('humanas') || lower.includes('individuals')) return 'bg-teal-100 hover:bg-teal-200 border-teal-200 dark:bg-teal-900/30 dark:hover:bg-teal-800/40 dark:border-teal-800/50 text-teal-900 dark:text-teal-100';
                if (lower.includes('algoritmos') || lower.includes('programação') || lower.includes('informática')) return 'bg-slate-100 hover:bg-slate-200 border-slate-200 dark:bg-slate-900/30 dark:hover:bg-slate-800/40 dark:border-slate-800/50 text-slate-900 dark:text-slate-100';
                if (lower.includes('astronomia') || lower.includes('sistema solar') || lower.includes('estrelas')) return 'bg-violet-100 hover:bg-violet-200 border-violet-200 dark:bg-violet-900/30 dark:hover:bg-violet-800/40 dark:border-violet-800/50 text-violet-900 dark:text-violet-100';
                if (lower.includes('aritmética') || lower.includes('álgebra') || lower.includes('geometria')) return 'bg-red-100 hover:bg-red-200 border-red-200 dark:bg-red-900/30 dark:hover:bg-red-800/40 dark:border-red-800/50 text-red-900 dark:text-red-100';
                return 'bg-gray-100 hover:bg-gray-200 border-gray-200 dark:bg-gray-900/30 dark:hover:bg-gray-800/40 dark:border-gray-800/50 text-gray-900 dark:text-gray-100';
              };
              
              const IconComponent = getSubjectIcon(subject);
              const colorClass = getSubjectColor(subject);
              return (
                <Button
                  key={index}
                  variant="outline"
                  className={`h-20 flex flex-col items-center gap-2 ${selectedExam.subjects.length % 3 !== 0 ? 'w-48' : ''} ${colorClass}`}
                  onClick={() => setSelectedSubject(subject)}
                >
                  <IconComponent size={20} />
                  <span className="text-sm text-center">{subject}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  const topics = getTopicsForSubject(selectedSubject);

  const updateProgress = (topic: string, progress: number) => {
    const newProgress = { ...studyProgress, [topic]: progress };
    setStudyProgress(newProgress);
    localStorage.setItem(`progress_${selectedExam.name}_${selectedSubject}`, JSON.stringify(newProgress));
  };

  const overallProgress = topics.length > 0 ? 
    Object.values(studyProgress).reduce((sum, val) => sum + val, 0) / topics.length : 0;

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setSelectedSubject(null)}>
            <ArrowLeft size={16} />
          </Button>
          <CardTitle className="flex items-center gap-2">
            {selectedSubject}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp size={16} />
              {Math.round(overallProgress)}% concluído
            </div>
          </CardTitle>
        </div>
        <Progress value={overallProgress} className="w-full" />
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-1">
              <BookOpen size={14} />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-1">
              <Calendar size={14} />
              Cronograma
            </TabsTrigger>
            <TabsTrigger value="practice" className="flex items-center gap-1">
              <Target size={14} />
              Prática
            </TabsTrigger>
            <TabsTrigger value="mock" className="flex items-center gap-1">
              <Timer size={14} />
              Simulados
            </TabsTrigger>
            <TabsTrigger value="techniques" className="flex items-center gap-1">
              <Zap size={14} />
              Técnicas
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-1">
              <BarChart3 size={14} />
              Análise
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <Button
                onClick={async () => {
                  try {
                    const plan = await generateStudyPlan(selectedExam.name, selectedSubject, topics);
                    const prompt = `🎯 PLANO DE ESTUDOS PERSONALIZADO

📚 ${selectedExam.name} - ${selectedSubject}

${plan}

💪 Dicas motivacionais:
- Mantenha consistência nos estudos
- Faça pausas regulares
- Pratique questões anteriores
- Acredite no seu potencial!`;
                    await sendMessageAndShowModal(prompt, `Plano de Estudos - ${selectedExam.name}`);
                  } catch (error) {
                    console.error('Erro ao gerar plano de estudos:', error);
                  }
                }}
                className="flex items-center gap-2"
              >
                <Target size={16} />
                Plano de Estudos IA
              </Button>
              
              <Button
                variant="outline"
                onClick={async () => {
                  try {
                    const strategy = await generateExamStrategy(selectedExam.name, selectedSubject);
                    const prompt = `🎯 ESTRATÉGIA DE PREPARAÇÃO

📚 ${selectedExam.name} - ${selectedSubject}

${strategy}

💡 Dicas adicionais:
🎯 Como devo priorizar meus estudos?
📊 Quais são os tópicos que mais caem?
⚡ Técnicas de resolução rápida
🧠 Como lidar com ansiedade pré-prova
📝 Dicas de gestão de tempo durante o exame

Dê conselhos práticos e motivadores!`;
                    await sendMessageAndShowModal(prompt, `Plano de Estudos - ${selectedExam.name}`);
                  } catch (error) {
                    console.error('Erro ao gerar estratégia:', error);
                  }
                }}
                className="flex items-center gap-2"
              >
                <GraduationCap size={16} />
                Estratégia de Prova
              </Button>
              
              <Button
                variant="outline"
                onClick={async () => {
                  try {
                    const bibliography = await generateBibliography(selectedExam.name, selectedSubject);
                    await sendMessageAndShowModal(bibliography, `Bibliografia - ${selectedSubject}`);
                  } catch (error) {
                    console.error('Erro ao gerar bibliografia:', error);
                  }
                }}
                className="flex items-center gap-2"
              >
                <BookOpen size={16} />
                Bibliografia
              </Button>
              
              <Button
                variant="outline"
                onClick={async () => {
                  try {
                    const coaching = await generateMotivationalCoach(selectedExam.name, selectedSubject);
                    await sendMessageAndShowModal(coaching, `Coach Motivacional - ${selectedSubject}`);
                  } catch (error) {
                    console.error('Erro ao gerar coaching:', error);
                  }
                }}
                className="flex items-center gap-2"
              >
                <Award size={16} />
                Coach Motivacional
              </Button>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Tópicos do Programa:</h4>
              {topics.map((topic, index) => {
                const progress = studyProgress[topic] || 0;
                return (
                  <div key={index} className="p-4 bg-muted rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="flex-1 font-medium">{topic}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{progress}%</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={async () => {
                            const explanation = await explainTopic(selectedExam.name, selectedSubject, topic);
                            const prompt = `📚 EXPLICAÇÃO DETALHADA

📌 ${topic} - ${selectedExam.name}

${explanation}

💡 Continue estudando! Cada conceito dominado te aproxima do seu objetivo.`;
                            await sendMessageAndShowModal(prompt, `Plano de Estudos - ${selectedExam.name}`);
                          }}
                        >
                          <BookOpen size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={async () => {
                            const questions = await generatePracticeQuestions(selectedExam.name, selectedSubject, topic);
                            const prompt = `🎯 QUESTÕES DE PRÁTICA

📝 ${topic} - ${selectedExam.name}

${questions}

🚀 Pratique regularmente! A repetição é a chave do sucesso.`;
                            await sendMessageAndShowModal(prompt, `Plano de Estudos - ${selectedExam.name}`);
                          }}
                        >
                          <Target size={14} />
                        </Button>
                      </div>
                    </div>
                    <Progress value={progress} className="w-full" />
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        {[25, 50, 75, 100].map(val => (
                          <Button
                            key={val}
                            size="sm"
                            variant={progress >= val ? "default" : "outline"}
                            onClick={() => updateProgress(topic, val)}
                            className="text-xs"
                          >
                            {val === 25 ? '🟡' : val === 50 ? '🟠' : val === 75 ? '🔵' : '🟢'} {val}%
                          </Button>
                        ))}
                      </div>
                      {progress === 100 && (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle size={16} />
                          <span className="text-xs font-medium">Concluído!</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Data da Prova</label>
                <Input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Horas de Estudo/Dia</label>
                <Select value={studyHoursPerDay} onValueChange={setStudyHoursPerDay}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 horas</SelectItem>
                    <SelectItem value="4">4 horas</SelectItem>
                    <SelectItem value="6">6 horas</SelectItem>
                    <SelectItem value="8">8 horas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button
              onClick={async () => {
                try {
                  if (!examDate) {
                    alert('Por favor, defina a data da prova primeiro.');
                    return;
                  }
                  const schedule = await generateStudySchedule(selectedExam.name, selectedSubject, topics, examDate, parseInt(studyHoursPerDay));
                  const prompt = `📅 CRONOGRAMA PERSONALIZADO

🎯 ${selectedExam.name} - ${selectedSubject}
📆 Data da Prova: ${new Date(examDate).toLocaleDateString('pt-BR')}
⏰ ${studyHoursPerDay}h/dia de estudo

${schedule}

🎯 Dicas para seguir o cronograma:
- Use alarmes para lembrar dos horários
- Faça pausas de 15min a cada hora
- Revise o progresso semanalmente
- Ajuste conforme necessário

💪 Você consegue! Disciplina é a chave do sucesso!`;
                  await sendMessageAndShowModal(prompt, `Cronograma - ${selectedExam.name}`);
                } catch (error) {
                  console.error('Erro ao gerar cronograma:', error);
                }
              }}
              className="w-full flex items-center gap-2"
            >
              <Calendar size={16} />
              Gerar Cronograma Inteligente
            </Button>
          </TabsContent>

          <TabsContent value="practice" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center gap-2"
                onClick={async () => {
                  try {
                    const questions = await generateQuickQuestions(selectedExam.name, selectedSubject);
                    await sendMessageAndShowModal(questions, `Questões - ${selectedSubject}`);
                  } catch (error) {
                    console.error('Erro ao gerar questões rápidas:', error);
                  }
                }}
              >
                <Zap size={20} />
                <span className="text-center">Questões Rápidas</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center gap-2"
                onClick={async () => {
                  try {
                    const questions = await generateEssayQuestions(selectedExam.name, selectedSubject);
                    await sendMessageAndShowModal(questions, `Questões - ${selectedSubject}`);
                  } catch (error) {
                    console.error('Erro ao gerar questões dissertativas:', error);
                  }
                }}
              >
                <PenTool size={20} />
                <span className="text-center">Questões Dissertativas</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center gap-2"
                onClick={async () => {
                  try {
                    const questions = await generateChallengeQuestions(selectedExam.name, selectedSubject);
                    await sendMessageAndShowModal(questions, `Questões - ${selectedSubject}`);
                  } catch (error) {
                    console.error('Erro ao gerar questões desafio:', error);
                  }
                }}
              >
                <Trophy size={20} />
                <span className="text-center">Questões Desafio</span>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="mock" className="space-y-6 mt-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold">Simulados Personalizados</h3>
              <p className="text-muted-foreground">Pratique com simulados no formato real da prova</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                className="h-20 flex flex-col items-center gap-2"
                disabled={isGeneratingQuickMock || isGeneratingFullMock}
                onClick={async () => {
                  setIsGeneratingQuickMock(true);
                  try {
                    toast({
                      title: "Gerando simulado...",
                      description: "Isso pode levar alguns instantes. Por favor, aguarde.",
                    });
                    
                    const mockExam = await generateMockExam(selectedExam.name, selectedSubject, 'quick');
                    
                    if (mockExam && !mockExam.includes('⚠️ Erro') && mockExam.length > 50) {
                      const prompt = `⚡ SIMULADO RÁPIDO - ${selectedExam.name}

📚 ${selectedSubject} | ⏱️ 30 minutos

${mockExam}

🎯 Instruções:
- Cronometre 30 minutos
- Não consulte material
- Anote suas respostas
- Compare com o gabarito

💪 Boa sorte! Trate como prova real!`;
                      
                      const response = await sendMessageAndShowModal(prompt, `Simulado - ${selectedExam.name}`);
                      
                      if (response.success) {
                        toast({
                          title: "Simulado gerado!",
                          description: "O simulado foi enviado para o chat. Abra o chat para visualizar.",
                        });
                      } else {
                        toast({
                          title: "Erro ao enviar",
                          description: "O simulado foi gerado, mas houve um erro ao enviar para o chat.",
                          variant: "destructive",
                        });
                      }
                    } else {
                      toast({
                        title: "Erro ao gerar simulado",
                        description: mockExam || "Não foi possível gerar o simulado. Tente novamente.",
                        variant: "destructive",
                      });
                      
                      const errorPrompt = `⚠️ Erro ao gerar simulado rápido para ${selectedExam.name} - ${selectedSubject}.\n\n${mockExam}\n\nPor favor, tente novamente em alguns instantes.`;
                      await sendMessageAndShowModal(errorPrompt, `Erro - Simulado`);
                    }
                  } catch (error) {
                    console.error('Erro ao gerar simulado rápido:', error);
                    toast({
                      title: "Erro",
                      description: error instanceof Error ? error.message : "Erro desconhecido ao gerar simulado.",
                      variant: "destructive",
                    });
                    
                    const errorPrompt = `⚠️ Erro ao gerar simulado rápido: ${error instanceof Error ? error.message : 'Erro desconhecido'}\n\nPor favor, tente novamente.`;
                    await sendMessageAndShowModal(errorPrompt, `Erro - Simulado`);
                  } finally {
                    setIsGeneratingQuickMock(false);
                  }
                }}
              >
                {isGeneratingQuickMock ? (
                  <>
                    <Loader2 size={24} className="animate-spin" />
                    <span>Gerando...</span>
                  </>
                ) : (
                  <>
                    <Clock size={24} />
                    <span>Simulado Rápido (30min)</span>
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center gap-2"
                disabled={isGeneratingQuickMock || isGeneratingFullMock}
                onClick={async () => {
                  setIsGeneratingFullMock(true);
                  try {
                    toast({
                      title: "Gerando simulado...",
                      description: "Isso pode levar alguns instantes. Por favor, aguarde.",
                    });
                    
                    const mockExam = await generateMockExam(selectedExam.name, selectedSubject, 'full');
                    
                    if (mockExam && !mockExam.includes('⚠️ Erro') && mockExam.length > 50) {
                      const prompt = `📋 SIMULADO COMPLETO - ${selectedExam.name}

📚 ${selectedSubject} | ⏱️ 2 horas

${mockExam}

🎯 Instruções:
- Ambiente silencioso
- Cronometre 2 horas
- Sem consultas
- Simule condições reais

🏆 Este é o momento da verdade!`;
                      
                      const response = await sendMessageAndShowModal(prompt, `Simulado - ${selectedExam.name}`);
                      
                      if (response.success) {
                        toast({
                          title: "Simulado gerado!",
                          description: "O simulado foi enviado para o chat. Abra o chat para visualizar.",
                        });
                      } else {
                        toast({
                          title: "Erro ao enviar",
                          description: "O simulado foi gerado, mas houve um erro ao enviar para o chat.",
                          variant: "destructive",
                        });
                      }
                    } else {
                      toast({
                        title: "Erro ao gerar simulado",
                        description: mockExam || "Não foi possível gerar o simulado. Tente novamente.",
                        variant: "destructive",
                      });
                      
                      const errorPrompt = `⚠️ Erro ao gerar simulado completo para ${selectedExam.name} - ${selectedSubject}.\n\n${mockExam}\n\nPor favor, tente novamente em alguns instantes.`;
                      await sendMessageAndShowModal(errorPrompt, `Erro - Simulado`);
                    }
                  } catch (error) {
                    console.error('Erro ao gerar simulado completo:', error);
                    toast({
                      title: "Erro",
                      description: error instanceof Error ? error.message : "Erro desconhecido ao gerar simulado.",
                      variant: "destructive",
                    });
                    
                    const errorPrompt = `⚠️ Erro ao gerar simulado completo: ${error instanceof Error ? error.message : 'Erro desconhecido'}\n\nPor favor, tente novamente.`;
                    await sendMessageAndShowModal(errorPrompt, `Erro - Simulado`);
                  } finally {
                    setIsGeneratingFullMock(false);
                  }
                }}
              >
                {isGeneratingFullMock ? (
                  <>
                    <Loader2 size={24} className="animate-spin" />
                    <span>Gerando...</span>
                  </>
                ) : (
                  <>
                    <FileText size={24} />
                    <span>Simulado Completo (2h)</span>
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="techniques" className="space-y-6 mt-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold">Técnicas de Estudo Avançadas</h3>
              <p className="text-muted-foreground">Otimize seu aprendizado com métodos cientificamente comprovados</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center gap-2"
                onClick={async () => {
                  try {
                    const feynman = await generateFeynmanMethod(selectedExam.name, selectedSubject, topics);
                    await sendMessageAndShowModal(feynman, `Método Feynman - ${selectedSubject}`);
                  } catch (error) {
                    console.error('Erro ao gerar Método Feynman:', error);
                  }
                }}
              >
                <Users size={20} />
                <span className="text-center">Método Feynman</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center gap-2"
                onClick={async () => {
                  try {
                    const spacedRep = await generateSpacedRepetition(selectedExam.name, selectedSubject, topics);
                    await sendMessageAndShowModal(spacedRep, `Repetição Espaçada - ${selectedSubject}`);
                  } catch (error) {
                    console.error('Erro ao gerar Repetição Espaçada:', error);
                  }
                }}
              >
                <Clock size={20} />
                <span className="text-center">Repetição Espaçada</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center gap-2"
                onClick={async () => {
                  try {
                    const mindMaps = await generateMindMaps(selectedExam.name, selectedSubject, topics);
                    await sendMessageAndShowModal(mindMaps, `Mapas Mentais - ${selectedSubject}`);
                  } catch (error) {
                    console.error('Erro ao gerar Mapas Mentais:', error);
                  }
                }}
              >
                <Telescope size={20} />
                <span className="text-center">Mapas Mentais</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center gap-2"
                onClick={async () => {
                  try {
                    const pomodoro = await generatePersonalizedPomodoro(selectedExam.name, selectedSubject, topics);
                    await sendMessageAndShowModal(pomodoro, `Pomodoro - ${selectedSubject}`);
                  } catch (error) {
                    console.error('Erro ao gerar Pomodoro Personalizado:', error);
                  }
                }}
              >
                <Timer size={20} />
                <span className="text-center">Pomodoro Personalizado</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center gap-2"
                onClick={async () => {
                  try {
                    const association = await generateAssociationTechnique(selectedExam.name, selectedSubject, topics);
                    await sendMessageAndShowModal(association, `Associação - ${selectedSubject}`);
                  } catch (error) {
                    console.error('Erro ao gerar Técnica de Associação:', error);
                  }
                }}
              >
                <Zap size={20} />
                <span className="text-center">Técnica de Associação</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center gap-2"
                onClick={async () => {
                  try {
                    const summaries = await generateStrategicSummaries(selectedExam.name, selectedSubject, topics);
                    await sendMessageAndShowModal(summaries, `Resumos - ${selectedSubject}`);
                  } catch (error) {
                    console.error('Erro ao gerar Resumos Estratégicos:', error);
                  }
                }}
              >
                <FileText size={20} />
                <span className="text-center">Resumos Estratégicos</span>
              </Button>
            </div>
            
            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">💡 Dica do Especialista</h4>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                Combine diferentes técnicas para maximizar o aprendizado. Use mapas mentais para visão geral, 
                Feynman para compreensão profunda, e repetição espaçada para fixação duradoura.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{Math.round(overallProgress)}%</div>
                  <div className="text-sm text-muted-foreground">Progresso Geral</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {Object.values(studyProgress).filter(p => p === 100).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Tópicos Concluídos</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {topics.length - Object.values(studyProgress).filter(p => p === 100).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Tópicos Restantes</div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={async () => {
                  try {
                    const analysis = await analyzePerformance(selectedExam.name, selectedSubject, studyProgress, topics);
                    const prompt = `📊 ANÁLISE DE DESEMPENHO

🎯 ${selectedExam.name} - ${selectedSubject}

${analysis}

🎯 Próximos Passos:
- Foque nos pontos fracos identificados
- Mantenha a consistência nos estudos
- Faça revisões regulares
- Pratique mais questões

💪 Você está no caminho certo! Continue assim!`;
                    await sendMessageAndShowModal(prompt, `Plano de Estudos - ${selectedExam.name}`);
                  } catch (error) {
                    console.error('Erro ao analisar desempenho:', error);
                  }
                }}
                className="flex items-center gap-2"
              >
                <BarChart3 size={16} />
                Analisar Desempenho
              </Button>
              
              <Button
                variant="outline"
                onClick={async () => {
                  try {
                    const memorization = await generateMemorizationTechniques(selectedExam.name, selectedSubject, topics);
                    await sendMessageAndShowModal(memorization, `Memorização - ${selectedSubject}`);
                  } catch (error) {
                    console.error('Erro ao gerar técnicas de memorização:', error);
                  }
                }}
                className="flex items-center gap-2"
              >
                <Zap size={16} />
                Técnicas de Memorização
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {/* Modal para exibir respostas da IA */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{modalTitle}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsModalOpen(false)}
                className="h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto pr-2">
            {isLoadingResponse ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Gerando resposta...</span>
              </div>
            ) : (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // Estilização personalizada para markdown
                    h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-5 mb-3" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-lg font-semibold mt-4 mb-2" {...props} />,
                    p: ({node, ...props}) => <p className="mb-3 leading-relaxed" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 space-y-1" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 space-y-1" {...props} />,
                    li: ({node, ...props}) => <li className="mb-1" {...props} />,
                    code: ({node, inline, ...props}: any) => 
                      inline ? (
                        <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
                      ) : (
                        <code className="block bg-muted p-3 rounded-md text-sm font-mono overflow-x-auto mb-4" {...props} />
                      ),
                    blockquote: ({node, ...props}) => (
                      <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground" {...props} />
                    ),
                    strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                    em: ({node, ...props}) => <em className="italic" {...props} />,
                  }}
                >
                  {modalContent}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ExamPrep;