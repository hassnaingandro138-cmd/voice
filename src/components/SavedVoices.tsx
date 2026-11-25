import React, { useState } from 'react';
import { Skull, Share2, Trash2, Play, Copy, Check, ExternalLink, Sparkles, Link as LinkIcon } from 'lucide-react';
import { villainAudioProcessor } from './AudioEffects';

interface SavedVoicesProps {
  voices: any[];
  onDeleteVoice: (id: string) => void;
  onSelectVoice: (voice: any) => void;
}

export const SavedVoices: React.FC<SavedVoicesProps> = ({ voices, onDeleteVoice, onSelectVoice }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [activeLinkModalVoice, setActiveLinkModalVoice] = useState<any | null>(null);

  const getPrankUrl = (id: string) => {
    // Uses current origin / deployment URL (works on Vercel / Cloud Run)
    return `${window.location.origin}/prank/${id}`;
  };

  const handleCopyLink = (id: string) => {
    const url = getPrankUrl(id);
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handlePlay = async (voice: any) => {
    if (playingId === voice.id) {
      villainAudioProcessor.stop();
      setPlayingId(null);
      return;
    }

    setPlayingId(voice.id);
    if (voice.audioData) {
      await villainAudioProcessor.playAudioData(voice.audioData, voice.voiceSettings || {
        pitch: 0.5, speed: 1.0, reverb: 0.9, bassBoost: 1.2, echo: 0.8, loop: true
      }, () => setPlayingId(null));
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(voice.script);
        utterance.pitch = voice.voiceSettings?.pitch || 0.4;
        utterance.rate = voice.voiceSettings?.speed || 1.0;
        utterance.onend = () => setPlayingId(null);
        utterance.onerror = () => setPlayingId(null);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-red-950/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-800/50 text-red-400 text-xs font-mono uppercase mb-2">
            <Share2 className="w-3.5 h-3.5 animate-pulse" />
            <span>Direct Voice Prank Link Generator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
            My Saved Voices & Link Generator
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Click "Generate Voice Link" to get a clean direct URL that plays the villain voice instantly when opened.
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono text-zinc-400">Total Saved: </span>
          <span className="text-lg font-bold text-red-500 font-mono">{voices.length}</span>
        </div>
      </div>

      {voices.length === 0 ? (
        <div className="bg-zinc-950/80 border border-red-950/80 rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-800/60 flex items-center justify-center text-red-500 mx-auto">
            <Skull className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No saved voices found</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Create an AI villain voice or record audio to generate your first unique direct voice link.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {voices.map((voice) => {
            const isPlaying = playingId === voice.id;
            const prankLink = getPrankUrl(voice.id);
            const isCopied = copiedId === voice.id;

            return (
              <div
                key={voice.id}
                className="bg-zinc-950/90 border border-red-950/80 rounded-3xl p-6 flex flex-col justify-between hover:border-red-800/80 transition-all shadow-[0_0_20px_rgba(0,0,0,0.8)]"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-red-950/60 border border-red-800/50 text-red-300 font-mono">
                      Target: {voice.targetName}
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">
                      {voice.playsCount || 0} plays
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{voice.title}</h3>
                    <p className="text-xs text-zinc-400 italic line-clamp-2">"{voice.script}"</p>
                  </div>

                  {/* Prominent Generate Voice Link Action */}
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => setActiveLinkModalVoice(voice)}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all cursor-pointer"
                    >
                      <LinkIcon className="w-4 h-4" />
                      <span>Generate Voice Link</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-6 mt-6 border-t border-red-950/80">
                  <button
                    onClick={() => handlePlay(voice)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isPlaying
                        ? 'bg-amber-600 text-white'
                        : 'bg-red-950/60 hover:bg-red-900 border border-red-800/50 text-white'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 text-red-400" />
                    <span>{isPlaying ? 'Pause' : 'Preview'}</span>
                  </button>

                  <button
                    onClick={() => onDeleteVoice(voice.id)}
                    className="flex items-center justify-center p-2.5 bg-zinc-900 hover:bg-red-950 border border-red-900/50 hover:border-red-600 text-zinc-400 hover:text-red-400 rounded-xl transition-all cursor-pointer"
                    title="Delete Prank"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for Generated Voice Link */}
      {activeLinkModalVoice && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-red-800/80 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-[0_0_50px_rgba(220,38,38,0.4)]">
            <div className="flex items-center justify-between border-b border-red-950 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-700 flex items-center justify-center text-red-500">
                  <Skull className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Unique Voice Link Generated</h3>
                  <p className="text-xs text-zinc-400">{activeLinkModalVoice.title}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveLinkModalVoice(null)}
                className="text-zinc-400 hover:text-white text-sm font-mono px-3 py-1 bg-zinc-900 rounded-lg cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-mono text-zinc-400 uppercase">Shareable Direct Playback URL</label>
              <div className="bg-black border border-red-900/80 rounded-2xl p-4 flex items-center justify-between gap-3">
                <span className="text-xs text-red-400 font-mono break-all">
                  {getPrankUrl(activeLinkModalVoice.id)}
                </span>
                <button
                  onClick={() => handleCopyLink(activeLinkModalVoice.id)}
                  className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shrink-0 shadow-[0_0_15px_rgba(220,38,38,0.5)] cursor-pointer"
                >
                  {copiedId === activeLinkModalVoice.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedId === activeLinkModalVoice.id ? 'Copied Link!' : 'Copy Link'}</span>
                </button>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">
                When your friend opens this direct link, it opens a clean minimal playback page that plays the deep villain voice instantly with looping enabled.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <a
                href={getPrankUrl(activeLinkModalVoice.id)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-red-900/50 text-white rounded-xl text-xs font-medium transition-all"
              >
                <ExternalLink className="w-4 h-4 text-red-500" />
                <span>Test Link in New Tab</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
