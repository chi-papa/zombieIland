import React from 'react';

interface ZombieSpriteProps {
  action: 'idle' | 'attack' | 'hurt' | 'dead';
  zombieType?: 'groomer' | 'screamer' | 'brute' | 'boss';
}

export default function ZombieSprite({ action, zombieType = 'groomer' }: ZombieSpriteProps) {
  // アクションに応じた追加アニメーション・位置ズレ
  const getActionStyles = () => {
    switch (action) {
      case 'idle':
        return 'animate-zombie-slither';
      case 'attack':
        // プレイヤーに一気に噛み付きにいく跳躍
        return '-translate-x-[110px] scale-x-110 md:-translate-x-[160px] transition-all duration-150 ease-out z-20';
      case 'hurt':
        // のけぞる（右方向に押し戻される）
        return 'animate-screen-shake translate-x-6 rotate-[12deg] skew-y-[-4deg] brightness-150 saturate-150 duration-100';
      case 'dead':
        // 崩壊して地面に倒れ伏す
        return 'rotate-[-90deg] translate-y-[90px] translate-x-[40px] opacity-0 transition-all duration-700 ease-in-out pointer-events-none scale-y-75';
      default:
        return 'animate-zombie-slither';
    }
  };

  // ゾンビの種類による色や装飾の変化
  const getZombieColors = () => {
    switch (zombieType) {
      case 'boss':
        return { skin: '#1e293b', clothes: '#171717', accent: '#ef4444' };
      case 'screamer':
        return { skin: '#86efac', clothes: '#801a80', accent: '#a21caf' };
      case 'brute':
        return { skin: '#14532d', clothes: '#1e293b', accent: '#7f1d1d' };
      default: // groomer
        return { skin: '#4d7c0f', clothes: '#2e1065', accent: '#b91c1c' };
    }
  };

  const colors = getZombieColors();

  return (
    <div className={`relative w-36 h-48 md:w-44 md:h-56 flex items-end justify-center select-none ${getActionStyles()} ${zombieType === 'boss' ? 'scale-125 md:scale-[1.35] origin-bottom' : ''}`}>
      
      {/* 攻撃時の赤いエフェクト爪跡（スラッシュ効果） */}
      {action === 'attack' && (
        <div className="absolute -left-16 top-12 pointer-events-none select-none opacity-90 animate-pulse">
          <svg width="100" height="100" viewBox="0 0 100 100" className="animate-bounce">
            {/* 3本の爪跡血痕 */}
            <path d="M 90 10 L 20 70 M 80 5 L 10 60 M 95 25 L 35 85" stroke="#ef4444" strokeWidth="5.5" strokeLinecap="round" />
            <path d="M 90 10 L 20 70 M 80 5 L 10 60 M 95 25 L 35 85" stroke="#f87171" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      )}

      {/* ゾンビの16ビットドット絵風SVG */}
      <svg
        viewBox="0 0 100 120"
        className="w-full h-full pixel-art filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.7)]"
      >
        {/* レトロなビジュアル陰影用のダークシャドウ */}
        <ellipse cx="50" cy="112" rx="27" ry="7" fill="rgba(0,0,0,0.5)" />

        <g id="zombie-character">
          {/* ゾンビのボロボロの髪の毛（奥） */}
          {action !== 'dead' && (
            <path
              d="M 45 10 C 35 5, 25 20, 28 32 C 32 20, 42 16, 45 15"
              fill="#1e293b"
            />
          )}

          {/* 両脚（がに股、骨ばっている） */}
          <g id="zombie-legs" fill={colors.clothes} stroke="#0f052d" strokeWidth="2">
            {action === 'dead' ? (
              <>
                <rect x="40" y="80" width="25" height="10" rx="2" fill="#3f6212" />
                <rect x="20" y="80" width="25" height="10" rx="2" fill="#3f6212" />
              </>
            ) : (
              <>
                {/* 左脚：ボロボロのズボン破れ（奥の脚） */}
                <path d="M 38 75 L 30 108 L 22 108 L 26 112 L 35 112 L 45 80 Z" />
                <rect x="25" y="90" width="6" height="10" fill={colors.skin} stroke="none" /> {/* 露出したゾンビ肉 */}

                {/* 右脚（手前） */}
                <path d="M 50 75 L 58 108 L 48 108 L 52 112 L 64 112 L 56 80 Z" />
                
                {/* 骨の露出描写 */}
                <line x1="53" y1="92" x2="57" y2="100" stroke="#f3f4f6" strokeWidth="2.5" />
                
                {/* 露出した腐敗足の指先 */}
                <rect x="24" y="109" width="10" height="4" fill={colors.skin} />
                <rect x="50" y="109" width="10" height="4" fill={colors.skin} />
              </>
            )}
          </g>

          {/* 胴体（破れた紫色の古着、胸に肋骨がむき出し） */}
          <g id="zombie-torso">
            <path
              d="M 32 45 L 62 48 L 55 80 L 30 78 Z"
              fill={colors.clothes}
              stroke="#0f052d"
              strokeWidth="2"
            />

            {/* ボロボロのダメージ痕穴 */}
            <circle cx="48" cy="58" r="4" fill="#1c0a35" />
            
            {/* むき出しのあばら骨（白のライン） */}
            {action !== 'dead' && (
              <g stroke="#f3f4f6" strokeWidth="2.5" strokeLinecap="round">
                <line x1="44" y1="55" x2="53" y2="55" />
                <line x1="43" y1="61" x2="51" y2="61" />
                <line x1="45" y1="67" x2="50" y2="67" />
              </g>
            )}

            {/* 胴体の血痕とうんちく緑色の液体 */}
            <circle cx="36" cy="66" r="3.5" fill={colors.accent} />
            <circle cx="39" cy="71" r="2" fill="#eab308" /> {/* 膿（うみ） */}
            <path d="M 33 60 L 37 68 L 33 64 Z" fill={colors.accent} />
          </g>

          {/* 頭部（凶悪な顔面、血走った目、剥き出しの歯） */}
          <g id="zombie-head" className={action === 'hurt' ? 'translate-y-[-6px] rotate-[15deg]' : ''}>
            {/* 後ろ髪・ただれた皮膚 */}
            <circle cx="48" cy="28" r="14" fill="#1e293b" stroke="#000" strokeWidth="2" />
            
            {/* 腐った皮（緑色） */}
            <rect x="38" y="18" width="17" height="18" rx="3" fill={colors.skin} stroke="#1a2e05" strokeWidth="1.5" />
            
            {/* ただれた紫のデコ痕 */}
            <path d="M 39 19 Q 44 24 49 19" fill={colors.accent} />

            {/* 血走った邪悪な目 */}
            {action === 'dead' ? (
              // 死亡時：黒い眼窩のみ
              <circle cx="43" cy="24" r="2.5" fill="#000" />
            ) : action === 'hurt' ? (
              // ダメージ時：目が飛び出る
              <g>
                <circle cx="42" cy="23" r="4.5" fill="#fee2e2" stroke="#ef4444" strokeWidth="1" />
                <circle cx="42" cy="23" r="1.5" fill="#f43f5e" />
              </g>
            ) : (
              // 通常時：血走ったギョロ目
              <g>
                <rect x="40" y="22" width="6" height="4.5" fill="#fee2e2" />
                <rect x="42" y="24" width="2.5" height="2.5" fill="#ef4444" /> {/* 赤色の瞳孔 */}
                <rect x="43" y="24" width="1" height="1" fill="#fff" /> {/* 光 */}
                {/* 怒りの太眉 */}
                <path d="M 39 20 L 46 22" stroke="#000" strokeWidth="2" />
              </g>
            )}

            {/* 剥き出しの牙・不気味な顎関節 */}
            {action === 'attack' ? (
              // 噛みつき時の超大口
              <g>
                <rect x="36" y="29" width="11" height="10" fill="#7f1d1d" rx="1" />
                {/* 尖った歯（ドット） */}
                <path d="M 37 29 L 38 32 L 39 29 L 41 32 L 42 29 L 44 32 L 45 29 L 46 32" stroke="#fff" strokeWidth="1.5" />
                <path d="M 37 39 L 38 36 L 40 39 L 41 36 L 43 39 L 44 36 L 46 39" stroke="#fff" strokeWidth="1.5" />
                {/* たれるよだれ */}
                <line x1="40" y1="38" x2="40" y2="44" stroke="#a3e635" strokeWidth="1.5" />
              </g>
            ) : action === 'hurt' ? (
              // ダメージ時：口が歪む
              <path d="M 36 29 Q 47 36 41 30" fill="none" stroke="#000" strokeWidth="3" />
            ) : (
              // 通常時：剥き出しの不気味な笑み
              <g>
                <rect x="38" y="29" width="8" height="5" fill="#000" />
                {/* 歯のドット */}
                <rect x="39" y="29" width="1.5" height="1.5" fill="#fff" />
                <rect x="41" y="29" width="1.5" height="1.5" fill="#fff" />
                <rect x="43" y="29" width="1.5" height="1.5" fill="#fff" />
                <rect x="40" y="32.5" width="1.5" height="1.5" fill="#fff" />
                <rect x="42" y="32.5" width="1.5" height="1.5" fill="#fff" />
                {/* たれる血 */}
                <line x1="39" y1="32" x2="39" y2="37" stroke="#7f1d1d" strokeWidth="2" />
              </g>
            )}
          </g>

          {/* 前腕・伸ばした手（手前） */}
          <g id="zombie-arms">
            {action === 'attack' ? (
              // 猛烈な爪とぎアタック（左向きに一気に伸ばす）
              <>
                <path
                  d="M 45 48 C 20 48, 10 52, 2 45"
                  fill="none"
                  stroke={colors.skin}
                  strokeWidth="11"
                  strokeLinecap="round"
                />
                <circle cx="2" cy="45" r="5" fill={colors.accent} />
                {/* 鋭い爪 */}
                <path d="M 2 45 L -7 42 M 2 45 L -8 47 M 2 45 L -6 51" stroke="#eab308" strokeWidth="2" />
              </>
            ) : action === 'dead' ? (
              <path d="M 45 48 Q 50 65 55 70" stroke={colors.skin} strokeWidth="6" strokeLinecap="round" />
            ) : (
              // 通常：うろつく様に前に這うゾンビの手
              <>
                <path
                  d="M 46 50 C 30 50, 22 42, 16 34"
                  fill="none"
                  stroke={colors.skin}
                  strokeWidth="10.5"
                  strokeLinecap="round"
                />
                {/* 破れた紫の袖口 */}
                <path d="M 46 50 L 36 50" stroke={colors.clothes} strokeWidth="12" />
                {/* むき出しの骨が袖から突き出ている */}
                <rect x="33" y="47" width="4" height="2.5" fill="#fff" transform="rotate(-15 33 47)" />
                {/* 腐った手首、爪 */}
                <circle cx="16" cy="34" r="5" fill={colors.skin} />
                <path d="M 16 34 L 11 29 M 16 34 L 8 34 M 16 34 L 10 39" stroke="#fee2e2" strokeWidth="1.5" />
              </>
            )}
          </g>
        </g>
      </svg>
    </div>
  );
}
