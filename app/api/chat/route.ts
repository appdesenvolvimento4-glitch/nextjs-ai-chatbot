export const runtime = 'edge';

import { streamText } from 'ai';
import { NextResponse } from 'next/server';

const SYSTEM_PROMPT =
  'Você é um assistente de mídia social criativo e útil. Responda em português com clareza e objetividade.';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText(
    {
      model: 'minimax/m2',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...(messages ?? [])],
      maxTokens: 1024,
      temperature: 0.7,
    },
    {
      // ⚠️ Sem "api: { ... }". Vai direto aqui no 2º argumento:
      baseUrl: process.env.AI_GATEWAY_URL || 'https://api.ai.vercel.com',
      headers: {
        Authorization: `Bearer ${process.env.AI_GATEWAY_API_KEY ?? ''}`,
      },
    }
  );

  return result.toAIStreamResponse();
}
