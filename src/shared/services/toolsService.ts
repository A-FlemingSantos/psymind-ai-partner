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

export async function generateMockExam(examName: string, subject: string, type: 'quick' | 'full') {
  const duration = type === 'quick' ? '30 minutos, 10 questões' : '2 horas, 30 questões';
  
  const prompt = `Simulado ${examName} - ${subject}:\n\nTipo: ${type === 'quick' ? 'Rápido' : 'Completo'}\nDuração: ${duration}\n\nCrie um simulado com:\n1. Questões no formato da prova\n2. Níveis variados de dificuldade\n3. Gabarito ao final\n4. Critérios de correção\n5. Tempo sugerido por questão\n\nEstilo oficial ${examName}. Sem saudações.`;
  
  const response = await sendMessage(prompt, []);
  return response.success ? response.text : 'Simulado não disponível no momento.';
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