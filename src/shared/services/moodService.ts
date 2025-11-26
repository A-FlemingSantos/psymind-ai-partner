import { sendMessage } from './chatService';

export async function generateMoodInsight(moodHistory: Array<{ mood: { label: string } }>) {
  if (moodHistory.length === 0) return '';

  const recentMoods = moodHistory.slice(-5).map(e => e.mood.label).join(', ');
  const prompt = `Analise os humores: ${recentMoods}. Gere apenas uma análise direta (2-3 frases) com sugestão prática. Sem saudações ou introduções.`;
  
  const result = await sendMessage(prompt, []);
  return result.success ? result.text : result.userMessage || '⚠️ Não foi possível gerar análise no momento.';
}