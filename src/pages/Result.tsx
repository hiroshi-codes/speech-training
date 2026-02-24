import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';

const Result: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const count = location.state?.count ?? 0;
  const level = location.state?.level ?? 0; // 前の画面からレベルも渡すと「もう一回」が楽になります

  const [visibleStamps, setVisibleStamps] = useState(0);

  useEffect(() => {
    // 紙吹雪を飛ばす
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ffbed1', '#ffea00', '#42a5f5', '#66bb6a']
    });

    // スタンプを一個ずつ表示させるタイマー
    const timer = setInterval(() => {
      setVisibleStamps((prev) => {
        if (prev < count) return prev + 1;
        clearInterval(timer);
        return prev;
      });
    }, 200);

    return () => clearInterval(timer);
  }, [count]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-amber-50">
      <div className="text-6xl mb-4 animate-bounce">🏆</div>
      <h2 className="text-4xl font-black text-slate-800 mb-2">やったね！！</h2>
      <p className="text-lg font-bold text-slate-600 mb-8">
        今日は <span className="text-3xl text-orange-500">{count}</span> もん おはなししたよ
      </p>

      {/* ごほうびスタンプエリア */}
      <div className="bg-white/50 border-4 border-dashed border-orange-200 rounded-3xl p-6 w-full max-w-sm mb-10">
        <p className="text-sm font-bold text-orange-400 mb-4 text-center">ごほうびスタンプ</p>
        <div className="flex flex-wrap justify-center gap-3">
          {[...Array(count)].map((_, i) => (
            <div
              key={i}
              className={`text-4xl transition-all duration-300 transform ${
                i < visibleStamps ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
              }`}
            >
              💮
            </div>
          ))}
        </div>
      </div>

      {/* アクションボタン */}
      <div className="w-full max-w-xs space-y-4">
        <button
          onClick={() => navigate('/play', { state: { selectedLevel: level } })}
          className="w-full py-5 bg-orange-400 text-white rounded-3xl text-2xl font-black shadow-[0_8px_0_rgb(234,88,12)] active:translate-y-1 active:shadow-[0_4px_0_rgb(234,88,12)] transition-all"
        >
          もう一回！
        </button>

        <button
          onClick={() => navigate('/')}
          className="w-full py-3 bg-white text-blue-500 border-2 border-blue-200 rounded-2xl font-bold hover:bg-blue-50"
        >
          ホームへもどる
        </button>
      </div>
    </div>
  );
};

export default Result;