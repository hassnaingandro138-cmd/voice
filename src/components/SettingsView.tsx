import React, { useState } from 'react';
import { Settings, Shield, Volume2, HardDrive, CheckCircle2 } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [defaultLoop, setDefaultLoop] = useState(true);
  const [autoPlayWarning, setAutoPlayWarning] = useState(true);
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSaveSettings = () => {
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-red-950/80 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-800/50 text-red-400 text-xs font-mono uppercase mb-2">
          <Settings className="w-3.5 h-3.5 animate-pulse" />
          <span>App Preferences</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
          Settings & Configuration
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Configure default audio playback behavior, storage settings, and voice engine preferences.
        </p>
      </div>

      {savedMessage && (
        <div className="flex items-center gap-3 p-4 bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 rounded-2xl text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Settings successfully updated!</span>
        </div>
      )}

      <div className="bg-zinc-950/80 border border-red-950/80 rounded-3xl p-8 space-y-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between py-4 border-b border-red-950/60">
            <div>
              <h3 className="text-sm font-bold text-white font-mono">Continuous Loop by Default</h3>
              <p className="text-xs text-zinc-400">Automatically repeat villain voice playback on shareable links.</p>
            </div>
            <input
              type="checkbox"
              checked={defaultLoop}
              onChange={(e) => setDefaultLoop(e.target.checked)}
              className="w-5 h-5 accent-red-600 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-4 border-b border-red-950/60">
            <div>
              <h3 className="text-sm font-bold text-white font-mono">Visitor Autoplay Warning Banner</h3>
              <p className="text-xs text-zinc-400">Display prominent Start button on prank landing pages to comply with browser policies.</p>
            </div>
            <input
              type="checkbox"
              checked={autoPlayWarning}
              onChange={(e) => setAutoPlayWarning(e.target.checked)}
              className="w-5 h-5 accent-red-600 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-4 border-b border-red-950/60">
            <div>
              <h3 className="text-sm font-bold text-white font-mono">Backend Database & Audio Storage</h3>
              <p className="text-xs text-zinc-400">Server-side JSON file persistence active in /data/voices.json</p>
            </div>
            <span className="px-3 py-1 bg-emerald-950 text-emerald-400 text-xs font-mono rounded-full border border-emerald-800">
              Active
            </span>
          </div>
        </div>

        <button
          onClick={handleSaveSettings}
          className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-bold rounded-xl text-sm shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all cursor-pointer"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
};
