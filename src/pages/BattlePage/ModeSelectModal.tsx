import type { BattleMode } from '../../types';

interface ModeSelectModalProps {
  title: string;
  subtitle: string;
  onSelect: (mode: BattleMode) => void;
  onClose: () => void;
}

const MODES: { id: BattleMode; icon: string; name: string; desc: string; cls: string }[] = [
  { id: 'flip',   icon: '🃏', name: '翻牌模式', desc: '翻牌看意思，記得就攻擊！', cls: 'mode-flip' },
  { id: 'choice', icon: '🎯', name: '選擇題',   desc: '四選一，考驗你的記憶！',   cls: 'mode-choice' },
  { id: 'fill',   icon: '✍️', name: '填空模式', desc: '看例句，填入正確單字！',   cls: 'mode-fill' },
  { id: 'mix',    icon: '🌀', name: '混合模式', desc: '三種模式交錯，最強挑戰！', cls: 'mode-mix' },
];

export default function ModeSelectModal({ title, subtitle, onSelect, onClose }: ModeSelectModalProps) {
  return (
    <div className="mode-select" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="mode-panel">
        <div className="mode-panel-title">{title}</div>
        <div className="mode-panel-sub">{subtitle}</div>
        <div className="mode-btns">
          {MODES.map(m => (
            <button key={m.id} className={`mode-btn ${m.cls}`} onClick={() => onSelect(m.id)}>
              <div className="mode-icon">{m.icon}</div>
              <div className="mode-name">{m.name}</div>
              <div className="mode-desc">{m.desc}</div>
            </button>
          ))}
        </div>
        <button className="mode-cancel" onClick={onClose}>取消</button>
      </div>
    </div>
  );
}
