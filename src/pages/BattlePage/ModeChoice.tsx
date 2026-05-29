import { useState, useMemo } from 'react';
import { WORDS, CAT_INFO } from '../../data/gameData';
import type { Word } from '../../types';

interface ModeChoiceProps {
  word: Word;
  allWords: Word[];
  onCorrect: () => void;
  onWrong: () => void;
  onNext: () => void;
  onSpeak: (word: string) => void;
}

const LETTERS = ['A', 'B', 'C', 'D'];

export default function ModeChoice({ word, allWords, onCorrect, onWrong, onNext, onSpeak }: ModeChoiceProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const options = useMemo(() => {
    const wrong = allWords.filter(x => x.id !== word.id).sort(() => Math.random() - 0.5).slice(0, 3);
    return [word, ...wrong].sort(() => Math.random() - 0.5);
  }, [word.id]); // eslint-disable-line

  const catInfo = CAT_INFO[word.cat] || { icon: '📝', name: word.cat };

  function handleAnswer(idx: number) {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (options[idx].id === word.id) onCorrect(); else onWrong();
  }

  function getOptStyle(idx: number): React.CSSProperties {
    if (!answered) return {};
    if (options[idx].id === word.id) return { background: '#DCFCE7', borderColor: '#22C55E', color: '#22C55E' };
    if (idx === selected) return { background: '#FEE2E2', borderColor: '#EF4444', color: '#EF4444' };
    return {};
  }

  return (
    <>
      <div style={{ background: '#fff', borderRadius: 20, padding: 20, textAlign: 'center', marginBottom: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
        <div style={{ fontSize: 10, background: '#A8EDEA', color: '#2BB5AC', padding: '3px 10px', borderRadius: 20, marginBottom: 10, display: 'inline-block' }}>{catInfo.icon} {catInfo.name}</div>
        <div style={{ fontFamily: 'var(--font-game)', fontSize: 26, fontWeight: 900, color: '#1E293B', letterSpacing: -1 }}>{word.word}</div>
        <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 4 }}>{word.phonetic}</div>
        {/* 🔊 發音按鈕 */}
        <button
          onClick={() => onSpeak(word.word)}
          style={{
            marginTop: 10, background: 'none', border: '1.5px solid #A8EDEA',
            borderRadius: 20, padding: '4px 16px', cursor: 'pointer',
            fontSize: 13, color: '#2BB5AC', fontFamily: 'var(--font-zh)',
          }}
        >
          🔊 發音
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 10 }}>
        {options.map((opt, i) => (
          <div
            key={i}
            className={`choice-opt${answered ? ' disabled' : ''}`}
            style={getOptStyle(i)}
            onClick={() => handleAnswer(i)}
          >
            <div className="opt-letter">{LETTERS[i]}</div>
            {opt.meaning}
          </div>
        ))}
      </div>

      {answered && (
        <>
          <div
            className={`choice-feedback ${options[selected!]?.id === word.id ? 'ok' : 'bad'}`}
            style={{ display: 'block' }}
          >
            {options[selected!]?.id === word.id ? '✅ 答對了！' : `❌ 答錯了！正確答案：${word.meaning}`}
          </div>
          <button className="battle-next-btn" style={{ display: 'block' }} onClick={onNext}>下一題 →</button>
        </>
      )}
    </>
  );
}
