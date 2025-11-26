import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
// Validação simples para não tentar iniciar se não houver chave
const isKeyValid = apiKey && apiKey.length > 0 && apiKey !== "sua_chave_api_aqui";
const genAI = isKeyValid ? new GoogleGenerativeAI(apiKey) : null;

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

export const sendMessageToEditor = async (
  history: ChatMessage[], 
  newMessage: string,
  documentContext: string = "" // Novo parâmetro para o conteúdo do editor
): Promise<string> => {
  if (!isKeyValid || !genAI) {
    return "⚠️ **Erro de Configuração:** A chave de API não foi encontrada. Verifique seu arquivo .env.";
  }

  try {
    const systemInstructionText = `Você é o PsyMind Editor, um assistente de escrita colaborativa inteligente.
    Seu objetivo é ajudar o usuário a escrever, refinar, expandir e estruturar seus textos.
    
    ATENÇÃO: O usuário está trabalhando em um documento agora.
    Conteúdo ATUAL do documento:
    """
    ${documentContext}
    """
    
    Diretrizes:
    - Use o "Conteúdo ATUAL do documento" acima como contexto para suas respostas.
    - Se o usuário pedir para "melhorar isto" ou "resumir", refira-se ao texto do documento.
    - Forneça feedbacks construtivos, específicos e acionáveis.
    - Sugira melhorias de clareza, tom, gramática e estrutura.
    - Use formatação Markdown rica (negrito, itálico, listas, blocos de código) para facilitar a leitura.
    - Seja conciso nas explicações, mas aprofundado nas sugestões de conteúdo.
    - Atue como um co-autor experiente.`;

    // Configuração do modelo usando a instrução de sistema nativa (mais robusto)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-pro",
      systemInstruction: systemInstructionText,
    });

    // Converte o histórico para o formato da API
    const chatHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 8192,
        temperature: 0.7,
      },
      safetySettings,
    });

    const result = await chat.sendMessage(newMessage);
    const response = await result.response;
    return response.text();

  } catch (error: any) {
    console.error("Erro do Gemini Editor:", error);
    
    // Retorna a mensagem de erro real para ajudar no debug
    let errorMessage = "Desculpe, tive um problema técnico.";
    
    if (error.message) {
        if (error.message.includes('API key')) errorMessage = "⚠️ Erro de Chave de API: Verifique se sua chave está correta.";
        else if (error.message.includes('404')) errorMessage = "⚠️ Modelo não encontrado: O Gemini 1.5 Pro pode não estar disponível para sua chave/região.";
        else if (error.message.includes('429')) errorMessage = "⚠️ Limite de requisições excedido. Tente novamente em alguns instantes.";
        else errorMessage = `⚠️ Erro da API: ${error.message}`;
    }
    
    return errorMessage;
  }
};