import React, { useState } from 'react';
import { GraduationCap, Calculator, BookOpen, Target, ArrowLeft, School, Languages, History, Globe, Atom, Zap, Beaker, Dna, PenTool, Mic, Headphones, Palette, Users, Code, Telescope, Trophy } from 'lucide-react';
import { generateExamStrategy, generateStudyPlan, explainTopic, generatePracticeQuestions } from '@/shared/services';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { sendMessage } from '@/shared/services/chatService';

const ExamPrep: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);

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
      const prompt = `🎓 ANÁLISE DE VIABILIDADE SISU/PROUNI

📊 MINHAS NOTAS DO ENEM:
• Linguagens: ${scores.linguagens}
• Ciências Humanas: ${scores.humanas}
• Ciências da Natureza: ${scores.natureza}
• Matemática: ${scores.matematica}
• Redação: ${scores.redacao}

📈 Média Simples: ${avg.toFixed(2)}

🎯 OBJETIVO:
• Curso: ${desiredCourse}
• Modalidade: ${category}

Por favor, me ajude com:

1. 🏛️ UNIVERSIDADES VIÁVEIS
   - Liste universidades federais/estaduais onde tenho BOA chance
   - Mencione as notas de corte recentes (2023/2024)

2. ⚠️ OPÇÕES ARRISCADAS
   - Universidades onde seria mais difícil, mas possível

3. ⚖️ SISTEMA DE PESOS
   - Como ${desiredCourse} costuma pesar as áreas?
   - Qual minha nota ponderada estimada?

4. 💡 ESTRATÉGIAS
   - Devo focar em melhorar alguma área específica?
   - Dicas para escolha de cursos no SiSU

5. 🧠 APOIO EMOCIONAL
   - Como lidar com a ansiedade da espera?
   - Mensagem motivacional personalizada

Seja realista mas encorajador! 💪`;
      
      await sendMessage(prompt, []);
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              const IconComponent = getSubjectIcon(subject);
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="h-20 flex flex-col items-center gap-2"
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

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setSelectedSubject(null)}>
            <ArrowLeft size={16} />
          </Button>
          <CardTitle>{selectedSubject}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={async () => {
              const plan = await generateStudyPlan(selectedExam.name, selectedSubject, topics);
              const prompt = `🎯 PLANO DE ESTUDOS PERSONALIZADO

📚 ${selectedExam.name} - ${selectedSubject}

${plan}

💪 Dicas motivacionais:
- Mantenha consistência nos estudos
- Faça pausas regulares
- Pratique questões anteriores
- Acredite no seu potencial!`;
              await sendMessage(prompt, []);
            }}
            className="flex items-center gap-2"
          >
            <Target size={16} />
            Criar Plano de Estudos com IA
          </Button>
          
          <Button
            variant="outline"
            onClick={async () => {
              const prompt = `Analise a estratégia de preparação para ${selectedExam.name} - ${selectedSubject}:

🎯 Como devo priorizar meus estudos?
📊 Quais são os tópicos que mais caem?
⚡ Técnicas de resolução rápida
🧠 Como lidar com ansiedade pré-prova
📝 Dicas de gestão de tempo durante o exame

Dê conselhos práticos e motivadores!`;
              await sendMessage(prompt, []);
            }}
            className="flex items-center gap-2"
          >
            <GraduationCap size={16} />
            Estratégia de Prova
          </Button>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium">Tópicos do Programa:</h4>
          {topics.map((topic, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="flex-1">{topic}</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={async () => {
                    const explanation = await explainTopic(selectedExam.name, selectedSubject, topic);
                    const prompt = `📚 EXPLICAÇÃO DETALHADA

📌 ${topic} - ${selectedExam.name}

${explanation}

💡 Continue estudando! Cada conceito dominado te aproxima do seu objetivo.`;
                    await sendMessage(prompt, []);
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
                    await sendMessage(prompt, []);
                  }}
                >
                  <Target size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExamPrep;