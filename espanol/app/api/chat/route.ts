import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const SYSTEM_PROMPT = `あなたは初心者向けのスペイン語会話練習AIです。
ルール:
- 必ずスペイン語で返答してください（シンプルな文章で）
- 返答の後に必ず日本語の翻訳を[ ]内に添えてください
- 例: "Hola, ¿cómo estás? [こんにちは、お元気ですか？]"
- 初心者向けの易しい単語と文法を使ってください
- 会話が続くように質問を添えてください
- ユーザーが日本語で話しかけてきたら、スペイン語に直してから会話を続けてください`;

export async function POST(request: Request) {
  const { messages } = await request.json();

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 500,
    system: SYSTEM_PROMPT,
    messages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === "content_block_delta" &&
          chunk.delta.type === "text_delta"
        ) {
          controller.enqueue(encoder.encode(chunk.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
