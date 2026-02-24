import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';

const Result: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const count = location.state?.count ?? 0;

  useEffect(() => {
    // 画面に来た瞬間に紙吹雪を飛ばす
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ['#ffbed1', '#ffea00', '#42a5f5']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#ffbed1', '#ffea00', '#42a5f5']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
      <div className="text-6xl mb-6">🏆</div>
      <h2 className="text-4xl font-black text-slate-800 mb-4">
        すごーい！！
      </h2>
      <p className="text-xl font-bold text-slate-600 mb-8">
        ぜんぶで <span className="text-3xl text-orange-500">{count}</span> もん<br />
        おはなし できたね！
      </p>

      <button 
        onClick={() => navigate('/speech-training/')}
        className="w-full max-w-xs py-5 bg-blue-500 text-white rounded-3xl text-2xl font-black shadow-[0_8px_0_rgb(37,99,235)] active:translate-y-1 active:shadow-[0_4px_0_rgb(37,99,235)] transition-all"
      >
        ホームへもどる
      </button>
    </div>
  );
};

export default Result;