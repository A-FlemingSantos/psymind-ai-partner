import { Message } from '@/features/chat/ChatContext';

export const generateConversationSummary = async (messages: Message[]): Promise<string> => {
  if (messages.length < 2) {
    return 'Conversa inicial';
  }

  // Pega a primeira mensagem do usuário para criar um resumo
  const firstUserMessage = messages.find(m => m.role === 'user')?.content || '';
  const allMessages = messages.slice(0, 4).map(m => m.content).join(' ');
  
  // Resumo simples baseado em palavras-chave
  const keywords = extractKeywords(allMessages);
  
  if (keywords.includes('ansiedade') || keywords.includes('estresse')) {
    return 'Conversa sobre gestão de ansiedade e bem-estar mental';
  }
  
  if (keywords.includes('trabalho') || keywords.includes('carreira')) {
    return 'Discussão sobre questões profissionais e carreira';
  }
  
  if (keywords.includes('relacionamento') || keywords.includes('família')) {
    return 'Conversa sobre relacionamentos e vida pessoal';
  }
  
  if (keywords.includes('estudo') || keywords.includes('aprender')) {
    return 'Planejamento de estudos e desenvolvimento pessoal';
  }
  
  if (keywords.includes('saúde') || keywords.includes('exercício')) {
    return 'Discussão sobre saúde física e mental';
  }
  
  // Resumo genérico baseado no primeiro tópico
  const words = firstUserMessage.split(' ').slice(0, 6).join(' ');
  
  return words.length > 10 ? `${words}...` : 'Conversa geral';
};

const extractKeywords = (text: string): string[] => {
  const commonWords = ['o', 'a', 'de', 'que', 'e', 'do', 'da', 'em', 'um', 'para', 'é', 'com', 'não', 'uma', 'os', 'no', 'se', 'na', 'por', 'mais', 'as', 'dos', 'como', 'mas', 'foi', 'ao', 'ele', 'das', 'tem', 'à', 'seu', 'sua', 'ou', 'ser', 'quando', 'muito', 'há', 'nos', 'já', 'está', 'eu', 'também', 'só', 'pelo', 'pela', 'até', 'isso', 'ela', 'entre', 'era', 'depois', 'sem', 'mesmo', 'aos', 'ter', 'seus', 'suas', 'numa', 'nem', 'suas', 'meu', 'às', 'minha', 'têm', 'numa', 'pelos', 'pelas'];
  
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.includes(word));
};