import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import topicData from '../data/topics.json';
import { type Topic } from '../types/topic';

const Play: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedLevel = location.state?.selectedLevel ?? 0;

  // 1セットの最大問題数
  const MAX_QUESTIONS = 10;

  // データの準備（フィルタリングとシャッフル）
  const filteredTopics = useMemo(() => {
    const rawData = selectedLevel === 0
      ? (topicData.topics as Topic[])
      : (topicData.topics as Topic[]).filter((t) => t.level === selectedLevel);
    return [...rawData].sort(() => Math.random() - 0.5);
  }, [selectedLevel]);

  const [currentIndex, setCurrentIndex] = useState(0);

  // 共通の終了処理
  const finishSession = (finalCount: number) => {
    navigate('/result', { state: { count: finalCount, level: selectedLevel } });
  };

  // 読み上げ用の関数
  const speak = (text: string) => {
    // ブラウザが対応しているか確認
    if (!('speechSynthesis' in window)) {
      alert('このブラウザは音声読み上げに対応していません');
      return;
    }

    // 実行中の読み上げがあればキャンセル
    window.speechSynthesis.cancel();

    const uttr = new SpeechSynthesisUtterance(text);
    uttr.lang = 'ja-JP'; // 日本語
    uttr.rate = 1.0;     // 速度（0.1〜10）
    uttr.pitch = 1.0;    // 声の高さ（0〜2）

    window.speechSynthesis.speak(uttr);
  };

  const handleNext = () => {
    // 10問目（MAX-1）に達したか、全データの上限なら終了
    if (currentIndex < MAX_QUESTIONS - 1 && currentIndex < filteredTopics.length - 1) {
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
      <div className="relative bg-white w-full p-8 rounded-[2.5rem] shadow-xl border-4 border-blue-50 flex items-center justify-center min-h-62.5 mb-10">
        <p className="text-3xl font-black text-slate-700 text-center leading-relaxed">
          {filteredTopics[currentIndex]?.text}
        </p>
        {/* 読み上げボタン */}
        <button
          onClick={() => speak(filteredTopics[currentIndex]?.text)}
          className="absolute -bottom-1 right-1 w-14 h-14 bg-yellow-400 rounded-full shadow-lg flex items-center justify-center text-2xl hover:scale-110 active:scale-95 transition-transform"
          title="よみあげ"
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