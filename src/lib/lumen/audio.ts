import type { SceneId } from "./scenes";

function noiseBuffer(ctx: AudioContext, kind: "white" | "brown", seconds = 4) {
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);
    let last = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      if (kind === "white") {
        data[i] = white;
      } else {
        last = (last + 0.02 * white) / 1.02;
        data[i] = last * 3.5;
      }
    }
  }
  return buffer;
}

class Soundscape {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private nodes: AudioNode[] = [];
  private sources: AudioBufferSourceNode[] = [];
  private oscillators: OscillatorNode[] = [];
  private chirpTimer: ReturnType<typeof setTimeout> | null = null;
  private scene: SceneId = "rain";
  private volume = 0.42;
  private playing = false;

  private ensure() {
    if (this.ctx) return;
    const ctx = new AudioContext();
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    this.ctx = ctx;
    this.master = master;
  }

  async resume() {
    this.ensure();
    if (this.ctx?.state === "suspended") await this.ctx.resume();
  }

  setVolume(v: number) {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.playing) this.fadeTo(this.volume, 0.25);
  }

  async play(scene: SceneId) {
    await this.resume();
    if (this.playing && this.scene === scene) {
      this.fadeTo(this.volume, 0.5);
      return;
    }
    this.rebuild(scene);
    this.playing = true;
    this.fadeTo(this.volume, 0.8);
  }

  duck() {
    if (!this.playing) return;
    this.fadeTo(this.volume * 0.18, 0.6);
  }

  stop() {
    if (!this.playing) return;
    this.fadeTo(0, 0.5);
    window.setTimeout(() => {
      if (this.playing) return;
      this.teardownGraph();
    }, 520);
    this.playing = false;
  }

  chime() {
    this.ensure();
    void this.resume();
    const ctx = this.ctx;
    if (!ctx) return;
    const now = ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99];
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.07 / (i + 1), now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.11);
      osc.stop(now + 2.5);
    });
  }

  private fadeTo(value: number, seconds: number) {
    if (!this.ctx || !this.master) return;
    const g = this.master.gain;
    const now = this.ctx.currentTime;
    g.cancelScheduledValues(now);
    g.setValueAtTime(Math.max(0.0001, g.value), now);
    g.linearRampToValueAtTime(Math.max(0.0001, value), now + seconds);
  }

  private rebuild(scene: SceneId) {
    this.teardownGraph();
    this.ensure();
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return;
    this.scene = scene;

    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer(ctx, scene === "rain" ? "white" : "brown");
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    if (scene === "rain") {
      filter.type = "bandpass";
      filter.frequency.value = 1800;
      filter.Q.value = 0.7;
      gain.gain.value = 0.55;
    } else if (scene === "forest") {
      filter.type = "lowpass";
      filter.frequency.value = 420;
      filter.Q.value = 0.5;
      gain.gain.value = 0.7;
      this.startChirps();
    } else if (scene === "cafe") {
      filter.type = "bandpass";
      filter.frequency.value = 380;
      filter.Q.value = 0.55;
      gain.gain.value = 0.45;
      this.startClinks();
    } else {
      filter.type = "lowpass";
      filter.frequency.value = 280;
      filter.Q.value = 0.4;
      gain.gain.value = 0.8;
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.type = "sine";
      lfo.frequency.value = 0.07;
      lfoGain.gain.value = 160;
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();
      this.oscillators.push(lfo);
    }

    source.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    source.start();
    this.sources.push(source);
    this.nodes.push(filter, gain);
  }

  private startChirps() {
    const sing = () => {
      const ctx = this.ctx;
      const master = this.master;
      if (!ctx || !master || !this.playing || this.scene !== "forest") return;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      const freq = 1600 + Math.random() * 2400;
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.22, ctx.currentTime + 0.14);
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.028, ctx.currentTime + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
      osc.connect(g);
      g.connect(master);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
      this.chirpTimer = setTimeout(sing, 3500 + Math.random() * 7000);
    };
    this.chirpTimer = setTimeout(sing, 1800);
  }

  private startClinks() {
    const clink = () => {
      const ctx = this.ctx;
      const master = this.master;
      if (!ctx || !master || !this.playing || this.scene !== "cafe") return;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = 1200 + Math.random() * 900;
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.02, ctx.currentTime + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
      osc.connect(g);
      g.connect(master);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
      this.chirpTimer = setTimeout(clink, 5000 + Math.random() * 9000);
    };
    this.chirpTimer = setTimeout(clink, 2400);
  }

  private teardownGraph() {
    if (this.chirpTimer) {
      clearTimeout(this.chirpTimer);
      this.chirpTimer = null;
    }
    for (const src of this.sources) {
      try {
        src.stop();
        src.disconnect();
      } catch {
        /* already stopped */
      }
    }
    for (const osc of this.oscillators) {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        /* already stopped */
      }
    }
    for (const node of this.nodes) {
      try {
        node.disconnect();
      } catch {
        /* already disconnected */
      }
    }
    this.sources = [];
    this.oscillators = [];
    this.nodes = [];
  }
}

export const soundscape = new Soundscape();
