import { useState, useMemo } from 'react';
import { WORDS } from '../../data/gameData';
import type { Word, CatInfo, WordMastery, GameState } from '../../types';

interface CatGlossaryProps {
  cat: string;
  catInfo: CatInfo;
  customWords: Word[];
  wordBankWords: Word[];
  state: GameState;
  onStudy: () => void;
  onBack: () => void;
}

const STATUS_TABS = [
  { id: 'all',      label: '全部',     icon: '📚' },
  { id: 'new',      label: '未學習',   icon: '🔒' },
  { id: 'learning', label: '學習中',   icon: '📖' },
  { id: 'weak',     label: '危險',     icon: '⚠️' },
  { id: 'mastered', label: '精通',     icon: '✅' },
  { id: 'fluent',   label: '滾瓜爛熟', icon: '🌟' },
];

const STATUS_COLOR: Record<string, { text: string; bg: string; border: string }> = {
  new:      { text: '#9ca3af', bg: '#f9fafb', border: '#e5e7eb' },
  learning: { text: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
  weak:     { text: '#ef4444', bg: '#fff1f2', border: '#fca5a5' },
  mastered: { text: '#10b981', bg: '#ecfdf5', border: '#6ee7b7' },
  fluent:   { text: '#8b5cf6', bg: '#faf5ff', border: '#c4b5fd' },
};

const STATUS_LABEL: Record<string, string> = {
  new: '未學習', learning: '學習中', weak: '⚠ 危險',
  mastered: '精通', fluent: '🌟 滾瓜爛熟',
};

function getWordStatus(wordId: number, masteryMap: Record<number, WordMastery>, fluentSet: Set<number>): string {
  if (fluentSet.has(wordId)) return 'fluent';
  const m = masteryMap[wordId];
  if (!m || m.level === 0) return 'new';
  return m.status;
}

function MasteryStars({ level, isFluent }: { level: number; isFluent: boolean }) {
  const l = isFluent ? 3 : level;
  return (
    <span style={{ fontSize: 12, letterSpacing: 1 }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{ color: i < l ? '#f59e0b' : '#e5e7eb' }}>★</span>
      ))}
    </span>
  );
}

export default function CatGlossary({ cat, catInfo, customWords, wordBankWords, state, onStudy, onBack }: CatGlossaryProps) {
  const { masteryMap = {}, fluentWords = [] } = state;
  const fluentSet = new Set(fluentWords);

  const allWords = [...WORDS, ...wordBankWords, ...customWords];
  const catWords = allWords.filter(w => w.cat === cat);

  const [statusFilter, setStatusFilter] = useState('all');

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: catWords.length, new: 0, learning: 0, weak: 0, mastered: 0, fluent: 0 };
    catWords.forEach(w => { const s = getWordStatus(w.id, masteryMap, fluentSet); c[s] = (c[s] || 0) + 1; });
    return c;
  }, [catWords, masteryMap, fluentSet]);

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return catWords;
    return catWords.filter(w => getWordStatus(w.id, masteryMap, fluentSet) === statusFilter);
  }, [catWords, statusFilter, masteryMap, fluentSet]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '16px 16px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#6b7280', padding: '4px 8px', flexShrink: 0 }}>←</button>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#1f2937' }}>{catInfo.icon} {catInfo.name}</div>
            <div style={{ fontSize: 12, color: '#9ca3af' }}>共 {catWords.length} 個單字</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, marginBottom: 12 }}>
          {(['new', 'learning', 'weak', 'mastered', 'fluent'] as const).map(s => {
            const cfg = STATUS_COLOR[s];
            return (
              <div key={s} onClick={() => setStatusFilter(statusFilter === s ? 'all' : s)}
                style={{ background: statusFilter === s ? cfg.bg : '#f9fafb', border: `1.5px solid ${statusFilter === s ? cfg.border : '#e5e7eb'}`, borderRadius: 10, padding: '6px 4px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s' }}>
                <div style={{ fontSize: 16 }}>{STATUS_TABS.find(t => t.id === s)?.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: cfg.text }}>{counts[s] ?? 0}</div>
                <div style={{ fontSize: 9, color: '#9ca3af', fontWeight: 500, lineHeight: 1.2 }}>{STATUS_LABEL[s]}</div>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 10, scrollbarWidth: 'none' }}>
          {STATUS_TABS.map(t => (
            <button key={t.id} onClick={() => setStatusFilter(t.id)}
              style={{ flexShrink: 0, padding: '5px 12px', borderRadius: 20, border: `1.5px solid ${statusFilter === t.id ? catInfo.color : '#e5e7eb'}`, fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', background: statusFilter === t.id ? catInfo.color + '15' : '#fff', color: statusFilter === t.id ? catInfo.color : '#6b7280' }}>
              {t.icon} {t.label}
              {t.id !== 'all' && counts[t.id] > 0 && (
                <span style={{ marginLeft: 4, fontSize: 10, background: statusFilter === t.id ? catInfo.color : '#e5e7eb', color: statusFilter === t.id ? '#fff' : '#6b7280', borderRadius: 10, padding: '0 5px' }}>{counts[t.id]}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 16px 100px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#9ca3af' }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>{statusFilter === 'fluent' ? '🌟' : '🔍'}</div>
            <div style={{ fontSize: 14 }}>{statusFilter === 'fluent' ? '還沒有滾瓜爛熟的單字' : '此狀態沒有單字'}</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map(w => {
              const isFluent = fluentSet.has(w.id);
              const wStatus = getWordStatus(w.id, masteryMap, fluentSet);
              const m = masteryMap[w.id];
              const level = isFluent ? 3 : (m?.level ?? 0);
              const cfg = STATUS_COLOR[wStatus];
              return (
                <div key={w.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', background: isFluent ? '#faf5ff' : '#fff', border: `1.5px solid ${isFluent ? '#c4b5fd' : '#f0f0f0'}`, borderRadius: 12, transition: 'all 0.15s' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.text, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: isFluent ? '#6d28d9' : '#1f2937' }}>{w.word}</span>
                      <span style={{ fontSize: 11, color: '#9ca3af' }}>{w.phonetic}</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{w.meaning}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, flexShrink: 0 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: cfg.text, background: cfg.bg, padding: '2px 7px', borderRadius: 8, border: `1px solid ${cfg.border}` }}>{STATUS_LABEL[wStatus]}</span>
                    <MasteryStars level={level} isFluent={isFluent} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ padding: '12px 16px', borderTop: '1px solid #f3f4f6', background: '#fff', flexShrink: 0 }}>
        <button onClick={onStudy} style={{ width: '100%', padding: '14px 0', borderRadius: 14, border: 'none', background: `linear-gradient(135deg, ${catInfo.color}, ${catInfo.color}cc)`, color: '#fff', fontSize: 16, fontWeight: 800, cursor: 'pointer', boxShadow: `0 4px 16px ${catInfo.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          📖 開始背誦單字
        </button>
      </div>
    </div>
  );
}
