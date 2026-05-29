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
    <div className={`start-screen ${visible ? 'start-screen--visible' : ''}`}>
      <div className="start-bg" />
      <div className="start-cloud start-cloud--1" />
      <div className="start-cloud start-cloud--2" />
      <div className="start-cloud start-cloud--3" />
      <div className="start-stars">
        {[...Array(8)].map((_, i) => (
          <div key={i} className={`start-star start-star--${i + 1}`}>✦</div>
        ))}
      </div>

      <div className="start-logo-wrap">
        <div className="start-shield">
          <div className="start-sword">🗡️</div>
          <div className="start-title-box">
            <span className="start-title-line1">擊退</span>
            <span className="start-title-line2">英文單字</span>
            <span className="start-title-line3">怪獸！</span>
          </div>
        </div>
        <div className="start-banner">成為最強的單字冒險者！</div>
      </div>

      <div className="start-scene">
        <div className="start-castle">🏰</div>
        <div className="start-monsters">
          <span className="start-monster start-monster--blue">🫐</span>
          <span className="start-monster start-monster--green">🌿</span>
          <span className="start-monster start-monster--purple">👾</span>
        </div>
        {/* 劍+紫色怪獸並排 */}
        <div className="start-hero-group">
          <span className="start-hero-monster">🐉</span>
          <span className="start-hero-sword">⚔️</span>
        </div>
      </div>

      <button className="start-btn" onClick={onStart}>
        <span className="start-btn-diamond">✦</span>
        開始冒險
        <span className="start-btn-diamond">✦</span>
      </button>
    </div>
  );
}