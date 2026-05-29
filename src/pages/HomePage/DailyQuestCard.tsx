interface DailyQuestCardProps {
  goal: number;
  todayKilled: number;
  maxCombo: number;
  stamina?: number;
  isDailyDone: boolean;
  onClick: () => void;
}

export default function DailyQuestCard({
  goal, todayKilled, maxCombo, stamina = 5, isDailyDone, onClick,
}: DailyQuestCardProps) {
  return (
    <div className="card quest-card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="quest-header">
        <div className="card-title">⚔️ 今日任務</div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {isDailyDone && (
            <div style={{
              background: 'var(--green-light)', color: 'var(--green)',
              borderRadius: 20, padding: '3px 10px',
              fontSize: 11, fontFamily: 'var(--font-game)', fontWeight: 700,
            }}>
              ✅ 已完成
            </div>
          )}
          <div className="stamina-badge">⚡ 體力 {stamina}/5</div>
        </div>
      </div>
      <div className="quest-stats">
        <div className="quest-stat">
          <div className="qs-num">{goal}</div>
          <div className="qs-lbl">每日目標</div>
        </div>
        <div className="quest-stat">
          <div className="qs-num">{todayKilled}</div>
          <div className="qs-lbl">今日擊退</div>
        </div>
        <div className="quest-stat highlight">
          <div className="qs-num">{maxCombo}</div>
          <div className="qs-lbl">連擊 Combo</div>
        </div>
      </div>
      {/* 進度條 */}
      <div style={{ marginTop: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--gray-400)', marginBottom: 4 }}>
          <span>今日進度</span>
          <span>{Math.min(todayKilled, goal)} / {goal}</span>
        </div>
        <div style={{ background: 'var(--gray-200)', borderRadius: 6, height: 8, overflow: 'hidden' }}>
          <div style={{
            background: isDailyDone
              ? 'var(--green)'
              : 'linear-gradient(90deg, var(--ocean), var(--grass))',
            height: '100%', borderRadius: 6,
            width: `${Math.min((todayKilled / Math.max(goal, 1)) * 100, 100)}%`,
            transition: 'width .5s ease',
          }} />
        </div>
      </div>
    </div>
  );
}
