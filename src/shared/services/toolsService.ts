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
  const examStrategies = {
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
  const examContexts = {
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