"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ConversationPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "¡Hola! ¿Cómo estás? [こんにちは！お元気ですか？]",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = { role: "user", content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.body) throw new Error("No response body");

      const assistantMessage: Message = { role: "assistant", content: "" };
      setMessages((prev) => [...prev, assistantMessage]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value);
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              content: updated[updated.length - 1].content + chunk,
            };
            return updated;
          });
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "エラーが発生しました。もう一度試してください。" },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function speakSpanish(text: string) {
    const spanishOnly = text.replace(/\[.*?\]/g, "").trim();
    const utterance = new SpeechSynthesisUtterance(spanishOnly);
    utterance.lang = "es-ES";
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  }

  function renderMessage(msg: Message) {
    const parts = msg.content.split(/(\[.*?\])/g);
    return parts.map((part, i) => {
      if (part.startsWith("[") && part.endsWith("]")) {
        return (
          <span key={i} className="text-gray-400 text-sm">
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  }

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto">
      <header className="flex items-center gap-3 p-4 bg-white border-b border-amber-200 shadow-sm">
        <Link href="/" className="text-amber-700 font-bold text-xl">
          ←
        </Link>
        <div>
          <h1 className="font-bold text-gray-800">AI会話練習</h1>
          <p className="text-xs text-gray-400">スペイン語でAIと話してみよう</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-amber-600 text-white rounded-br-sm"
                  : "bg-white border border-gray-200 rounded-bl-sm"
              }`}
            >
              <p className="text-sm leading-relaxed">{renderMessage(msg)}</p>
              {msg.role === "assistant" && msg.content && (
                <button
                  onClick={() => speakSpanish(msg.content)}
                  className="mt-2 text-xs text-amber-600 hover:text-amber-800 flex items-center gap-1"
                >
                  🔊 読み上げ
                </button>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3">
              <span className="text-gray-400 text-sm">入力中...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 bg-white border-t border-amber-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="日本語でもスペイン語でもOK"
            className="flex-1 rounded-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-amber-400 text-sm"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-amber-600 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-amber-700 disabled:opacity-40 transition-colors"
          >
            ➤
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          日本語で入力するとスペイン語に変換してくれます
        </p>
      </div>
    </div>
  );
}
