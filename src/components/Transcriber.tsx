import React, { useState } from 'react';
import { FileText, Mic, Upload, Sparkles, Copy, Check, Loader2, AlertCircle } from 'lucide-react';

export const Transcriber: React.FC = () => {
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setErrorMsg('');
    setTranscript(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setAudioBase64(reader.result as string);
    };
  };

  const handleTranscribe = async () => {
    if (!audioBase64) return;
    setIsTranscribing(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/ai/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioData: audioBase64 }),
      });
      const data = await res.json();
      if (data.error) {
        setErrorMsg(data.error);
      } else if (data.transcript) {
        setTranscript(data.transcript);
      } else {
        setErrorMsg('Transcription returned empty result.');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to transcribe audio.');
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleCopy = () => {
    if (!transcript) return;
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-red-950/80 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-800/50 text-red-400 text-xs font-mono uppercase mb-2">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Gemini 3.5 Transcribe Model</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
          AI Audio Transcription
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Upload any audio recording or voice prank to instantly transcribe spoken words with Gemini AI.
        </p>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-3 p-4 bg-red-950/40 border border-red-800/60 text-red-300 rounded-2xl text-sm">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="bg-zinc-950/80 border border-red-950/80 rounded-3xl p-8 space-y-6">
        <div className="max-w-md mx-auto border-2 border-dashed border-red-900/50 hover:border-red-600 rounded-3xl p-8 text-center space-y-4 bg-black/40 transition-colors relative cursor-pointer">
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-800/60 flex items-center justify-center text-red-500 mx-auto">
            <Mic className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">{fileName ? fileName : 'Upload audio for transcription'}</p>
            <p className="text-xs text-zinc-500 mt-1">MP3, WAV, M4A, OGG supported</p>
          </div>
        </div>

        {audioBase64 && (
          <div className="max-w-md mx-auto">
            <button
              onClick={handleTranscribe}
              disabled={isTranscribing}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-bold rounded-xl text-sm shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all cursor-pointer disabled:opacity-50"
            >
              {isTranscribing ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
              <span>{isTranscribing ? 'Transcribing with Gemini 3.5...' : 'Transcribe Audio Now'}</span>
            </button>
          </div>
        )}

        {transcript && (
          <div className="pt-6 border-t border-red-950/80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-mono text-zinc-300 uppercase">Transcription Result</h3>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-red-900/50 text-red-400 rounded-lg text-xs font-medium transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Text'}</span>
              </button>
            </div>
            <div className="bg-black border border-red-950 rounded-2xl p-6 text-zinc-200 font-mono text-sm leading-relaxed whitespace-pre-wrap">
              {transcript}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
