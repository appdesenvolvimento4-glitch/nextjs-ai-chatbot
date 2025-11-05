import { NextRequest } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { messages, temperature = 1.0, top_p = 0.95, top_k = 40 } = await req.json();

    const apiKey = process.env.MINIMAX_API_KEY;
    const baseUrl = process.env.MINIMAX_API_BASE || "https://platform.minimax.io/v1";
    const model = process.env.MODEL_ID || "MiniMax-M2";

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "MINIMAX_API_KEY ausente" }), { status: 500 });
    }

    const payload = {
      model,
      messages,
      temperature,
      top_p,
      top_k,
      stream: false,
    };

    const resp = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return new Response(JSON.stringify({ error: errText }), { status: resp.status });
    }

    const data = await resp.json();
    const content =
      data?.choices?.[0]?.message?.content ??
      data?.choices?.[0]?.delta?.content ??
      "";

    return new Response(JSON.stringify({ content, raw: data }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? "Erro inesperado" }), { status: 500 });
  }
}

