import React from 'react';
import { Skull, Mic, Wand2, Upload, FileText, Share2, History, Settings, Volume2 } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, savedCount }) => {
  const navItems = [
    { id: 'home', label: 'Dashboard', icon: Skull },
    { id: 'ai-gen', label: 'AI Voice Gen', icon: Wand2 },
    { id: 'record', label: 'Record', icon: Mic },
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'transcribe', label: 'AI Transcribe', icon: FileText },
    { id: 'saved', label: 'My Voices', icon: Share2, badge: savedCount },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-red-950/60 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <div 
          onClick={() => setCurrentTab('home')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-950 to-black border border-red-800/80 flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.4)] group-hover:shadow-[0_0_25px_rgba(220,38,38,0.7)] transition-all">
            <Skull className="w-6 h-6 text-red-500 animate-pulse" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-wider text-white uppercase font-mono bg-gradient-to-r from-red-500 via-rose-400 to-red-600 bg-clip-text text-transparent">
              DARK VILAIN
            </span>
            <span className="block text-[10px] tracking-widest text-red-400/70 font-mono uppercase">
              Voice Prank Generator
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden xl:flex items-center gap-1 bg-red-950/20 border border-red-900/30 p-1 rounded-xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-red-950 to-red-900 text-white border border-red-700/50 shadow-[0_0_10px_rgba(220,38,38,0.3)]'
                    : 'text-red-300/70 hover:text-white hover:bg-red-950/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-red-400' : 'text-red-400/60'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 bg-red-600 text-white text-[10px] font-bold rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Mobile menu dropdown or quick actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentTab('ai-gen')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 text-white font-medium text-xs rounded-xl shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all cursor-pointer whitespace-nowrap"
          >
            <Volume2 className="w-4 h-4" />
            <span className="hidden sm:inline">Create Prank</span>
          </button>
        </div>
      </div>

      {/* Mobile Nav Bar Scroll */}
      <div className="flex xl:hidden items-center gap-1.5 overflow-x-auto pt-3 pb-1 no-scrollbar border-t border-red-950/40 mt-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-red-900 text-white border border-red-700'
                  : 'text-red-300/70 bg-red-950/20 hover:bg-red-950/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-red-400" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
