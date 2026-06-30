import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Skull, 
  RotateCcw, 
  Trophy, 
  ShieldAlert, 
  Heart, 
  Flame, 
  TrendingUp, 
  Compass, 
  Zap,
  Play,
  HelpCircle,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { 
  GameStage, 
  RyuAction, 
  ZombieAction, 
  ZombieWord, 
  BloodParticle, 
  FloatingText, 
  TypingEffect,
  ZOMBIE_WORDS 
} from './types';
import { motion, AnimatePresence } from 'framer-motion';
import { audio } from './utils/audio';
import RyuSprite from './components/RyuSprite';
import ZombieSprite from './components/ZombieSprite';

// --- ストーリー＆探索エリア管理 ---
export interface AreaInfo {
  name: string;
  subTitle: string;
  description: string;
  bgHex: string;
  signText: string;
  graffiti: string;
  themeColor: string;
  borderColor: string;
  taskText: string;
}

export const getAreaInfo = (currentWave: number): AreaInfo => {
  if (currentWave <= 4) {
    return {
      name: "海岸のテントサイト",
      subTitle: "BEACH CAMPSITE",
      description: "ソロキャンプ中に嵐で遭難し、目覚めた島。放置されたキャンプテントの影から、無数のゾンビが這い出てきた！",
      bgHex: "from-[#08111e] via-[#0c1626] to-[#08111e]",
      signText: "BEACH SHORELINE - AREA 1",
      graffiti: "S.O.S... ANYBODY ALIVE?",
      themeColor: "text-blue-400",
      borderColor: "border-blue-900/50",
      taskText: "【作戦目標】襲撃を耐え、森へのルートを確保せよ（無線部品: 0/3）"
    };
  } else if (currentWave === 5) {
    return {
      name: "海岸のテントサイト - 支配種強襲",
      subTitle: "BEACH BOSS ENCOUNTER",
      description: "森への通路を塞ぐ巨大な水死ゾンビが出現！奴を倒して、最初の無線パーツ【アンテナ】を奪取せよ！",
      bgHex: "from-[#1b080b] via-[#240b0f] to-[#1b080b]",
      signText: "CRITICAL BOSS DETECTED",
      graffiti: "NO RETREAT HERE",
      themeColor: "text-red-500 animate-pulse",
      borderColor: "border-red-950",
      taskText: "【緊急目標】ボスをタイピング撃破し、パーツを回収せよ（無線部品: 0/3）"
    };
  } else if (currentWave <= 9) {
    return {
      name: "不気味な暗い森",
      subTitle: "SPOOKY DARK FOREST",
      description: "アンテナを回収し、鬱蒼とした暗い森の中へ。生い茂る木々と深い霧の中、おびただしいゾンビが手元を阻む！",
      bgHex: "from-[#05110a] via-[#081910] to-[#05110a]",
      signText: "SPOOKY WOODS - AREA 2",
      graffiti: "RUN HIGHER!",
      themeColor: "text-emerald-400",
      borderColor: "border-emerald-950/65",
      taskText: "【作戦目標】森林エリアを突破し、山頂の通信塔を目指せ（無線部品: 1/3）"
    };
  } else if (currentWave === 10) {
    return {
      name: "不気味な暗い森 - 支配種強襲",
      subTitle: "FOREST BOSS ENCOUNTER",
      description: "森の主である、苔まみれの獰猛なタイタンゾンビが出現！奴をなぎ倒し、重要パーツ【高容量バッテリー】を回収せよ！",
      bgHex: "from-[#1a0621] via-[#23092d] to-[#1a0621]",
      signText: "FOREST TITAN DETECTED",
      graffiti: "MOSS FEASTS ON YOU",
      themeColor: "text-purple-400 animate-pulse",
      borderColor: "border-purple-900",
      taskText: "【緊急目標】巨漢ゾンビを倒し、電力を確保せよ（無線部品: 1/3）"
    };
  } else if (currentWave <= 14) {
    return {
      name: "山頂の通信塔",
      subTitle: "MOUNTAIN SUMMIT BEACON",
      description: "すべての部品を揃え、ついに通信塔山頂へ到達！暴風雨の中、起動ボタンを押してSOS救難信号を最大出力で送信せよ！",
      bgHex: "from-[#1c1103] via-[#241604] to-[#1c1103]",
      signText: "SUMMIT BEACON - AREA 3",
      graffiti: "SUMMIT RADAR ACTIVATED",
      themeColor: "text-amber-500",
      borderColor: "border-amber-900/50",
      taskText: "【作戦目標】無線の接続を補修し、救助信号を外部へ送れ（無線部品: 2/3）"
    };
  } else {
    return {
      name: "山頂の通信塔 - 最終防衛圏",
      subTitle: "FINAL SHOWDOWN: PLAGUE DEMON",
      description: "救難信号の電波を浴び、覚醒した絶海の超巨大怪異『疫病デモン』が襲来！救助ヘリ到着まで、通信塔を命がけで防衛せよ！",
      bgHex: "from-[#250205] via-[#350508] to-[#250205]",
      signText: "⚠️ SYSTEM COMPROMISE DIRECT THREAT",
      graffiti: "YOU SHALL NOT ESCAPE",
      themeColor: "text-rose-600 animate-pulse font-bold",
      borderColor: "border-rose-600",
      taskText: "【最終目標】最凶のボスを駆逐し、脱出用ヘリの着陸を援護せよ！（無線部品: 2/3）"
    };
  }
};

// --- 生存者ランキング（LEADERBOARD）インターフェースと初期値 ---
export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  wave: number;
  kps: number;
  totalKeys: number;
  misses: number;
  title: string;
  date: string;
  difficulty: 'EASY' | 'NORMAL' | 'HARD';
}

const defaultRankings: LeaderboardEntry[] = [
  { id: '1', name: 'CHRIS', score: 28500, wave: 15, kps: 6.2, totalKeys: 1420, misses: 22, title: '神速の救世主', date: '2026-06-25', difficulty: 'HARD' },
  { id: '2', name: 'JILL', score: 18200, wave: 12, kps: 4.8, totalKeys: 980, misses: 15, title: '雷電のタイピスト', date: '2026-06-26', difficulty: 'HARD' },
  { id: '3', name: 'LEON', score: 12400, wave: 9, kps: 3.8, totalKeys: 620, misses: 34, title: 'トリガーハッピー', date: '2026-06-27', difficulty: 'NORMAL' },
  { id: '4', name: 'CLAIRE', score: 8900, wave: 6, kps: 2.7, totalKeys: 410, misses: 12, title: '冷静なる迎撃手', date: '2026-06-28', difficulty: 'NORMAL' },
  { id: '5', name: 'BARRY', score: 4500, wave: 4, kps: 1.8, totalKeys: 220, misses: 18, title: '意地と執念の生存者', date: '2026-06-28', difficulty: 'EASY' }
];

// 称号判定用の計算ヘルパー
const getTypingTitle = (kps: number, accuracy: number, totalKeys: number, misses: number): string => {
  if (totalKeys < 10) return "新米の敗走者";
  if (misses === 0 && totalKeys >= 40) return "完全無欠の狙撃手";
  if (kps >= 5.0 && accuracy >= 95) return "神速の救世主";
  if (kps >= 3.8 && accuracy >= 90) return "雷電のタイピスト";
  if (kps >= 2.8 && accuracy >= 85) return "疾風の暗殺者";
  if (kps >= 1.8 && accuracy >= 75) return "冷静なる迎撃手";
  if (misses > 30) return "トリガーハッピー";
  if (kps >= 1.0 && accuracy >= 60) return "意地と執念 of 孤島";
  return "震える指の敗走者";
};

export default function App() {
  // --- ゲームステート系 ---
  const [stage, setStage] = useState<GameStage>('TITLE');
  const [muted, setMuted] = useState<boolean>(false);
  const [crtFilter, setCrtFilter] = useState<boolean>(true);

  // --- ランキング & パーソナルレコード ---
  const [rankings, setRankings] = useState<LeaderboardEntry[]>(() => {
    try {
      const saved = localStorage.getItem('ryu_zombie_rankings');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load rankings:', e);
    }
    return defaultRankings;
  });
  const [playerNameInput, setPlayerNameInput] = useState<string>("RYU");
  const [hasRegisteredCurrentRun, setHasRegisteredCurrentRun] = useState<boolean>(false);
  
  // --- 戦闘ステータス ---
  const [playerHp, setPlayerHp] = useState<number>(100);
  const [playerMaxHp] = useState<number>(100);
  const [zombieHp, setZombieHp] = useState<number>(60);
  const [zombieMaxHp, setZombieMaxHp] = useState<number>(60);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('ryu_zombie_high_score');
      return saved ? parseInt(saved, 10) : 0;
    } catch (e) {
      return 0;
    }
  });

  // ハイスコアの自動更新・保存
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      try {
        localStorage.setItem('ryu_zombie_high_score', score.toString());
      } catch (e) {
        console.error('Failed to save high score:', e);
      }
    }
  }, [score, highScore]);

  const [kills, setKills] = useState<number>(0);
  const [wave, setWave] = useState<number>(1);
  const [daysSurvived, setDaysSurvived] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<'EASY' | 'NORMAL' | 'HARD'>('NORMAL');
  const [titlePracticeTypedIndex, setTitlePracticeTypedIndex] = useState<number>(0);
  
  // 今探索中の孤島のエリアとストーリー情報
  const areaInfo = getAreaInfo(wave);
  
  // --- Combo Meter and Fever Mode State ---
  const [comboProgress, setComboProgress] = useState<number>(0); // 0 up to MAX_COMBO_METER (5)
  const [isFeverActive, setIsFeverActive] = useState<boolean>(false);
  const [feverTimeRemaining, setFeverTimeRemaining] = useState<number>(0);
  const MAX_COMBO_METER = 5;
  const FEVER_DURATION = 8.0;

  // --- アニメーション状態 ---
  const [ryuAction, setRyuAction] = useState<RyuAction>('idle');
  const [zombieAction, setZombieAction] = useState<ZombieAction>('idle');
  const [zombieType, setZombieType] = useState<'groomer' | 'screamer' | 'brute' | 'boss'>('groomer');
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [isMissShake, setIsMissShake] = useState<boolean>(false);
  const [isRyuFlashing, setIsRyuFlashing] = useState<boolean>(false);
  const [isZombieFlashing, setIsZombieFlashing] = useState<boolean>(false);
  const [isWaveTransition, setIsWaveTransition] = useState<boolean>(false);
  const [readyCountdown, setReadyCountdown] = useState<string>('READY');

  // --- タイピング状態 ---
  const [currentWord, setCurrentWord] = useState<ZombieWord>({ text: "DEAD", meaning: "死者", difficulty: "easy" });
  const [typedIndex, setTypedIndex] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(4.5); // ゾンビの攻撃ゲージ制限時間（秒）
  const [maxTime, setMaxTime] = useState<number>(4.5);
  
  // --- 分析統計値 ---
  const [totalKeyStrokes, setTotalKeyStrokes] = useState<number>(0);
  const [correctKeyStrokes, setCorrectKeyStrokes] = useState<number>(0);
  const [wordsCompleted, setWordsCompleted] = useState<number>(0);
  const [gameStartTime, setGameStartTime] = useState<number>(0);
  const [playDurationMs, setPlayDurationMs] = useState<number>(0);
  const [totalReactionTimeMs, setTotalReactionTimeMs] = useState<number>(0);
  const lastKeyPressTimeRef = useRef<number>(0);

  // --- パーティクル & テキスト用リスト ---
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [typingEffects, setTypingEffects] = useState<TypingEffect[]>([]);
  
  // --- 参照(Refs) ---
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<BloodParticle[]>([]);
  const nextParticleId = useRef<number>(0);
  const activeInputRef = useRef<HTMLInputElement | null>(null);
  const timingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioInitialized = useRef<boolean>(false);

  // 音声の初期化（ブラウザ制限回避用）
  const initAudio = () => {
    if (!audioInitialized.current) {
      audio.setMute(muted);
      audioInitialized.current = true;
    }
  };

  // ミュート切り替え
  const toggleMute = () => {
    const newState = !muted;
    setMuted(newState);
    audio.setMute(newState);
  };

  // スクリーンシェイク実行
  const triggerScreenShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 300);
  };

  // --- パーティクルエフェクト駆動 (Canvas) ---
  const spawnBloodSplatter = useCallback((x: number, y: number, colorStyle: 'red' | 'green' | 'yellow') => {
    const particles: BloodParticle[] = [];
    const count = 25 + Math.floor(Math.random() * 15);
    const colors = {
      red: ['#ef4444', '#b91c1c', '#7f1d1d', '#991b1b', '#3b0712'],
      green: ['#84cc16', '#4d7c0f', '#3f6212', '#15803d', '#1e293b'],
      yellow: ['#eab308', '#ca8a04', '#eab308', '#ffffff', '#fbbf24']
    };
    const palette = colors[colorStyle];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 9;
      particles.push({
        id: nextParticleId.current++,
        x: x,
        y: y,
        vx: Math.cos(angle) * speed + (colorStyle === 'red' ? -3 : 3), // ヒット方向に合わせて少しバイアス
        vy: Math.sin(angle) * speed - 2, // 上向きに飛びやすく
        size: 3 + Math.floor(Math.random() * 5),
        color: palette[Math.floor(Math.random() * palette.length)],
        alpha: 1
      });
    }

    particlesRef.current = [...particlesRef.current, ...particles];
  }, []);

  // キャンバスレンダリングループ
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    
    // 親要素のサイズに合わせる
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || 800;
      canvas.height = canvas.parentElement?.clientHeight || 400;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const updateAndRender = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // パーティクル更新
      const activeParticles = particlesRef.current.map(p => {
        return {
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + 0.35, // 重力
          alpha: p.alpha - 0.025 // 徐々に消える
        };
      }).filter(p => p.alpha > 0 && p.y < canvas.height);

      particlesRef.current = activeParticles;

      // パーティクル描画 (16bitブロック風に四角で描く)
      activeParticles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });
      
      ctx.globalAlpha = 1.0;
      animationId = requestAnimationFrame(updateAndRender);
    };

    updateAndRender();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // フローティングテキストの追加
  const addFloatingText = useCallback((text: string, x: number, y: number, type: 'damage' | 'combo' | 'heal' | 'scary' | 'fever') => {
    const colors = {
      damage: '#ef4444', // 赤
      combo: '#eab308',  // 金色
      heal: '#22c55e',   // 緑
      scary: '#a21caf',  // 紫
      fever: '#f43f5e'   // フィーバーカラー（鮮烈なローズ）
    };
    const id = Date.now() + Math.random();
    setFloatingTexts(prev => [
      ...prev, 
      { id, text, x, y, color: colors[type], type }
    ]);
    
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== id));
    }, 1000);
  }, []);

  // --- 単語決定ロジック ---
  const selectNextWord = useCallback((currentWave: number) => {
    let difficultyFilter: ('easy' | 'medium' | 'hard' | 'nightmare')[] = [];
    
    if (currentWave % 5 === 0) {
      difficultyFilter = ['nightmare'];
    } else if (currentWave <= 2) {
      difficultyFilter = ['easy'];
    } else if (currentWave <= 5) {
      difficultyFilter = ['easy', 'medium'];
    } else if (currentWave <= 8) {
      difficultyFilter = ['medium', 'hard'];
    } else if (currentWave <= 12) {
      difficultyFilter = ['hard'];
    } else {
      difficultyFilter = ['hard', 'nightmare'];
    }

    const pool = ZOMBIE_WORDS.filter(w => difficultyFilter.includes(w.difficulty));
    const randomWord = pool[Math.floor(Math.random() * pool.length)];
    setCurrentWord(randomWord);
    setTypedIndex(0);

    // ウェーブが進行するほどゾンビの攻撃速度が上昇
    let baseTime = 5.0;
    if (currentWave % 5 === 0) {
      // 12文字以上の難関な英単語をタイピングするための適正な時間設定
      baseTime = Math.max(4.0, 7.5 - ((currentWave / 5) * 0.5));
    } else if (currentWave <= 3) {
      baseTime = 4.8 - (currentWave * 0.4);
    } else if (currentWave <= 7) {
      baseTime = 3.8 - ((currentWave - 3) * 0.3);
    } else {
      baseTime = 2.4 - ((currentWave - 7) * 0.1);
    }

    // 難易度(difficulty)による調整
    let actualTime = baseTime;
    let minTime = 1.8;
    if (difficulty === 'EASY') {
      actualTime = baseTime * 1.35;
      minTime = 2.4;
    } else if (difficulty === 'HARD') {
      actualTime = baseTime * 0.75;
      minTime = 1.2;
    }

    const finalTime = Math.max(minTime, actualTime);
    setTimeRemaining(finalTime);
    setMaxTime(finalTime);
    lastKeyPressTimeRef.current = Date.now();
  }, [difficulty]);

  // --- ゲーム初期化とスタート ---
  const startGame = () => {
    initAudio();
    audio.playReady();
    setStage('READY_GO');
    setPlayerHp(100);
    
    // 難易度によるゾンビ初期体力調整
    let initZombieHp = 60;
    if (difficulty === 'EASY') {
      initZombieHp = 40;
    } else if (difficulty === 'HARD') {
      initZombieHp = 90;
    }
    
    setZombieHp(initZombieHp);
    setZombieMaxHp(initZombieHp);
    setWave(1);
    setDaysSurvived(0);
    setScore(0);
    setKills(0);
    setCombo(0);
    setMaxCombo(0);
    setComboProgress(0);
    setIsFeverActive(false);
    setFeverTimeRemaining(0);
    setTotalKeyStrokes(0);
    setCorrectKeyStrokes(0);
    setWordsCompleted(0);
    setGameStartTime(Date.now());
    setPlayDurationMs(0);
    setTotalReactionTimeMs(0);
    setHasRegisteredCurrentRun(false);
    lastKeyPressTimeRef.current = Date.now();
    setZombieType('groomer');
    setRyuAction('idle');
    setZombieAction('idle');
    setIsWaveTransition(false);

    // 'READY? GO!'の演出カウントダウン
    setReadyCountdown('READY?');
    setTimeout(() => {
      setReadyCountdown('GO!');
      setTimeout(() => {
        setStage('PLAYING');
        selectNextWord(1);
        // 入力フォームにオートフォーカス
        if (activeInputRef.current) {
          activeInputRef.current.focus({ preventScroll: true });
        }
      }, 900);
    }, 1200);
  };

  // リスタート
  const handleRestart = () => {
    startGame();
  };

  // 生存者レジストリ（ランキング）への記録
  const registerSurvivorRecord = () => {
    if (hasRegisteredCurrentRun) return;
    
    // クリア時は5000EXPのクリアボーナス
    const finalScore = stage === 'VICTORY' ? (score + 5000) : score;
    const durationSeconds = playDurationMs / 1000;
    const kps = durationSeconds > 0 ? (totalKeyStrokes / durationSeconds) : 0;
    const misses = totalKeyStrokes - correctKeyStrokes;
    const accuracy = getAccuracy();
    const title = getTypingTitle(kps, accuracy, totalKeyStrokes, misses);
    
    const newEntry: LeaderboardEntry = {
      id: Date.now().toString(),
      name: playerNameInput.trim().toUpperCase() || 'RYU',
      score: finalScore,
      wave: wave,
      kps: Number(kps.toFixed(2)),
      totalKeys: totalKeyStrokes,
      misses: misses,
      title: title,
      date: new Date().toISOString().split('T')[0],
      difficulty: difficulty
    };

    const updated = [...rankings, newEntry]
      .sort((a, b) => b.score - a.score);
      
    setRankings(updated);
    setHasRegisteredCurrentRun(true);
    audio.playComplete(); // レトロな登録完了ファンファーレ風
    
    try {
      localStorage.setItem('ryu_zombie_rankings', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save rankings:', e);
    }
  };

  // --- ゾンビの攻撃（タイムアウトによる被弾） ---
  const triggerZombieAttack = useCallback(() => {
    if (stage !== 'PLAYING') return;

    // ゾンビ攻撃モーション
    setZombieAction('attack');
    audio.playHit();
    triggerScreenShake();
    setIsRyuFlashing(true);
    setRyuAction('hurt');

    // ダメージ計算（Wave進行で上昇）
    const damage = Math.min(30, 8 + wave * 2);
    setPlayerHp(prev => {
      const nextHp = Math.max(0, prev - damage);
      if (nextHp <= 0) {
        // プレイヤー死亡
        setTimeout(() => {
          setRyuAction('dead');
          setStage('GAMEOVER');
          setPlayDurationMs(Date.now() - gameStartTime);
          audio.playGameOver();
        }, 400);
      } else {
        // 通常被ダメージ復帰
        setTimeout(() => {
          setRyuAction('idle');
        }, 500);
      }
      return nextHp;
    });

    // 暗い赤色での血しぶき（プレイヤーが殴られたエフェクト）
    // プレイヤー座標近辺を想定
    setTimeout(() => {
      spawnBloodSplatter(200, 200, 'red');
      addFloatingText(`-${damage} HP`, 150, 150, 'damage');
    }, 150);

    // コンボリセット
    setCombo(0);
    if (!isFeverActive) {
      setComboProgress(0);
    }

    // ダメージフラッシュ復帰
    setTimeout(() => {
      setIsRyuFlashing(false);
      setZombieAction('idle');
    }, 400);

    // 新しい単語をリセットして再スタート
    selectNextWord(wave);
  }, [stage, wave, spawnBloodSplatter, addFloatingText, selectNextWord]);

  // --- 共通タイピングキー処理 ---
  const processKeyPressed = (pressedKey: string) => {
    initAudio();

    if (stage === 'TITLE') {
      if (pressedKey === 'ENT') {
        startGame();
        return;
      }

      const targetWord = "START";
      const neededChar = targetWord[titlePracticeTypedIndex];

      if (pressedKey.toUpperCase() === neededChar) {
        audio.playType();
        const nextIndex = titlePracticeTypedIndex + 1;
        setTitlePracticeTypedIndex(nextIndex);

        // タイピングエフェクト
        const id = Date.now() + Math.random();
        setTypingEffects(prev => [
          ...prev,
          {
            id,
            char: pressedKey.toUpperCase(),
            x: (titlePracticeTypedIndex - targetWord.length / 2) * 20 + (Math.random() * 10 - 5),
            y: Math.random() * -10,
            isMiss: false
          }
        ]);
        setTimeout(() => {
          setTypingEffects(prev => prev.filter(eff => eff.id !== id));
        }, 700);

        if (nextIndex === targetWord.length) {
          setTitlePracticeTypedIndex(0);
          startGame();
        }
      } else {
        audio.playError();
        setTitlePracticeTypedIndex(0); // ミスしたらリセット
        setIsMissShake(true);
        setTimeout(() => setIsMissShake(false), 200);

        const id = Date.now() + Math.random();
        setTypingEffects(prev => [
          ...prev,
          {
            id,
            char: "✖",
            x: (titlePracticeTypedIndex - 2) * 20 + (Math.random() * 10 - 5),
            y: 0,
            isMiss: true
          }
        ]);
        setTimeout(() => {
          setTypingEffects(prev => prev.filter(eff => eff.id !== id));
        }, 700);
      }
      return;
    }

    if (stage !== 'PLAYING' || isWaveTransition) return;

    setTotalKeyStrokes(prev => prev + 1);

    const neededKey = currentWord.text[typedIndex];

    if (pressedKey === neededKey) {
      // ーー【正入力処理】ーー
      setCorrectKeyStrokes(prev => prev + 1);
      const now = Date.now();
      const reactionDiff = now - lastKeyPressTimeRef.current;
      setTotalReactionTimeMs(prev => prev + reactionDiff);
      lastKeyPressTimeRef.current = now;
      audio.playType();
      
      const newTypedIndex = typedIndex + 1;
      setTypedIndex(newTypedIndex);

      // 一文字ずつの「消し込み」に伴う金色のフローティングキーエフェクト
      const id = Date.now() + Math.random();
      const xOffset = (typedIndex - currentWord.text.length / 2) * 18; // 文字数に応じたX座標オフセット
      setTypingEffects(prev => [
        ...prev,
        {
          id,
          char: pressedKey,
          x: xOffset + (Math.random() * 12 - 6),
          y: Math.random() * -10,
          isMiss: false
        }
      ]);
      setTimeout(() => {
        setTypingEffects(prev => prev.filter(eff => eff.id !== id));
      }, 700);

      // 木製ボード中央の文字位置(350+xOffset, 220)でスパーク火花を発生させて爽快さを最大化
      spawnBloodSplatter(350 + xOffset, 190, 'yellow');

      // 単語の途中でのささやかなコンボ閃光風
      if (newTypedIndex > 1) {
        // 小さな粒子
        spawnBloodSplatter(550, 180, 'yellow');
      }

      // 単語完了判定
      if (newTypedIndex === currentWord.text.length) {
        handleWordComplete();
      }
    } else {
      // ーー【誤入力処理】ーー
      lastKeyPressTimeRef.current = Date.now();
      audio.playError();
      setCombo(0); // コンボリセット
      if (!isFeverActive) {
        setComboProgress(0);
      }
      setIsMissShake(true);
      setTimeout(() => setIsMissShake(false), 200);
      
      // 誤入力時に「✖」を赤い血飛沫とともにポップさせる
      const id = Date.now() + Math.random();
      const xOffset = (typedIndex - currentWord.text.length / 2) * 18;
      setTypingEffects(prev => [
        ...prev,
        {
          id,
          char: "✖",
          x: xOffset + (Math.random() * 16 - 8),
          y: 0,
          isMiss: true
        }
      ]);
      setTimeout(() => {
        setTypingEffects(prev => prev.filter(eff => eff.id !== id));
      }, 700);

      // 誤入力位置から真っ赤な血しぶき（ミス火花）を放出
      spawnBloodSplatter(350 + xOffset, 190, 'red');
      
      // ゾンビが驚いたかのように少し笑う
      addFloatingText("MISS!", 130 + Math.random() * 40, 160, 'scary');
      
      // 強烈なミスでゾンビの残り時間をさらにマイナスするペナルティ（0.1秒に緩和して快適なやり直しを提供）
      setTimeRemaining(prev => Math.max(0.5, prev - 0.1));
    }
  };

  // --- タイピング入力処理 ---
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // タイトルの時にエンターキーでスタート
    if (stage === 'TITLE') {
      if (e.key === 'Enter') {
        startGame();
      }
      return;
    }

    if (stage !== 'PLAYING' || isWaveTransition) return;

    const pressedKey = e.key.toUpperCase();
    
    // アルファベット以外、またはメタキーは無視
    if (pressedKey.length !== 1 || e.ctrlKey || e.altKey || e.metaKey) {
      return;
    }

    processKeyPressed(pressedKey);
  };

  // 単語を完全に撃ち終えた時の格闘アクション
  const handleWordComplete = () => {
    setWordsCompleted(prev => prev + 1);
    audio.playComplete();

    // 3回に1回飛び蹴り、それ以外は強力なパンチ
    const isKick = Math.random() > 0.6;
    setRyuAction(isKick ? 'kick' : 'punch');
    
    // comboカウントアップ
    const nextCombo = combo + 1;
    setCombo(nextCombo);
    if (nextCombo > maxCombo) {
      setMaxCombo(nextCombo);
    }

    // ゾンビへのダメージ
    setIsZombieFlashing(true);
    setZombieAction('hurt');

    // --- コボメーター・フィーバーロジック ---
    const newlyActivatedFever = !isFeverActive && (comboProgress + 1 >= MAX_COMBO_METER);
    const activeMultiplier = (isFeverActive || newlyActivatedFever) ? 1.5 : 1.0;

    if (isFeverActive) {
      // フィーバー中は、成功するたびに少しだけ残り時間を回復するプロボーナス (MAX制限 is FEVER_DURATION)
      setFeverTimeRemaining(prev => Math.min(FEVER_DURATION, prev + 1.2));
    } else {
      const nextProgress = comboProgress + 1;
      if (nextProgress >= MAX_COMBO_METER) {
        setComboProgress(MAX_COMBO_METER);
        setIsFeverActive(true);
        setFeverTimeRemaining(FEVER_DURATION);
        
        // フィーバー発生時エフェクト
        setTimeout(() => {
          audio.playReady(); // 爽快なゲームボイス風
        }, 120);
        
        spawnBloodSplatter(200, 150, 'yellow');
        spawnBloodSplatter(580, 150, 'yellow');
        
        addFloatingText("⚡ COMBO FEVER! ⚡", 360, 100, 'fever');
        addFloatingText("ATK 1.5x CRITICAL!", 360, 135, 'fever');
      } else {
        setComboProgress(nextProgress);
      }
    }

    // ダメージ計算（コンボによってボーナス発生、かつフィーバー時は1.5倍）
    const comboBonus = Math.floor(nextCombo / 3);
    const baseDamage = 10 + currentWord.text.length + comboBonus;
    const damageDealt = Math.floor(baseDamage * activeMultiplier);
    
    const nextZombieHp = Math.max(0, zombieHp - damageDealt);
    setZombieHp(nextZombieHp);

    // スコア加算（フィーバー時はスコア加算も 1.5倍）
    const points = (currentWord.text.length * 10) * (1 + nextCombo * 0.1) * activeMultiplier;
    setScore(prev => prev + Math.floor(points));

    setTimeout(() => {
      // ゾンビの座標付近に緑/琥珀色の血しぶき（ゾンビ肉）
      spawnBloodSplatter(580, 180, 'green');
      
      const showedCrit = isFeverActive || newlyActivatedFever;
      addFloatingText(`-${damageDealt} HP${showedCrit ? ' (CRIT 1.5x!)' : ''}`, 580, 140, showedCrit ? 'fever' : 'damage');
      
      if (nextCombo >= 3) {
        addFloatingText(`${nextCombo} COMBO!`, 180, 80, 'combo');
      }
    }, 150);

    // ゾンビのHPが0になったらゾンビ死亡
    if (nextZombieHp <= 0) {
      handleZombieDefeated();
    } else {
      // 生きていればしばらく動作したのちに復帰
      setTimeout(() => {
        setRyuAction('idle');
        setZombieAction('idle');
        setIsZombieFlashing(false);
      }, 400);

      // 次のワードをセット
      selectNextWord(wave);
    }
  };

  const handleZombieDefeated = () => {
    setZombieAction('dead');
    setRyuAction('victory');
    setIsWaveTransition(true);
    audio.playWin();

    const isBossDefeated = (wave % 5 === 0);
    
    // 勝利フローティングテキスト演出
    addFloatingText("★ WAVE COMPLETE ★", 360, 80, 'combo');
    if (isBossDefeated) {
      setTimeout(() => {
        addFloatingText("🔥 BOSS ELIMINATED! 🔥", 360, 120, 'scary');
        addFloatingText("S-CLASS THREAT SANCTION LIFTED", 360, 160, 'heal');
      }, 350);
    } else {
      setTimeout(() => {
        addFloatingText("VICTORY POSING!", 360, 120, 'heal');
      }, 350);
    }

    setKills(prev => prev + 1);
    
    // 生存日数カウントアップ
    setDaysSurvived(prev => prev + 1);
    setTimeout(() => {
      addFloatingText("SURVIVED +1 DAY! ⛺", 360, 200, 'heal');
    }, 650);
    
    // スコアボーナス
    const defeatBonus = wave * 250 + (isBossDefeated ? 1000 : 0);
    setScore(prev => prev + defeatBonus);
    
    // フローティング撃退ボーナス
    setTimeout(() => {
      addFloatingText(`K.O. +${defeatBonus} PTS`, 550, 120, 'combo');
    }, 450);

    // ウェーブクリア判定、またはエンドレス進行
    if (wave === 15) {
      // 最終15ウェーブのボス撃破＝絶海の無人島完全攻略！
      addFloatingText("★ SOS SENT SUCCESSFULLY! ★", 360, 60, 'combo');
      setTimeout(() => {
        addFloatingText("🚁 RESCUE HELICOPTER INBOUND! 🚁", 360, 100, 'heal');
        addFloatingText("CONGRATULATIONS!", 360, 140, 'fever');
      }, 550);

      // 少し余裕を持たせてVICTORY画面に遷移
      setTimeout(() => {
        setStage('VICTORY');
        setPlayDurationMs(Date.now() - gameStartTime);
      }, 3500);
      return;
    }

    const nextWave = wave + 1;
    setWave(nextWave);

    // プレイヤーのHPを少し回復 (ゾンビを倒した報酬)
    const healAmount = isBossDefeated 
      ? Math.floor(40 + Math.random() * 20) 
      : Math.floor(15 + Math.random() * 15);
    setPlayerHp(prev => Math.min(playerMaxHp, prev + healAmount));
    setTimeout(() => {
      addFloatingText(`+${healAmount} HP`, 150, 120, 'heal');
    }, 350);

    // ゾンビをリスポーン（ウェーブ数に応じてHPを変更）
    setTimeout(() => {
      // 次のゾンビの種類を決定
      let nextType: 'groomer' | 'screamer' | 'brute' | 'boss' = 'groomer';
      let nextZombieMaxHp = 60;
      
      if (nextWave % 5 === 0) {
        nextType = 'boss';
        nextZombieMaxHp = 220 + (nextWave * 20); // ボスは圧倒的な体力を持つ
        audio.playBoss();
        setTimeout(() => {
          addFloatingText("🚨 BOSS ENCOUNTER! 🚨", 360, 140, 'scary');
        }, 300);
      } else if (nextWave % 3 === 0) {
        nextType = 'brute';
        nextZombieMaxHp = 130 + (nextWave * 12);
      } else if (nextWave % 1 === 0 && nextWave % 2 === 0) {
        nextType = 'screamer';
        nextZombieMaxHp = 80 + (nextWave * 8);
      } else {
        nextType = 'groomer';
        nextZombieMaxHp = 50 + (nextWave * 6);
      }

      // 難易度によるゾンビ体力調整
      if (difficulty === 'EASY') {
        nextZombieMaxHp = Math.round(nextZombieMaxHp * 0.7);
      } else if (difficulty === 'HARD') {
        nextZombieMaxHp = Math.round(nextZombieMaxHp * 1.4);
      }

      setZombieType(nextType);
      setZombieHp(nextZombieMaxHp);
      setZombieMaxHp(nextZombieMaxHp);
      
      // 通常構えへ移行
      setZombieAction('idle');
      setRyuAction('idle');
      setIsZombieFlashing(false);
      setIsWaveTransition(false); // ウェーブ遷移終了。タイマー・タイピングが再始動
      
      addFloatingText(`WAVE ${nextWave}`, 360, 100, 'combo');
      selectNextWord(nextWave);
    }, 1800);
  };

  // --- ゲーム時間コントロール（ゾンビの攻撃間隔更新） ---
  useEffect(() => {
    if (stage !== 'PLAYING' || isWaveTransition) {
      if (timingIntervalRef.current) {
        clearInterval(timingIntervalRef.current);
        timingIntervalRef.current = null;
      }
      return;
    }

    const interval = 80; // 0.08秒ごとにタイマーを更新
    timingIntervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        const nextTime = prev - 0.08;
        if (nextTime <= 0) {
          triggerZombieAttack();
          return 0;
        }
        return nextTime;
      });

      setFeverTimeRemaining(prev => {
        if (prev <= 0) return 0;
        const nextTime = prev - 0.08;
        if (nextTime <= 0) {
          setIsFeverActive(false);
          setComboProgress(0);
          return 0;
        }
        return nextTime;
      });
    }, interval);

    return () => {
      if (timingIntervalRef.current) {
        clearInterval(timingIntervalRef.current);
        timingIntervalRef.current = null;
      }
    };
  }, [stage, isWaveTransition, triggerZombieAttack]);

  // フォーカス維持：プレイ中は常に隠し入力ボックスにフォーカスを当ててタイピング検出
  useEffect(() => {
    if (stage === 'PLAYING' && activeInputRef.current) {
      activeInputRef.current.focus({ preventScroll: true });
    }
  }, [stage, typedIndex, isWaveTransition]);

  // グローバル物理キーイベント監視（タイトル練習・本編プレイ共通 ＆ IMEの影響を完全にバイパス！）
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // コマンドショートカット等（Ctrl, Alt, Meta）はブラウザの標準機能を邪魔しないように除外
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      if (stage === 'TITLE') {
        if (e.key === 'Enter') {
          startGame();
          return;
        }

        // 物理キー判定 (IMEがONでも正確に反応させるために e.code を優先)
        if (e.code && e.code.startsWith('Key')) {
          const pressedChar = e.code.substring(3).toUpperCase();
          if (pressedChar.length === 1 && pressedChar >= 'A' && pressedChar <= 'Z') {
            processKeyPressed(pressedChar);
            e.preventDefault();
          }
        } else {
          // e.codeが取れない、またはその他のキーのためのフォールバック
          const pressedKey = e.key.toUpperCase();
          if (pressedKey.length === 1 && pressedKey >= 'A' && pressedKey <= 'Z') {
            processKeyPressed(pressedKey);
          }
        }
        return;
      }

      if (stage === 'PLAYING') {
        if (isWaveTransition) return;

        // 物理キー判定 (IMEがONであっても、e.codeは常にキーボードの物理位置を報告します)
        if (e.code && e.code.startsWith('Key')) {
          const pressedChar = e.code.substring(3).toUpperCase(); // 'KeyA' -> 'A'
          if (pressedChar.length === 1 && pressedChar >= 'A' && pressedChar <= 'Z') {
            processKeyPressed(pressedChar);
            // IME変換中の不要な入力をブラウザに送らないよう、イベントのデフォルト挙動をキャンセル
            e.preventDefault();
            e.stopPropagation();
          }
        } else {
          // e.codeが取れない環境、またはモバイル環境等のフォールバック
          const pressedKey = e.key.toUpperCase();
          if (pressedKey.length === 1 && pressedKey >= 'A' && pressedKey <= 'Z') {
            processKeyPressed(pressedKey);
          }
        }
      }
    };

    // キャプチャフェーズ(true)でリッスンすることで、inputやIME変換にキーイベントを奪われる前に最速で処理します
    window.addEventListener('keydown', handleGlobalKeyDown, { capture: true });
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown, { capture: true });
    };
  }, [stage, isWaveTransition, typedIndex, currentWord, titlePracticeTypedIndex]);

  // キー割込み検出、常に入力ボックスにフォーカスを与える
  const handleContainerClick = () => {
    if (stage === 'PLAYING' && activeInputRef.current) {
      activeInputRef.current.focus({ preventScroll: true });
    }
  };

  // 命中率(Accuracy)計算
  const getAccuracy = () => {
    if (totalKeyStrokes === 0) return 0;
    return Math.round((correctKeyStrokes / totalKeyStrokes) * 100);
  };

  // Words Per Minute (WPM) 計算
  const getWPM = () => {
    if (playDurationMs <= 0) return 0;
    const minutes = playDurationMs / 60000;
    return Math.round((correctKeyStrokes / 5) / minutes);
  };

  // 平均反応時間 (Avg Reaction Time in ms) 計算
  const getAvgReactionTime = () => {
    if (correctKeyStrokes === 0) return 0;
    return Math.round(totalReactionTimeMs / correctKeyStrokes);
  };

  // ボスが生存して脅威状態にあるかどうか
  const isBossActive = zombieType === 'boss' && zombieAction !== 'dead' && stage === 'PLAYING';

  return (
    <div 
      className="h-screen w-screen max-h-screen overflow-hidden bg-[#0a0a0a] font-gothic text-white flex flex-col items-center justify-center p-2 selection:bg-red-900 relative select-none"
      onClick={handleContainerClick}
    >
      {/* 隠しインプット：常にフォーカスを当ててタイピング検出 */}
      {stage === 'PLAYING' && (
        <input
          ref={activeInputRef}
          type="text"
          className="absolute opacity-0 pointer-events-none w-0 h-0"
          value=""
          onChange={(e) => {
            let val = e.target.value;
            // 全角英数字を半角英数字に変換 (IME全角対策)
            val = val.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => {
              return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
            });
            // アルファベットのみを安全に抽出
            const englishChars = val.toUpperCase().replace(/[^A-Z]/g, '');
            if (englishChars.length > 0) {
              const char = englishChars[englishChars.length - 1];
              processKeyPressed(char);
            }
            e.target.value = "";
          }}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck="false"
        />
      )}

      {/* 画面全体のCRT走査線エフェクト */}
      {crtFilter && <div className="absolute inset-0 pointer-events-none crt-lines z-50 opacity-15" />}
      {crtFilter && <div className="absolute inset-0 pointer-events-none crt-flicker z-50 opacity-5" />}

      {/* メインの筐体フレーム */}
      <div className={`w-full max-w-5xl h-full max-h-[820px] bg-black border-4 border-zinc-900 rounded-lg shadow-2xl flex flex-col overflow-hidden relative ${crtFilter ? 'crt-curve' : ''}`}>
        
        {/* レトロ筐体上部のLEDインジケータバー */}
        <div className="bg-zinc-950 border-b-2 border-zinc-900 px-4 py-1.5 flex justify-between items-center text-[9px] font-mono select-none text-zinc-500 z-20 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block shadow-[0_0_4px_rgba(16,185,129,0.5)]"></span>
            <span>SYSTEM: ONLINE [v1.4.2]</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setCrtFilter(!crtFilter);
                audio.playType();
              }}
              className={`px-2 py-0.5 border rounded flex items-center justify-center transition-colors cursor-pointer ${
                crtFilter 
                  ? 'border-cyan-600 bg-cyan-950/80 text-cyan-400 font-bold shadow-[0_0_8px_rgba(34,211,238,0.25)]' 
                  : 'border-neutral-800 bg-[#161616]/95 text-zinc-405 hover:text-white'
              }`}
              title="FILTER TOGGLE"
            >
              CRT: {crtFilter ? "ON" : "OFF"}
            </button>
          </div>
        </div>

        {/* モニター画面領域 */}
        <div className="flex-1 relative flex flex-col overflow-hidden bg-zinc-950">

          {/* ーーー【状態 1: タイトル画面】ーーー */}
          {stage === 'TITLE' && (
            <div className="flex-1 flex flex-col items-center justify-between py-4 px-4 relative overflow-y-auto bg-gradient-to-b from-[#060b11] via-[#0d1420] to-[#070b12] w-full h-full">
              
              {/* 背景 of island grid and custom glow */}
              <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#4f46e5_1.5px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
              <div className="absolute top-1/4 left-1/3 w-40 h-40 bg-zinc-900 rounded-full blur-3xl opacity-40 animate-pulse pointer-events-none" />
              <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-blue-950 rounded-full blur-3xl opacity-35 pointer-events-none" />
              <div className="absolute top-10 right-10 w-24 h-24 bg-red-950 rounded-full blur-2xl opacity-30 pointer-events-none" />

              {/* 上部サマリー */}
              <div className="text-center mt-1 z-10 shrink-0">
                <span className="font-press-start text-[8px] sm:text-[9px] text-cyan-400 tracking-widest block mb-1 animate-pulse">
                  ⚓ SOLO-CAMPING SURVIVAL THRILLER ⚓
                </span>
                <div className="h-[2px] w-36 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto" />
              </div>

              {/* タイトルロゴ */}
              <div className="text-center my-1 z-10 shrink-0">
                <h1 className="font-sans text-3xl sm:text-4xl font-black text-red-650 tracking-tighter text-outline-dark uppercase leading-tight drop-shadow-[0_4px_0_#450a0a]">
                  ESCAPE FROM<br />
                  <span className="font-press-start text-yellow-500 animate-pulse text-2xl sm:text-3.5xl block mt-1 drop-shadow-[0_4px_0_#854d0e] tracking-tight">
                    ZOMBIE ISLAND
                  </span>
                </h1>
                <p className="text-[8px] font-press-start text-zinc-405 mt-1.5 tracking-widest text-center px-2">
                  [OFFLINE-FIRST 16-BIT TYPING SURVIVOR]
                </p>

                {/* 🏆 HIGH SCORE DISPLAY 🏆 */}
                <div className="mt-3 mx-auto max-w-[240px] bg-yellow-950/30 border border-yellow-700/40 pixel-border py-1 px-3 rounded flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(234,179,8,0.15)] select-none">
                  <Trophy size={11} className="text-yellow-400 animate-pulse shrink-0" />
                  <span className="font-press-start text-[8px] sm:text-[9px] text-yellow-400/90 tracking-wider">
                    HIGH SCORE:
                  </span>
                  <span className="font-press-start text-[9px] sm:text-[10px] text-yellow-400 font-bold animate-pulse">
                    {highScore.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* 2段組 of grid layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-w-4xl w-full z-10 my-1 px-2 sm:px-4 shrink-0">
                {/* ストーリー設定 & あらすじ */}
                <div className="bg-black/85 border border-zinc-900/65 pixel-border p-3 rounded text-left text-xs text-zinc-300 tracking-wide backdrop-blur-md flex flex-col gap-1.5 shadow-xl">
                  <div className="flex items-center gap-1.5 text-red-500 font-bold text-xs border-b border-zinc-800 pb-1">
                    <Compass size={13} className="animate-spin" />
                    <span>【STORY: 遭難、そして圏外の悪夢】</span>
                  </div>
                  <p className="leading-relaxed text-zinc-350 text-[10px]">
                    ソロトレッキングを楽しみに島へ向かっていたが、不気味な嵐に巻き込まれ乗っていた船が難破。目を覚ますと、そこは電波が完全に圏外の不気味なゾンビ島だった。荒れ果てた海岸から響くのは、おびただしい死者のうめき声…。
                  </p>
                  <p className="leading-relaxed text-yellow-500 font-semibold text-[10px]">
                    手元にあるのは、文字入力の波動でゾンビを撃退できる「特殊タイピング端末」のみ！パーツを集め、山頂の通信塔からSOS要請を送信せよ！
                  </p>
                </div> 
                {/* プレイ方法 / 説明 */}
                <div className="bg-zinc-950/90 border border-zinc-900/65 pixel-border p-3.5 rounded text-left text-[10.5px] text-zinc-300 tracking-wide backdrop-blur-sm flex flex-col gap-1.5 shadow-xl">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold pb-1.5 border-b border-zinc-900">
                    <Flame size={12} className="text-cyan-400 animate-pulse" />
                    <span>端末の操作方法</span>
                  </div>
                  <p className="leading-relaxed">
                    1) 画面に表示される<span className="text-red-500 font-bold">ローマ字単語</span>を正確に入力してください。
                  </p>
                  <p className="leading-relaxed">
                    2) 単語を全入力するとRYUが攻撃！コンボが3以上たまると<span className="text-yellow-400 font-extrabold animate-pulse">フィーバー状態</span>へ！
                  </p>
                  <p className="text-zinc-400 leading-relaxed">
                    3) ゾンビの攻撃ゲージがゼロに達するとHPが減少します。
                  </p>
                  <p className="text-zinc-405 leading-relaxed">
                    4) 全15ウェーブ構成。ボスが落とす信号パーツを集めてSOSを完了せよ！
                  </p>
                </div>
              </div>

              {/* 🏆 生存者ランキング (SURVIVOR LEADERBOARD) 🏆 */}
              <div className="z-10 w-full max-w-4xl bg-black/85 border border-zinc-900/65 pixel-border p-3 sm:p-3.5 rounded backdrop-blur-md shadow-xl mt-1 select-none shrink-0">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5 mb-2">
                  <div className="flex items-center gap-1.5 text-yellow-500 font-bold text-xs">
                    <Trophy size={13} className="text-yellow-400 animate-pulse shrink-0" />
                    <span>生存者レジストリ (TOP SURVIVOR REGISTRY)</span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if(confirm("ランキング履歴をすべてリセットしますか？")) {
                        setRankings(defaultRankings);
                        try {
                          localStorage.setItem('ryu_zombie_rankings', JSON.stringify(defaultRankings));
                        } catch(err){}
                      }
                    }}
                    className="text-[8px] font-mono text-zinc-500 hover:text-red-400 transition-colors bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 cursor-pointer"
                  >
                    RESET
                  </button>
                </div>
                
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                  <table className="w-full text-left border-collapse font-mono text-[9.5px] sm:text-[10px] min-w-[500px]">
                    <thead>
                      <tr className="border-b border-zinc-800 text-zinc-500">
                        <th className="py-1 px-2 text-center w-8">順位</th>
                        <th className="py-1 px-2">名前</th>
                        <th className="py-1 px-2 text-right">スコア</th>
                        <th className="py-1 px-2 text-center">到達WAVE</th>
                        <th className="py-1 px-2 text-center">タイピング速度</th>
                        <th className="py-1 px-2 text-center">キー総数 / ミス</th>
                        <th className="py-1 px-2">称号 (TITLE)</th>
                        <th className="py-1 px-2 text-center">難易度</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rankings.slice(0, 5).map((entry, idx) => (
                        <tr 
                          key={entry.id} 
                          className={`border-b border-zinc-900/40 hover:bg-zinc-900/30 ${idx === 0 ? 'text-yellow-400 font-bold bg-yellow-950/10' : idx === 1 ? 'text-zinc-300' : 'text-zinc-400'}`}
                        >
                          <td className="py-1 px-2 text-center font-press-start text-[8px]">
                            {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `${idx + 1}`}
                          </td>
                          <td className="py-1 px-2 font-bold tracking-wider">{entry.name}</td>
                          <td className="py-1 px-2 text-right font-semibold text-yellow-500">{entry.score.toLocaleString()}</td>
                          <td className="py-1 px-2 text-center text-red-400 font-bold">W{entry.wave}</td>
                          <td className="py-1 px-2 text-center text-cyan-400 font-semibold">{entry.kps?.toFixed(1) || '0.0'} <span className="text-[8px] text-zinc-500">KPS</span></td>
                          <td className="py-1 px-2 text-center">
                            <span className="text-zinc-300 font-bold">{entry.totalKeys || 0}</span>
                            <span className="text-[8px] text-red-500/85 ml-1">({entry.misses || 0} Miss)</span>
                          </td>
                          <td className="py-1 px-2 text-[9.5px] font-semibold text-zinc-300 truncate max-w-[130px]" title={entry.title}>
                            <span className="bg-zinc-900 px-1 py-0.5 rounded border border-zinc-800 text-cyan-400">🏆 {entry.title}</span>
                          </td>
                          <td className="py-1 px-2 text-center">
                            <span className={`text-[8px] px-1 rounded font-bold ${entry.difficulty === 'EASY' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' : entry.difficulty === 'NORMAL' ? 'bg-yellow-950 text-yellow-500 border border-yellow-900' : 'bg-red-950 text-red-500 border border-red-900'}`}>
                              {entry.difficulty}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
 
              {/* 難易度選択 (Difficulty level selection) */}
              <div className="z-10 flex flex-col items-center mt-1 w-full max-w-sm bg-black/60 p-3 rounded-lg border border-zinc-900 shadow-lg shrink-0">
                <span className="font-press-start text-[8px] text-zinc-500 tracking-wider mb-2 uppercase leading-none">
                  SELECT DIFFICULTY:
                </span>
                <div className="grid grid-cols-3 gap-2 w-full text-[9px] font-press-start">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDifficulty('EASY');
                      audio.playType();
                    }}
                    className={`py-2 px-1 rounded border-2 transition-all cursor-pointer ${
                      difficulty === 'EASY'
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.3)] font-bold'
                        : 'bg-zinc-950/40 border-zinc-900 text-zinc-500 hover:border-zinc-800'
                    }`}
                  >
                    EASY
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDifficulty('NORMAL');
                      audio.playType();
                    }}
                    className={`py-2 px-1 rounded border-2 transition-all cursor-pointer ${
                      difficulty === 'NORMAL'
                        ? 'bg-yellow-950/80 border-yellow-600 text-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.3)] font-bold'
                        : 'bg-zinc-950/40 border-zinc-900 text-zinc-500 hover:border-zinc-800'
                    }`}
                  >
                    NORMAL
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDifficulty('HARD');
                      audio.playType();
                    }}
                    className={`py-2 px-1 rounded border-2 transition-all cursor-pointer ${
                      difficulty === 'HARD'
                        ? 'bg-red-950/80 border-red-700 text-red-500 shadow-[0_0_8px_rgba(239,68,68,0.3)] font-bold'
                        : 'bg-zinc-950/40 border-zinc-900 text-zinc-500 hover:border-zinc-800'
                    }`}
                  >
                    HARD
                  </button>
                </div>
                <div className="text-[9px] text-zinc-400 mt-2 font-mono text-center leading-normal">
                  {difficulty === 'EASY' && "🟢 Slow timer (1.35x limit) & -30% Zombie HP"}
                  {difficulty === 'NORMAL' && "🟡 Standard speed timer & default Zombie HP"}
                  {difficulty === 'HARD' && "🔴 Fast timer (0.75x limit) & +40% Zombie HP"}
                </div>
              </div>
 
              {/* スタートフラッシングボタン */}
              <div className="mt-2 z-10 shrink-0 flex flex-col items-center">
                <button
                  onClick={startGame}
                  className="font-press-start text-xs bg-red-900 border-4 border-white text-white px-8 py-3.5 rounded shadow-lg hover:bg-red-800 active:scale-95 transition-all animate-bounce cursor-pointer flex items-center gap-3 pixel-border"
                >
                  <Play size={14} fill="white" />
                  START MISSION [ CLICK OR ENTER ]
                </button>
              </div>
            </div>
          )}

          {/* ーーー【状態 2: READY? GO! 】ーーー */}
          {stage === 'READY_GO' && (
            <div className="flex-1 flex flex-col items-center justify-center bg-black select-none relative min-h-[480px]">
              <div className="text-center z-10">
                <span className="font-press-start text-[10px] text-zinc-500 tracking-widest block mb-4 uppercase">GET READY...</span>
                <h1 className="font-press-start text-5xl md:text-7xl text-red-600 tracking-wider text-outline-dark uppercase animate-ping leading-none">
                  {readyCountdown}
                </h1>
                <p className="mt-5 font-press-start text-xs text-yellow-400 animate-pulse">
                  PREPARE YOUR MIND & FINGERS
                </p>
              </div>
            </div>
          )}

          {/* ーーー【状態 3: メイン戦闘画面 (BENTO GRID DESIGN)】ーーー */}
          {stage === 'PLAYING' && (
            <div className="flex-1 h-full min-h-0 flex flex-col gap-2 md:gap-3 justify-between select-none p-1 sm:p-2">
              
              {/* ーーー【探索中エリア状況・目標ボード】ーーー */}
              <div id="island-quest-banner" className={`bg-[#0c121e]/90 border ${areaInfo.borderColor} pixel-border p-3 rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-2.5 z-10 shadow-[0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-sm shrink-0`}>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-black/90 rounded border border-zinc-900 flex items-center justify-center animate-pulse">
                    <Compass size={16} className="text-cyan-400 rotate-[15deg]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] sm:text-xs font-black font-press-start ${areaInfo.themeColor}`}>
                        {areaInfo.name}
                      </span>
                      <span className="text-[7px] font-mono font-black bg-zinc-900 border border-zinc-800 text-zinc-400 px-1 py-0.5 rounded tracking-wide leading-none">
                        {areaInfo.subTitle}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-300 mt-0.5 leading-snug">
                      {areaInfo.description}
                    </p>
                  </div>
                </div>

                {/* Dynamic Boss HP Indicator if Boss is Active */}
                {isBossActive && (
                  <div className="w-full md:w-72 flex flex-col gap-1.5 px-3 py-1.5 bg-black/75 rounded border border-red-900/60 font-mono z-10 shrink-0 shadow-[0_0_12px_rgba(220,38,38,0.15)] animate-pulse">
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] font-press-start uppercase tracking-wider text-red-500 font-extrabold animate-pulse">
                        🚨 BOSS CRITICAL
                      </span>
                      <span className="font-mono text-[9px] font-bold text-red-400">
                        {zombieHp}/{zombieMaxHp} ({Math.round((zombieHp / zombieMaxHp) * 100)}%)
                      </span>
                    </div>
                    <div className="h-2.5 bg-zinc-950 rounded-sm border border-zinc-900 overflow-hidden relative p-[1px] flex items-center">
                      <div 
                        className="h-full rounded-xs transition-all duration-300 bg-gradient-to-r from-red-600 via-red-500 to-red-700"
                        style={{ width: `${(zombieHp / zombieMaxHp) * 100}%` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                    </div>
                  </div>
                )}
                
                {/* 作戦目標・進捗 */}
                <div className="flex flex-col items-end shrink-0 w-full md:w-auto border-t md:border-t-0 border-zinc-900/50 pt-2 md:pt-0">
                  <span className="text-[10px] font-press-start text-yellow-500 tracking-tight text-right drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                    {areaInfo.taskText}
                  </span>
                  
                  {/* Stylized Signal Parts Progress Bar */}
                  <div className={`mt-2 flex flex-col items-end w-full md:w-auto ${isBossActive ? 'animate-pulse' : ''}`}>
                    <div className={`flex items-center gap-2 px-2.5 py-1 rounded border font-mono text-[9px] ${
                      isBossActive 
                        ? 'bg-red-950/60 border-red-800 text-red-200' 
                        : 'bg-black/45 border-zinc-900 text-zinc-400'
                    }`}>
                      <span className="text-zinc-500 font-bold uppercase tracking-wider text-[8px]">
                        {isBossActive ? '🛸 BOSS DROP TARGET' : 'SIGNAL PARTS'}
                      </span>
                      <div className="flex items-center gap-1.5 font-press-start text-[9px]">
                        {/* Part 1 */}
                        <span className={`inline-block ${wave >= 6 ? 'text-emerald-400 drop-shadow-[0_0_4px_rgba(52,211,153,0.5)]' : 'text-zinc-800'}`}>●</span>
                        {/* Part 2 */}
                        <span className={`inline-block ${wave >= 11 ? 'text-emerald-400 drop-shadow-[0_0_4px_rgba(52,211,153,0.5)]' : 'text-zinc-800'}`}>●</span>
                        {/* Part 3 */}
                        <span className={`inline-block ${wave > 15 ? 'text-emerald-400 drop-shadow-[0_0_4px_rgba(52,211,153,0.5)]' : 'text-zinc-800'}`}>●</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* === BENTO HUD SECTION (常に1行、超省スペース) === */}
              <div className="md:hidden flex flex-row gap-2 z-10 shrink-0 w-full select-none">
                
                {/* 1. RYU (Player) Bento Tile */}
                <div className={`flex-1 min-w-0 pixel-border p-2 sm:p-2.5 rounded flex flex-col gap-1 border relative overflow-hidden bento-card transition-all duration-500 ${isBossActive ? 'border-red-900 bg-[#160c0e]' : 'border-zinc-800 bg-[#121212]'}`}>
                  <div className="absolute top-0 right-0 w-12 h-12 blood-splatter opacity-15 pointer-events-none" />
                  <div className="flex justify-between items-center px-0.5">
                    <span className="text-blue-400 font-bold uppercase tracking-wider text-[10px] sm:text-xs flex items-center gap-1 min-w-0 truncate">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-500 inline-block animate-pulse shrink-0"></span>
                      <span className="truncate">RYU</span>
                    </span>
                    {combo >= 2 && (
                      <span className="text-[7.5px] font-press-start bg-red-800 text-yellow-300 px-1 py-0.2 rounded animate-pulse scale-90 hidden xs:inline-block shrink-0">
                        {combo} COMBO!
                      </span>
                    )}
                    <span className="text-[10px] sm:text-xs font-mono text-zinc-300 shrink-0">HP {playerHp}%</span>
                  </div>
                  {/* 体力ゲージ */}
                  <div className="w-full bg-zinc-950 border border-black h-4 sm:h-5 rounded relative overflow-hidden">
                    <div 
                      className={`h-full bg-blue-600 transition-all duration-150 relative ${playerHp <= 30 ? 'animate-pulse' : ''}`}
                      style={{ width: `${(playerHp / playerMaxHp) * 100}%` }}
                    >
                      <div className="absolute inset-0 bg-white/10 h-1/3" />
                    </div>
                  </div>
                </div>

                {/* 2. VS / WAVE Bento Tile */}
                <div className={`w-16 sm:w-24 shrink-0 pixel-border p-1.5 rounded flex flex-col items-center justify-center border bento-card text-center transition-all duration-500 ${isBossActive ? 'border-red-600 bg-red-950/60 shadow-[0_0_10px_rgba(220,38,38,0.25)] text-red-500 animate-pulse' : 'border-zinc-800 bg-[#121212]'}`}>
                  <span className={`text-[7px] sm:text-[8px] font-press-start block tracking-tighter ${isBossActive ? 'text-red-450' : 'text-zinc-500'}`}>{isBossActive ? '☠️ WARN' : 'WAVE'}</span>
                  <span className={`font-press-start leading-none my-0.5 ${isBossActive ? 'text-xs sm:text-sm text-red-500 font-black' : 'text-xs sm:text-sm text-yellow-400'}`}>{isBossActive ? 'BOSS' : wave}</span>
                  <span className="text-[#8B0000] font-black text-[9px] sm:text-[10px] tracking-widest leading-none">VS</span>
                </div>

                {/* 3. ZOMBIE (CPU) Bento Tile */}
                <div className={`flex-1 min-w-0 pixel-border p-2 sm:p-2.5 rounded flex flex-col gap-1 border relative overflow-hidden bento-card transition-all duration-500 ${isBossActive ? 'border-red-600 bg-[#25070f]' : 'border-zinc-800 bg-[#121212]'}`}>
                  <div className="absolute top-0 left-0 w-12 h-12 blood-splatter opacity-15 pointer-events-none" />
                  <div className="flex justify-between items-center px-0.5">
                    <span className="text-[10px] sm:text-xs font-mono text-zinc-300 shrink-0">HP {zombieHp}%</span>
                    <span className="text-red-500 font-bold uppercase tracking-wider text-[10px] sm:text-xs flex items-center gap-1 min-w-0 justify-end truncate">
                      <span className="truncate">{zombieType === 'boss' ? 'BOSS' : 'ZOMBIE'}</span>
                      <span className={`text-[7px] sm:text-[8px] font-press-start px-1 py-0.2 bg-red-950 border border-red-900 rounded shrink-0`}>
                        Lv.{wave}
                      </span>
                    </span>
                  </div>
                  {/* 体力ゲージ */}
                  <div className="w-full bg-zinc-950 border border-black h-4 sm:h-5 rounded relative overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-150 relative ${isBossActive ? 'bg-red-500 animate-pulse' : 'bg-red-700'}`}
                      style={{ width: `${(zombieHp / zombieMaxHp) * 100}%` }}
                    >
                      <div className="absolute inset-0 bg-white/10 h-1/3" />
                    </div>
                  </div>
                </div>
              </div>

              {/* === BENTO GRID SECTION (HUD & STATS) === */}
              <div className="hidden md:grid grid-cols-12 gap-3 z-10">
                
                {/* 1. RYU (Player) Bento Tile */}
                <div className={`col-span-12 md:col-span-5 pixel-border p-3.5 rounded flex flex-col gap-2 border relative overflow-hidden bento-card transition-all duration-500 ${isBossActive ? 'border-red-900 bg-[#160c0e] shadow-[inset_0_0_15px_rgba(239,68,68,0.1)]' : 'border-zinc-800 bg-[#121212]'}`}>
                  <div className="absolute top-0 right-0 w-16 h-16 blood-splatter opacity-15 pointer-events-none" />
                  <div className="flex justify-between items-center px-1">
                    <span className="text-blue-400 font-bold uppercase tracking-widest text-xs flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block animate-pulse"></span>
                      RYU [P1]
                    </span>
                    {combo >= 2 && (
                      <span className="text-[9px] font-press-start bg-red-800 text-yellow-300 px-1.5 py-0.5 rounded animate-pulse">
                        {combo} COMBO!
                      </span>
                    )}
                    <span className="text-xs font-mono text-zinc-300">HP {playerHp}%</span>
                  </div>
                  {/* 体力ゲージ */}
                  <div className="w-full bg-zinc-950 border-2 border-black h-6 rounded relative overflow-hidden">
                    <div 
                      className={`h-full bg-blue-600 transition-all duration-150 relative ${playerHp <= 30 ? 'animate-pulse' : ''}`}
                      style={{ width: `${(playerHp / playerMaxHp) * 100}%` }}
                    >
                      <div className="absolute inset-0 bg-white/10 h-1/3" />
                    </div>
                  </div>
                </div>

                {/* 2. VS / WAVE Bento Tile */}
                <div className={`col-span-12 md:col-span-2 pixel-border p-2 rounded flex flex-col items-center justify-center border bento-card text-center transition-all duration-500 ${isBossActive ? 'border-red-600 bg-red-950/60 shadow-[0_0_15px_rgba(220,38,38,0.25)] text-red-500 animate-pulse' : 'border-zinc-800 bg-[#121212]'}`}>
                  <span className={`text-[9px] font-press-start block tracking-tighter ${isBossActive ? 'text-red-450' : 'text-zinc-500'}`}>{isBossActive ? '☠️ WARNING' : 'WAVE'}</span>
                  <span className={`font-press-start my-0.5 ${isBossActive ? 'text-xl text-red-500 font-black' : 'text-lg text-yellow-400'}`}>{isBossActive ? 'BOSS' : wave}</span>
                  <span className="text-[#8B0000] font-black text-xs tracking-widest leading-none">V S</span>
                  
                  {/* 生存日数表示 */}
                  <div className="border-t border-zinc-900/60 w-full mt-1.5 pt-1.5 flex flex-col items-center justify-center">
                    <span className="text-[7.5px] font-press-start block tracking-tighter text-zinc-500">SURVIVED</span>
                    <span className="font-press-start text-xs text-emerald-400 mt-0.5 leading-none">{daysSurvived} D</span>
                  </div>
                </div>

                {/* 3. ZOMBIE (CPU) Bento Tile */}
                <div className={`col-span-12 md:col-span-5 pixel-border p-3.5 rounded flex flex-col gap-2 border relative overflow-hidden bento-card transition-all duration-500 ${isBossActive ? 'border-red-600 bg-[#25070f] shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border-zinc-800 bg-[#121212]'}`}>
                  <div className="absolute top-0 left-0 w-16 h-16 blood-splatter opacity-15 pointer-events-none" />
                  <div className="flex justify-between items-center px-1">
                    <span className="text-xs font-mono text-zinc-300">HP {zombieHp}%</span>
                    <span className="text-red-500 font-bold uppercase tracking-widest text-xs flex items-center gap-1">
                      <span className={`text-[9px] font-press-start px-1.5 py-0.5 rounded mr-1 ${isBossActive ? 'bg-red-800 text-yellow-400 font-black tracking-widest animate-pulse border border-red-500' : 'bg-[#2e1065] text-amber-400'}`}>
                        {zombieType === 'boss' ? 'S-TIER BOSS' : zombieType}
                      </span>
                      {zombieType === 'boss' ? 'PLAGUE DEMON' : 'OBSTACLE'}
                    </span>
                  </div>
                  {/* 体力ゲージ */}
                  <div className="w-full bg-zinc-950 border-2 border-black h-6 rounded relative overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-150 relative ${isBossActive ? 'bg-red-500 shadow-[inset_0_0_10px_rgba(255,255,255,0.4)] animate-pulse' : 'bg-red-700'}`}
                      style={{ width: `${(zombieHp / zombieMaxHp) * 100}%` }}
                    >
                      <div className="absolute inset-0 bg-white/10 h-1/3" />
                    </div>
                  </div>
                </div>

              </div>

              {/* === CENTRAL FIGHT STAGE BENTO GRID === */}
              <div className={`col-span-12 rounded-lg relative overflow-hidden flex-1 min-h-[200px] md:min-h-[250px] flex flex-col justify-end transition-all duration-500 pixel-border bg-gradient-to-b ${areaInfo.bgHex} ${isBossActive ? 'border-red-600 shadow-[inset_0_0_35px_rgba(239,68,68,0.3)]' : 'border-zinc-850 shadow-[inset_0_0_20px_rgba(0,0,0,0.85)]'}`}>
                {/* 16ビットエリア風背景レイヤー */}
                <div className="absolute inset-0 pointer-events-none z-0">
                  {/* 遠景レイヤー (Far Parallax Layer) */}
                  <div className="absolute inset-y-0 -left-[4%] w-[108%] pointer-events-none z-0 animate-parallax-far">
                    {/* 壁：暗いレンガ調のグリッド */}
                    <div className={`absolute inset-x-0 top-0 h-4/5 border-b-4 flex flex-col transition-colors duration-500 ${isBossActive ? 'bg-[#1e0306]/85 border-red-950/80' : 'bg-black/60 border-zinc-900/60'}`}>
                      <div className="flex-1 opacity-15 bg-[linear-gradient(#27272a_1px,transparent_1px),linear-gradient(90deg,#27272a_1px,transparent_1px)] [background-size:24px_16px]" />
                    </div>
                    {/* 遠景のデコレーションシルエット塔 */}
                    <div className="absolute bottom-8 right-12 w-12 h-20 bg-zinc-950/35 border-l-2 border-r-2 border-zinc-900/20 flex flex-col justify-between items-center py-2 opacity-40">
                      <div className="w-8 h-1 bg-zinc-800/20" />
                      <div className="w-6 h-1 bg-zinc-800/20" />
                      <div className="w-4 h-1 bg-zinc-800/20" />
                    </div>
                  </div>

                  {/* 中景レイヤー (Mid Parallax Layer) */}
                  <div className="absolute inset-y-0 -left-[8%] w-[116%] pointer-events-none z-10 animate-parallax-mid">
                    {/* 中景の柱（奥行きを増す構造） */}
                    <div className="absolute inset-y-0 left-12 w-4 bg-zinc-900/40 border-r border-zinc-950/20 opacity-30" />
                    <div className="absolute inset-y-0 right-12 w-4 bg-zinc-900/40 border-l border-zinc-950/20 opacity-30" />

                    {/* 看板 */}
                    <div className={`absolute top-8 left-16 border p-1.5 text-center rounded transition-all duration-500 ${isBossActive ? 'border-red-500 bg-red-950/90 animate-pulse text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)] opacity-90' : 'border-zinc-800 bg-black/80 text-zinc-500 opacity-60'}`}>
                      <span className="font-press-start text-[6px] text-red-500 block">⚠️ GPS OUT OF SERVICE</span>
                      <span className="font-mono text-[8px]">{isBossActive ? 'BOSS HARBINGER OF DESTRUCTION' : areaInfo.signText}</span>
                    </div>

                    {/* 落書き */}
                    <div className={`absolute top-1/4 right-1/4 select-none font-press-start text-[11px] sm:text-sm rotate-12 transition-colors duration-500 ${isBossActive ? 'text-red-600 opacity-65 saturate-200 animate-pulse' : 'text-red-900/40 opacity-40'}`}>
                      {isBossActive ? 'DIE DIE DIE' : areaInfo.graffiti}
                    </div>

                    {/* 中央の金属サポート梁 */}
                    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-neutral-850 via-neutral-900 to-neutral-950 border-r-2 border-neutral-950 opacity-15" />

                    {/* 点滅する薄暗い非常口マーク / 電波サーチマーク */}
                    <div className={`absolute top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[7px] font-press-start animate-lamp-flicker border transition-all duration-500 ${isBossActive ? 'bg-red-800 text-yellow-300 border-yellow-500 animate-[bounce_1s_infinite]' : 'bg-cyan-950/30 border-cyan-800 text-cyan-500'}`}>
                      {isBossActive ? '⚠️ RED ALERT' : 'GPS: NO SIG'}
                    </div>
                  </div>

                  {/* 近景レイヤー (Near/Foreground Parallax Layer) */}
                  <div className="absolute inset-y-0 -left-[12%] w-[124%] pointer-events-none z-20 animate-parallax-near">
                    {/* 壊れた鉄路・プラットホーム床 */}
                    <div className={`absolute inset-x-0 bottom-0 h-8 border-t-2 flex flex-col justify-end transition-colors duration-500 ${isBossActive ? 'bg-[#290509] border-red-900/60' : 'bg-zinc-900 border-zinc-800'}`}>
                      <div className="h-2 bg-zinc-950 border-t border-stone-900" />
                    </div>

                    {/* 破壊されたハザードデブリ（ドラム缶） */}
                    <div className="absolute bottom-6 left-10 w-4 h-7 border-2 border-black bg-yellow-700/65 flex flex-col justify-between p-0.5 shadow-md">
                      <div className="h-0.5 bg-black/50" />
                      <span className="font-press-start text-[3px] text-black font-black text-center leading-none">🚧</span>
                      <div className="h-0.5 bg-black/50" />
                    </div>

                    <div className="absolute bottom-6 right-12 w-5 h-4 border border-black bg-zinc-800/55 rounded flex items-center justify-center">
                      <span className="font-press-start text-[5px] text-red-500">☣</span>
                    </div>

                    {/* 床デコレーション・シャドウ */}
                    <div className="absolute bottom-4 left-1/4 w-8 h-2 bg-zinc-950/20 rounded-full blur-[1px]" />
                    <div className="absolute bottom-4 right-1/4 w-10 h-2 bg-zinc-950/20 rounded-full blur-[1px]" />
                  </div>
                </div>

                {/* エフェクト描画のためのCanvas overlay */}
                <canvas 
                  ref={canvasRef} 
                  className="absolute inset-0 w-full h-full pointer-events-none z-10"
                />

                {/* 動的フローティングテキスト描画 */}
                {floatingTexts.map(t => (
                  <div 
                    key={t.id} 
                    className="absolute font-press-start text-[10px] md:text-xs text-outline-dark animate-float-text pointer-events-none z-30"
                    style={{ left: `${t.x}px`, top: `${t.y}px`, color: t.color }}
                  >
                    {t.text}
                  </div>
                ))}

                {/* キャラクターズステージングレイアウト */}
                <div className="flex-grow flex items-end justify-between px-8 pb-1 z-10 pointer-events-none select-none">
                  <RyuSprite action={ryuAction} comboCount={combo} />
                  <ZombieSprite action={zombieAction} zombieType={zombieType} />
                </div>

                {/* 5. Center Floating Typing Wood Board (画面中央に大きく表示) */}
                <motion.div 
                  animate={isMissShake ? { x: ["-50%", "-52%", "-48%", "-51%", "-49%", "-50.5%", "-49.5%", "-50%"] } : { x: "-50%" }}
                  transition={{ duration: 0.18, ease: "easeInOut" }}
                  className={`absolute top-2 left-1/2 z-30 w-[96%] max-w-[460px] p-2.5 sm:p-3 rounded-lg overflow-hidden flex flex-col justify-between shadow-2xl border-2 transition-all duration-500 select-none ${isBossActive ? 'bg-gradient-to-br from-[#450a0a] via-[#880808] to-[#1c1917] border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.6)] scale-102 font-bold' : 'wood-board border-[#2d1b18]'}`}
                >
                  {/* 背景の血しぶき */}
                  <div className="absolute top-0 right-0 w-24 h-24 blood-splatter opacity-50 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-28 h-28 blood-splatter opacity-35 pointer-events-none" />

                  {/* 情報ヘッダー */}
                  <div className={`text-[10px] sm:text-xs font-press-start tracking-wider mb-2 uppercase z-10 flex items-center justify-center gap-1 text-shadow-glow transition-all duration-300 ${isBossActive ? 'text-yellow-400 animate-pulse' : 'text-zinc-300'}`}>
                    <span className="text-red-500">⚠️ {isBossActive ? 'BOSS TARGET MEANING' : '☣'}</span>
                    <span className="text-white font-bold text-xs sm:text-sm px-1 bg-black/35 rounded">{currentWord.meaning}</span>
                    <span className="text-red-500">{isBossActive ? '⚠️' : '☣'}</span>
                  </div>

                  {/* ーーー【COMBO GAUGE / FEVER STATUS】ーーー */}
                  <div className="z-10 flex flex-col gap-1 items-center justify-center my-1">
                    {isFeverActive ? (
                      <div className="flex flex-col items-center gap-1 animate-pulse select-none">
                        <div className="flex items-center gap-1 text-rose-500 font-press-start text-[8px] font-black tracking-widest drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]">
                          <Zap size={9} className="animate-bounce" fill="#f43f5e" />
                          <span>COMBO FEVER 1.5x ATK!</span>
                          <Zap size={9} className="animate-bounce" fill="#f43f5e" />
                        </div>
                        {/* フィーバー残り時間の視覚的ローディングバー */}
                        <div className="w-48 bg-zinc-950/80 border-2 border-[#f43f5e] h-3 rounded relative overflow-hidden flex items-center p-0.5 shadow-[0_0_10px_rgba(244,63,94,0.3)]">
                          <div 
                            className="h-full bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 transition-all duration-75 relative rounded-sm"
                            style={{ width: `${(feverTimeRemaining / FEVER_DURATION) * 100}%` }}
                          >
                            <div className="absolute inset-0 bg-white/20 h-1/3" />
                          </div>
                          <span className="absolute inset-0 flex items-center justify-center text-[7px] font-press-start text-white">{feverTimeRemaining.toFixed(1)}s</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1 select-none">
                        <div className="flex justify-between items-center w-48 text-[7px] font-press-start text-zinc-400">
                          <span className="tracking-tight">COMBO METER GAUGE</span>
                          <span className="text-amber-500 font-bold">{comboProgress} / {MAX_COMBO_METER}</span>
                        </div>
                        {/* 5個 of LEDセグメント */}
                        <div className="flex gap-1.5 bg-zinc-950/90 p-1 border border-zinc-900 rounded shadow-inner">
                          {Array.from({ length: MAX_COMBO_METER }).map((_, idx) => {
                            const isActive = comboProgress > idx;
                            return (
                              <div 
                                key={idx}
                                className={`w-8 h-2 rounded-sm transition-all duration-200 border border-black/40 ${
                                  isActive 
                                    ? 'bg-gradient-to-t from-amber-600 via-yellow-400 to-yellow-300 shadow-[0_0_6px_rgba(234,179,8,0.7)]' 
                                    : 'bg-zinc-800/80'
                                }`}
                              />
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 出題ワード (大きく表示) */}
                  <div className="font-press-start text-xl sm:text-3xl tracking-widest select-none z-10 my-2.5 break-all relative flex items-center justify-center gap-x-[1px] flex-wrap min-h-[44px]">
                    
                    {/* 飛び散るきらきらキーエフェクト */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible z-30">
                      {typingEffects.map(eff => (
                        <motion.span
                          key={eff.id}
                          initial={{ opacity: 1, scale: 1.5, y: 0, x: eff.x, rotate: 0 }}
                          animate={{ 
                            opacity: 0, 
                            scale: 0.4, 
                            y: -100, 
                            x: eff.x + (Math.random() * 50 - 25), 
                            rotate: Math.random() * 360 - 180 
                          }}
                          transition={{ duration: 0.65, ease: "easeOut" }}
                          className={`absolute font-press-start font-black text-xl sm:text-3xl ${
                            eff.isMiss 
                              ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.95)]' 
                              : 'text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.95)]'
                          }`}
                        >
                          {eff.char}
                        </motion.span>
                      ))}
                    </div>

                    {/* 1文字ずつの消し込み表示 */}
                    {Array.from(currentWord.text).map((char, index) => {
                      const isTyped = index < typedIndex;
                      const isActive = index === typedIndex;

                      if (isTyped) {
                        return null; // タイプが完了した文字は完全に消す（左詰めで次の文字が前に来る）
                      } else if (isActive) {
                        return (
                          <motion.span 
                            key={index}
                            className="text-[#0a0a0a] bg-zinc-100 px-1.5 rounded mx-[2px] inline-block font-bold border-2 border-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 0.6 }}
                          >
                            {char}
                          </motion.span>
                        );
                      } else {
                        return (
                          <span 
                            key={index} 
                            className="text-white opacity-95 font-bold inline-block mx-[2px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                          >
                            {char}
                          </span>
                        );
                      }
                    })}
                  </div>

                  {/* タイマーバー */}
                  <div className="w-full mt-2.5 z-10 flex flex-col gap-1 select-none">
                    <div className="w-full bg-[#111] h-2 border-2 border-black rounded overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-75 ${
                          isBossActive
                            ? 'bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]'
                            : (timeRemaining / maxTime) <= 0.35 
                              ? 'bg-red-650 animate-pulse' 
                              : 'bg-red-800'
                        }`}
                        style={{ width: `${(timeRemaining / maxTime) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[8px] font-press-start text-zinc-400">
                      <span className={zombieType === 'boss' ? 'text-red-400 animate-pulse font-bold' : ''}>{zombieType === 'boss' ? '☠️ ELIMINATE THE BOSS BEAST!' : 'ATTACK TIMER'}</span>
                      <span className={zombieType === 'boss' ? 'text-red-400 font-bold' : ''}>{timeRemaining.toFixed(2)}s</span>
                    </div>
                  </div>
                </motion.div>

                {/* タイムゲージと警告表示（キャラクターの間） */}
                {timeRemaining <= 2.0 && (
                  <div className="absolute top-[65%] left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-950/95 border-2 border-red-600 text-red-400 p-2 rounded text-center z-20 animate-bounce max-w-[150px]">
                    <div className="flex items-center justify-center gap-1">
                      <ShieldAlert size={14} className="text-red-500 animate-pulse" />
                      <span className="font-press-start text-[8px] uppercase tracking-tighter">ATTACK TIME!</span>
                    </div>
                  </div>
                )}
              </div>

              {/* === BENTO FOOTER GRID (超省スペース化・スタッツ & スコア、常に1行フレックス) === */}
              <div className="flex flex-row gap-2 w-full shrink-0 select-none">
                
                {/* 4. Left Info Tile: Score & Combos */}
                <div className="flex-1 bg-[#121212] border border-zinc-850 pixel-border p-2 rounded flex flex-row justify-between items-center bento-card select-none gap-2 min-w-0">
                  <div className="flex items-center gap-1.5 min-w-0 truncate">
                    <Trophy size={14} className="text-yellow-500 shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[7px] font-mono text-zinc-500 uppercase tracking-wider">SCORE</span>
                      <span className="font-press-start text-[11px] sm:text-xs text-yellow-400 drop-shadow-[0_1px_0_#000] truncate">{score}</span>
                    </div>
                  </div>
                  
                  <div className="hidden xs:flex items-center gap-2 border-l border-zinc-800 pl-2 min-w-0">
                    <div className="flex flex-col min-w-0">
                      <span className="text-[7px] font-mono text-zinc-500 uppercase tracking-wider">AMP</span>
                      <span className={`font-press-start text-[8px] tracking-tight leading-none truncate ${isFeverActive ? 'text-rose-500 animate-pulse font-bold' : 'text-zinc-400'}`}>
                        {isFeverActive ? '1.5X FEVER' : '1.0X STBY'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 bg-[#450a0a]/30 px-1.5 py-0.5 rounded border border-red-950/50 shrink-0">
                    <Skull size={10} className="text-red-500 animate-pulse shrink-0" />
                    <span className="text-[8px] font-press-start text-red-400">{kills} SLN</span>
                  </div>
                </div>

                {/* 6. Right Info Tile: Stats & Combos */}
                <div className="flex-1 bg-[#121212] border border-zinc-850 pixel-border p-2 rounded flex flex-row justify-between items-center bento-card select-none gap-2 min-w-0">
                  <div className="flex items-center gap-1.5 min-w-0 truncate">
                    <Zap size={14} className="text-orange-500 shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[7px] font-mono text-zinc-500 uppercase tracking-wider">ACCURACY</span>
                      <span className="text-white font-press-start text-[10px] sm:text-xs truncate">{getAccuracy()}%</span>
                    </div>
                  </div>

                  <div className="hidden xs:flex items-center gap-2 border-l border-zinc-800 pl-2 min-w-0">
                    <div className="flex flex-col min-w-0">
                      <span className="text-[7px] font-mono text-zinc-500 uppercase tracking-wider">MAX COMBO</span>
                      <span className="text-red-500 font-press-start text-[9px] sm:text-[10px] truncate">{maxCombo} COM</span>
                    </div>
                  </div>

                  <div className="text-[8px] text-zinc-500 font-press-start uppercase tracking-wider animate-pulse shrink-0">
                    TYPE!
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ーーー【状態 4: GAME OVER 】ーーー */}
          {stage === 'GAMEOVER' && (
            <div className="flex-1 overflow-y-auto flex flex-col items-center justify-start p-6 py-8 relative bg-gradient-to-b from-black via-red-950 to-black select-none">
              
              <div className="absolute inset-x-0 h-1 bg-red-700/30 animate-pulse top-4" />
              <div className="absolute inset-x-0 h-1 bg-red-700/30 animate-pulse bottom-4" />

              <div className="text-center z-10">
                <Skull size={64} className="text-red-650 mx-auto animate-bounce mb-3" />
                <h1 className="font-press-start text-3xl sm:text-5xl text-red-650 tracking-tighter text-outline-dark uppercase">
                  GAME OVER
                </h1>
                <p className="font-press-start text-xs text-zinc-400 mt-4 tracking-tighter">
                  YOU WERE DEFEATED BY THE OUTBREAK
                </p>
              </div>

              {/* スコア・スタッツグリッド */}
              <div className="w-full max-w-2xl mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 font-mono z-10 px-4">
                
                {/* 1. SURVIVAL PERFORMANCE CARD */}
                <div className="border-4 border-black bg-[#121212] rounded-lg p-5 flex flex-col gap-3 pixel-border shadow-lg">
                  <h2 className="font-press-start text-[9px] text-[#861919] border-b border-zinc-800 pb-2.5 flex items-center gap-1.5 uppercase tracking-wide">
                    <Skull size={12} className="text-red-650" />
                    <span>SURVIVAL STATISTICS:</span>
                  </h2>
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 uppercase font-black">REACHED WAVE:</span>
                    <span className="text-red-500 font-press-start text-xs">{wave}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 uppercase font-black">DAYS SURVIVED:</span>
                    <span className="text-emerald-400 font-bold">{daysSurvived} DAYS</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 uppercase font-black">ZOMBIES SLAIN:</span>
                    <span className="text-red-400 font-bold">{kills} DEFEATS</span>
                  </div>

                  <div className="flex justify-between items-center text-xs border-t border-zinc-900 pt-2">
                    <span className="text-zinc-500 uppercase font-black">FINAL SCORE:</span>
                    <span className="text-yellow-400 font-bold">{score} EXP</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 uppercase font-black">MAX COMBO HIT:</span>
                    <span className="text-orange-500 font-bold flex items-center gap-1">
                      <Flame size={12} className="fill-orange-500 animate-pulse" />
                      {maxCombo} COMBOS!
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 uppercase font-black">MISSION LEVEL:</span>
                    <span className={`font-bold ${difficulty === 'EASY' ? 'text-emerald-400' : difficulty === 'NORMAL' ? 'text-yellow-500' : 'text-red-600'}`}>
                      {difficulty}
                    </span>
                  </div>
                </div>

                {/* 2. TYPING PERFORMANCE REPORT CARD */}
                <div className="border-4 border-black bg-[#121212] rounded-lg p-5 flex flex-col gap-3 pixel-border shadow-lg">
                  <h2 className="font-press-start text-[9px] text-emerald-400 border-b border-zinc-800 pb-2.5 flex items-center gap-1.5 uppercase tracking-wide">
                    <TrendingUp size={12} className="text-emerald-400" />
                    <span>TYPING REPORT:</span>
                  </h2>
                  
                  <div className="grid grid-cols-2 gap-2 my-1 text-center font-press-start">
                    <div className="bg-[#0b0b0b] p-2 rounded border border-zinc-900 flex flex-col items-center justify-center shadow-inner">
                      <span className="text-[7px] text-zinc-500 uppercase">SPEED</span>
                      <span className="text-lg text-emerald-400 font-extrabold mt-1">{getWPM()} <span className="text-[8px] text-zinc-650 font-normal block mt-0.5">WPM</span></span>
                    </div>
                    
                    <div className="bg-[#0b0b0b] p-2 rounded border border-zinc-900 flex flex-col items-center justify-center shadow-inner">
                      <span className="text-[7px] text-zinc-500 uppercase">REACTION</span>
                      <span className="text-lg text-indigo-400 font-extrabold mt-1">{getAvgReactionTime()} <span className="text-[8px] text-zinc-650 font-normal block mt-0.5">ms</span></span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs border-t border-zinc-900 pt-2">
                    <span className="text-zinc-500 uppercase font-black">TYPING ACCURACY:</span>
                    <span className="text-emerald-400 font-bold">{getAccuracy()}% ACC</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 uppercase font-black">TOTAL KEYPRESSES:</span>
                    <span className="text-slate-300 font-bold">{totalKeyStrokes} KEYS</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 uppercase font-black">CORRECT STROKES:</span>
                    <span className="text-emerald-505 font-bold">{correctKeyStrokes} KEYS</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 uppercase font-black">WORDS TRANSFERRED:</span>
                    <span className="text-yellow-500 font-bold">{wordsCompleted} WORDS</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 uppercase font-black">TERMINAL UP-TIME:</span>
                    <span className="text-zinc-450 font-bold">{(playDurationMs / 1000).toFixed(1)} SEC</span>
                  </div>
                </div>

              </div>

              {/* 🏆 生存者ランキング登録パネル (SURVIVOR REGISTRATION PANEL) 🏆 */}
              <div className="w-full max-w-2xl mt-5 bg-[#090909] border-2 border-red-900/60 p-4 rounded-lg flex flex-col gap-3 font-mono z-10 shadow-lg">
                <div className="flex items-center gap-2 text-yellow-500 font-bold text-xs border-b border-zinc-850 pb-2">
                  <Trophy size={14} className="text-yellow-500 animate-pulse" />
                  <span>生存者レジストリに記録を登録 (SURVIVOR REGISTRY ENROLLMENT)</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center my-1">
                  <div className="bg-[#121212] p-2 rounded border border-zinc-900">
                    <span className="text-[8px] text-zinc-500 uppercase block">1秒あたりのタイピング数</span>
                    <span className="text-sm font-bold text-cyan-400 mt-1 block">{(playDurationMs > 0 ? (totalKeyStrokes / (playDurationMs / 1000)) : 0).toFixed(2)} K/S</span>
                  </div>
                  <div className="bg-[#121212] p-2 rounded border border-zinc-900">
                    <span className="text-[8px] text-zinc-500 uppercase block">総タイピングキー数</span>
                    <span className="text-sm font-bold text-slate-300 mt-1 block">{totalKeyStrokes} Keys</span>
                  </div>
                  <div className="bg-[#121212] p-2 rounded border border-zinc-900">
                    <span className="text-[8px] text-zinc-500 uppercase block">ミス入力数</span>
                    <span className="text-sm font-bold text-red-400 mt-1 block">{totalKeyStrokes - correctKeyStrokes} Miss</span>
                  </div>
                </div>

                <div className="bg-[#121212] border border-zinc-900 rounded p-3 text-center flex flex-col items-center justify-center gap-1">
                  <span className="text-[8px] text-zinc-500 uppercase">獲得した称号 (SURVIVOR TITLE AWARDED)</span>
                  <span className="text-base font-black text-yellow-400 tracking-wider animate-pulse uppercase">
                    🏆 {getTypingTitle(
                      playDurationMs > 0 ? (totalKeyStrokes / (playDurationMs / 1000)) : 0, 
                      getAccuracy(), 
                      totalKeyStrokes, 
                      totalKeyStrokes - correctKeyStrokes
                    )} 🏆
                  </span>
                </div>

                {hasRegisteredCurrentRun ? (
                  <div className="text-center py-2.5 bg-zinc-900/60 border border-zinc-800 text-emerald-400 font-semibold text-xs rounded animate-pulse">
                    ✅ レジストリに生存者記録が正常に記録されました！
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-zinc-950 p-2.5 rounded border border-zinc-900">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest shrink-0">NAME:</span>
                      <input 
                        type="text" 
                        maxLength={8}
                        value={playerNameInput}
                        onChange={(e) => setPlayerNameInput(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                        placeholder="RYU"
                        className="bg-black border border-zinc-800 text-yellow-400 font-bold px-2 py-1 text-sm rounded w-full sm:w-28 tracking-widest text-center focus:border-yellow-600 focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={registerSurvivorRecord}
                      className="w-full sm:w-auto bg-gradient-to-r from-red-950 to-red-800 border-2 border-red-600 text-white hover:text-yellow-400 font-semibold px-4 py-1.5 text-[11px] rounded transition-all active:scale-95 cursor-pointer shadow-[0_0_8px_rgba(220,38,38,0.2)] hover:shadow-[0_0_12px_rgba(220,38,38,0.4)]"
                    >
                      レジストリに記録を登録
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-8 z-10 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleRestart}
                  className="font-press-start text-xs bg-red-900 border-4 border-white text-white px-6 py-3.5 rounded shadow-lg hover:bg-red-800 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 pixel-border"
                >
                  <RotateCcw size={14} />
                  INSERT COIN [ RETRY ]
                </button>
                <button
                  onClick={() => setStage('TITLE')}
                  className="font-press-start text-xs bg-[#161616] border-2 border-zinc-800 px-6 py-3.5 rounded text-zinc-300 shadow-lg hover:bg-neutral-800 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  TITLE SCREEN
                </button>
              </div>

            </div>
          )}

          {/* ーーー【状態 5: VICTORY (GAME CLEAR) 】ーーー */}
          {stage === 'VICTORY' && (
            <div className="flex-1 overflow-y-auto flex flex-col items-center justify-start p-6 py-8 relative bg-gradient-to-b from-[#081710] via-[#052414] to-[#081710] select-none">
              
              <div className="absolute inset-x-0 h-1 bg-green-700/30 animate-pulse top-4" />
              <div className="absolute inset-x-0 h-1 bg-green-700/30 animate-pulse bottom-4" />

              <div className="text-center z-10 flex flex-col items-center">
                {/* Helicopter silhouette or abstract animated component */}
                <div className="relative mb-6 flex items-center justify-center">
                  <div className="w-16 h-1 bg-zinc-400 rounded animate-[spin_0.1s_infinite] absolute -top-2"></div>
                  <Trophy size={64} className="text-yellow-400 animate-bounce" />
                </div>
                
                <h1 className="font-press-start text-3xl sm:text-5xl text-yellow-400 tracking-tighter text-shadow uppercase">
                  GAME CLEAR!
                </h1>
                <p className="font-press-start text-[10px] text-emerald-400 mt-4 tracking-wider animate-pulse uppercase leading-none">
                  ⚓ MISSION ACCOMPLISHED ⚓
                </p>
              </div>

              {/* ストーリークリア文章 */}
              <div className="w-full max-w-xl mt-6 bg-black/85 border border-emerald-950/70 p-5 rounded-lg flex flex-col gap-3 font-medium z-10 shadow-2xl">
                <span className="text-[11px] font-bold text-emerald-400 tracking-wider border-b border-emerald-900 pb-1.5 flex items-center gap-1.5 leading-none">
                  🚁 レスキューヘリ到達：ゾンビアイランドから奇跡の生還
                </span>
                <p className="text-[11px] sm:text-xs text-zinc-350 leading-relaxed">
                  山頂の通信塔から放たれた最大出力のSOS救難信号により、派遣された救助ヘリコプターが暴風雨を突いて上空に到着！
                  手元の「特殊キーボード」の超電波波形ですべての脅威を撃滅した主人公は、ヘリから降ろされた縄梯子をガッチリと掴んだ。
                </p>
                <p className="text-[11px] sm:text-xs text-yellow-400 font-semibold leading-relaxed">
                  眼下に広がるゾンビの巣窟を後にし、あなたは安堵と勝利の喜びを噛みしめる。特殊キーボードを携え、絶望の無人島からついに生還したのだ！
                </p>
              </div>

              {/* スコア・スタッツグリッド */}
              <div className="w-full max-w-2xl mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 font-mono z-10 px-4 text-xs">
                
                {/* 1. SURVIVAL CHRONICLE CARD */}
                <div className="border-4 border-black bg-[#121212] rounded-lg p-5 flex flex-col gap-3 pixel-border shadow-lg">
                  <h2 className="font-press-start text-[9px] text-yellow-500 border-b border-zinc-850 pb-2.5 flex items-center gap-1.5 uppercase tracking-wide animate-pulse">
                    <Sparkles size={11} className="text-yellow-400 animate-spin" />
                    <span>SURVIVOR CHRONICLE:</span>
                  </h2>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 uppercase font-black">PROGRESS:</span>
                    <span className="text-emerald-400 font-bold">ALL WAVES CLEARED</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 uppercase font-black">DAYS SURVIVED:</span>
                    <span className="text-emerald-400 font-bold">{daysSurvived} DAYS</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 uppercase font-black">TOTAL KILLS:</span>
                    <span className="text-red-500 font-bold">{kills} DEFEATS</span>
                  </div>

                  <div className="flex justify-between items-center border-t border-zinc-900 pt-2">
                    <span className="text-zinc-500 uppercase font-black">FINAL SCORE:</span>
                    <span className="text-yellow-400 font-bold">{score + 5000} PTS (★ CLEAR BONUS)</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 uppercase font-black">PEAK COMBO:</span>
                    <span className="text-orange-500 font-bold">
                      {maxCombo} STREAK
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 uppercase font-black">MISSION LEVEL:</span>
                    <span className={`font-bold ${difficulty === 'EASY' ? 'text-emerald-400' : difficulty === 'NORMAL' ? 'text-yellow-500' : 'text-red-600'}`}>
                      {difficulty}
                    </span>
                  </div>
                </div>

                {/* 2. TYPING PERFORMANCE REPORT CARD */}
                <div className="border-4 border-black bg-[#121212] rounded-lg p-5 flex flex-col gap-3 pixel-border shadow-lg">
                  <h2 className="font-press-start text-[9px] text-emerald-400 border-b border-zinc-850 pb-2.5 flex items-center gap-1.5 uppercase tracking-wide">
                    <TrendingUp size={12} className="text-emerald-400" />
                    <span>TYPING REPORT:</span>
                  </h2>
                  
                  <div className="grid grid-cols-2 gap-2 my-1 text-center font-press-start">
                    <div className="bg-[#0b0b0b] p-2 rounded border border-zinc-900 flex flex-col items-center justify-center shadow-inner">
                      <span className="text-[7px] text-zinc-500 uppercase">SPEED</span>
                      <span className="text-lg text-emerald-400 font-extrabold mt-1">{getWPM()} <span className="text-[8px] text-zinc-650 font-normal block mt-0.5">WPM</span></span>
                    </div>
                    
                    <div className="bg-[#0b0b0b] p-2 rounded border border-zinc-900 flex flex-col items-center justify-center shadow-inner">
                      <span className="text-[7px] text-zinc-500 uppercase">REACTION</span>
                      <span className="text-lg text-indigo-400 font-extrabold mt-1">{getAvgReactionTime()} <span className="text-[8px] text-zinc-650 font-normal block mt-0.5">ms</span></span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t border-zinc-900 pt-2">
                    <span className="text-zinc-500 uppercase font-black">TYPING ACCURACY:</span>
                    <span className="text-emerald-400 font-bold">{getAccuracy()}% ACC</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 uppercase font-black">TOTAL KEYPRESSES:</span>
                    <span className="text-slate-300 font-bold">{totalKeyStrokes} KEYS</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 uppercase font-black">CORRECT STROKES:</span>
                    <span className="text-emerald-505 font-bold">{correctKeyStrokes} KEYS</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 uppercase font-black">WORDS TRANSFERRED:</span>
                    <span className="text-yellow-500 font-bold">{wordsCompleted} WORDS</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 uppercase font-black">TERMINAL UP-TIME:</span>
                    <span className="text-zinc-440 font-bold">{(playDurationMs / 1000).toFixed(1)} SEC</span>
                  </div>
                </div>

              </div>

              {/* 🏆 生存者ランキング登録パネル (SURVIVOR REGISTRATION PANEL) 🏆 */}
              <div className="w-full max-w-2xl mt-5 bg-[#090909] border-2 border-emerald-900/60 p-4 rounded-lg flex flex-col gap-3 font-mono z-10 shadow-lg">
                <div className="flex items-center gap-2 text-yellow-500 font-bold text-xs border-b border-zinc-850 pb-2">
                  <Trophy size={14} className="text-yellow-500 animate-pulse" />
                  <span>生存者レジストリにクリア記録を登録 (SURVIVOR REGISTRY ENROLLMENT - CLEAR)</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center my-1">
                  <div className="bg-[#121212] p-2 rounded border border-zinc-900">
                    <span className="text-[8px] text-zinc-500 uppercase block">1秒あたりのタイピング数</span>
                    <span className="text-sm font-bold text-cyan-400 mt-1 block">{(playDurationMs > 0 ? (totalKeyStrokes / (playDurationMs / 1000)) : 0).toFixed(2)} K/S</span>
                  </div>
                  <div className="bg-[#121212] p-2 rounded border border-zinc-900">
                    <span className="text-[8px] text-zinc-500 uppercase block">総タイピングキー数</span>
                    <span className="text-sm font-bold text-slate-300 mt-1 block">{totalKeyStrokes} Keys</span>
                  </div>
                  <div className="bg-[#121212] p-2 rounded border border-zinc-900">
                    <span className="text-[8px] text-zinc-500 uppercase block">ミス入力数</span>
                    <span className="text-sm font-bold text-red-400 mt-1 block">{totalKeyStrokes - correctKeyStrokes} Miss</span>
                  </div>
                </div>

                <div className="bg-[#121212] border border-zinc-900 rounded p-3 text-center flex flex-col items-center justify-center gap-1">
                  <span className="text-[8px] text-zinc-500 uppercase">獲得した称号 (SURVIVOR TITLE AWARDED)</span>
                  <span className="text-base font-black text-yellow-400 tracking-wider animate-pulse uppercase">
                    🏆 {getTypingTitle(
                      playDurationMs > 0 ? (totalKeyStrokes / (playDurationMs / 1000)) : 0, 
                      getAccuracy(), 
                      totalKeyStrokes, 
                      totalKeyStrokes - correctKeyStrokes
                    )} 🏆
                  </span>
                </div>

                {hasRegisteredCurrentRun ? (
                  <div className="text-center py-2.5 bg-zinc-900/60 border border-zinc-800 text-emerald-400 font-semibold text-xs rounded animate-pulse">
                    ✅ 栄光のクリア記録が生存者レジストリに登録されました！
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-zinc-950 p-2.5 rounded border border-zinc-900">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest shrink-0">NAME:</span>
                      <input 
                        type="text" 
                        maxLength={8}
                        value={playerNameInput}
                        onChange={(e) => setPlayerNameInput(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                        placeholder="RYU"
                        className="bg-black border border-zinc-800 text-yellow-400 font-bold px-2 py-1 text-sm rounded w-full sm:w-28 tracking-widest text-center focus:border-yellow-600 focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={registerSurvivorRecord}
                      className="w-full sm:w-auto bg-gradient-to-r from-emerald-950 to-emerald-800 border-2 border-emerald-600 text-white hover:text-yellow-400 font-semibold px-4 py-1.5 text-[11px] rounded transition-all active:scale-95 cursor-pointer shadow-[0_0_8px_rgba(16,185,129,0.2)] hover:shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                    >
                      レジストリに記録を登録
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-8 z-10 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleRestart}
                  className="font-press-start text-xs bg-emerald-900 border-4 border-white text-white px-6 py-3.5 rounded shadow-lg hover:bg-emerald-800 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 pixel-border"
                >
                  <RotateCcw size={14} />
                  PLAY AGAIN [ RE-DEPLOY ]
                </button>
                <button
                  onClick={() => setStage('TITLE')}
                  className="font-press-start text-xs bg-[#161616] border-2 border-zinc-800 px-6 py-3.5 rounded text-zinc-300 shadow-lg hover:bg-neutral-800 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  TITLE SCREEN
                </button>
              </div>

            </div>
          )}

        </div>

        {/* コントローラ部分の化粧ベゼル（アーケード風のボタングラフィック） */}
        <div className="bg-[#121212] border-t-2 border-zinc-900 p-4 flex flex-col md:flex-row gap-4 items-center justify-between select-none">
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <span className="w-4 h-4 rounded bg-red-850 border-2 border-black shadow-inner block animate-pulse"></span>
              <span className="w-4 h-4 rounded bg-yellow-500 border-2 border-black shadow-inner block"></span>
              <span className="w-4 h-4 rounded bg-blue-650 border-2 border-black shadow-inner block"></span>
            </div>
            <div className="text-[10px] text-zinc-500 font-mono tracking-widest">
              BENTO GRID EDITION COIN-OP
            </div>
          </div>

          <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-red-500 block animate-pulse"></span>
              <span>LIVE CORE</span>
            </div>
            <span>PORT 3000</span>
          </div>
        </div>

      </div>

    </div>
  );
}
