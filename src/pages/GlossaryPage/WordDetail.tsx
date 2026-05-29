import type { Word, WordMastery } from '../../types';

interface WordDetailProps {
  word: Word;
  mastery: WordMastery | null;
  isFluent: boolean;
  accentLang: string;
  onClose: () => void;
  onToggleFluent: () => void;
}

function MasteryStars({ level }: { level: number }) {
  return (
    <span style={{ fontSize: 20, letterSpacing: 3 }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{ color: i < level ? '#f59e0b' : '#d1d5db' }}>★</span>
      ))}
    </span>
  );
}

const CAT_LABEL: Record<string, string> = {
  business: '商務英文', travel: '旅遊英文',
  tech: '科技英文',    hr: 'HR', boss: 'Boss 單字',
};

const STATUS_LABEL = {
  new: '未學習', learning: '學習中',
  weak: '⚠ 危險', mastered: '精通', fluent: '🌟 滾瓜爛熟',
};

const LEVEL_LABEL = ['未解鎖', '學習中 ★☆☆', '熟悉 ★★☆', '精通 ★★★'];

export default function WordDetail({ word, mastery, isFluent, accentLang, onClose, onToggleFluent }: WordDetailProps) {
  const level        = isFluent ? 3 : (mastery?.level ?? 0);
  const status       = isFluent ? 'fluent' : (mastery?.status ?? 'new');
  const correctCount = mastery?.correctCount ?? 0;
  const wrongCount   = mastery?.wrongCount ?? 0;
  const lastReview   = mastery?.lastReview ?? null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: '24px 24px 0 0',
          width: '100%', maxWidth: 520,
          padding: '28px 24px 40px',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.15)',
          animation: 'slideUp 0.3s ease',
        }}
      >
        {/* 拖曳條 */}
        <div style={{ width: 40, height: 4, background: '#e5e7eb', borderRadius: 2, margin: '0 auto 20px' }} />

        {/* 標題列 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: '#1f2937', letterSpacing: 1 }}>
        📚 {word.word}
      </div>
<button
  onClick={() => {
    if (!window.speechSynthesis) return;
    speechSynthesis.cancel();
    const doSpeak = () => {
      const utter = new SpeechSynthesisUtterance(word.word);
      utter.lang = accentLang;
      utter.rate = 0.9;
      const voices = speechSynthesis.getVoices();
      const matched = voices.find(v => v.lang === accentLang)
        ?? voices.find(v => v.lang.startsWith(accentLang.split('-')[0]));
      if (matched) utter.voice = matched;
      speechSynthesis.speak(utter);
    };
    speechSynthesis.getVoices().length === 0
      ? (speechSynthesis.onvoiceschanged = () => { speechSynthesis.onvoiceschanged = null; setTimeout(doSpeak, 50); })
      : setTimeout(doSpeak, 50);
  }}
  style={{
    width: 34, height: 34, borderRadius: '50%', border: 'none',
    background: '#e0e7ff', color: '#6366f1',
    fontSize: 16, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}
>🔊</button>
</div>

        {/* 滾瓜爛熟標籤 */}
        {isFluent && (
          <div style={{
            background: 'linear-gradient(135deg, #faf5ff, #ede9fe)',
            border: '1.5px solid #c4b5fd',
            borderRadius: 10, padding: '8px 14px',
            marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ fontSize: 18 }}>🌟</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#6d28d9' }}>
              滾瓜爛熟 — 不參與出題
            </span>
          </div>
        )}

        <DetailRow icon="🇹🇼" label="中文" value={word.meaning} highlight />
        {word.example && (
          <DetailRow icon="💬" label="例句" value={word.example} italic />
        )}
        <DetailRow icon="🏷️" label="分類" value={CAT_LABEL[word.cat] || word.cat} />

        {/* 熟練度 */}
<div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
  <span style={{ fontSize: 18, width: 28, textAlign: 'center' }}>⭐</span>
  <span style={{ fontSize: 13, color: '#6b7280', width: 60 }}>熟練度</span>
  <MasteryStars level={level} />
</div>

        <DetailRow icon="📊" label="狀態" value={STATUS_LABEL[status]} />

        {/* 答題統計 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, margin: '16px 0' }}>
          <StatBox icon="✅" label="答對" value={`${correctCount} 次`} color="#10b981" />
          <StatBox icon="❌" label="答錯" value={`${wrongCount} 次`} color="#ef4444" />
        </div>

        <DetailRow
          icon="📅" label="最近複習"
          value={lastReview ? lastReview.replace(/-/g, '/') : '尚未複習'}
        />

        {/* 滾瓜爛熟切換按鈕 */}
        <button
          onClick={onToggleFluent}
          style={{
            width: '100%', padding: '13px 0',
            borderRadius: 14, border: 'none', marginTop: 16,
            background: isFluent
              ? 'linear-gradient(135deg, #f3f4f6, #e5e7eb)'
              : 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            color: isFluent ? '#6b7280' : '#fff',
            fontSize: 15, fontWeight: 800, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          {isFluent ? '📖 取消滾瓜爛熟，重新練習' : '🌟 標記為滾瓜爛熟（不再出題）'}
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0; }
          to   { transform: translateY(0);   opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function DetailRow({ icon, label, value, highlight, italic }: {
  icon: string; label: string; value: string; highlight?: boolean; italic?: boolean;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
      <span style={{ fontSize: 18, width: 28, textAlign: 'center', flexShrink: 0 }}>{icon}</span>
      <span style={{ fontSize: 13, color: '#6b7280', width: 60, flexShrink: 0, paddingTop: 2 }}>{label}</span>
      <span style={{
        fontSize: highlight ? 16 : 14,
        fontWeight: highlight ? 700 : 400,
        color: highlight ? '#1f2937' : '#374151',
        fontStyle: italic ? 'italic' : 'normal',
        lineHeight: 1.5,
      }}>{value}</span>
    </div>
  );
}

function StatBox({ icon, label, value, color }: { icon: string; label: string; value: string; color: string; }) {
  return (
    <div style={{
      background: color + '10', border: `1.5px solid ${color}30`,
      borderRadius: 12, padding: '12px 16px', textAlign: 'center',
    }}>
      <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontSize: 20, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 12, color: '#9ca3af' }}>{label}</div>
    </div>
  );
}