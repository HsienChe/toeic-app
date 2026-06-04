import { useState } from 'react';
import { WORDS } from '../../data/gameData';
import type { Word, CatInfo, WordMastery, GameState } from '../../types';

interface FlashCardStudyProps {
  cat: string;
  catInfo: CatInfo;
  customWords: Word[];
  wordBankWords: Word[];
  state: GameState;
  onFinish: () => void;
  onBack: () => void;
}

export default function FlashCardStudy({ cat, catInfo, customWords, wordBankWords, state, onFinish, onBack }: FlashCardStudyProps) {
  const { masteryMap = {}, fluentWords = [] } = state;
  const fluentSet = new Set(fluentWords);

  const allWords = [...WORDS, ...wordBankWords, ...customWords];
  const catWords = allWords.filter(w => w.cat === cat);

  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [seen, setSeen] = useState<Set<number>>(new Set());

  if (catWords.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
        <div style={{ fontSize: 15, color: '#6b7280', marginBottom: 20 }}>這個類別目前沒有單字</div>
        <button onClick={onBack} style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: '#6b7280' + '20', color: '#6b7280', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>← 返回</button>
      </div>
    );
  }

  const current = catWords[cardIdx];
  const progress = Math.round(((cardIdx + 1) / catWords.length) * 100);
  const allSeen = seen.size >= catWords.length;

  function getWordStatus(wordId: number): string {
    if (fluentSet.has(wordId)) return 'fluent';
    const m = masteryMap[wordId];
    if (!m || m.level === 0) return 'new';
    return m.status;
  }

  function handleFlip() {
    setFlipped(f => !f);
    if (!flipped) setSeen(s => new Set([...s, current.id]));
  }

  function handlePrev() {
    if (cardIdx > 0) { setCardIdx(i => i - 1); setFlipped(false); }
  }

  function handleNext() {
    if (cardIdx < catWords.length - 1) { setCardIdx(i => i + 1); setFlipped(false); }
  }

  const STATUS_DOT: Record<string, string> = {
    new: '#9ca3af', learning: '#f59e0b', weak: '#ef4444', mastered: '#10b981', fluent: '#8b5cf6',
  };
  const STATUS_LABEL: Record<string, string> = {
    new: '未學習', learning: '學習中', weak: '⚠危險', mastered: '精通', fluent: '🌟爛熟',
  };

  const cardFaceStyle: React.CSSProperties = {
    position: 'absolute', inset: 0, borderRadius: 20,
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    padding: '24px 28px', textAlign: 'center',
    backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
  };

  return (
    <div style={{ padding: '16px', paddingBottom: 120, maxWidth: 480, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#6b7280', padding: '4px 8px' }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#1f2937' }}>{catInfo.icon} {catInfo.name} — 背誦單字</div>
          <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>翻開每張卡片，熟悉後就可以開始挑戰！</div>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: '#6b7280' }}>{cardIdx + 1} / {catWords.length}</span>
          <span style={{ fontSize: 12, color: '#6366f1', fontWeight: 600 }}>已翻開 {seen.size} 張</span>
        </div>
        <div style={{ background: '#e5e7eb', borderRadius: 20, height: 8, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg, ${catInfo.color}, ${catInfo.color}cc)`, borderRadius: 20, transition: 'width 0.3s ease' }} />
        </div>
      </div>

      <div onClick={handleFlip} style={{ perspective: '1000px', marginBottom: 20, cursor: 'pointer', userSelect: 'none' }}>
        <div style={{ position: 'relative', width: '100%', height: 220, transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)', transition: 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)' }}>
          <div style={{ ...cardFaceStyle, background: `linear-gradient(135deg, ${catInfo.bg}, #fff)`, border: `2px solid ${catInfo.color}40` }}>
            <div style={{ fontSize: 11, color: catInfo.color, fontWeight: 700, marginBottom: 12, letterSpacing: 2, textTransform: 'uppercase' }}>{catInfo.icon} {catInfo.name}</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#1f2937', marginBottom: 8, letterSpacing: 1 }}>{current.word}</div>
            <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 16 }}>{current.phonetic}</div>
            <div style={{ fontSize: 12, color: catInfo.color, background: catInfo.color + '15', padding: '6px 14px', borderRadius: 20, fontWeight: 600 }}>👆 點擊翻面查看</div>
          </div>
          <div style={{ ...cardFaceStyle, transform: 'rotateY(180deg)', background: 'linear-gradient(135deg, #1e293b, #334155)', border: '2px solid #475569' }}>
            <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>中文意思</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#f8fafc', marginBottom: 14 }}>{current.meaning}</div>
            {current.example && (
              <>
                <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 6 }}>例句</div>
                <div style={{ fontSize: 13, color: '#e2e8f0', fontStyle: 'italic', lineHeight: 1.6, background: 'rgba(255,255,255,0.07)', borderRadius: 10, padding: '8px 12px' }}>
                  {current.example.replace('______', `[${current.word}]`)}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <button onClick={handlePrev} disabled={cardIdx === 0} style={{ flex: 1, padding: '12px 0', borderRadius: 12, border: 'none', background: cardIdx === 0 ? '#f3f4f6' : '#e0e7ff', color: cardIdx === 0 ? '#d1d5db' : '#6366f1', fontWeight: 700, fontSize: 15, cursor: cardIdx === 0 ? 'not-allowed' : 'pointer' }}>← 上一張</button>
        <button onClick={handleNext} disabled={cardIdx === catWords.length - 1} style={{ flex: 1, padding: '12px 0', borderRadius: 12, border: 'none', background: cardIdx === catWords.length - 1 ? '#f3f4f6' : '#e0e7ff', color: cardIdx === catWords.length - 1 ? '#d1d5db' : '#6366f1', fontWeight: 700, fontSize: 15, cursor: cardIdx === catWords.length - 1 ? 'not-allowed' : 'pointer' }}>下一張 →</button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 10 }}>📋 本類別單字一覽</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {catWords.map((w, i) => {
            const wStatus = getWordStatus(w.id);
            const dotColor = STATUS_DOT[wStatus] ?? '#9ca3af';
            return (
              <div key={w.id} onClick={() => { setCardIdx(i); setFlipped(false); }}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: i === cardIdx ? catInfo.color + '12' : '#f9fafb', border: `1.5px solid ${i === cardIdx ? catInfo.color + '50' : '#e5e7eb'}`, borderRadius: 10, cursor: 'pointer' }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, background: seen.has(w.id) ? '#10b981' : '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#fff', fontWeight: 700 }}>
                  {seen.has(w.id) ? '✓' : i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#1f2937' }}>{w.word}</span>
                  <span style={{ fontSize: 12, color: '#6b7280', marginLeft: 8 }}>{w.meaning}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: dotColor }} />
                  <span style={{ fontSize: 10, color: dotColor, fontWeight: 600 }}>{STATUS_LABEL[wStatus]}</span>
                </div>
                {i === cardIdx && <span style={{ fontSize: 11, color: catInfo.color, fontWeight: 600 }}>查看中</span>}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ position: 'sticky', bottom: 16, background: '#fff', borderTop: '1px solid #f3f4f6', paddingTop: 12 }}>
        {!allSeen && (
          <div style={{ fontSize: 12, color: '#f59e0b', textAlign: 'center', marginBottom: 8, fontWeight: 600 }}>
            💡 翻開所有 {catWords.length} 張卡片後即可解鎖挑戰
          </div>
        )}
        <button onClick={onFinish} disabled={!allSeen}
          style={{ width: '100%', padding: '14px 0', borderRadius: 14, border: 'none', background: allSeen ? `linear-gradient(135deg, ${catInfo.color}, ${catInfo.color}cc)` : '#e5e7eb', color: allSeen ? '#fff' : '#9ca3af', fontSize: 16, fontWeight: 800, cursor: allSeen ? 'pointer' : 'not-allowed', transition: 'all 0.3s', boxShadow: allSeen ? `0 4px 20px ${catInfo.color}50` : 'none' }}>
          {allSeen ? '🎯 選擇口音，開始挑戰！' : `📖 還有 ${catWords.length - seen.size} 張未翻開`}
        </button>
      </div>
    </div>
  );
}
