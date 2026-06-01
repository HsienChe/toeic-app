import { useEffect, useState } from 'react';

interface StartScreenProps {
  onStart: () => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`ss-wrap ${visible ? 'ss-wrap--in' : ''}`}>

      {/* ── 天空層 ── */}
      <div className="ss-sky">
        {/* 雲朵 */}
        <div className="ss-cloud ss-cloud-a" />
        <div className="ss-cloud ss-cloud-b" />
        <div className="ss-cloud ss-cloud-c" />
        <div className="ss-cloud ss-cloud-d" />
        {/* 星星 */}
        {[...Array(10)].map((_, i) => (
          <span key={i} className={`ss-star ss-star-${i}`}>✦</span>
        ))}
      </div>

      {/* ── Logo 盾牌 ── */}
      <div className="ss-logo">
        <div className="ss-shield">
          <div className="ss-shield-sword">🗡️</div>
          <div className="ss-shield-titles">
            <span className="ss-t1">擊退</span>
            <span className="ss-t2">英文單字</span>
            <span className="ss-t3">怪獸！</span>
          </div>
        </div>
        <div className="ss-tagline">成為最強的單字冒險者！</div>
      </div>

      {/* ── 中景：山脈 + 城堡 ── */}
      <div className="ss-midground">
        {/* 山脈 SVG */}
        <svg className="ss-mountains" viewBox="0 0 480 120" preserveAspectRatio="none">
          <polygon points="0,120 60,40 120,80 180,20 240,70 300,10 360,60 420,30 480,80 480,120" fill="#4a9e6b" opacity="0.5"/>
          <polygon points="0,120 80,55 160,90 230,35 300,75 370,25 440,65 480,45 480,120" fill="#5ab87a" opacity="0.6"/>
        </svg>
        {/* 城堡 */}
        <div className="ss-castle-wrap">
          <div className="ss-castle">🏰</div>
        </div>
      </div>

      {/* ── 草地 + 路徑層 ── */}
      <div className="ss-ground">
        {/* 路徑 */}
        <svg className="ss-path" viewBox="0 0 480 80" preserveAspectRatio="none">
          <path d="M 180,0 Q 220,40 200,80 L 280,80 Q 260,40 300,0 Z" fill="#c8a96e" opacity="0.7"/>
          <path d="M 195,0 Q 232,38 212,80 L 268,80 Q 248,38 285,0 Z" fill="#d4b87a" opacity="0.5"/>
        </svg>

        {/* 左側怪獸群 */}
        <div className="ss-left-monsters">
          <div className="ss-mob ss-mob-1">
            <span className="ss-mob-body">🫐</span>
          </div>
          <div className="ss-mob ss-mob-2">
            <span className="ss-mob-body">🌿</span>
          </div>
          <div className="ss-mob ss-mob-3">
            <span className="ss-mob-body">👾</span>
          </div>
        </div>

        {/* 右側主角 + 暴龍 */}
        <div className="ss-right-hero">
          <div className="ss-hero-trex">
            <span>🦖</span>
          </div>
          <div className="ss-hero-sword">
            <span>⚔️</span>
          </div>
        </div>

        {/* 花草裝飾 */}
        <span className="ss-deco ss-deco-1">🌸</span>
        <span className="ss-deco ss-deco-2">🌼</span>
        <span className="ss-deco ss-deco-3">🍀</span>
        <span className="ss-deco ss-deco-4">🌺</span>
      </div>

      {/* ── 開始按鈕 ── */}
      <button className="ss-btn" onClick={onStart}>
        <span className="ss-btn-gem">✦</span>
        開始冒險
        <span className="ss-btn-gem">✦</span>
      </button>

    </div>
  );
}
