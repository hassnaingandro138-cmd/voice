import React, { useEffect, useState, useRef } from 'react';
import { Skull, Play, Square, Volume2, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';
import { villainAudioProcessor } from './AudioEffects';

interface PrankLandingProps {
  prankId: string;
}

export const PrankLanding: React.FC<PrankLandingProps> = ({ prankId }) => {
  const [voice, setVoice] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  useEffect(() => {
    fetch(`/api/voices/${prankId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Prank voice record not found or expired.');
        return res.json();
      })
      .then((data) => {
        setVoice(data);
        setLoading(false);
        // Attempt immediate playback on load
        attemptInstantPlayback(data);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [prankId]);

  const attemptInstantPlayback = async (voiceData: any) => {
    setIsPlaying(true);

    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: voiceData.title || 'Dark Villain Prank',
        artist: 'Unknown Dark Entity',
        album: 'Haunted Audio Pranks',
      });
    }

    try {
      if (voiceData.audioData) {
        await villainAudioProcessor.playAudioData(voiceData.audioData, voiceData.voiceSettings || {
          pitch: 0.5, speed: 1.0, reverb: 0.9, bassBoost: 1.5, echo: 0.9, loop: true
        }, () => setIsPlaying(false));
      } else if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(voiceData.script);
        utterance.pitch = voiceData.voiceSettings?.pitch || 0.4;
        utterance.rate = voiceData.voiceSettings?.speed || 1.0;
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.log('Autoplay blocked by browser policy:', e);
      setAutoplayBlocked(true);
      setIsPlaying(false);
    }
  };

  const handleManualPlay = () => {
    if (!voice) return;
    setAutoplayBlocked(false);
    attemptInstantPlayback(voice);
  };

  const handleStop = () => {
    villainAudioProcessor.stop();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-800/80 flex items-center justify-center text-red-500 animate-pulse">
          <Skull className="w-8 h-8" />
        </div>
        <p className="text-zinc-400 font-mono text-sm">Opening dark audio link...</p>
      </div>
    );
  }

  if (error || !voice) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-800/80 flex items-center justify-center text-red-500">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-white font-mono">Prank Not Found</h1>
        <p className="text-xs text-zinc-400 max-w-sm">{error || 'This voice prank link is invalid or has been removed.'}</p>
        <a
          href="/"
          className="px-6 py-2.5 bg-red-900 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition-all"
        >
          Create Your Own Prank
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* Background Cinematic Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-700/15 rounded-full blur-[120px] pointer-events-none animate-pulse" />

      <div className="relative z-10 max-w-xl w-full bg-zinc-950/90 border border-red-900/60 rounded-3xl p-8 sm:p-12 text-center space-y-8 shadow-[0_0_80px_rgba(220,38,38,0.3)] backdrop-blur-xl">
        {/* Header Icon */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-950 to-black border border-red-700/80 flex items-center justify-center text-red-500 mx-auto shadow-[0_0_30px_rgba(220,38,38,0.6)] animate-pulse">
          <Skull className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono text-red-400 uppercase tracking-widest bg-red-950/80 px-3 py-1 rounded-full border border-red-800/50">
            Incoming Voice Message for {voice.targetName}
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-mono text-white">
            {voice.title}
          </h1>
        </div>

        {/* Script / Dialogue Box */}
        <div className="bg-black/80 border border-red-950 rounded-2xl p-6 relative">
          <p className="text-red-400 font-mono text-base sm:text-lg italic leading-relaxed">
            "{voice.script}"
          </p>
        </div>

        {/* Autoplay status or fallback button */}
        {autoplayBlocked ? (
          <button
            onClick={handleManualPlay}
            className="w-full py-5 bg-gradient-to-r from-red-600 via-red-700 to-red-900 hover:from-red-500 hover:to-red-800 text-white font-extrabold text-base uppercase tracking-wider rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.8)] transition-all cursor-pointer flex items-center justify-center gap-3 animate-bounce"
          >
            <Play className="w-6 h-6 fill-current" />
            <span>TAP TO PLAY VILLAIN AUDIO</span>
          </button>
        ) : isPlaying ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-1.5 py-3 bg-red-950/40 border border-red-800/50 rounded-2xl">
              <span className="w-3 h-3 rounded-full bg-red-600 animate-ping" />
              <span className="text-xs font-mono text-red-400 uppercase tracking-widest">Playing Villain Voice (Looping Active)...</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleManualPlay}
                className="flex-1 py-3 bg-red-950 hover:bg-red-900 border border-red-700 text-white font-bold rounded-xl text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Replay from Start</span>
              </button>
              <button
                onClick={handleStop}
                className="flex-1 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-bold rounded-xl text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Stop</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={handleManualPlay}
              className="w-full py-4 bg-red-950 hover:bg-red-900 border border-red-700 text-white font-bold rounded-xl text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 text-red-500 fill-current" />
              <span>Play Audio</span>
            </button>
          </div>
        )}

        <div className="pt-4 border-t border-red-950/60 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
          <span>Dark Villain Prank Generator</span>
          <a href="/" className="text-red-400 hover:underline">Create Yours</a>
        </div>
      </div>
    </div>
  );
};
