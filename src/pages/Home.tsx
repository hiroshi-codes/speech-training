// src/pages/Home.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
      {/* ゆるいアイコン的なもの */}
      <div className="mb-8 w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-blue-200 text-6xl animate-bounce-gentle">
        💬
      </div>

      <h1 className="text-4xl font-black text-slate-800 mb-2 leading-tight">
        おしゃべり<br />
        <span className="text-blue-500">トレーニング！</span>
      </h1>
      
      <p className="text-slate-500 font-bold mb-12">
        たのしく おはなし の れんしゅう
      </p>

      <div className="w-full max-w-xs">
        <button 
          onClick={() => navigate('/speech-training/setup')}
          className="w-full py-5 bg-orange-400 text-white rounded-3xl text-2xl font-black shadow-[0_8px_0_rgb(234,88,12)] active:translate-y-1 active:shadow-[0_4px_0_rgb(234,88,12)] transition-all mb-6"
        >
          はじめる！
        </button>
      </div>
    </div>
  );
};

export default Home;