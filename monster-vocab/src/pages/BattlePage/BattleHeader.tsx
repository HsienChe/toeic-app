interface BattleHeaderProps {
  progress: number; // 0-100
  progText: string;
  combo: number;
  onExit: () => void;
}

export default function BattleHeader({ progress, progText, combo, onExit }: BattleHeaderProps) {
  return (
    <div className="battle-header">
      <button className="battle-back" onClick={onExit}>← 離開</button>
      <div className="battle-info">
        <div className="battle-progress-bar">
          <div className="battle-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="battle-prog-text">{progText}</div>
      </div>
      <div className={`combo-badge${combo > 2 ? ' pop' : ''}`} style={{ background: combo > 2 ? 'var(--coral)' : 'rgba(0,0,0,0.3)' }}>
        Combo x<span>{combo}</span>
      </div>
    </div>
  );
}
