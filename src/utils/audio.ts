// Web Audio API を用いた完全プロシージャルな16ビト風レトロ電子音シンセサイザー

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // タイピング音（高音メカニカルキーボード風カチャ・微ノイズ）
  public playType() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // 1. 高速な高周波サインスイープ（スイッチプラスチック接触音）
    const osc = this.ctx.createOscillator();
    const gainDir = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(3200, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.015);

    gainDir.gain.setValueAtTime(0.012, now); // 高品質かつ「控えめ、耳障りでない」音量
    gainDir.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

    osc.connect(gainDir);
    gainDir.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.02);

    // 2. 超短時間ノイズ（青軸・茶軸の「シャッ」とした摩擦タッチ）
    try {
      const bufferSize = this.ctx.sampleRate * 0.008; // 8ミリ秒の極小バッファ
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(4500, now);

      const gainNoise = this.ctx.createGain();
      gainNoise.gain.setValueAtTime(0.008, now);
      gainNoise.gain.exponentialRampToValueAtTime(0.001, now + 0.008);

      noise.connect(filter);
      filter.connect(gainNoise);
      gainNoise.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + 0.008);
    } catch (e) {
      // フォールバック
    }
  }

  // 入力ミス音（低音のブーッ）
  public playError() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(130, this.ctx.currentTime);
    osc.frequency.setValueAtTime(110, this.ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  // 単語完成・攻撃時（アセンディングスイープ ＆ 力強い打撃サフサイズ「Thud」低音の二重結合）
  public playComplete() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // 16bit風のピコピコ上昇スイープ
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.005, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.18);

    // 重みのある満足感：重厚な「ズシン (Thud)」という木・肉体的な低音
    const thudOsc = this.ctx.createOscillator();
    const thudGain = this.ctx.createGain();
    const thudFilter = this.ctx.createBiquadFilter();

    thudOsc.type = 'sine';
    thudOsc.frequency.setValueAtTime(140, now);
    thudOsc.frequency.exponentialRampToValueAtTime(38, now + 0.16);

    thudFilter.type = 'lowpass';
    thudFilter.frequency.setValueAtTime(180, now);

    thudGain.gain.setValueAtTime(0.38, now); // 強いずっしり感
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    thudOsc.connect(thudFilter);
    thudFilter.connect(thudGain);
    thudGain.connect(this.ctx.destination);

    thudOsc.start(now);
    thudOsc.stop(now + 0.2);
  }

  // ゾンビ攻撃のヒット（ノイズに近い爆発音）
  public playHit() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const duration = 0.25;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // ホワイトノイズ生成
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    // ローパスフィルターで重みを
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(20, this.ctx.currentTime + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
    noise.stop(this.ctx.currentTime + duration);
  }

  // プレイヤーが傷ついた音（下りスイープ＋少しノイズ）
  public playDamage() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(80, this.ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.32);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.32);
  }

  // READY GO笛（ピピーッ）
  public playReady() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime); // A5

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.005, this.ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.5);
  }

  // ゲームクリア大勝利ファンファーレ
  public playWin() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // Cメジャーコード
    notes.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + index * 0.1);

      gain.gain.setValueAtTime(0.05, now + index * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.1 + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + index * 0.1);
      osc.stop(now + index * 0.1 + 0.5);
    });
  }

  // ゲームオーバー不協和音
  public playGameOver() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [146.83, 138.59, 130.81, 116.54, 110.00]; // 陰鬱な下行音
    notes.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + index * 0.15);

      gain.gain.setValueAtTime(0.12, now + index * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.15 + 0.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + index * 0.15);
      osc.stop(now + index * 0.15 + 0.8);
    });
  }

  // ボス遭遇時の警報アラーム音（ピポー、ピポー）
  public playBoss() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    for (let i = 0; i < 3; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now + i * 0.4);
      osc.frequency.linearRampToValueAtTime(640, now + i * 0.4 + 0.15);
      osc.frequency.linearRampToValueAtTime(320, now + i * 0.4 + 0.3);

      gain.gain.setValueAtTime(0.08, now + i * 0.4);
      gain.gain.linearRampToValueAtTime(0.12, now + i * 0.4 + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.4 + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + i * 0.4);
      osc.stop(now + i * 0.4 + 0.35);
    }
  }
}

export const audio = new SoundManager();
