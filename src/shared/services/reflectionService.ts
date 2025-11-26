import { sendMessage } from './chatService';

export async function generateReflection(category: string | null = null) {
  const categoryPrompt = category ? `sobre ${category}` : 'motivacional para estudantes';
  const prompt = `Gere apenas uma frase inspiradora ${categoryPrompt} (máximo 2 linhas) com autor. Formato: "Frase" - Autor. Sem introduções.`;
  
  const result = await sendMessage(prompt, []);
  
  if (result.success) {
    const text = result.text.replace(/[""\"]/g, '').trim();
    const parts = text.split(' - ');
    return {
      text: parts[0] || text,
      author: parts[1] || 'PsyMind.AI',
      category: category || 'geral'
    };
  }
  
  return null;
}

export async function generateReflectionAnalysis(reflection: { text: string; author: string }) {
  const prompt = `Frase: "${reflection.text}" - ${reflection.author}. Gere apenas aplicação prática direta (2-3 frases) para estudantes. Sem introduções.`;
  
  const result = await sendMessage(prompt, []);
  return result.success ? result.text : result.userMessage || '⚠️ Não foi possível gerar reflexão no momento.';
}