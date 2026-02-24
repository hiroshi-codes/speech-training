// src/pages/Setup.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Setup: React.FC = () => {
  const navigate = useNavigate();

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
        {levels.map((lvl) => (
          <button
            key={lvl.id}
            onClick={() => navigate('/speech-training/play', { state: { selectedLevel: lvl.id } })}
            className={`flex items-center p-4 ${lvl.color} text-white rounded-2xl ${lvl.shadow} active:translate-y-1 active:shadow-none transition-all`}
          >
            <div className="bg-white/20 rounded-lg p-2 mr-4 font-black text-xl min-w-10">
              {lvl.id === 0 ? "★" : lvl.id}
            </div>
            <div className="text-left">
              <div className="font-black text-lg leading-none">{lvl.name}</div>
              <div className="text-xs font-bold opacity-90">{lvl.desc}</div>
            </div>
          </button>
        ))}
      </div>

      <button 
        onClick={() => navigate('/speech-training/')}
        className="mt-10 block mx-auto text-slate-400 font-bold hover:text-slate-600"
      >
        ← もどる
      </button>
    </div>
  );
};

export default Setup;