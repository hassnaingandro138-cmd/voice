import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardHome } from './components/DashboardHome';
import { AIGenerator } from './components/AIGenerator';
import { AudioRecorder } from './components/AudioRecorder';
import { AudioUploader } from './components/AudioUploader';
import { Transcriber } from './components/Transcriber';
import { SavedVoices } from './components/SavedVoices';
import { SettingsView } from './components/SettingsView';
import { HistoryView } from './components/HistoryView';
import { PrankLanding } from './components/PrankLanding';
import { villainAudioProcessor } from './components/AudioEffects';

export default function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [voices, setVoices] = useState<any[]>([]);
  const [prankId, setPrankId] = useState<string | null>(null);

  useEffect(() => {
    // Check if URL is a prank share link /prank/:id
    const path = window.location.pathname;
    if (path.startsWith('/prank/')) {
      const id = path.split('/prank/')[1];
      if (id) {
        setPrankId(id);
      }
    }

    // Fetch saved voices from backend server
    fetchVoices();
  }, []);

  const fetchVoices = async () => {
    try {
      const res = await fetch('/api/voices');
      const data = await res.json();
      if (Array.isArray(data)) {
        setVoices(data);
      }
    } catch (e) {
      console.error('Failed to fetch voices:', e);
    }
  };

  const handleSaveVoice = async (voiceData: any) => {
    try {
      const res = await fetch('/api/voices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(voiceData),
      });
      const saved = await res.json();
      setVoices((prev) => [saved, ...prev]);
    } catch (e) {
      console.error('Failed to save voice:', e);
    }
  };

  const handleDeleteVoice = async (id: string) => {
    try {
      await fetch(`/api/voices/${id}`, { method: 'DELETE' });
      setVoices((prev) => prev.filter((v) => v.id !== id));
    } catch (e) {
      console.error('Failed to delete voice:', e);
    }
  };

  // If opening a shared prank link
  if (prankId) {
    return <PrankLanding prankId={prankId} />;
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white font-sans">
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        savedCount={voices.length}
      />

      <main className="pb-16">
        {currentTab === 'home' && (
          <DashboardHome
            setCurrentTab={setCurrentTab}
            voices={voices}
            onSelectVoice={(voice) => {
              if (voice.audioData) {
                villainAudioProcessor.playAudioData(voice.audioData, voice.voiceSettings);
              }
            }}
          />
        )}
        {currentTab === 'ai-gen' && (
          <AIGenerator
            onSaveVoice={handleSaveVoice}
            onViewSaved={() => setCurrentTab('saved')}
          />
        )}
        {currentTab === 'record' && (
          <AudioRecorder
            onSaveVoice={handleSaveVoice}
            onViewSaved={() => setCurrentTab('saved')}
          />
        )}
        {currentTab === 'upload' && (
          <AudioUploader
            onSaveVoice={handleSaveVoice}
            onViewSaved={() => setCurrentTab('saved')}
          />
        )}
        {currentTab === 'transcribe' && <Transcriber />}
        {currentTab === 'saved' && (
          <SavedVoices
            voices={voices}
            onDeleteVoice={handleDeleteVoice}
            onSelectVoice={(voice) => {
              if (voice.audioData) {
                villainAudioProcessor.playAudioData(voice.audioData, voice.voiceSettings);
              }
            }}
          />
        )}
        {currentTab === 'history' && <HistoryView voices={voices} />}
        {currentTab === 'settings' && <SettingsView />}
      </main>
    </div>
  );
}
