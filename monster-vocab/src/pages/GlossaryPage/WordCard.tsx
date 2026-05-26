// WordCard.tsx
import { useState, useRef } from 'react';
import type { Word, WordMastery } from '../../types';

interface WordCardProps {
  word: Word;
  mastery: WordMastery | null;
  isFluent: boolean;
  accentLang: string;   // ← 新增
  onClick: () => void;
  onToggleFluent: () => void;
}

const CAT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  business: { bg: '#fff8e6', text: '#b45309', border: '#fcd34d' },
  travel:   { bg: '#ecfdf5', text: '#065f46', border: '#6ee7b7' },
  tech:     { bg: '#eff6ff', text: '#1e40af', border: '#93c5fd' },
  hr:       { bg: '#fdf4ff', text: '#7e22ce', border: '#d8b4fe' },
  boss:     { bg: '#fff1f2', text: '#9f1239', border: '#fda4af' },
};

function getCatStyle(cat: string) {
  return CAT_COLORS[cat] || { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' };
}

const STATUS_CONFIG = {
  new:      { label: '未學習',   icon: '🔒', color: '#9ca3af' },
  learning: { label: '學習中',   icon: '📖', color: '#f59e0b' },
  weak:     { label: '⚠ 危險',  icon: '⚠️', color: '#ef4444' },
  mastered: { label: '精通',     icon: '✅', color: '#10b981' },
  fluent:   { label: '滾瓜爛熟', icon: '🌟', color: '#8b5cf6' },
};

function MasteryStars({ level }: { level: number }) {
  return (
    <span style={{ letterSpacing: '1px', fontSize: 13 }}>
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

function speakWord(word: string, lang: string) {
  if (!window.speechSynthesis) return;
  speechSynthesis.cancel();

  const doSpeak = () => {
    const utter = new SpeechSynthesisUtterance(word);
    utter.lang = lang;
    utter.rate = 0.9;
    const voices = speechSynthesis.getVoices();
    const matched = voices.find(v => v.lang === lang)
      ?? voices.find(v => v.lang.startsWith(lang.split('-')[0]));
    if (matched) utter.voice = matched;
    speechSynthesis.speak(utter);
  };

  if (speechSynthesis.getVoices().length === 0) {
    speechSynthesis.onvoiceschanged = () => {
      speechSynthesis.onvoiceschanged = null;
      setTimeout(doSpeak, 50);
    };
  } else {
    setTimeout(doSpeak, 50);
  }
}

export default function WordCard({
  word, mastery, isFluent, accentLang, onClick, onToggleFluent,
}: WordCardProps) {
  const level = mastery?.level ?? 0;
  const status = isFluent ? 'fluent' : (mastery?.status ?? 'new');
  const statusCfg = STATUS_CONFIG[status];
  const catStyle = getCatStyle(word.cat);
  const isLocked = level === 0 && !isFluent && status === 'new';

  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [pressing, setPressing] = useState(false);
  const [showFluentMenu, setShowFluentMenu] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  function handlePressStart() {
    setPressing(true);
    pressTimer.current = setTimeout(() => {
      setPressing(false);
      setShowFluentMenu(true);
    }, 500);
  }

  function handlePressEnd() {
    setPressing(false);
    if (pressTimer.current) { clearTimeout(pressTimer.current); pressTimer.current = null; }
  }

  function handleClick() {
    if (showFluentMenu) return;
    onClick();
  }

function handleSpeak(e: React.MouseEvent) {
  e.stopPropagation();
  if (isLocked || !window.speechSynthesis) return;
  setSpeaking(true);
  speechSynthesis.cancel();
  const doSpeak = () => {
    const utter = new SpeechSynthesisUtterance(word.word);
    utter.lang = accentLang;
    utter.rate = 0.9;
    const voices = speechSynthesis.getVoices();
    const matched = voices.find(v => v.lang === accentLang)
      ?? voices.find(v => v.lang.startsWith(accentLang.split('-')[0]));
    if (matched) utter.voice = matched;
    utter.onend = () => setSpeaking(false);
    speechSynthesis.speak(utter);
  };
  speechSynthesis.getVoices().length === 0
    ? (speechSynthesis.onvoiceschanged = () => { speechSynthesis.onvoiceschanged = null; setTimeout(doSpeak, 50); })
    : setTimeout(doSpeak, 50);
}

return (
  <>
    <div
      onClick={handleClick}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      onMouseEnter={e => {
        if (!pressing) (e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.10)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
        handlePressEnd();
      }}
      style={{
        background: isFluent ? 'linear-gradient(135deg, #faf5ff, #ede9fe)' : isLocked ? '#f9fafb' : '#ffffff',
        border: `1.5px solid ${isFluent ? '#c4b5fd' : isLocked ? '#e5e7eb' : catStyle.border}`,
        borderRadius: 14, padding: '14px 16px', cursor: 'pointer',
        transition: 'all 0.18s ease', position: 'relative', overflow: 'hidden',
        transform: pressing ? 'scale(0.97)' : 'scale(1)',
        userSelect: 'none', WebkitUserSelect: 'none',
      }}
      >
        {/* 左側色塊 */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
          background: isFluent ? '#8b5cf6' : isLocked ? '#e5e7eb' : catStyle.border,
          borderRadius: '4px 0 0 4px',
        }} />

        {/* 長按提示 */}
        {pressing && (
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 14,
            background: 'rgba(139,92,246,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, color: '#8b5cf6', fontWeight: 700, pointerEvents: 'none',
          }}>長按設定滾瓜爛熟…</div>
        )}

        {/* 單字行：英文 + 發音按鈕 + 狀態標籤 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
            <div>
              <div style={{
                fontSize: 16, fontWeight: 700,
                color: isFluent ? '#6d28d9' : isLocked ? '#9ca3af' : '#1f2937',
                letterSpacing: '0.5px',
                filter: isLocked ? 'blur(4px)' : 'none',
              }}>
                {isLocked ? '????????' : word.word}
              </div>
              <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2, filter: isLocked ? 'blur(3px)' : 'none' }}>
                {isLocked ? '翻譯已鎖定' : word.meaning}
              </div>
            </div>

            {/* 發音按鈕 */}
            {!isLocked && (
              <button
                onClick={handleSpeak}
                style={{
                  flexShrink: 0,
                  width: 30, height: 30,
                  borderRadius: '50%', border: 'none',
                  background: speaking ? '#6366f1' : '#e0e7ff',
                  color: speaking ? '#fff' : '#6366f1',
                  fontSize: 14, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                  transform: speaking ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                🔊
              </button>
            )}
          </div>

          {/* 狀態標籤 */}
          <div style={{
            fontSize: 11, fontWeight: 600,
            color: statusCfg.color, background: statusCfg.color + '18',
            borderRadius: 8, padding: '2px 8px', whiteSpace: 'nowrap', marginLeft: 8,
          }}>
            {statusCfg.icon} {statusCfg.label}
          </div>
        </div>

        {/* 底部：分類 + 熟練度 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
          <span style={{
            fontSize: 11, background: catStyle.bg, color: catStyle.text,
            padding: '2px 8px', borderRadius: 20, fontWeight: 600,
          }}>
            {CAT_LABEL[word.cat] || word.cat}
          </span>
          <MasteryStars level={isFluent ? 3 : level} />
        </div>
      </div>

      {/* 滾瓜爛熟 Action Sheet */}
      {showFluentMenu && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 300,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          }}
          onClick={() => setShowFluentMenu(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: '20px 20px 0 0',
              width: '100%', maxWidth: 480,
              padding: '20px 20px 40px',
              animation: 'slideUp 0.25s ease',
            }}
          >
            <div style={{ width: 36, height: 4, background: '#e5e7eb', borderRadius: 2, margin: '0 auto 16px' }} />
            <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 16, textAlign: 'center' }}>
              <strong style={{ color: '#1f2937' }}>{word.word}</strong> 的設定
            </div>
            <button
              onClick={() => { onToggleFluent(); setShowFluentMenu(false); }}
              style={{
                width: '100%', padding: '14px 0', borderRadius: 14, border: 'none',
                background: isFluent ? 'linear-gradient(135deg, #f3f4f6, #e5e7eb)' : 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                color: isFluent ? '#6b7280' : '#fff',
                fontSize: 16, fontWeight: 800, cursor: 'pointer', marginBottom: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {isFluent ? <>📖 取消滾瓜爛熟，重新練習</> : <>🌟 標記為滾瓜爛熟（不再出題）</>}
            </button>
            <button
              onClick={() => setShowFluentMenu(false)}
              style={{
                width: '100%', padding: '12px 0', borderRadius: 14,
                border: '1.5px solid #e5e7eb', background: '#fff',
                color: '#6b7280', fontSize: 15, fontWeight: 600, cursor: 'pointer',
              }}
            >取消</button>
          </div>
          <style>{`
            @keyframes slideUp {
              from { transform: translateY(30px); opacity: 0; }
              to   { transform: translateY(0); opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </>
  );
}