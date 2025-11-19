// app/api/chat/route.ts
export const runtime = "nodejs";

import { MODELS, DEFAULT_CHAT_MODEL, getModelByKey, type ModelKey } from "@/lib/ai/models";
import { getUser, incrementMessageCount, resetUserCounterIfNewDay, setUserPlan } from "@/lib/user";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

const PRO_LIMIT = 5;

export async function POST(req: Request) {
  try {
    const {
      messages,
      stream,
      selectedModelKey,
      userId,
    }: {
      messages: ChatMessage[];
      stream?: boolean;
      selectedModelKey?: ModelKey;
      userId: string;
    } = await req.json();

    if (!userId) {
      return new Response(JSON.stringify({ error: "Missing userId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Load user from DB
    const user = await getUser(userId);

    // Reset daily limit if needed
    await resetUserCounterIfNewDay(user);

    const isPro = user.plan === "pro";
    const messagesUsed = user.messagesToday;

    // Enforce limit: 5 messages PRO/day
    if (isPro && messagesUsed >= PRO_LIMIT) {
      return new Response(
        JSON.stringify({
          error: "Limite diário do plano PRO atingido.",
          upgrade: true,
          options: ["upgrade", "continuar_free"],
        }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // Determine which model should be used
    // If user is PRO -> allow any model key
    // If user is FREE -> enforce longcat always
    let modelKey: ModelKey = DEFAULT_CHAT_MODEL;

    if (isPro) {
      modelKey = selectedModelKey || "pro-chat";
    }

    const modelInfo = getModelByKey(modelKey);

    if (!modelInfo) {
      return new Response(JSON.stringify({ error: "Invalid model key." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const modelId = MODELS[modelKey];

    // Send to AI Gateway
    const resp = await fetch(`${process.env.AI_GATEWAY_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.AI_GATEWAY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelId,
        messages,
        stream: stream ?? true,
        temperature: isPro ? 0.9 : 0.7,
      }),
    });

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

    // Increment message usage only when successful
    await incrementMessageCount(userId);

    // If streaming response
    if (resp.headers.get("content-type")?.includes("text/event-stream")) {
      return new Response(resp.body, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          "X-Accel-Buffering": "no",
        },
      });
    }

    const content = await resp.json();
    return new Response(JSON.stringify(content), {
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

