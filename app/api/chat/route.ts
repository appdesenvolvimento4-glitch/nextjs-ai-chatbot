// app/api/chat/route.ts
export const runtime = 'nodejs';

type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

function getEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

export async function POST(req: Request) {
  try {
    const { messages, stream, selectedChatModel }: {
      messages: ChatMessage[];
      stream?: boolean;
      selectedChatModel?: string;
    } = await req.json();

    const baseUrl = getEnv('AI_GATEWAY_URL');
    const apiKey = getEnv('AI_GATEWAY_API_KEY');

    // 🔥 NOVO — nossos modelos
    const MODELS = {
      flash: "meituan/longcat-flash-chat",
      thinking: "meituan/longcat-thinking"
    };

    // 🔥 Seleção do modelo
    let model = MODELS.flash;
    if (selectedChatModel === "thinking") {
      model = MODELS.thinking;
    }

    const resp = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        stream: stream ?? true,
        temperature: 0.8,
        top_p: 0.95,
      }),
    });

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
