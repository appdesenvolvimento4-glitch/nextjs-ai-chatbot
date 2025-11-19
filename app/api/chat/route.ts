// app/api/chat/route.ts
export const runtime = "nodejs";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

import { getUser, incrementMessageCount, updateUserPlan, resetUserCounterIfNewDay } from "@/lib/user";

export async function POST(req: Request) {
  try {
    const { messages, stream, selectedChatModel, userId }: {
      messages: ChatMessage[];
      stream?: boolean;
      selectedChatModel?: string;
      userId: string; // importante: frontend envia o userId
    } = await req.json();

    if (!userId) {
      return new Response(JSON.stringify({ error: "Missing userId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 🔥 Carrega usuário e reseta contagem se for novo dia
    const user = await getUser(userId);
    await resetUserCounterIfNewDay(user);

    // 📌 LIMITES DO PLANO
    const PRO_LIMIT = 5;
    const isPro = user.plan === "pro";

    // Se estiver no PRO (trial) mas atingiu o limite
    if (isPro && user.messagesToday >= PRO_LIMIT) {
      return new Response(
        JSON.stringify({
          error: "Limite diário do plano PRO atingido.",
          upgrade: true,
          options: ["upgrade", "continuar_free"],
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 📌 MODELOS PRO + FREE
    const MODELS = {
      FREE: "meituan/longcat-flash-chat",
      PRO: {
        qwen: "qwen/qwen3-max",
        thinking: "deepseek/deepseek-r1",
        long: "llama/llama-4-maverick",
        vision: "vision/model", // ajustar quando tiver modelo real
      },
    };

    let model = MODELS.FREE;

    // 🧠 Lógica de modelo
    if (isPro && user.messagesToday < PRO_LIMIT) {
      switch (selectedChatModel) {
        case "thinking":
          model = MODELS.PRO.thinking;
          break;
        case "pdf":
          model = MODELS.PRO.long;
          break;
        case "vision":
          model = MODELS.PRO.vision;
          break;
        default:
          model = MODELS.PRO.qwen;
      }
    }

    // 🔥 Envia requisição ao AI Gateway
    const resp = await fetch(`${process.env.AI_GATEWAY_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.AI_GATEWAY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        stream: stream ?? true,
        temperature: isPro ? 0.9 : 0.7,
      }),
    });

    // ❌ Falha no Gateway
    if (!resp.ok) {
      const text = await resp.text();
      return new Response(
        JSON.stringify({
          error: `Gateway error (${resp.status})`,
          details: text.slice(0, 2000),
        }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    // ⚡ Se resposta for streaming
    const isStream = resp.headers.get("content-type")?.includes("text/event-stream");
    if (isStream) {
      // marcar contagem
      await incrementMessageCount(userId);
      return new Response(resp.body, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          "X-Accel-Buffering": "no",
        },
      });
    }

    // 🔥 Mensagem normal (não-stream)
    await incrementMessageCount(userId);
    const data = await resp.json();

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (err: any) {
    return new Response(
      JSON.stringify({
        error: "Chat route failed",
        details: err?.message || String(err),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
