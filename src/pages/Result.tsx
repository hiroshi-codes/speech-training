import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';

const Result: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const count = location.state?.count ?? 0;
  const level = location.state?.level ?? 0;

  const [visibleStamps, setVisibleStamps] = useState(0);

  useEffect(() => {
    // ★ 1問以上できた時だけ紙吹雪を飛ばす
    if (count > 0) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ffbed1', '#ffea00', '#42a5f5', '#66bb6a']
      });

      const timer = setInterval(() => {
        setVisibleStamps((prev) => {
          if (prev < count) return prev + 1;
          clearInterval(timer);
          return prev;
        });
      }, 200);

      return () => clearInterval(timer);
    }
  }, [count]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-amber-50">
      
      {/* 1. アイコンとタイトルの切り替え */}
      <div className="text-6xl mb-4 animate-bounce">
        {count > 0 ? "🏆" : "✨"}
      </div>
      <h2 className="text-4xl font-black text-slate-800 mb-2">
        {count > 0 ? "やったね！！" : "どんまい！"}
      </h2>
      
      <p className="text-lg font-bold text-slate-600 mb-8 text-center">
        {count > 0 ? (
          <>今日は <span className="text-3xl text-orange-500">{count}</span> もん おはなししたよ</>
        ) : (
          <>ちょうせん したことが えらいよ！</>
        )}
      </p>

      {/* 2. メインコンテンツ（スタンプ or 応援メッセージ） */}
      <div className="bg-white/70 border-4 border-dashed border-orange-200 rounded-3xl p-8 w-full max-w-sm mb-10 shadow-sm">
        {count > 0 ? (
          <>
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
          </>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-xl font-black text-blue-500">
              つぎは きっと できるよ！
            </p>
            <p className="text-sm font-bold text-slate-500 leading-relaxed">
              むずかしかったかな？<br />
              また いっしょに れんしゅう して<br />
              スタンプを あつめよう！
            </p>
          </div>
        )}
      </div>

      {/* 3. アクションボタン（共通） */}
      <div className="w-full max-w-xs space-y-4">
        <button
          onClick={() => navigate('/play', { state: { selectedLevel: level } })}
          className={`w-full py-5 text-white rounded-3xl text-2xl font-black transition-all active:translate-y-1 
            ${count > 0 
              ? 'bg-orange-400 shadow-[0_8px_0_rgb(234,88,12)] active:shadow-none' 
              : 'bg-blue-400 shadow-[0_8px_0_rgb(37,99,235)] active:shadow-none'
            }`}
        >
          {count > 0 ? "もう一回！" : "リベンジする！"}
        </button>

        <button
          onClick={() => navigate('/setup')}
          className="w-full py-3 bg-white text-slate-400 border-2 border-slate-200 rounded-2xl font-bold hover:bg-slate-50"
        >
          レベルを かえる
        </button>
      </div>
    </div>
  );
};

export default Result;