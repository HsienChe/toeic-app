import { useState } from 'react';
import { CAT_INFO } from '../../data/gameData';
import type { Word } from '../../types';

interface ModeFlipProps {
  word: Word;
  onCorrect: () => void;
  onWrong: () => void;
  onNext: () => void;
  onSpeak: (word: string) => void;
}

export default function ModeFlip({ word, onCorrect, onWrong, onNext, onSpeak }: ModeFlipProps) {
  const [flipped, setFlipped] = useState(false);
  const [answered, setAnswered] = useState(false);

  const catInfo = CAT_INFO[word.cat] || { icon: '📝', name: word.cat };

  function handleRate(knew: boolean) {
    if (answered || !flipped) return;
    setAnswered(true);
    if (knew) onCorrect(); else onWrong();
  }

  return (
    <>
      <div style={{ perspective: 1000, cursor: 'pointer', marginBottom: 12, paddingTop: 14 }} onClick={() => !answered && setFlipped(f => !f)}>
       <div
  style={{
    width: '100%', height: 180, position: 'relative',
    transformStyle: 'preserve-3d', transition: 'transform .5s',
    transform: flipped ? 'rotateY(180deg)' : '',
  }}
>
          {/* Front */}
          <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', borderRadius: 20, padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
            <div style={{ fontSize: 10, background: '#A8EDEA', color: '#2BB5AC', padding: '3px 10px', borderRadius: 20, marginBottom: 10 }}>{catInfo.icon} {catInfo.name}</div>
            <div style={{ fontFamily: 'var(--font-game)', fontSize: 30, fontWeight: 900, color: '#1E293B', letterSpacing: -1 }}>{word.word}</div>
            <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 4 }}>{word.phonetic}</div>
            {/* 🔊 發音按鈕 */}
            <button
              onClick={e => { e.stopPropagation(); onSpeak(word.word); }}
              style={{
                marginTop: 10, background: 'none', border: '1.5px solid #A8EDEA',
                borderRadius: 20, padding: '4px 16px', cursor: 'pointer',
                fontSize: 13, color: '#2BB5AC', fontFamily: 'var(--font-zh)',
              }}
            >
              🔊 發音
            </button>
            <div style={{ fontSize: 11, color: '#CBD5E1', marginTop: 10 }}>點擊翻牌查看意思 👆</div>
          </div>
          {/* Back */}
          <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', borderRadius: 20, padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: 'linear-gradient(135deg,#E8F7FF,#D4F1F4)', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
            <div style={{ fontSize: 10, background: '#A8EDEA', color: '#2BB5AC', padding: '3px 10px', borderRadius: 20, marginBottom: 10 }}>{catInfo.icon} {catInfo.name}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1E293B', marginBottom: 8 }}>{word.meaning}</div>
            {word.example && <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.7, fontStyle: 'italic' }}>"{word.example}"</div>}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
        <button
          onClick={() => handleRate(false)}
          disabled={!flipped || answered}
          style={{ background: '#FEE2E2', color: '#EF4444', border: '2px solid #EF4444', borderRadius: 16, padding: 12, fontSize: 13, fontFamily: 'var(--font-zh)', cursor: 'pointer', fontWeight: 600, opacity: !flipped || answered ? 0.4 : 1 }}
        >
          😵 不會
        </button>
        <button
          onClick={() => handleRate(true)}
          disabled={!flipped || answered}
          style={{ background: '#DCFCE7', color: '#22C55E', border: '2px solid #22C55E', borderRadius: 16, padding: 12, fontSize: 13, fontFamily: 'var(--font-zh)', cursor: 'pointer', fontWeight: 600, opacity: !flipped || answered ? 0.4 : 1 }}
        >
          ✅ 我知道！
        </button>
      </div>

      {answered && (
        <button className="battle-next-btn" style={{ display: 'block' }} onClick={onNext}>下一題 →</button>
      )}
    </>
  );
}
