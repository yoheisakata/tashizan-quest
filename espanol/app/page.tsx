import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-sm w-full">
        <div className="text-center mb-10">
          <div className="text-6xl mb-4">🇪🇸</div>
          <h1 className="text-3xl font-bold text-amber-800 mb-2">Español</h1>
          <p className="text-gray-600">初心者向けスペイン語学習アプリ</p>
        </div>

        <div className="space-y-4">
          <Link href="/conversation" className="block w-full">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-amber-200 hover:shadow-lg hover:border-amber-400 transition-all active:scale-95">
              <div className="flex items-center gap-4">
                <span className="text-4xl">💬</span>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">AI会話練習</h2>
                  <p className="text-sm text-gray-500 mt-1">AIとスペイン語で会話しよう</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/listening" className="block w-full">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-amber-200 hover:shadow-lg hover:border-amber-400 transition-all active:scale-95">
              <div className="flex items-center gap-4">
                <span className="text-4xl">👂</span>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">聞き取り練習</h2>
                  <p className="text-sm text-gray-500 mt-1">スペイン語を聞いて意味を当てよう</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          ¡Buena suerte! 頑張ってね！
        </p>
      </div>
    </main>
  );
}
