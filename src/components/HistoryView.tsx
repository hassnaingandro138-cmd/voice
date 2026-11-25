import React from 'react';
import { History, Skull, Play } from 'lucide-react';

interface HistoryViewProps {
  voices: any[];
}

export const HistoryView: React.FC<HistoryViewProps> = ({ voices }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-red-950/80 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-800/50 text-red-400 text-xs font-mono uppercase mb-2">
          <History className="w-3.5 h-3.5 animate-pulse" />
          <span>Activity Log & History</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
          Prank Generation History
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Chronological record of all created villain voice pranks and playback statistics.
        </p>
      </div>

      <div className="bg-zinc-950/80 border border-red-950/80 rounded-3xl p-6 space-y-4">
        {voices.length === 0 ? (
          <p className="text-xs text-zinc-500 text-center py-8">No history records found.</p>
        ) : (
          <div className="space-y-3">
            {voices.map((voice, idx) => (
              <div
                key={voice.id || idx}
                className="flex items-center justify-between p-4 bg-black/60 border border-red-950 rounded-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-800 flex items-center justify-center text-red-500 shrink-0">
                    <Skull className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{voice.title}</h4>
                    <p className="text-xs text-zinc-400 font-mono">Target: {voice.targetName} · Created: {new Date(voice.createdAt || Date.now()).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-red-400">{voice.playsCount || 0} plays</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
