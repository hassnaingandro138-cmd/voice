import React from 'react';
import { Skull, Wand2, Mic, Upload, Share2, FileText, Play, ArrowRight, Zap, ShieldAlert, Sparkles } from 'lucide-react';

interface DashboardHomeProps {
  setCurrentTab: (tab: string) => void;
  voices: any[];
  onSelectVoice: (voice: any) => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({ setCurrentTab, voices, onSelectVoice }) => {
  const totalPlays = voices.reduce((acc, v) => acc + (v.playsCount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-10">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-950/80 via-black to-zinc-950 border border-red-900/50 p-8 lg:p-12 shadow-[0_0_50px_rgba(220,38,38,0.2)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/80 border border-red-700/50 text-red-300 text-xs font-mono uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            <span>Cinematic Horror Voice Engine</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight font-mono">
            Bhaaiii... tu so gaya kya? <span className="text-red-500">Unleash the Dark Villain.</span>
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Generate extremely deep bass villain voices, record your microphone, transcribe audio with Gemini AI, and create unique shareable prank links that haunt your friends with cinematic reverb and spooky soundscapes.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => setCurrentTab('ai-gen')}
              className="flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-bold text-sm rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.6)] transition-all cursor-pointer"
            >
              <Wand2 className="w-4 h-4" />
              <span>Generate AI Villain Voice</span>
            </button>
            <button
              onClick={() => setCurrentTab('saved')}
              className="flex items-center gap-2.5 px-6 py-3 bg-zinc-900/80 hover:bg-zinc-800 border border-red-900/50 text-zinc-200 font-bold text-sm rounded-xl transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-red-500" />
              <span>My Saved Voices ({voices.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-950/60 border border-red-950/80 rounded-2xl p-6 relative overflow-hidden group hover:border-red-800/60 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider">Saved Pranks</p>
              <p className="text-3xl font-extrabold text-white mt-2 font-mono">{voices.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-950/50 border border-red-900/50 flex items-center justify-center text-red-500">
              <Skull className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs text-red-400/80">
            <span>Ready for instant deployment</span>
          </div>
        </div>

        <div className="bg-zinc-950/60 border border-red-950/80 rounded-2xl p-6 relative overflow-hidden group hover:border-red-800/60 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider">Total Prank Plays</p>
              <p className="text-3xl font-extrabold text-white mt-2 font-mono">{totalPlays}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-950/50 border border-red-900/50 flex items-center justify-center text-red-500">
              <Play className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs text-red-400/80">
            <span>Victims haunted worldwide</span>
          </div>
        </div>

        <div className="bg-zinc-950/60 border border-red-950/80 rounded-2xl p-6 relative overflow-hidden group hover:border-red-800/60 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider">AI Voice Engine</p>
              <p className="text-xl font-extrabold text-white mt-2 font-mono">Gemini & WebAudio</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-950/50 border border-red-900/50 flex items-center justify-center text-red-500">
              <Zap className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Server-side API active</span>
          </div>
        </div>

        <div className="bg-zinc-950/60 border border-red-950/80 rounded-2xl p-6 relative overflow-hidden group hover:border-red-800/60 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider">Security & Links</p>
              <p className="text-xl font-extrabold text-white mt-2 font-mono">Persistent DB</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-950/50 border border-red-900/50 flex items-center justify-center text-red-500">
              <ShieldAlert className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs text-red-400/80">
            <span>Cross-device sync enabled</span>
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-600" />
          <span>Prank Creation Suite</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            onClick={() => setCurrentTab('ai-gen')}
            className="bg-gradient-to-br from-zinc-950 to-red-950/30 border border-red-900/40 rounded-2xl p-6 cursor-pointer hover:border-red-700/80 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-red-950/80 border border-red-800/60 flex items-center justify-center text-red-500 mb-4 group-hover:scale-110 transition-transform">
              <Wand2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">AI Villain Voice Generator</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Generate custom villain scripts with Gemini AI and synthesize spooky bass-boosted audio with cinematic echo.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs text-red-400 font-medium">
              <span>Get started</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div 
            onClick={() => setCurrentTab('record')}
            className="bg-gradient-to-br from-zinc-950 to-red-950/30 border border-red-900/40 rounded-2xl p-6 cursor-pointer hover:border-red-700/80 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-red-950/80 border border-red-800/60 flex items-center justify-center text-red-500 mb-4 group-hover:scale-110 transition-transform">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Microphone Recorder</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Record your own voice directly from the mic and apply heavy pitch reduction and monster reverb effects.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs text-red-400 font-medium">
              <span>Start recording</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div 
            onClick={() => setCurrentTab('transcribe')}
            className="bg-gradient-to-br from-zinc-950 to-red-950/30 border border-red-900/40 rounded-2xl p-6 cursor-pointer hover:border-red-700/80 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-red-950/80 border border-red-800/60 flex items-center justify-center text-red-500 mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">AI Audio Transcriber</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Upload any recorded audio file and instantly transcribe speech to text using Gemini 3.5 Transcribe.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs text-red-400 font-medium">
              <span>Transcribe audio</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Voices */}
      {voices.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              <span>Recent Created Voices</span>
            </h2>
            <button
              onClick={() => setCurrentTab('saved')}
              className="text-xs text-red-400 hover:text-red-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>View all ({voices.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {voices.slice(0, 3).map((voice) => (
              <div
                key={voice.id}
                className="bg-zinc-950/80 border border-red-950/80 rounded-2xl p-5 hover:border-red-800/80 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-red-950/60 border border-red-800/50 text-red-300 font-mono">
                      Target: {voice.targetName}
                    </span>
                    <span className="text-[11px] text-zinc-500 font-mono">
                      {voice.playsCount || 0} plays
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-1 truncate">{voice.title}</h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 italic mb-4">"{voice.script}"</p>
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-red-950/60">
                  <button
                    onClick={() => onSelectVoice(voice)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-950/60 hover:bg-red-900 border border-red-800/50 text-white rounded-xl text-xs font-medium transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 text-red-400" />
                    <span>Preview</span>
                  </button>
                  <button
                    onClick={() => setCurrentTab('saved')}
                    className="flex items-center justify-center px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-xl text-xs font-medium transition-all cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
