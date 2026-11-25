import React, { useState } from 'react';
import { Wand2, Volume2, Play, Square, Save, Share2, Sparkles, Sliders, CheckCircle2, Link as LinkIcon, Copy, Check, ExternalLink } from 'lucide-react';
import { villainAudioProcessor } from './AudioEffects';

interface AIGeneratorProps {
  onSaveVoice: (voiceData: any) => Promise<any>;
  onViewSaved: () => void;
}

export const AIGenerator: React.FC<AIGeneratorProps> = ({ onSaveVoice, onViewSaved }) => {
  const [targetName, setTargetName] = useState('Bhai');
  const [customPrompt, setCustomPrompt] = useState('bhai to so gaya uth qamene');
  const [title, setTitle] = useState('Bollywood Villain Prank');
  const [script, setScript] = useState('bhai to so gaya uth qamene');
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedVoiceResult, setSavedVoiceResult] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  // Voice Settings
  const [pitch, setPitch] = useState(0.35);
  const [speed, setSpeed] = useState(0.9);
  const [reverb, setReverb] = useState(0.95);
  const [bassBoost, setBassBoost] = useState(1.4);
  const [loop, setLoop] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleGenerateScript = async () => {
    setIsGeneratingScript(true);
    try {
      const res = await fetch('/api/ai/script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: customPrompt, targetName }),
      });
      const data = await res.json();
      if (data.script) {
        setScript(data.script);
        setTitle(`${targetName}'s Bollywood Villain Prank`);
      }
    } catch (e) {
      console.error('Failed to generate script', e);
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const handlePreviewAudio = () => {
    if (isPlaying) {
      villainAudioProcessor.stop();
      setIsPlaying(false);
      return;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(script);
      utterance.pitch = Math.max(0.1, Math.min(0.8, pitch));
      utterance.rate = Math.max(0.5, Math.min(1.5, speed));
      utterance.lang = 'hi-IN'; // Natural Hindi/Urdu pronunciation

      const voices = window.speechSynthesis.getVoices();
      const hindiVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('ur') || v.name.includes('Hindi') || v.name.includes('India'));
      if (hindiVoice) {
        utterance.voice = hindiVoice;
      }

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
    } else {
      alert('Speech synthesis not supported in this browser.');
    }
  };

  const handleSaveAndGenerateLink = async () => {
    setIsSaving(true);
    try {
      const voiceData = {
        title,
        targetName,
        script,
        audioData: '',
        voiceSettings: { pitch, speed, reverb, bassBoost, echo: 0.9, loop },
      };
      const saved = await onSaveVoice(voiceData);
      setSavedVoiceResult(saved);
    } catch (e) {
      console.error('Failed to save voice', e);
    } finally {
      setIsSaving(false);
    }
  };

  const getPrankUrl = (id: string) => {
    return `${window.location.origin}/prank/${id}`;
  };

  const handleCopy = (id: string) => {
    const url = getPrankUrl(id);
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-red-950/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-800/50 text-red-400 text-xs font-mono uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Bollywood Villain Voice API</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
            Generate Indian Bollywood Villain Voice Link
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Create heavy bass villain dialogues in Hindi/Urdu and get your direct shareable public voice link.
          </p>
        </div>
        <button
          onClick={onViewSaved}
          className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-red-900/50 text-white rounded-xl text-xs font-medium transition-all cursor-pointer"
        >
          <Share2 className="w-4 h-4 text-red-500" />
          <span>View All Saved Links</span>
        </button>
      </div>

      {savedVoiceResult && (
        <div className="bg-gradient-to-br from-red-950/90 via-black to-zinc-950 border border-red-600 rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_0_60px_rgba(220,38,38,0.6)]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-900/60 border border-red-500 flex items-center justify-center text-red-300">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Direct Voice Link Generated Successfully!</h3>
              <p className="text-xs text-zinc-400">Copy this unique public link to send to your friend.</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-mono text-red-400 uppercase">Your Unique Shareable Voice URL</label>
            <div className="bg-black border border-red-800/80 rounded-2xl p-4 flex items-center justify-between gap-3">
              <span className="text-xs text-red-300 font-mono break-all">
                {getPrankUrl(savedVoiceResult.id)}
              </span>
              <button
                onClick={() => handleCopy(savedVoiceResult.id)}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shrink-0 shadow-[0_0_20px_rgba(220,38,38,0.8)] cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied Link!' : 'Copy Link'}</span>
              </button>
            </div>
            <p className="text-xs text-zinc-400 italic">
              When your friend opens this direct link, it opens a clean minimal playback page that plays the villain voice immediately.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <a
              href={getPrankUrl(savedVoiceResult.id)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-3 bg-zinc-900 hover:bg-zinc-800 border border-red-800 text-white font-bold rounded-xl text-xs transition-all"
            >
              <ExternalLink className="w-4 h-4 text-red-500" />
              <span>Test Direct Link in New Tab</span>
            </a>
            <button
              onClick={() => setSavedVoiceResult(null)}
              className="px-5 py-3 bg-black hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-xl text-xs font-mono transition-all cursor-pointer"
            >
              Create Another Voice
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Inputs & Urdu Dialogue */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-950/80 border border-red-950/80 rounded-3xl p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase mb-2">Target Friend Name</label>
                <input
                  type="text"
                  value={targetName}
                  onChange={(e) => setTargetName(e.target.value)}
                  placeholder="e.g. Bhai, Rahul"
                  className="w-full bg-black border border-red-950 focus:border-red-600 rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase mb-2">Voice Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Bollywood Villain Prank"
                  className="w-full bg-black border border-red-950 focus:border-red-600 rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase mb-2">AI Prompt / Scenario (Urdu or Roman Urdu)</label>
              <textarea
                rows={3}
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Enter prompt in Urdu or Roman Urdu..."
                className="w-full bg-black border border-red-950 focus:border-red-600 rounded-xl p-4 text-white text-sm outline-none transition-colors resize-none"
              />
            </div>

            <button
              onClick={handleGenerateScript}
              disabled={isGeneratingScript}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-red-900 to-red-950 hover:from-red-800 hover:to-red-900 border border-red-700/60 text-white font-bold rounded-xl text-sm shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all cursor-pointer disabled:opacity-50"
            >
              <Wand2 className={`w-4 h-4 ${isGeneratingScript ? 'animate-spin' : ''}`} />
              <span>{isGeneratingScript ? 'Generating Bollywood Villain Script...' : 'Generate Urdu AI Script'}</span>
            </button>

            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase mb-2">Urdu / Roman Urdu Dialogue</label>
              <textarea
                rows={4}
                value={script}
                onChange={(e) => setScript(e.target.value)}
                className="w-full bg-black border border-red-900/60 focus:border-red-600 rounded-xl p-4 text-red-400 font-mono text-base outline-none transition-colors text-right"
                dir="auto"
              />
            </div>
          </div>
        </div>

        {/* Right Col: Voice Tuning & Generate Voice Link */}
        <div className="space-y-6">
          <div className="bg-zinc-950/80 border border-red-950/80 rounded-3xl p-6 space-y-6">
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <Sliders className="w-4 h-4 text-red-500" />
              <span>Villain Voice Tuning</span>
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
                  <span>Deep Bass & Pitch</span>
                  <span>{pitch}x</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="0.8"
                  step="0.05"
                  value={pitch}
                  onChange={(e) => setPitch(parseFloat(e.target.value))}
                  className="w-full accent-red-600 bg-black cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
                  <span>Playback Speed</span>
                  <span>{speed}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.05"
                  value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  className="w-full accent-red-600 bg-black cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-red-950/80">
                <span className="text-xs font-mono text-zinc-300">Continuous Loop</span>
                <input
                  type="checkbox"
                  checked={loop}
                  onChange={(e) => setLoop(e.target.checked)}
                  className="w-4 h-4 accent-red-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-red-950/80">
              <button
                onClick={handlePreviewAudio}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                  isPlaying
                    ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-[0_0_15px_rgba(217,119,6,0.5)]'
                    : 'bg-zinc-900 hover:bg-zinc-800 border border-red-900/60 text-white'
                }`}
              >
                {isPlaying ? <Square className="w-4 h-4 animate-pulse" /> : <Play className="w-4 h-4 text-red-500" />}
                <span>{isPlaying ? 'Stop Voice Preview' : 'Preview Voice'}</span>
              </button>

              <button
                onClick={handleSaveAndGenerateLink}
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2.5 py-4 bg-gradient-to-r from-red-600 via-red-700 to-red-900 hover:from-red-500 hover:to-red-800 text-white font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-[0_0_25px_rgba(220,38,38,0.7)] transition-all cursor-pointer disabled:opacity-50"
              >
                <LinkIcon className="w-4 h-4" />
                <span>{isSaving ? 'Generating Link...' : 'Generate Voice Link'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
