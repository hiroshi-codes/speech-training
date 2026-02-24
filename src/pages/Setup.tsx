import React from 'react';
import { useNavigate } from 'react-router-dom';
import topicData from '../data/topics.json';
import { type Topic } from '../types/topic';

const Setup: React.FC = () => {
  const navigate = useNavigate();

  // 進捗を計算する関数
  const getProgress = (level: number) => {
    const allTopics = (topicData.topics as Topic[]).filter((t) =>
      level === 0 ? true : t.level === level
    );
    const total = allTopics.length;

    const queueKey = `queue_level_${level}`;
    const clearKey = `clear_count_level_${level}`;

    const queueRaw = localStorage.getItem(queueKey);
    const queue: number[] = JSON.parse(queueRaw || '[]');
    // クリア回数を取得
    const clears = Number(localStorage.getItem(clearKey) || '0');

    let remaining = total;
    if (queueRaw !== null) {
      remaining = queue.length;
    }

    // 1周終わって次の周回がまだ始まっていない状態、または全て解いた後
    const completed = total - remaining;

    return { total, completed, remaining, clears };
  };

  const handleReset = () => {
    // 誤操作防止のために確認ダイアログを出す
    const isConfirmed = window.confirm(
      "これまでの「クリアきろく」と「のこり数」をすべて消して、さいしょから やり直しますか？"
    );

    if (isConfirmed) {
      // 1. 全レベル（0〜6）のキューとクリア回数を削除
      [0, 1, 2, 3, 4, 5, 6].forEach((level) => {
        localStorage.removeItem(`queue_level_${level}`);
        localStorage.removeItem(`clear_count_level_${level}`);
      });

      // 2. 画面をリロードして表示を初期状態に戻す
      window.location.reload();
    }
  };

  const levels = [
    { id: 0, name: 'ぜんぶ', desc: 'ごちゃまぜ', color: 'bg-slate-500', shadow: 'shadow-[0_6px_0_rgb(71,85,105)]' },
    { id: 1, name: 'レベル1', desc: 'かんたんな質問', color: 'bg-emerald-400', shadow: 'shadow-[0_6px_0_rgb(5,150,105)]' },
    { id: 2, name: 'レベル2', desc: 'どっちがすき？', color: 'bg-sky-400', shadow: 'shadow-[0_6px_0_rgb(2,132,199)]' },
    { id: 3, name: 'レベル3', desc: 'ほうこく・説明', color: 'bg-indigo-400', shadow: 'shadow-[0_6px_0_rgb(79,70,229)]' },
    { id: 4, name: 'レベル4', desc: '空想・発明', color: 'bg-purple-400', shadow: 'shadow-[0_6px_0_rgb(147,51,234)]' },
    { id: 5, name: 'レベル5', desc: '価値観・思考', color: 'bg-pink-400', shadow: 'shadow-[0_6px_0_rgb(219,39,119)]' },
    { id: 6, name: 'レベル6', desc: 'なりきり', color: 'bg-rose-500', shadow: 'shadow-[0_6px_0_rgb(190,18,60)]' },
  ];

  return (
    <div className="p-6 pb-12">
      <h2 className="text-2xl font-black text-center text-slate-700 mb-8">
        どの レベル にする？
      </h2>

      <div className="grid grid-cols-1 gap-5 max-w-sm mx-auto">
        {levels.map((lvl) => {
          const { total, completed, remaining, clears } = getProgress(lvl.id);
          return (
            <button
              key={lvl.id}
              onClick={() => navigate('/play', { state: { selectedLevel: lvl.id } })}
              className={`relative flex items-center p-4 ${lvl.color} text-white rounded-2xl ${lvl.shadow} active:translate-y-1 active:shadow-none transition-all overflow-hidden`}
            >
              {/* 進捗ゲージ */}
              <div
                className="absolute bottom-0 left-0 h-1.5 bg-white/30 transition-all duration-1000"
                style={{ width: `${(completed / total) * 100}%` }}
              />

              <div className="bg-white/20 rounded-lg p-2 mr-4 font-black text-xl min-w-10 flex items-center justify-center">
                {lvl.id === 0 ? "★" : lvl.id}
              </div>

              <div className="text-left flex-1">
                <div className="font-black text-lg leading-none">
                  {lvl.name}
                  {/* クリア回数があれば名前の横に表示 */}
                  {clears > 0 && (
                    <span className="ml-2 text-[10px] bg-yellow-300 text-rose-600 px-1.5 py-0.5 rounded-full animate-bounce inline-block">
                      {clears}かい クリア!
                    </span>
                  )}
                </div>
                <div className="text-xs font-bold opacity-90">{lvl.desc}</div>
              </div>

              <div className="text-right">
                {/* 全問解き終わった瞬間（残り0）の表示 */}
                {remaining === 0 ? (
                  <div className="text-lg font-black animate-pulse text-yellow-200">👑 完了!</div>
                ) : (
                  <>
                    <div className="text-[10px] font-black opacity-80 leading-none">あと</div>
                    <div className="text-lg font-black leading-none">{remaining}</div>
                  </>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => navigate('/')}
        className="mt-8 block mx-auto text-slate-400 font-bold hover:text-slate-600"
      >
        ← もどる
      </button>

      {/* 開発・テスト用：記録リセットボタン（必要に応じて） */}
      <button
        onClick={handleReset}
        className="mt-4 block mx-auto text-[10px] text-slate-300 hover:text-rose-400 transition-colors underline decoration-dotted"
      >
        きろくを さいしょからに する
      </button>
    </div>
  );
};

export default Setup;