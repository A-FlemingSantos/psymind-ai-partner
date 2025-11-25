import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// 1. Obtém a chave
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// 2. Validação aprimorada: verifica se existe E se não é o placeholder do exemplo
const isKeyValid = apiKey && apiKey.length > 0 && apiKey !== "sua_chave_api_aqui";

// Inicializa apenas se passar na validação básica
const genAI = isKeyValid ? new GoogleGenerativeAI(apiKey) : null;

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

export const sendMessageToGemini = async (
  history: ChatMessage[], 
  newMessage: string,
  mode: 'Advisor' | 'Planner',
  personality: string
): Promise<string> => {
  // 3. Retorno imediato se a configuração inicial falhou
  if (!isKeyValid || !genAI) {
    return "⚠️ **Erro de Configuração:** A chave de API não foi encontrada ou é inválida.\n\nPor favor, crie um arquivo `.env` na raiz do projeto e adicione: `VITE_GEMINI_API_KEY=sua_chave_real_aqui`";
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", 
    });

    const chatHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const systemPrompt = `Você é o PsyMind, um parceiro de IA para saúde mental.
    Modo atual: ${mode} (${mode === 'Advisor' ? 'Conselheiro: Foco em empatia, escuta ativa e reflexão' : 'Planejador: Foco em passos práticos, organização e ação'}).
    Personalidade: ${personality}.
    
    Responda formatando seu texto com Markdown para melhor leitura (use negrito para ênfase, listas para tópicos, etc).
    Seja acolhedor e seguro.`;

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemPrompt }]
        },
        {
          role: "model",
          parts: [{ text: "Entendido. Estou pronto para atuar como PsyMind seguindo estas diretrizes." }]
        },
        ...chatHistory
      ],
      generationConfig: {
        maxOutputTokens: 28000, // Limite aumentado para 28.000 tokens
      },
      safetySettings,
    });

    const result = await chat.sendMessage(newMessage);
    const response = await result.response;
    return response.text();

  } catch (error: any) {
    console.error("Erro detalhado do Gemini:", error);

    // 4. Tratamento específico para erros de API Key que passam pela validação inicial
    if (
      error.message?.includes('API key') || 
      error.message?.includes('403') || 
      error.toString().includes('API key')
    ) {
      return "⚠️ **Erro de Autenticação:** A API recusou sua chave. Verifique se ela está correta no arquivo `.env`.";
    }

    return "Desculpe, estou tendo dificuldade para processar isso agora. Pode verificar sua conexão ou tentar novamente?";
  }
};