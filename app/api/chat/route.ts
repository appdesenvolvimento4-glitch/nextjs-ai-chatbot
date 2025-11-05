// app/api/chat/route.ts
export const runtime = 'edge';

type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

function getEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

export async function POST(req: Request) {
  try {
    const { messages, stream }: { messages: ChatMessage[]; stream?: boolean } = await req.json();

    const baseUrl = getEnv('AI_GATEWAY_URL'); // deve terminar em /v1
    const apiKey = getEnv('AI_GATEWAY_KEY');
    const model = process.env.AI_MODEL_ID || 'minimax/minimax-m2';

    const resp = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      // Streaming melhora UX; o front do template já entende SSE
      body: JSON.stringify({
        model,
        messages,
        stream: stream ?? true,
        // Ajuste de sampling se quiser
        temperature: 0.8,
        top_p: 0.95,
      }),
      // tempo de espera razoável p/ rede: 60s
      // @ts-ignore (Edge Fetch aceita sinal/timeout em runtimes recentes)
      // keepalive: true
    });

    // Erros claros
    if (!resp.ok) {
      const text = await resp.text();
      return new Response(
        JSON.stringify({
          error: `Gateway error (${resp.status})`,
          details: text.slice(0, 2000),
        }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Se vier stream, repasse como SSE
    const contentType = resp.headers.get('content-type') || '';
    const isStream = contentType.includes('text/event-stream');

    if (isStream) {
      return new Response(resp.body, {
        headers: {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          'X-Accel-Buffering': 'no',
        },
      });
    }

    // Fallback não-stream
    const data = await resp.json();
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: 'Chat route failed', details: String(err?.message || err) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
