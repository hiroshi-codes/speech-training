import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Setup from './pages/Setup';
import Play from './pages/Play';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-yellow-50">
        <header className="p-4 flex justify-end">
          {/* ここに「設定」アイコンなど置く予定 */}
        </header>

        <main className="container mx-auto px-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/setup" element={<Setup />} />
            <Route path="/play" element={<Play />} />
            <Route path="/speech-training/" element={<Home />} />
            <Route path="/speech-training/setup" element={<Setup />} />
            <Route path="/speech-training/play" element={<Play />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
export default App
