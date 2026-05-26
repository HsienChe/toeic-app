import { useRef } from 'react';
import { getMonsterSVG } from '../../data/gameData';

interface MonsterAreaProps {
  monsterType: string;
  monsterName: string;
  hp: number;
  maxHp: number;
  shakeType: 'shake' | 'heal' | null;
  damageText: string | null;
}

export default function MonsterArea({ monsterType, monsterName, hp, maxHp, shakeType, damageText }: MonsterAreaProps) {
  const hpPct = maxHp > 0 ? (hp / maxHp) * 100 : 100;

  return (
    <div className="monster-area">
      <div className="monster-hp-wrap">
        <div className="monster-hp-label">
          <span>{monsterName}</span>
          <span>{hp}/{maxHp}</span>
        </div>
        <div className="monster-hp-bar">
          <div className="monster-hp-fill" style={{ width: `${hpPct}%` }} />
        </div>
      </div>

      <div className={`monster-svg-wrap${shakeType ? ` ${shakeType}` : ''}`} id="monster-wrap">
        {damageText && (
          <div className="damage-popup" style={{ display: 'block' }}>{damageText}</div>
        )}
  <div 
  dangerouslySetInnerHTML={{ __html: getMonsterSVG(monsterType) }} 
  style={{ width: '100%', height: '100%', display: 'block' }}
/>
      </div>

      <div className="monster-name">{monsterName}</div>
    </div>
  );
}
