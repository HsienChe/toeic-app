import type { Word, WordMastery } from '../../types';

interface DangerZoneProps {
  words: Word[];
  masteryMap: Record<number, WordMastery>;
  onWordClick: (word: Word) => void;
}

export default function DangerZone({ words, masteryMap, onWordClick }: DangerZoneProps) {
  // 錯誤 >= 3 次的單字
  const dangerWords = words
    .filter(w => (masteryMap[w.id]?.wrongCount ?? 0) >= 3)
    .sort((a, b) => (masteryMap[b.id]?.wrongCount ?? 0) - (masteryMap[a.id]?.wrongCount ?? 0))
    .slice(0, 20);

  if (dangerWords.length === 0) return null;

  return (
    <div style={{
      margin: '16px 0',
      background: 'linear-gradient(135deg, #fff1f2, #fff8f0)',
      border: '1.5px solid #fca5a5',
      borderRadius: 16,
      padding: '16px',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 22 }}>⚠️</span>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#9f1239' }}>危險單字區</div>
          <div style={{ fontSize: 12, color: '#f87171' }}>這些單字需要加強！</div>
        </div>
        <div style={{
          marginLeft: 'auto',
          background: '#ef4444',
          color: '#fff',
          borderRadius: 20,
          padding: '2px 10px',
          fontSize: 12,
          fontWeight: 700,
        }}>
          {dangerWords.length} 個
        </div>
      </div>

      {/* 危險單字列表 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {dangerWords.map(word => {
          const m = masteryMap[word.id];
          const wrongCount = m?.wrongCount ?? 0;
          return (
            <div
              key={word.id}
              onClick={() => onWordClick(word)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#fff',
                border: '1px solid #fca5a5',
                borderRadius: 10,
                padding: '10px 14px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.background = '#fff1f2';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.background = '#fff';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18 }}>☠️</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1f2937' }}>{word.word}</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>{word.meaning}</div>
                </div>
              </div>
              <div style={{
                background: '#fee2e2',
                color: '#ef4444',
                borderRadius: 8,
                padding: '3px 10px',
                fontSize: 12,
                fontWeight: 700,
                whiteSpace: 'nowrap',
              }}>
                錯誤 {wrongCount} 次
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
