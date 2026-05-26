import { useState, useRef } from 'react';
import { CAT_INFO } from '../../data/gameData';
import type { Word } from '../../types';

interface ModeFillProps {
  word: Word;
  onCorrect: (usedHint: boolean, usedSpeak: boolean) => void;
  onWrong: () => void;
  onNext: () => void;
  onSpeak: (word: string) => void;
}

export default function ModeFill({ word, onCorrect, onWrong, onNext, onSpeak }: ModeFillProps) {
  const [value, setValue] = useState('');
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const [speakVisible, setSpeakVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const catInfo = CAT_INFO[word.cat] || { icon: '📝', name: word.cat };
  const sentence = word.example || `Please use "${word.word}" correctly.`;

  function handleRevealHint() {
    setHintVisible(true);
  }

  function handleRevealSpeak() {
    setSpeakVisible(true);
    onSpeak(word.word);
  }

  function handleSubmit() {
    if (answered) return;
    const correct = value.trim().toLowerCase() === word.word.toLowerCase();
    setIsCorrect(correct);
    setAnswered(true);
    if (correct) {
      onCorrect(hintVisible, speakVisible);
    } else {
      onWrong();
    }
  }

  return (
    <>
      <div style={{
        background: '#fff', borderRadius: 20, padding: 20,
        marginBottom: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
      }}>
        {/* 頂部：類別 + 發音按鈕 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{
            fontSize: 10, background: '#A8EDEA', color: '#2BB5AC',
            padding: '3px 10px', borderRadius: 20,
          }}>
            {catInfo.icon} {catInfo.name}
          </div>

          {/* 發音按鈕：未點擊時顯示「🔒 發音」，點擊後播放並解鎖 */}
          {!speakVisible ? (
            <button
              onClick={handleRevealSpeak}
              style={{
                background: 'none', border: '1.5px solid #CBD5E1',
                borderRadius: 20, padding: '4px 14px', cursor: 'pointer',
                fontSize: 13, color: '#94A3B8', fontFamily: 'var(--font-zh)',
                display: 'flex', alignItems: 'center', gap: 4,
              }}
            >
              🔒 發音 <span style={{ fontSize: 10, color: '#F59E0B' }}>-3 XP</span>
            </button>
          ) : (
            <button
              onClick={() => onSpeak(word.word)}
              style={{
                background: 'none', border: '1.5px solid #A8EDEA',
                borderRadius: 20, padding: '4px 14px', cursor: 'pointer',
                fontSize: 13, color: '#2BB5AC', fontFamily: 'var(--font-zh)',
              }}
            >
              🔊 發音
            </button>
          )}
        </div>

        {/* 例句 */}
        <p style={{ fontSize: 15, color: '#1E293B', lineHeight: 2, marginBottom: 8 }}>
          {sentence}
        </p>

        {/* 提示區：未點擊顯示解鎖按鈕 */}
        {!hintVisible ? (
          <button
            onClick={handleRevealHint}
            style={{
              background: 'none', border: '1.5px dashed #CBD5E1',
              borderRadius: 10, padding: '5px 12px', cursor: 'pointer',
              fontSize: 11, color: '#94A3B8', fontFamily: 'var(--font-zh)',
              display: 'flex', alignItems: 'center', gap: 4, marginTop: 6,
            }}
          >
            🔒 顯示提示 <span style={{ fontSize: 10, color: '#F59E0B' }}>-5 XP</span>
          </button>
        ) : (
          <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 6 }}>
            💡 提示：{word.meaning}
          </div>
        )}
      </div>

      {/* 輸入區 */}
      <div style={{
        background: '#fff', borderRadius: 20, padding: 16,
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)', marginBottom: 10,
      }}>
        <input
          ref={inputRef}
          type="text"
          placeholder="輸入正確單字..."
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !answered && handleSubmit()}
          disabled={answered}
          style={{
            width: '100%',
            border: `2px solid ${answered ? (isCorrect ? '#22C55E' : '#EF4444') : '#E2E8F0'}`,
            borderRadius: 8, padding: '12px 14px', fontSize: 16,
            fontFamily: 'var(--font-game)', fontWeight: 700, outline: 'none',
            background: answered ? (isCorrect ? '#DCFCE7' : '#FEE2E2') : '#fff',
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={answered}
          style={{
            width: '100%', background: '#4ECDC4', color: '#fff',
            border: 'none', borderRadius: 16, padding: 13, fontSize: 14,
            fontFamily: 'var(--font-zh)', cursor: answered ? 'not-allowed' : 'pointer',
            fontWeight: 600, marginTop: 8, opacity: answered ? 0.5 : 1,
          }}
        >
          確認 ✓
        </button>
      </div>

      {answered && (
        <>
          <div
            className={`fill-feedback ${isCorrect ? 'ok' : 'bad'}`}
            style={{ display: 'block' }}
          >
            {isCorrect ? '✅ 拼對了！' : `❌ 正確答案是：${word.word}`}
          </div>
          <button className="battle-next-btn" style={{ display: 'block' }} onClick={onNext}>
            下一題 →
          </button>
        </>
      )}
    </>
  );
}