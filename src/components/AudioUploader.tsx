import React, { useState } from 'react';
import { Upload, Play, Save, Volume2, FileAudio, CheckCircle2, AlertCircle } from 'lucide-react';
import { villainAudioProcessor } from './AudioEffects';

interface AudioUploaderProps {
  onSaveVoice: (voiceData: any) => void;
  onViewSaved: () => void;
}

export const AudioUploader: React.FC<AudioUploaderProps> = ({ onSaveVoice, onViewSaved }) => {
  const [title, setTitle] = useState('Uploaded Prank Audio');
  const [targetName, setTargetName] = useState('Victim');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('audio') && !file.name.match(/\.(mp3|wav|m4a|ogg|aac)$/i)) {
      setErrorMsg('Please upload a valid audio file (MP3, WAV, M4A).');
      return;
    }

    setErrorMsg('');
    setTitle(file.name.replace(/\.[^/.]+$/, ''));

    const url = URL.createObjectURL(file);
    setAudioUrl(url);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setAudioBase64(reader.result as string);
    };
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
      pitch: 0.5,
      speed: 0.9,
      bassBoost: 1.3,
      echo: 0.8,
      loop: true,
    }, () => setIsPlaying(false));
  };

  const handleSave = async () => {
    if (!audioBase64) return;
    setIsSaving(true);
    try {
      const voiceData = {
        title,
        targetName,
        script: '[Uploaded Audio File]',
        audioData: audioBase64,
        voiceSettings: { pitch: 0.5, speed: 0.9, reverb: 0.9, bassBoost: 1.3, echo: 0.8, loop: true },
      };
      await onSaveVoice(voiceData);
      setSuccessMessage('Uploaded audio prank successfully saved!');
      setIsSaving(false);
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (e) {
      console.error('Failed to save uploaded voice', e);
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-red-950/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-800/50 text-red-400 text-xs font-mono uppercase mb-2">
            <Upload className="w-3.5 h-3.5 animate-pulse" />
            <span>Audio File Uploader</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
            Upload MP3 / WAV Prank Audio
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Upload your custom audio tracks and generate instant shareable horror prank links.
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

      {errorMsg && (
        <div className="flex items-center gap-3 p-4 bg-red-950/40 border border-red-800/60 text-red-300 rounded-2xl text-sm">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="bg-zinc-950/80 border border-red-950/80 rounded-3xl p-8 space-y-8">
        <div className="max-w-md mx-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        {/* File Dropzone */}
        <div className="max-w-md mx-auto border-2 border-dashed border-red-900/50 hover:border-red-600 rounded-3xl p-8 text-center space-y-4 bg-black/40 transition-colors relative cursor-pointer group">
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-800/60 flex items-center justify-center text-red-500 mx-auto group-hover:scale-110 transition-transform">
            <FileAudio className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Click to upload or drag & drop</p>
            <p className="text-xs text-zinc-500 mt-1">MP3, WAV, M4A up to 50MB</p>
          </div>
          {audioUrl && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950 text-red-300 text-xs font-mono rounded-full border border-red-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Audio file loaded successfully</span>
            </div>
          )}
        </div>

        {/* Preview & Save */}
        {audioUrl && (
          <div className="pt-6 border-t border-red-950/80 space-y-4 max-w-md mx-auto">
            <div className="flex items-center gap-3">
              <button
                onClick={handlePlayPreview}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-950 hover:bg-red-900 border border-red-700 text-white font-bold rounded-xl text-sm transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 text-red-500" />
                <span>{isPlaying ? 'Pause Audio' : 'Preview Audio'}</span>
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
