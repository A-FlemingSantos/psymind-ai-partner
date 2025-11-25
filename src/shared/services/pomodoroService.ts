import { sendMessage } from './chatService';

export async function generatePomodoroTip(mode: 'focus' | 'short' | 'long') {
  const prompts = {
    focus: 'Gere apenas uma dica direta e objetiva (máximo 1 frase) para manter foco durante estudo Pomodoro. Sem saudações ou introduções.',
    short: 'Gere apenas uma sugestão direta (máximo 1 frase) de atividade para pausa de 5 minutos. Sem saudações ou introduções.',
    long: 'Gere apenas uma sugestão direta (máximo 1 frase) de atividade para pausa de 15 minutos. Sem saudações ou introduções.'
  };

  const result = await sendMessage(prompts[mode] || prompts.focus, []);
  return result.success ? result.text : result.userMessage || '⚠️ Não foi possível gerar dica no momento.';
}