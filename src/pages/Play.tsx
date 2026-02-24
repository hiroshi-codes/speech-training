import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import topicData from '../data/topics.json';
import { type Topic } from '../types/topic';

type Phase = 'thinking' | 'speaking';

const Play: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedLevel = location.state?.selectedLevel ?? 0;
  const MAX_QUESTIONS = 10;

  // 1. お題のリストを作成
  const filteredTopics = useMemo(() => {
    const allTopics = (topicData.topics as Topic[]).filter((t) =>
      selectedLevel === 0 ? true : t.level === selectedLevel
    );

    const queueKey = `queue_level_${selectedLevel}`;
    let currentQueue: number[] = JSON.parse(localStorage.getItem(queueKey) || '[]');

    // ★ 修正：山札が完全に空（または初回）の場合だけ、全お題をセットする
    // 「足りないから補充」ではなく「空だから新しく始める」時だけにする
    if (currentQueue.length === 0) {
      currentQueue = allTopics.map(t => t.id).sort(() => Math.random() - 0.5);
      // ここで保存することで、新しい周回がスタートする
      localStorage.setItem(queueKey, JSON.stringify(currentQueue));
    }

    // 表示用に最大10問取り出す
    const sessionIds = currentQueue.slice(0, MAX_QUESTIONS);
    return sessionIds.map(id => allTopics.find(t => t.id === id)!).filter(Boolean);
  }, [selectedLevel, location.key]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('thinking');
  const [timeLeft, setTimeLeft] = useState(20);
  const [doneIds, setDoneIds] = useState<number[]>([]);

  // シンキングタイムのカウントダウン
  useEffect(() => {
    let timer: number;
    if (phase === 'thinking' && timeLeft > 0) {
      timer = window.setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [phase, timeLeft]);

  // お題が変わるたびにタイマーとフェーズをリセット
  useEffect(() => {
    setTimeLeft(20);
    setPhase('thinking');
  }, [currentIndex]);

  // --- 終了・集計処理の共通関数 ---
  const saveAndExit = (finalDoneIds: number[]) => {
    const queueKey = `queue_level_${selectedLevel}`;
    const clearCountKey = `clear_count_level_${selectedLevel}`;

    // 現在の全山札（まだ解いていない全ID）を取得
    const currentQueue: number[] = JSON.parse(localStorage.getItem(queueKey) || '[]');

    // 1. 今回のプレイで「できた」お題を、全体の山札から消す
    const updatedQueue = currentQueue.filter(id => !finalDoneIds.includes(id));

    // 2. 更新された山札を保存
    localStorage.setItem(queueKey, JSON.stringify(updatedQueue));

    // ★ 3. クリア判定のロジックを変更
    // 山札（未クリア）が 0 になったら、クリア回数を増やす
    if (updatedQueue.length === 0) {
      const currentClears = Number(localStorage.getItem(clearCountKey) || '0');
      localStorage.setItem(clearCountKey, String(currentClears + 1));

      // 【重要】Setup画面で「残り0」を表示させ続けるため、ここでは補充しない
    }

    navigate('/result', { state: { count: finalDoneIds.length, level: selectedLevel } });
  };

  // --- 判定ボタンが押された時の処理 ---
  const processResult = (isSuccess: boolean) => {
    // 成功時のみIDをリストに追加
    const nextDoneIds = isSuccess
      ? [...doneIds, filteredTopics[currentIndex].id]
      : doneIds;

    if (isSuccess) setDoneIds(nextDoneIds);

    if (currentIndex < filteredTopics.length - 1) {
      // 次の問題へ
      setCurrentIndex(prev => prev + 1);
    } else {
      // 10問終了
      saveAndExit(nextDoneIds);
    }
  };

  // --- 途中で「おしまい」にする時 ---
  const finishSession = () => {
    saveAndExit(doneIds);
  };

  return (
    <div className="flex flex-col items-center p-6 w-full max-w-md mx-auto min-h-screen">
      {/* 進捗ゲージ */}
      <div className="w-full mb-6">
        <div className="flex justify-between text-sm font-bold text-slate-500 mb-2">
          <span>あと {filteredTopics.length - currentIndex} もん</span>
          <span className="text-green-600 font-black">できた: {doneIds.length}</span>
        </div>
        <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden shadow-inner">
          <div
            className="bg-blue-400 h-full transition-all duration-500 ease-out"
            style={{ width: `${((currentIndex + 1) / filteredTopics.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* お題カード */}
      <div className="relative bg-white w-full p-8 rounded-[2.5rem] shadow-xl border-4 border-blue-50 flex flex-col items-center justify-center min-h-64 mb-8">
        <p className="text-2xl font-black text-slate-700 text-center leading-relaxed mb-4">
          {filteredTopics[currentIndex]?.text}
        </p>
        <button
          onClick={() => speak(filteredTopics[currentIndex]?.text)}
          className="w-12 h-12 bg-yellow-400 rounded-full shadow-lg flex items-center justify-center text-xl hover:scale-110 active:scale-90 transition-transform"
        >
          🔊
        </button>
      </div>

      {/* アクションエリア */}
      <div className="w-full flex-1 flex flex-col items-center justify-start space-y-4">
        {phase === 'thinking' ? (
          <div className="text-center w-full animate-in fade-in duration-300">
            <div className="text-slate-500 font-bold mb-2">🤔 かんがえタイム</div>
            <div className={`text-5xl font-black mb-6 ${timeLeft <= 5 ? 'text-rose-500 animate-pulse' : 'text-blue-500'}`}>
              {timeLeft}
            </div>
            <button
              onClick={() => setPhase('speaking')}
              className="w-full py-5 bg-amber-400 text-white rounded-3xl text-2xl font-black shadow-[0_8px_0_rgb(217,119,6)] active:translate-y-1 active:shadow-none transition-all"
            >
              じゅんびOK！
            </button>
          </div>
        ) : (
          <div className="text-center w-full space-y-4 animate-in zoom-in duration-300">
            <div className="text-rose-500 font-bold mb-2 text-xl animate-bounce">📢 はっぴょう中！</div>

            <button
              onClick={() => processResult(true)}
              className="w-full py-6 bg-green-500 text-white rounded-3xl text-3xl font-black shadow-[0_8px_0_rgb(22,163,74)] active:translate-y-1 active:shadow-none transition-all"
            >
              できた！！
            </button>

            <button
              onClick={() => processResult(false)}
              className="w-full py-4 bg-slate-400 text-white rounded-2xl text-xl font-black shadow-[0_6px_0_rgb(71,85,105)] active:translate-y-1 active:shadow-none transition-all"
            >
              できなかった
            </button>
          </div>
        )}

        <button
          onClick={finishSession}
          className="text-slate-400 font-bold py-4 text-sm underline hover:text-slate-600 transition-colors"
        >
          ここでおしまい（しゅうけいする）
        </button>
      </div>
    </div>
  );
};

// 読み上げ関数
const speak = (text: string | undefined) => {
  if (!text || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const uttr = new SpeechSynthesisUtterance(text);
  uttr.lang = 'ja-JP';
  window.speechSynthesis.speak(uttr);
};

export default Play;