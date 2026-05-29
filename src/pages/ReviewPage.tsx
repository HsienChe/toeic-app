import { useState } from 'react';
import type { Word } from '../types';

interface ReviewPageProps {
  wrongWords: Word[];
  onRemove: (id: number) => void;
  onChallenge: (words: Word[]) => void;
}

export default function ReviewPage({ wrongWords, onRemove, onChallenge }: ReviewPageProps) {
  const [selected, setSelected] = useState<number[]>([]);

  function toggleSelect(id: number) {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }

  function handleSelectAll() {
    if (selected.length === wrongWords.length) {
      setSelected([]);
    } else {
      setSelected(wrongWords.map(w => w.id));
    }
  }

  function handleChallenge() {
    const selectedWords = wrongWords.filter(w => selected.includes(w.id));
    if (selectedWords.length > 0) {
      onChallenge(selectedWords);
      setSelected([]);
    }
  }

  return (
    <div className="page" id="page-review">
      <div className="review-container">
        <div className="section-title">📖 錯題複習</div>
        <div className="section-sub">這些單字你答錯過，一起來征服它們！</div>

        {wrongWords.length === 0 ? (
          <div className="review-empty">
            <div className="re-icon">✅</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-800)', marginBottom: 4 }}>沒有錯題！</div>
            <div style={{ fontSize: 13 }}>繼續保持，太厲害了！</div>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid var(--gray-100)' }}>
              <input
                type="checkbox"
                checked={selected.length === wrongWords.length && wrongWords.length > 0}
                onChange={handleSelectAll}
                style={{ width: 18, height: 18, cursor: 'pointer' }}
              />
              <span style={{ fontSize: 13, color: 'var(--gray-600)' }}>
                全選 ({selected.length}/{wrongWords.length})
              </span>
            </div>

            {wrongWords.map(w => (
              <div key={w.id} className="review-word-card">
                <input
                  type="checkbox"
                  checked={selected.includes(w.id)}
                  onChange={() => toggleSelect(w.id)}
                  style={{ width: 18, height: 18, cursor: 'pointer', flexShrink: 0 }}
                />
                <div style={{ flex: 1 }}>
                  <div className="rw-word">{w.word}</div>
                  <div className="rw-meaning">{w.meaning}</div>
                </div>
                <button className="rw-remove" onClick={() => onRemove(w.id)}>移除 ✓</button>
              </div>
            ))}

            {selected.length > 0 && (
              <button
                className="challenge-btn-batch"
                onClick={handleChallenge}
              >
                再次挑戰 ({selected.length}) ⚔️
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
