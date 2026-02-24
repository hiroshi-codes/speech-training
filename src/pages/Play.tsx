import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import topicData from '../data/topics.json'; // パスは適宜調整してください
import { type Topic } from '../types/topic';

const Play: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 0 は「全レベル」を指すと定義
  const selectedLevel = location.state?.selectedLevel ?? 0;

  const filteredTopics = useMemo(() => {
    // 1. レベルが0なら全データ、それ以外ならフィルタリング
    const rawData = selectedLevel === 0
      ? (topicData.topics as Topic[])
      : (topicData.topics as Topic[]).filter((t) => t.level === selectedLevel);

    // 2. シャッフル
    return [...rawData].sort(() => Math.random() - 0.5);
  }, [selectedLevel]);

  // 現在の問題のインデックスを管理するState
  const [currentIndex, setCurrentIndex] = React.useState(0);

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
    if (currentIndex < filteredTopics.length - 1) {
      setCurrentIndex(prev => prev + 1);
      // 次の問題に行った時に自動で読み上げたい場合はここで呼ぶ
      // ※ただし、一度ユーザーが画面のどこかをクリックしている必要があります
      // speak(filteredTopics[currentIndex + 1].text);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="text-center mb-4 text-gray-500 font-bold">
        {selectedLevel === 0 ? "ぜんぶ混ぜて練習中" : `レベル ${selectedLevel} の練習中`}
        <div className="text-sm">（{currentIndex + 1} / {filteredTopics.length}問目）</div>
      </div>

      <div className="relative bg-white p-10 rounded-[3rem] shadow-xl border-4 border-blue-100 min-h-62.5 w-full flex items-center justify-center mb-6">
        <p className="text-3xl font-black text-slate-700 text-center leading-relaxed">
          {filteredTopics[currentIndex]?.text}
        </p>

        {/* 読み上げボタン */}
        <button
          onClick={() => speak(filteredTopics[currentIndex]?.text)}
          className="absolute -bottom-1 right-6 w-14 h-14 bg-yellow-400 rounded-full shadow-lg flex items-center justify-center text-2xl hover:scale-110 active:scale-95 transition-transform"
          title="よみあげ"
        >
          🔊
        </button>
      </div>

      <div className="flex justify-center gap-6">
        <button
          onClick={() => navigate('/setup')}
          className="px-8 py-3 bg-gray-200 text-gray-700 rounded-full font-bold shadow-md active:scale-95"
        >
          やめる
        </button>
        <button
          onClick={handleNext}
          className="px-10 py-3 bg-blue-500 text-white rounded-full font-bold shadow-lg hover:bg-blue-600 active:scale-95"
        >
          つぎへ
        </button>
      </div>
    </div>
  );
};

export default Play;