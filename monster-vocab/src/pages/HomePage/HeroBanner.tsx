import { getLvXP, getTitle } from '../../utils/xpUtils';

interface HeroBannerProps {
  level: number;
  xp: number;
}

export default function HeroBanner({ level, xp }: HeroBannerProps) {
  const lvxp = getLvXP(xp);
  return (
    <div className="home-hero">
      <div className="hero-title">擊退英文單字怪獸！</div>
      <div className="hero-subtitle">澳洲冒險 × TOEIC 單字 × RPG 練習</div>
      <div className="hero-level-row">
        <div className="level-badge">
          <div className="lv-num">{level}</div>
          <div className="lv-lbl">Level</div>
        </div>
        <div className="exp-section">
          <div className="exp-label">
            <span>EXP</span>
            <span>{lvxp.cur} / {lvxp.max}</span>
          </div>
          <div className="exp-bar">
            <div className="exp-fill" style={{ width: `${lvxp.pct}%` }} />
          </div>
        </div>
      </div>
      <div className="title-badge">{getTitle(level)}</div>
    </div>
  );
}
