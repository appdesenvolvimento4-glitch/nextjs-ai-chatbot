// app/api/chat/route.ts
export const runtime = 'edge';

import { streamText } from 'ai';
import { NextResponse } from 'next/server';

const SYSTEM_PROMPT =
  'Você é um assistente de mídia social criativo e útil. Responda em português, ' +
  'seja claro, objetivo e mantenha um tom humano.';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    // Usaremos o Gateway da Vercel apontando para o provedor MiniMax
    model: 'minimax/m2',

    // Mensagens: adiciono um system no topo + as mensagens do usuário/assistente
    messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...(messages ?? [])],

    // Config do Gateway (só precisa da API key; a URL é a padrão do Gateway)
    api: {
      baseURL: process.env.AI_GATEWAY_URL || 'https://api.ai.vercel.com',
      headers: {
        Authorization: `Bearer ${process.env.AI_GATEWAY_API_KEY || ''}`,
      },
    },

    // (Opcional) Ajustes comuns
    maxTokens: 1024,
    temperature: 0.7,
  });

  return result.toAIStreamResponse();
}
