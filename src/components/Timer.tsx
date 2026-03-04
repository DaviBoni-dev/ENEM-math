'use client';

import { useState, useEffect } from 'react';
import { Clock, Pause, Play, RotateCcw } from 'lucide-react';

export default function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="sticky top-20 z-40 mb-8 flex justify-center">
      <div className="bg-white/80 backdrop-blur-md border border-indigo-100 shadow-lg px-6 py-3 rounded-2xl flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-mono font-bold text-slate-800">
            {formatTime(seconds)}
          </span>
        </div>

        <div className="flex items-center gap-2 border-l pl-6 border-slate-200">
          <button 
            onClick={() => setIsActive(!isActive)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            title={isActive ? "Pausar" : "Retomar"}
          >
            {isActive ? <Pause className="w-5 h-5 text-slate-600" /> : <Play className="w-5 h-5 text-indigo-600" />}
          </button>
          <button 
            onClick={() => { setSeconds(0); setIsActive(false); }}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
            title="Reiniciar"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}