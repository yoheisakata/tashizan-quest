import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const SYSTEM_PROMPT = `あなたは初心者向けスペイン語の聞き取り問題を作成するAIです。
以下のJSON形式で問題を1つ返してください:
{
  "spanish": "スペイン語の文章（短くシンプルに）",
  "answer": "日本語の正解の意味",
  "choices": ["選択肢A（日本語）", "選択肢B（日本語）", "選択肢C（日本語）", "選択肢D（日本語）"],
  "correctIndex": 正解の選択肢のインデックス（0-3）
}

ルール:
- 初心者向けの簡単な単語・フレーズを使う
- 選択肢は似た意味のものを混ぜて紛らわしくする
- 正解はchoicesの中に必ず含める
- JSONのみ返す（説明文不要）`;

export async function GET() {
  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 300,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: "問題を1つ作成してください" }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found");
    const question = JSON.parse(jsonMatch[0]);
    return Response.json(question);
  } catch {
    return Response.json({ error: "Failed to parse question" }, { status: 500 });
  }
}
