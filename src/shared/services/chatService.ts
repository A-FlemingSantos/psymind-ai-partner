import { sendMessageToGemini } from '../utils/gemini';

export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

export async function sendMessage(prompt: string, history: ChatMessage[] = []) {
  try {
    const response = await sendMessageToGemini(history, prompt, 'Advisor', 'empático e acolhedor');
    return {
      success: true,
      text: response,
      userMessage: null
    };
  } catch (error) {
    console.error('Erro no serviço de chat:', error);
    return {
      success: false,
      text: '',
      userMessage: 'Erro ao processar solicitação'
    };
  }
}