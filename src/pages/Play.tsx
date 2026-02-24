import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import topicData from '../data/topics.json';
import { type Topic } from '../types/topic';

const Play: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedLevel = location.state?.selectedLevel ?? 0;
  const MAX_QUESTIONS = 10;

  // --- お題のリスト作成ロジック ---
  const filteredTopics = useMemo(() => {
    const allTopics = (topicData.topics as Topic[]).filter((t) =>
      selectedLevel === 0 ? true : t.level === selectedLevel
    );

    // 山札（これから出すリスト）
    const queueKey = `queue_level_${selectedLevel}`;
    let currentQueue: number[] = JSON.parse(localStorage.getItem(queueKey) || '[]');

    // 山札が空なら全IDを補充
    if (currentQueue.length === 0) {
      currentQueue = allTopics.map(t => t.id).sort(() => Math.random() - 0.5);
      localStorage.setItem(queueKey, JSON.stringify(currentQueue));
    }

    // 先頭10問を表示用に取り出す（ここではまだ保存しない）
    const sessionIds = currentQueue.slice(0, MAX_QUESTIONS);
    return sessionIds.map(id => allTopics.find(t => t.id === id)!).filter(Boolean);
  }, [selectedLevel, location.key]);

  const [currentIndex, setCurrentIndex] = useState(0);

  // --- 終了時に「実際に答えた分」を山札から消す ---
  const finishSession = (finalCount: number) => {
    const queueKey = `queue_level_${selectedLevel}`;
    const clearCountKey = `clear_count_level_${selectedLevel}`;

    const currentQueue: number[] = JSON.parse(localStorage.getItem(queueKey) || '[]');
    const updatedQueue = currentQueue.slice(finalCount);

    // キューを更新
    localStorage.setItem(queueKey, JSON.stringify(updatedQueue));

    // ★ ここでクリア回数のカウントアップ
    if (updatedQueue.length === 0) {
      const currentClears = Number(localStorage.getItem(clearCountKey) || '0');
      localStorage.setItem(clearCountKey, String(currentClears + 1));
    }

    navigate('/result', { state: { count: finalCount, level: selectedLevel } });
  };

  // --- 読み上げ ---
  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const uttr = new SpeechSynthesisUtterance(text);
    uttr.lang = 'ja-JP';
    window.speechSynthesis.speak(uttr);
  };

  const handleNext = () => {
    if (currentIndex < filteredTopics.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      finishSession(currentIndex + 1);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 w-full max-w-md mx-auto">
      {/* 1. 進捗ゲージ */}
      <div className="w-full mb-8">
        <div className="flex justify-between text-sm font-bold text-slate-500 mb-2">
          <span>あと {MAX_QUESTIONS - currentIndex} もん</span>
          <span>{currentIndex + 1} / {MAX_QUESTIONS}</span>
        </div>
        <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden shadow-inner">
          <div
            className="bg-green-400 h-full transition-all duration-500 ease-out"
            style={{ width: `${((currentIndex + 1) / MAX_QUESTIONS) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* 2. お題カード */}
      <div className="relative bg-white w-full p-8 rounded-[2.5rem] shadow-xl border-4 border-blue-50 flex items-center justify-center min-h-60 mb-10">
        <p className="text-3xl font-black text-slate-700 text-center leading-relaxed">
          {filteredTopics[currentIndex]?.text}
        </p>
        <button
          onClick={() => speak(filteredTopics[currentIndex]?.text)}
          className="absolute -bottom-1 right-1 w-14 h-14 bg-yellow-400 rounded-full shadow-lg flex items-center justify-center text-2xl hover:scale-110 active:scale-95 transition-transform"
        >
          🔊
        </button>
      </div>

      {/* 3. 操作ボタン */}
      <div className="w-full space-y-6">
        <button
          onClick={handleNext}
          className="w-full py-5 bg-blue-500 text-white rounded-3xl text-2xl font-black shadow-[0_8px_0_rgb(37,99,235)] active:translate-y-1 active:shadow-[0_4px_0_rgb(37,99,235)] transition-all"
        >
          つぎへ！
        </button>

        <button
          onClick={() => finishSession(currentIndex + 1)}
          className="w-full py-3 text-slate-400 font-bold hover:text-slate-600 transition-colors"
        >
          ここで おしまいにする
        </button>
      </div>
    </div>
  );
};

export default Play;