import React, { useState, useRef } from 'react';
import { Mic, Square, Play, Save, RefreshCw, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';
import { villainAudioProcessor } from './AudioEffects';

interface AudioRecorderProps {
  onSaveVoice: (voiceData: any) => void;
  onViewSaved: () => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ onSaveVoice, onViewSaved }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('My Secret Voice Prank');
  const [targetName, setTargetName] = useState('Friend');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (e) {
      console.error('Microphone access denied or error:', e);
      alert('Microphone permission is required to record audio pranks.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const handlePlayPreview = async () => {
    if (!audioUrl) return;
    if (isPlaying) {
      villainAudioProcessor.stop();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    await villainAudioProcessor.playAudioData(audioUrl, {
      pitch: 0.4,
      speed: 0.85,
      bassBoost: 1.5,
      echo: 0.8,
      loop: true,
    }, () => setIsPlaying(false));
  };

  const handleSave = async () => {
    if (!audioUrl) return;
    setIsSaving(true);
    try {
      // Convert blob to base64 for persistent storage
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob!);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        const voiceData = {
          title,
          targetName,
          script: '[Recorded Voice Prank]',
          audioData: base64data,
          voiceSettings: { pitch: 0.4, speed: 0.85, reverb: 0.9, bassBoost: 1.2, echo: 0.8, loop: true },
        };
        await onSaveVoice(voiceData);
        setSuccessMessage('Recorded voice prank successfully saved!');
        setIsSaving(false);
        setTimeout(() => setSuccessMessage(''), 4000);
      };
    } catch (e) {
      console.error('Failed to save recorded voice', e);
      setIsSaving(false);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-red-950/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-800/50 text-red-400 text-xs font-mono uppercase mb-2">
            <Mic className="w-3.5 h-3.5 animate-pulse" />
            <span>Microphone Audio Recorder</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
            Record Your Villain Voice
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Speak into your mic and apply deep monster reverb effects for maximum horror pranks.
          </p>
        </div>
        <button
          onClick={onViewSaved}
          className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-red-900/50 text-white rounded-xl text-xs font-medium transition-all cursor-pointer"
        >
          <Volume2 className="w-4 h-4 text-red-500" />
          <span>View Saved Pranks</span>
        </button>
      </div>

      {successMessage && (
        <div className="flex items-center gap-3 p-4 bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 rounded-2xl text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="bg-zinc-950/80 border border-red-950/80 rounded-3xl p-8 space-y-8 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase mb-2">Prank Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-black border border-red-950 focus:border-red-600 rounded-xl px-4 py-3 text-white text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase mb-2">Target Name</label>
              <input
                type="text"
                value={targetName}
                onChange={(e) => setTargetName(e.target.value)}
                className="w-full bg-black border border-red-950 focus:border-red-600 rounded-xl px-4 py-3 text-white text-sm outline-none"
              />
            </div>
          </div>
        </div>

        {/* Recorder Visualizer Circle */}
        <div className="py-8 flex flex-col items-center justify-center space-y-6">
          <div className={`w-32 h-32 rounded-full border-2 flex items-center justify-center transition-all ${
            isRecording 
              ? 'border-red-600 bg-red-950/40 shadow-[0_0_50px_rgba(220,38,38,0.8)] animate-pulse' 
              : 'border-red-900/60 bg-black/60 shadow-[0_0_20px_rgba(220,38,38,0.2)]'
          }`}>
            <Mic className={`w-12 h-12 ${isRecording ? 'text-red-500 animate-bounce' : 'text-zinc-600'}`} />
          </div>

          <div className="font-mono text-xl tracking-widest text-red-500 font-bold">
            {formatTime(recordingTime)}
          </div>

          <div className="flex items-center justify-center gap-4">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-bold text-sm rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.6)] transition-all cursor-pointer"
              >
                <Mic className="w-5 h-5" />
                <span>Start Recording</span>
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="flex items-center gap-2 px-8 py-3.5 bg-zinc-900 hover:bg-zinc-800 border border-red-600 text-red-500 font-bold text-sm rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all cursor-pointer"
              >
                <Square className="w-5 h-5 fill-current" />
                <span>Stop Recording</span>
              </button>
            )}
          </div>
        </div>

        {/* Playback & Save recorded audio */}
        {audioUrl && (
          <div className="pt-6 border-t border-red-950/80 space-y-4 max-w-md mx-auto">
            <h4 className="text-sm font-mono text-zinc-300 uppercase">Recorded Audio Preview</h4>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePlayPreview}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-950 hover:bg-red-900 border border-red-700 text-white font-bold rounded-xl text-sm transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 text-red-500" />
                <span>{isPlaying ? 'Pause Audio' : 'Play Villain Preview'}</span>
              </button>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-bold rounded-xl text-sm shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save Prank'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
