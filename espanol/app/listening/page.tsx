"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

type Question = {
  spanish: string;
  answer: string;
  choices: string[];
  correctIndex: number;
};

export default function ListeningPage() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [hasPlayed, setHasPlayed] = useState(false);

  const loadQuestion = useCallback(async () => {
    setIsLoading(true);
    setSelected(null);
    setHasPlayed(false);
    try {
      const res = await fetch("/api/listening");
      const data = await res.json();
      setQuestion(data);
    } catch {
      setQuestion(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuestion();
  }, [loadQuestion]);

  function speak() {
    if (!question) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(question.spanish);
    utterance.lang = "es-ES";
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
    setHasPlayed(true);
  }

  function select(index: number) {
    if (selected !== null) return;
    setSelected(index);
    setScore((prev) => ({
      correct: prev.correct + (index === question?.correctIndex ? 1 : 0),
      total: prev.total + 1,
    }));
  }

  function getChoiceStyle(index: number) {
    if (selected === null) {
      return "bg-white border border-gray-200 hover:border-amber-400 hover:bg-amber-50 active:scale-95";
    }
    if (index === question?.correctIndex) {
      return "bg-green-100 border border-green-400";
    }
    if (index === selected) {
      return "bg-red-100 border border-red-400";
    }
    return "bg-white border border-gray-200 opacity-50";
  }

  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto p-4">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-amber-700 font-bold text-xl">
            ←
          </Link>
          <div>
            <h1 className="font-bold text-gray-800">聞き取り練習</h1>
            <p className="text-xs text-gray-400">スペイン語を聞いて意味を当てよう</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-sm font-bold text-amber-700">
            {score.correct}/{score.total}
          </span>
          <p className="text-xs text-gray-400">正解数</p>
        </div>
      </header>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="text-4xl animate-bounce">🎧</div>
          <p className="text-gray-500">問題を生成中...</p>
        </div>
      ) : question ? (
        <div className="flex-1 flex flex-col">
          <div className="bg-white rounded-2xl p-8 shadow-md border border-amber-200 text-center mb-6">
            <p className="text-xs text-gray-400 mb-4">スペイン語の音声を聞いて意味を選んでください</p>
            <button
              onClick={speak}
              className="bg-amber-600 text-white rounded-full w-24 h-24 text-4xl shadow-lg hover:bg-amber-700 active:scale-95 transition-all mx-auto flex items-center justify-center"
            >
              🔊
            </button>
            <p className="text-xs text-gray-400 mt-3">
              {hasPlayed ? "もう一度聞く" : "タップして音声を再生"}
            </p>
            {selected !== null && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-lg font-bold text-gray-700">{question.spanish}</p>
                <p className="text-sm text-green-600 mt-1">
                  正解: {question.answer}
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {question.choices.map((choice, i) => (
              <button
                key={i}
                onClick={() => select(i)}
                className={`rounded-xl p-4 text-sm font-medium transition-all ${getChoiceStyle(i)}`}
              >
                {choice}
              </button>
            ))}
          </div>

          {selected !== null && (
            <div className="space-y-3">
              <div
                className={`rounded-xl p-4 text-center font-bold text-lg ${
                  selected === question.correctIndex
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {selected === question.correctIndex ? "🎉 正解！" : "😢 不正解..."}
              </div>
              <button
                onClick={loadQuestion}
                className="w-full bg-amber-600 text-white rounded-xl py-4 font-bold hover:bg-amber-700 active:scale-95 transition-all"
              >
                次の問題へ →
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-gray-500">問題の取得に失敗しました</p>
          <button
            onClick={loadQuestion}
            className="bg-amber-600 text-white rounded-xl px-6 py-3 hover:bg-amber-700"
          >
            再試行
          </button>
        </div>
      )}
    </div>
  );
}
