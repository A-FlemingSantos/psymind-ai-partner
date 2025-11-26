import { sendMessage } from './chatService';

export async function explainCalculation(calculation: string, result: string) {
  const prompt = `Explique brevemente (1-2 frases) o cálculo: ${calculation} = ${result}. Sem saudações.`;
  const response = await sendMessage(prompt, []);
  return response.success ? response.text : 'Não foi possível explicar o cálculo.';
}

export async function generateStudyTip() {
  const prompt = 'Gere uma dica rápida de produtividade para estudos (1 frase). Sem saudações.';
  const response = await sendMessage(prompt, []);
  return response.success ? response.text : 'Mantenha o foco e faça pausas regulares.';
}

export async function improveNote(content: string) {
  const prompt = `Melhore esta anotação tornando-a mais clara e organizada: "${content}". Mantenha o mesmo conteúdo, apenas reorganize. Sem saudações.`;
  const response = await sendMessage(prompt, []);
  return response.success ? response.text : content;
}

export async function generateFlashcardFromText(text: string) {
  const prompt = `Crie uma pergunta e resposta para flashcard baseado neste texto: "${text}". Formato: "Pergunta|Resposta". Sem saudações.`;
  const response = await sendMessage(prompt, []);
  if (response.success && response.text.includes('|')) {
    const [front, back] = response.text.split('|');
    return { front: front.trim(), back: back.trim() };
  }
  return null;
}

export async function generateExamStrategy(examName: string, subject: string) {
  const examStrategies: { [key: string]: string } = {
    'FUVEST': 'A FUVEST (USP) é conhecida por questões dissertativas e interpretativas. Foque em análise crítica e escrita clara.',
    'COMVEST': 'A Unicamp valoriza interdisciplinaridade e questões contextualizadas. Pratique relacionar conhecimentos.',
    'VUNESP': 'A Unesp tem questões objetivas bem elaboradas. Treine eliminação de alternativas e gestão de tempo.',
    'ENEM': 'O ENEM foca em competências e habilidades. Pratique interpretação de textos e situações-problema.',
    'SAT': 'O SAT americano exige velocidade e precisão. Pratique com cronômetro e técnicas de eliminação.',
    'TOEFL': 'O TOEFL testa proficiência em inglês acadêmico. Foque em vocabulário técnico e estruturas complexas.',
    'IELTS': 'O IELTS avalia inglês para contextos acadêmicos e profissionais. Pratique diferentes sotaques e registros.',
    'OBMEP': 'A OBMEP valoriza raciocínio lógico e criatividade matemática. Pratique problemas não convencionais.'
  };
  
  const baseStrategy = examStrategies[examName] || 'Foque nos fundamentos e pratique questões anteriores.';
  
  const prompt = `Estratégia para ${examName} - ${subject}:\n\n${baseStrategy}\n\nDê 5 dicas específicas de preparação para esta matéria neste vestibular. Seja direto e prático. Sem saudações.`;
  
  const response = await sendMessage(prompt, []);
  return response.success ? response.text : 'Foque nos conceitos fundamentais e pratique questões anteriores.';
}

export async function generateStudyPlan(examName: string, subject: string, topics: string[]) {
  const examContexts: { [key: string]: string } = {
    'FUVEST': 'questões dissertativas e análise crítica',
    'COMVEST': 'abordagem interdisciplinar e contextualizada', 
    'VUNESP': 'questões objetivas bem estruturadas',
    'ENEM': 'competências, habilidades e situações-problema',
    'SAT': 'formato americano com foco em velocidade',
    'TOEFL': 'proficiência acadêmica em inglês',
    'IELTS': 'inglês para contextos internacionais',
    'OBMEP': 'raciocínio lógico e criatividade matemática'
  };
  
  const context = examContexts[examName] || 'preparação geral';
  
  const prompt = `Plano de estudos para ${examName} - ${subject}:\n\nTópicos: ${topics.join(', ')}\nFoco: ${context}\n\nCrie um plano com:\n1. Ordem de estudo\n2. Tempo por tópico\n3. Técnicas específicas\n4. Recursos recomendados\n\nSeja prático e direto. Sem saudações.`;
  
  const response = await sendMessage(prompt, []);
  return response.success ? response.text : 'Estude os tópicos em ordem de dificuldade crescente.';
}

export async function explainTopic(examName: string, subject: string, topic: string) {
  const prompt = `Explique para ${examName} - ${subject}:\n\nTópico: ${topic}\n\nIncluindo:\n1. Conceitos fundamentais\n2. Como aparece na prova\n3. Exemplo prático\n4. Dica de memorização\n\nSeja didático e direto. Sem saudações.`;
  
  const response = await sendMessage(prompt, []);
  return response.success ? response.text : 'Conceito importante que requer estudo aprofundado.';
}

export async function generatePracticeQuestions(examName: string, subject: string, topic: string) {
  const prompt = `Crie 3 questões para ${examName} sobre:\n\n${topic} (${subject})\n\nFormato:\n- Questão 1 (fácil)\n- Questão 2 (média) \n- Questão 3 (difícil)\n- Gabarito comentado\n\nEstilo da prova ${examName}. Sem saudações.`;
  
  const response = await sendMessage(prompt, []);
  return response.success ? response.text : 'Pratique com questões anteriores desta prova.';
}

export async function generateStudySchedule(examName: string, subject: string, topics: string[], examDate: string, hoursPerDay: number) {
  const daysUntilExam = Math.ceil((new Date(examDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const totalHours = daysUntilExam * hoursPerDay;
  
  const prompt = `Cronograma de estudos para ${examName} - ${subject}:\n\nTópicos: ${topics.join(', ')}\nDias até a prova: ${daysUntilExam}\nHoras/dia: ${hoursPerDay}\nTotal de horas: ${totalHours}\n\nCrie um cronograma detalhado com:\n1. Distribuição semanal\n2. Tempo por tópico\n3. Dias de revisão\n4. Simulados programados\n5. Descanso antes da prova\n\nSeja específico com datas. Sem saudações.`;
  
  const response = await sendMessage(prompt, []);
  return response.success ? response.text : 'Distribua o tempo igualmente entre os tópicos.';
}

export async function generateMockExam(examName: string, subject: string, type: 'quick' | 'full'): Promise<string> {
  const duration = type === 'quick' ? '30 minutos, 10 questões' : '2 horas, 30 questões';
  const questionCount = type === 'quick' ? 10 : 30;
  
  const prompt = `Crie um SIMULADO COMPLETO para ${examName} - ${subject}:\n\nTipo: ${type === 'quick' ? 'Rápido' : 'Completo'}\nDuração: ${duration}\nQuantidade de questões: ${questionCount}\n\nEstrutura obrigatória:\n\n1. 📋 INSTRUÇÕES GERAIS\n   - Formato da prova ${examName}\n   - Tempo total disponível\n   - Como marcar as respostas\n\n2. 📝 QUESTÕES (${questionCount} questões)\n   Para cada questão, inclua:\n   - Número da questão\n   - Enunciado completo e claro\n   - ${type === 'quick' ? '5 alternativas (A-E)' : '5 alternativas (A-E) ou formato dissertativo conforme o estilo de ' + examName}\n   - Nível de dificuldade (Fácil/Médio/Difícil)\n   - Tempo sugerido por questão\n   - Tópico/conteúdo abordado\n\n3. ✅ GABARITO COMENTADO\n   - Respostas corretas (questão por questão)\n   - Explicação breve de cada resposta\n   - Por que as outras alternativas estão incorretas\n\n4. 📊 CRITÉRIOS DE CORREÇÃO\n   - Como calcular a nota\n   - Sistema de pontuação do ${examName}\n   - Dicas de como melhorar\n\n5. 💡 DICAS FINAIS\n   - Estratégias para o dia da prova\n   - Como revisar antes do exame\n\nIMPORTANTE:\n- Use o estilo e formato real da prova ${examName}\n- Questões devem ser realistas e baseadas em provas anteriores\n- Dificuldade progressiva (começar fácil, terminar mais difícil)\n- Incluir questões interdisciplinares se aplicável\n- Formatação clara e organizada\n\nSem saudações. Comece diretamente com as instruções.`;
  
  try {
    const response = await sendMessage(prompt, []);
    if (response.success && response.text) {
      return response.text;
    } else {
      return `⚠️ Erro ao gerar simulado. Por favor, tente novamente.\n\nSe o problema persistir, verifique sua conexão com a internet.`;
    }
  } catch (error) {
    console.error('Erro ao gerar simulado:', error);
    return `⚠️ Erro ao gerar simulado: ${error instanceof Error ? error.message : 'Erro desconhecido'}`;
  }
}

export async function analyzePerformance(examName: string, subject: string, progress: {[key: string]: number}, topics: string[]) {
  const completedTopics = Object.entries(progress).filter(([_, p]) => p === 100).map(([topic, _]) => topic);
  const inProgressTopics = Object.entries(progress).filter(([_, p]) => p > 0 && p < 100).map(([topic, p]) => `${topic} (${p}%)`);
  const notStartedTopics = topics.filter(topic => !progress[topic] || progress[topic] === 0);
  
  const prompt = `Análise de desempenho ${examName} - ${subject}:\n\nTópicos concluídos (${completedTopics.length}): ${completedTopics.join(', ')}\n\nEm progresso (${inProgressTopics.length}): ${inProgressTopics.join(', ')}\n\nNão iniciados (${notStartedTopics.length}): ${notStartedTopics.join(', ')}\n\nForneça:\n1. Avaliação do progresso\n2. Pontos fortes e fracos\n3. Recomendações específicas\n4. Estratégia de priorização\n5. Motivação personalizada\n\nSeja encorajador mas realista. Sem saudações.`;
  
  const response = await sendMessage(prompt, []);
  return response.success ? response.text : 'Continue focando nos tópicos mais importantes.';
}

export async function generateKindnessIdea() {
  const prompt = 'Sugira uma ação de gentileza simples que posso fazer hoje (1-2 frases). Seja específico e prático. Sem saudações.';
  const response = await sendMessage(prompt, []);
  return response.success ? response.text : 'Envie uma mensagem carinhosa para alguém especial.';
}

export async function analyzeMood(mood: string, intensity: number) {
  const prompt = `Analise este estado emocional: ${mood} (intensidade ${intensity}/10). Forneça:\n1. Possíveis causas\n2. Estratégias de regulação\n3. Atividades recomendadas\n4. Dicas de bem-estar\n\nSeja empático e prático. Sem saudações.`;
  const response = await sendMessage(prompt, []);
  return response.success ? response.text : 'Reconheça seus sentimentos e seja gentil consigo mesmo.';
}

export async function generateReflectionPrompt() {
  const prompts = [
    'O que aprendi sobre mim hoje?',
    'Qual foi meu maior desafio hoje e como o superei?',
    'Por que três coisas sou grato hoje?',
    'Como posso melhorar amanhã?',
    'Que emoção predominou hoje e por quê?',
    'Qual foi meu momento de maior orgulho hoje?'
  ];
  return prompts[Math.floor(Math.random() * prompts.length)];
}

export async function generatePomodoroMotivation() {
  const motivations = [
    '🎯 Foco total! Cada minuto conta para seu sucesso.',
    '💪 Você está mais forte a cada sessão completada!',
    '🚀 Produtividade em alta! Continue assim!',
    '⭐ Excelente! Sua disciplina está pagando dividendos.',
    '🔥 Imparável! Mais uma sessão rumo aos seus objetivos.',
    '🏆 Campeão da produtividade! Siga em frente!'
  ];
  return motivations[Math.floor(Math.random() * motivations.length)];
}

export async function translateText(text: string, fromLanguage: string, toLanguage: string) {
  const languageNames: { [key: string]: string } = {
    'pt': 'Português',
    'en': 'Inglês',
    'es': 'Espanhol',
    'fr': 'Francês',
    'de': 'Alemão',
    'it': 'Italiano',
    'ja': 'Japonês',
    'ko': 'Coreano',
    'zh': 'Chinês',
    'ru': 'Russo'
  };

  const fromLangName = languageNames[fromLanguage] || fromLanguage;
  const toLangName = languageNames[toLanguage] || toLanguage;

  const prompt = `Traduza o seguinte texto de ${fromLangName} para ${toLangName}.\n\nConsidere:\n- Contexto e nuances culturais\n- Expressões idiomáticas\n- Tom e estilo do texto original\n- Mantenha a formatação quando possível\n\nTexto a traduzir:\n"""\n${text}\n"""\n\nForneça apenas a tradução, sem explicações adicionais. Sem saudações.`;
  
  const response = await sendMessage(prompt, []);
  return response.success ? response.text : 'Não foi possível traduzir o texto.';
}

export interface Question {
  question: string;
  type: string;
  difficulty: string;
  answer?: string;
}

export async function generateQuestionsFromText(
  text: string, 
  questionType: string, 
  difficulty: string, 
  count: number
): Promise<Question[]> {
  const typeMap: { [key: string]: string } = {
    'mixed': 'mistos (múltipla escolha, dissertativa, verdadeiro/falso, completar)',
    'multiple': 'múltipla escolha',
    'essay': 'dissertativas',
    'truefalse': 'verdadeiro/falso',
    'complete': 'completar'
  };

  const difficultyMap: { [key: string]: string } = {
    'easy': 'fácil',
    'medium': 'médio',
    'hard': 'difícil'
  };

  const typeDescription = typeMap[questionType] || 'mistos';
  const difficultyDescription = difficultyMap[difficulty] || 'médio';

  const prompt = `Gere ${count} questões ${typeDescription} de dificuldade ${difficultyDescription} baseadas no seguinte conteúdo:\n\n"""\n${text}\n"""\n\nFormato de resposta (uma questão por linha, separadas por "---"):\nQUESTÃO: [texto da questão]\nTIPO: [tipo da questão]\nDIFICULDADE: ${difficulty}\nRESPOSTA: [resposta ou gabarito, se aplicável]\n---\n\nSeja criativo e varie os tipos de questões. Sem saudações.`;
  
  const response = await sendMessage(prompt, []);
  
  if (!response.success) {
    return [];
  }

  // Parse da resposta da IA - mais flexível
  const questions: Question[] = [];
  
  // Tenta dividir por separadores comuns
  const separators = ['---', '***', '###', '\n\n'];
  let questionBlocks: string[] = [];
  
  for (const sep of separators) {
    const blocks = response.text.split(sep).filter(block => block.trim());
    if (blocks.length > 1) {
      questionBlocks = blocks;
      break;
    }
  }
  
  // Se não encontrou separadores, tenta dividir por números (1., 2., etc)
  if (questionBlocks.length <= 1) {
    const numberedSplit = response.text.split(/(?=\d+[\.\)]\s)/);
    if (numberedSplit.length > 1) {
      questionBlocks = numberedSplit;
    } else {
      // Último recurso: divide o texto em partes iguais
      const textLength = response.text.length;
      const blockSize = Math.ceil(textLength / count);
      questionBlocks = [];
      for (let i = 0; i < count; i++) {
        const start = i * blockSize;
        const end = Math.min(start + blockSize, textLength);
        questionBlocks.push(response.text.substring(start, end));
      }
    }
  }

  for (const block of questionBlocks.slice(0, count)) {
    const lines = block.split('\n').filter(line => line.trim());
    let question = '';
    let type = questionType === 'mixed' ? 'Misto' : typeMap[questionType] || 'Misto';
    let difficultyLevel = difficulty;
    let answer = '';
    let currentSection = '';

    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      
      if (lowerLine.includes('questão:') || lowerLine.includes('questao:') || lowerLine.match(/^\d+[\.\)]\s/)) {
        question = line.replace(/^.*?(questão|questao):\s*/i, '').replace(/^\d+[\.\)]\s*/, '').trim();
        currentSection = 'question';
      } else if (lowerLine.includes('tipo:')) {
        type = line.replace(/^.*?tipo:\s*/i, '').trim();
        currentSection = 'type';
      } else if (lowerLine.includes('dificuldade:')) {
        difficultyLevel = line.replace(/^.*?dificuldade:\s*/i, '').trim();
        currentSection = 'difficulty';
      } else if (lowerLine.includes('resposta:') || lowerLine.includes('gabarito:')) {
        answer = line.replace(/^.*?(resposta|gabarito):\s*/i, '').trim();
        currentSection = 'answer';
      } else if (line.trim()) {
        // Continua acumulando o conteúdo da seção atual
        if (currentSection === 'question' || (!question && !currentSection)) {
          question += (question ? ' ' : '') + line.trim();
        } else if (currentSection === 'answer') {
          answer += (answer ? ' ' : '') + line.trim();
        }
      }
    }

    // Se não encontrou questão explícita, usa a primeira linha não vazia
    if (!question) {
      const firstNonEmpty = lines.find(l => l.trim() && !l.toLowerCase().includes('tipo:') && !l.toLowerCase().includes('dificuldade:') && !l.toLowerCase().includes('resposta:'));
      if (firstNonEmpty) {
        question = firstNonEmpty.trim();
      }
    }

    if (question) {
      questions.push({
        question: question.trim(),
        type: type || 'Misto',
        difficulty: difficultyLevel || difficulty,
        answer: answer.trim() || undefined
      });
    }
  }

  // Se não conseguiu parsear nenhuma questão, tenta extrair do texto diretamente
  if (questions.length === 0) {
    // Divide o texto em partes e cria questões básicas
    const textParts = response.text.split(/\n{2,}/).filter(p => p.trim());
    for (let i = 0; i < Math.min(count, textParts.length); i++) {
      const part = textParts[i].trim();
      if (part.length > 10) { // Só adiciona se tiver conteúdo significativo
        questions.push({
          question: part,
          type: typeDescription,
          difficulty: difficulty,
          answer: undefined
        });
      }
    }
  }

  return questions;
}

export interface Correction {
  original: string;
  corrected: string;
  type: 'grammar' | 'spelling' | 'style';
  explanation: string;
}

export interface TextCorrectionResult {
  correctedText: string;
  corrections: Correction[];
}

export async function correctText(text: string): Promise<TextCorrectionResult> {
  const prompt = `Corrija o seguinte texto em português, identificando e corrigindo:\n1. Erros de gramática\n2. Erros de ortografia\n3. Problemas de estilo e clareza\n\nTexto a corrigir:\n"""\n${text}\n"""\n\nForneça a resposta no seguinte formato JSON (sem markdown, apenas JSON puro):\n{\n  "correctedText": "texto corrigido completo",\n  "corrections": [\n    {\n      "original": "texto original com erro",\n      "corrected": "texto corrigido",\n      "type": "grammar|spelling|style",\n      "explanation": "explicação da correção"\n    }\n  ]\n}\n\nSeja preciso e detalhado. Sem saudações.`;
  
  const response = await sendMessage(prompt, []);
  
  if (!response.success) {
    return {
      correctedText: text,
      corrections: []
    };
  }

  try {
    // Tenta extrair JSON da resposta (pode estar dentro de markdown code blocks)
    let jsonText = response.text;
    
    // Remove markdown code blocks se existirem
    const codeBlockMatch = jsonText.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (codeBlockMatch) {
      jsonText = codeBlockMatch[1];
    } else {
      // Tenta encontrar JSON entre chaves
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonText = jsonMatch[0];
      }
    }
    
    if (jsonText) {
      const parsed = JSON.parse(jsonText);
      return {
        correctedText: parsed.correctedText || text,
        corrections: Array.isArray(parsed.corrections) ? parsed.corrections : []
      };
    }

    // Se não encontrou JSON estruturado, assume que a resposta é o texto corrigido
    // e tenta extrair correções do texto
    const corrections: Correction[] = [];
    const correctedText = response.text.trim();
    
    // Tenta identificar padrões de correção no texto (ex: "corrigido: X → Y")
    const correctionPatterns = [
      /(?:original|erro|antes)[:\s]+["']?([^"']+)["']?\s*(?:→|->|para|corrigido)[:\s]+["']?([^"']+)["']?/gi,
      /["']([^"']+)["']\s*(?:→|->)\s*["']([^"']+)["']/gi
    ];
    
    for (const pattern of correctionPatterns) {
      let match;
      while ((match = pattern.exec(response.text)) !== null) {
        if (match[1] && match[2]) {
          corrections.push({
            original: match[1].trim(),
            corrected: match[2].trim(),
            type: 'grammar',
            explanation: 'Correção identificada automaticamente'
          });
        }
      }
    }
    
    return {
      correctedText: correctedText || text,
      corrections
    };
  } catch (error) {
    console.error('Erro ao parsear resposta do corretor:', error);
    // Se falhou completamente, retorna o texto original
    return {
      correctedText: response.text.trim() || text,
      corrections: []
    };
  }
}

export async function summarizeText(text: string): Promise<string> {
  const prompt = `Resuma o seguinte texto de forma clara e concisa, destacando os pontos principais:\n\n"""\n${text}\n"""\n\nO resumo deve:\n- Manter as informações mais relevantes\n- Ser objetivo e direto\n- Preservar o contexto importante\n- Usar formatação markdown para melhor leitura (listas, negrito para tópicos principais)\n\nForneça apenas o resumo. Sem saudações.`;
  
  const response = await sendMessage(prompt, []);
  return response.success ? response.text : 'Não foi possível gerar o resumo.';
}

// Funções específicas para Preparatório Vestibulares (ExamPrep)

export async function generateBibliography(examName: string, subject: string): Promise<string> {
  const prompt = `📚 BIBLIOGRAFIA ESSENCIAL - ${subject}\n\n🎯 Vestibular: ${examName}\n📝 Matéria: ${subject}\n\nRecomende:\n\n📚 LIVROS PRINCIPAIS (3-5 títulos)\n- Autor, título e por que é essencial\n- Qual parte focar para ${examName}\n\n📱 RECURSOS DIGITAIS\n- Apps recomendados\n- Canais do YouTube\n- Sites especializados\n- Plataformas online\n\n📝 MATERIAIS COMPLEMENTARES\n- Apostilas específicas\n- Resumos e mapas mentais\n- Bancos de questões\n\n📊 COMO USAR CADA RECURSO\n- Ordem de estudo\n- Tempo dedicado a cada um\n- Dicas de aproveitamento\n\n💡 Foque nos recursos mais eficientes para ${examName}! Sem saudações.`;
  
  const response = await sendMessage(prompt, []);
  return response.success ? response.text : 'Não foi possível gerar a bibliografia.';
}

export async function generateMotivationalCoach(examName: string, subject: string): Promise<string> {
  const prompt = `🧠 COACH MOTIVACIONAL - ${subject}\n\n🎯 Vestibular: ${examName}\n📚 Matéria: ${subject}\n\nComo seu coach pessoal, vou te ajudar com:\n\n💪 MOTIVAÇÃO DIÁRIA\n- Frases inspiradoras personalizadas\n- Lembretes do seu objetivo\n- Celebração de pequenas vitórias\n\n🧘 GESTÃO DE ANSIEDADE\n- Técnicas de respiração\n- Exercícios de relaxamento\n- Mindfulness para estudos\n\n🎯 FOCO E DISCIPLINA\n- Como manter consistência\n- Superar procrastinação\n- Criar hábitos de estudo\n\n🚀 MENTALIDADE VENCEDORA\n- Visualização do sucesso\n- Autoconfiança\n- Resiliência nos estudos\n\n🏆 Você TEM potencial! Vamos desbloqueá-lo juntos! Sem saudações.`;
  
  const response = await sendMessage(prompt, []);
  return response.success ? response.text : 'Não foi possível gerar o coaching motivacional.';
}

export async function generateQuickQuestions(examName: string, subject: string): Promise<string> {
  const prompt = `🎯 QUESTÕES RÁPIDAS - ${examName}\n\n📚 Matéria: ${subject}\n\nGere 5 questões de múltipla escolha (nível fácil-médio) com:\n- Enunciado claro\n- 5 alternativas (A-E)\n- Gabarito comentado\n- Tempo estimado: 2min/questão\n\nFoque nos tópicos mais cobrados! 🚀 Sem saudações.`;
  
  const response = await sendMessage(prompt, []);
  return response.success ? response.text : 'Não foi possível gerar as questões rápidas.';
}

export async function generateEssayQuestions(examName: string, subject: string): Promise<string> {
  const prompt = `📝 QUESTÕES DISSERTATIVAS - ${examName}\n\n📚 Matéria: ${subject}\n\nCrie 3 questões dissertativas com:\n- Enunciado contextualizado\n- Critérios de correção\n- Resposta modelo\n- Dicas de estruturação\n\nEstilo ${examName}! ✍️ Sem saudações.`;
  
  const response = await sendMessage(prompt, []);
  return response.success ? response.text : 'Não foi possível gerar as questões dissertativas.';
}

export async function generateChallengeQuestions(examName: string, subject: string): Promise<string> {
  const prompt = `🔥 QUESTÕES DESAFIO - ${examName}\n\n📚 Matéria: ${subject}\n\nCrie 3 questões de nível avançado:\n- Interdisciplinares\n- Raciocínio complexo\n- Resolução detalhada\n- Dicas de abordagem\n\nPara quem quer se destacar! 🏆 Sem saudações.`;
  
  const response = await sendMessage(prompt, []);
  return response.success ? response.text : 'Não foi possível gerar as questões desafio.';
}

export async function generateFeynmanMethod(examName: string, subject: string, topics: string[]): Promise<string> {
  const prompt = `🧠 MÉTODO FEYNMAN - ${subject}\n\n📚 Matéria: ${subject}\n🎯 Vestibular: ${examName}\n\nAplique a Técnica Feynman nos tópicos:\n${topics.slice(0, 3).map(topic => `• ${topic}`).join('\n')}\n\nPara cada tópico, crie:\n1️⃣ Explicação simples (como para uma criança)\n2️⃣ Identificação de lacunas no conhecimento\n3️⃣ Analogias do dia a dia\n4️⃣ Exemplos práticos\n5️⃣ Revisão simplificada\n\n💡 "Se você não consegue explicar de forma simples, não entendeu bem o suficiente" - Einstein\n\nSem saudações.`;
  
  const response = await sendMessage(prompt, []);
  return response.success ? response.text : 'Não foi possível gerar o método Feynman.';
}

export async function generateSpacedRepetition(examName: string, subject: string, topics: string[]): Promise<string> {
  const prompt = `🔄 REPETIÇÃO ESPAÇADA - ${subject}\n\n📚 Matéria: ${subject}\n🎯 Vestibular: ${examName}\n\nCrie um cronograma de repetição espaçada para:\n${topics.slice(0, 4).map(topic => `• ${topic}`).join('\n')}\n\nEstrutura:\n📅 Dia 1: Estudo inicial\n📅 Dia 3: Primeira revisão\n📅 Dia 7: Segunda revisão\n📅 Dia 21: Terceira revisão\n📅 Dia 60: Revisão final\n\n🧠 Intervalos otimizados para fixação na memória de longo prazo!\n⏰ Inclua lembretes específicos para cada tópico\n\nSem saudações.`;
  
  const response = await sendMessage(prompt, []);
  return response.success ? response.text : 'Não foi possível gerar o cronograma de repetição espaçada.';
}

export async function generateMindMaps(examName: string, subject: string, topics: string[]): Promise<string> {
  const prompt = `🗺️ MAPAS MENTAIS - ${subject}\n\n📚 Matéria: ${subject}\n🎯 Vestibular: ${examName}\n\nCrie estruturas de mapas mentais para:\n${topics.slice(0, 3).map(topic => `• ${topic}`).join('\n')}\n\nPara cada tópico:\n🌟 Conceito central\n🌿 Ramificações principais\n🍃 Subtópicos importantes\n🎨 Cores sugeridas\n🖼️ Símbolos visuais\n📝 Palavras-chave\n\n💡 Transforme conceitos abstratos em representações visuais memoráveis!\n\nSem saudações.`;
  
  const response = await sendMessage(prompt, []);
  return response.success ? response.text : 'Não foi possível gerar os mapas mentais.';
}

export async function generatePersonalizedPomodoro(examName: string, subject: string, topics: string[]): Promise<string> {
  const prompt = `🎯 TÉCNICA POMODORO PERSONALIZADA - ${subject}\n\n📚 Matéria: ${subject}\n🎯 Vestibular: ${examName}\n\nPersonalize a Técnica Pomodoro para cada tipo de conteúdo:\n\n${topics.slice(0, 4).map(topic => `📌 ${topic}`).join('\n')}\n\nPara cada tópico, defina:\n⏱️ Duração ideal do foco (15-45min)\n☕ Tipo de pausa recomendada\n🎵 Ambiente sonoro ideal\n📱 Estratégias anti-distração\n🏆 Sistema de recompensas\n📊 Métricas de progresso\n\n💪 Maximize sua concentração e produtividade!\n\nSem saudações.`;
  
  const response = await sendMessage(prompt, []);
  return response.success ? response.text : 'Não foi possível gerar o Pomodoro personalizado.';
}

export async function generateAssociationTechnique(examName: string, subject: string, topics: string[]): Promise<string> {
  const prompt = `🔗 TÉCNICA DE ASSOCIAÇÃO - ${subject}\n\n📚 Matéria: ${subject}\n🎯 Vestibular: ${examName}\n\nCrie associações poderosas para:\n${topics.slice(0, 4).map(topic => `• ${topic}`).join('\n')}\n\nTipos de associação:\n🏠 Palácio da Memória (locais familiares)\n🎭 Histórias narrativas\n🎵 Rimas e músicas\n🌈 Associações visuais\n👥 Conexões pessoais\n🔢 Padrões numéricos\n\n🧠 Transforme informações abstratas em memórias vívidas e duradouras!\n\nSem saudações.`;
  
  const response = await sendMessage(prompt, []);
  return response.success ? response.text : 'Não foi possível gerar a técnica de associação.';
}

export async function generateStrategicSummaries(examName: string, subject: string, topics: string[]): Promise<string> {
  const prompt = `📝 RESUMOS ESTRATÉGICOS - ${subject}\n\n📚 Matéria: ${subject}\n🎯 Vestibular: ${examName}\n\nCrie templates de resumos para:\n${topics.slice(0, 3).map(topic => `• ${topic}`).join('\n')}\n\nEstrutura para cada tópico:\n🎯 Conceito em 1 frase\n📋 3 pontos principais\n💡 1 exemplo prático\n⚠️ 1 pegadinha comum\n🔗 Conexões com outros tópicos\n📊 Como aparece na prova\n\n✨ Resumos otimizados para revisão rápida e eficiente!\n\nSem saudações.`;
  
  const response = await sendMessage(prompt, []);
  return response.success ? response.text : 'Não foi possível gerar os resumos estratégicos.';
}

export async function generateMemorizationTechniques(examName: string, subject: string, topics: string[]): Promise<string> {
  const prompt = `🧠 TÉCNICAS DE MEMORIZAÇÃO - ${subject}\n\n📚 Matéria: ${subject}\n🎯 Vestibular: ${examName}\n\nCrie técnicas específicas de memorização para:\n\n${topics.slice(0, 5).map(topic => `• ${topic}`).join('\n')}\n\nIncluindo:\n🔹 Mnemônicos personalizados\n🔹 Mapas mentais sugeridos\n🔹 Associações visuais\n🔹 Técnicas de repetição espaçada\n🔹 Flashcards estratégicos\n\n💡 Torne o aprendizado mais eficiente e duradouro!\n\nSem saudações.`;
  
  const response = await sendMessage(prompt, []);
  return response.success ? response.text : 'Não foi possível gerar as técnicas de memorização.';
}

export async function analyzeSisuProuniFeasibility(
  scores: { linguagens: string; humanas: string; natureza: string; matematica: string; redacao: string },
  desiredCourse: string,
  category: string
): Promise<string> {
  const avg = Object.values(scores).reduce((sum, val) => sum + (parseFloat(val) || 0), 0) / 5;
  
  const prompt = `🎓 ANÁLISE DE VIABILIDADE SISU/PROUNI\n\n📊 NOTAS DO ENEM:\n• Linguagens: ${scores.linguagens}\n• Ciências Humanas: ${scores.humanas}\n• Ciências da Natureza: ${scores.natureza}\n• Matemática: ${scores.matematica}\n• Redação: ${scores.redacao}\n\n📈 Média Simples: ${avg.toFixed(2)}\n\n🎯 OBJETIVO:\n• Curso: ${desiredCourse}\n• Modalidade: ${category}\n\nPor favor, me ajude com:\n\n1. 🏛️ UNIVERSIDADES VIÁVEIS\n   - Liste universidades federais/estaduais onde tenho BOA chance\n   - Mencione as notas de corte recentes (2023/2024)\n\n2. ⚠️ OPÇÕES ARRISCADAS\n   - Universidades onde seria mais difícil, mas possível\n\n3. ⚖️ SISTEMA DE PESOS\n   - Como ${desiredCourse} costuma pesar as áreas?\n   - Qual minha nota ponderada estimada?\n\n4. 💡 ESTRATÉGIAS\n   - Devo focar em melhorar alguma área específica?\n   - Dicas para escolha de cursos no SiSU\n\n5. 🧠 APOIO EMOCIONAL\n   - Como lidar com a ansiedade da espera?\n   - Mensagem motivacional personalizada\n\nSeja realista mas encorajador! 💪\n\nSem saudações.`;
  
  const response = await sendMessage(prompt, []);
  return response.success ? response.text : 'Não foi possível analisar a viabilidade.';
}