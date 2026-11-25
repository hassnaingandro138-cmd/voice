/**
 * Web Audio API helper for applying dark villain audio effects (Pitch shifting simulation, Low-pass filter bass boost, Reverb/Delay echo)
 */

export class VillainAudioProcessor {
  private audioContext: AudioContext | null = null;
  private sourceNode: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private delayNode: DelayNode | null = null;
  private isPlaying: boolean = false;

  constructor() {
    // Lazy init audio context on user interaction
  }

  private initContext() {
    if (!this.audioContext) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioCtx();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  public async playAudioData(
    base64OrUrl: string,
    settings: { pitch: number; speed: number; bassBoost: number; echo: number; loop: boolean } = {
      pitch: 0.5,
      speed: 0.85,
      bassBoost: 1.0,
      echo: 0.7,
      loop: true,
    },
    onEnded?: () => void
  ): Promise<void> {
    this.stop();
    this.initContext();
    if (!this.audioContext) return;

    try {
      let arrayBuffer: ArrayBuffer;
      if (base64OrUrl.startsWith('data:')) {
        const response = await fetch(base64OrUrl);
        arrayBuffer = await response.arrayBuffer();
      } else if (base64OrUrl.startsWith('http') || base64OrUrl.startsWith('/')) {
        const response = await fetch(base64OrUrl);
        arrayBuffer = await response.arrayBuffer();
      } else {
        // Assume raw base64 or blob URL
        const res = await fetch(base64OrUrl);
        arrayBuffer = await res.arrayBuffer();
      }

      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

      this.sourceNode = this.audioContext.createBufferSource();
      this.sourceNode.buffer = audioBuffer;
      this.sourceNode.loop = settings.loop;

      // Playback speed (pitch adjustment in Web Audio changes speed unless using pitch shifters, so we adjust playbackRate)
      this.sourceNode.playbackRate.value = Math.max(0.4, Math.min(1.5, settings.speed));

      // Low-pass filter for heavy bass boost & deep dark voice
      this.filterNode = this.audioContext.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.value = 800 * settings.bassBoost; // Cuts high frequencies, leaves deep bass

      // Delay / Echo for cinematic cave reverb
      this.delayNode = this.audioContext.createDelay();
      this.delayNode.delayTime.value = 0.3 * settings.echo;

      // Gain node for volume
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.value = 1.2;

      // Connect graph: source -> filter -> delay -> gain -> destination
      this.sourceNode.connect(this.filterNode);
      this.filterNode.connect(this.delayNode);
      this.delayNode.connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);

      // Also connect direct filter to gain for mix
      this.filterNode.connect(this.gainNode);

      this.sourceNode.onended = () => {
        this.isPlaying = false;
        if (onEnded) onEnded();
      };

      this.sourceNode.start(0);
      this.isPlaying = true;
    } catch (e) {
      console.error('Error playing processed audio:', e);
      // Fallback to standard HTML5 Audio if decode fails
      const audio = new Audio(base64OrUrl);
      audio.loop = settings.loop;
      audio.playbackRate = settings.speed;
      audio.onended = () => {
        this.isPlaying = false;
        if (onEnded) onEnded();
      };
      await audio.play();
      this.isPlaying = true;
    }
  }

  public stop() {
    if (this.sourceNode) {
      try {
        this.sourceNode.stop();
        this.sourceNode.disconnect();
      } catch (e) {}
      this.sourceNode = null;
    }
    this.isPlaying = false;
  }

  public getIsPlaying() {
    return this.isPlaying;
  }
}

export const villainAudioProcessor = new VillainAudioProcessor();
