import { COUNTRIES } from '../../data/gameData';

interface VictoryScreenProps {
  monsterEmoji: string;
  correct: number;
  total: number;
  xpGained: number;
  maxCombo: number;
  country: string;
  onBack: () => void;
  onRestart: () => void;
}

export default function VictoryScreen({ monsterEmoji, correct, total, xpGained, maxCombo, country, onBack, onRestart }: VictoryScreenProps) {
  const c = COUNTRIES[country];
  return (
    <div className="victory-screen">
      <div className="victory-monster">{monsterEmoji}</div>
      <div className="victory-title">成功擊退怪獸！</div>
      <div className="victory-stats">
        <div className="victory-stat-row"><span>🎯 答對題數</span><span>{correct} / {total}</span></div>
        <div className="victory-stat-row"><span>⭐ 獲得 EXP</span><span>+{xpGained}</span></div>
        <div className="victory-stat-row"><span>🔥 最高 Combo</span><span>{maxCombo}</span></div>
        {c && <div className="victory-stat-row"><span>🌏 國家</span><span>{c.flag} {c.name}</span></div>}
      </div>
      <div className="victory-btns">
        <button className="victory-btn victory-btn-primary" onClick={onBack}>回地圖</button>
        <button className="victory-btn victory-btn-secondary" onClick={onRestart}>再來一次</button>
      </div>
    </div>
  );
}
