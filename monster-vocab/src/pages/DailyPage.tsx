import { useState, useMemo } from 'react';
import { CAT_INFO, WORDS, DAYS, COUNTRIES } from '../data/gameData';
import type { GameState, BattleMode, Word } from '../types';

interface DailyPageProps {
  state: GameState;
  isDailyDone: boolean;
  onSwitchToHome: () => void;
  onSwitchToSettings: () => void;
  onStartBattle: (mode: BattleMode, words: Word[], cat: string, country: string) => void;
}

const ACCENT_OPTIONS = Object.entries(COUNTRIES).map(([key, c]) => ({
  key,
  label: `${c.flag} ${c.name}（${c.accent}）`,
}));

export default function DailyPage({
  state,
  isDailyDone,
  onSwitchToHome,
  onSwitchToSettings,
  onStartBattle,
}: DailyPageProps) {
  const [mode, setMode] = useState<BattleMode>('flip');
  const [country, setCountry] = useState<string>('us');

  const todayIdx = new Date().getDay();
  const dayKey = DAYS[todayIdx];
  const cat = state.weeklyGoals[dayKey] || null;
  const catInfo = cat ? CAT_INFO[cat] : null;

  const dailyWords = useMemo<Word[]>(() => {
    if (!cat) return [];
    const allWords: Word[] = [...WORDS, ...(state.customWords || [])];
    const pool = allWords.filter(w => w.cat === cat);
    return [...pool].sort((a, b) => a.id - b.id).slice(0, 10);
  }, [cat, state.customWords]);

  // ── 未設定今日目標 ─────────────────────────────────────────
  if (!cat || !catInfo) {
    return (
      <div className="page" id="page-daily">
        <div className="daily-page">
          <BackBtn onClick={onSwitchToHome} />
          <div style={{ textAlign: 'center', padding: '40px 16px' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
            <div style={{ fontSize: 16, color: 'var(--gray-800)', marginBottom: 8, fontWeight: 700 }}>
              今天尚未設定目標
            </div>
            <div style={{ fontSize: 13, color: 'var(--gray-600)', marginBottom: 24, lineHeight: 1.7 }}>
              請到「設定」頁面<br />為每週各天指定學習類別
            </div>
            <button
              className="daily-start-btn"
              style={{ maxWidth: 240, margin: '0 auto', display: 'block' }}
              onClick={onSwitchToSettings}
            >
              前往設定 ⚙️
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── 單字不足 ───────────────────────────────────────────────
  if (dailyWords.length === 0) {
    return (
      <div className="page" id="page-daily">
        <div className="daily-page">
          <BackBtn onClick={onSwitchToHome} />
          <div style={{ textAlign: 'center', padding: '40px 16px' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>😅</div>
            <div style={{ fontSize: 16, color: 'var(--gray-800)', fontWeight: 700 }}>
              {catInfo.name} 類別暫無單字
            </div>
            <div style={{ fontSize: 13, color: 'var(--gray-600)', marginTop: 8 }}>
              請先到「新增」頁面加入單字
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page" id="page-daily">
      <div className="daily-page">
        <BackBtn onClick={onSwitchToHome} />

        {/* ── 今日類別 Banner ── */}
        <div className="daily-cat-header">
          <div className="daily-cat-icon">{catInfo.icon}</div>
          <div className="daily-cat-info">
            <h3>今日主題：{catInfo.name}</h3>
            <p>共 {dailyWords.length} 個單字 · {catInfo.monsterName}</p>
          </div>
          {isDailyDone && (
            <div style={{
              marginLeft: 'auto', background: 'rgba(255,255,255,0.25)',
              borderRadius: 20, padding: '4px 12px',
              fontSize: 12, fontFamily: 'var(--font-game)', fontWeight: 700, color: '#fff',
              flexShrink: 0,
            }}>
              ✅ 已完成
            </div>
          )}
        </div>

        {/* ── 單字清單 ── */}
        <div className="daily-words-section">
          <div className="daily-words-title">📚 今日單字清單</div>
          <div className="daily-word-list">
            {dailyWords.map(w => (
              <div key={w.id} className="daily-word-item">
                <div className="daily-word-text">
                  <div className="word">{w.word}</div>
                  <div className="meaning">{w.meaning}</div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{w.phonetic}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 口音選擇 ── */}
        <div className="daily-mode-select" style={{ marginTop: 16 }}>
          <label className="daily-mode-label">🌍 選擇發音口音</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 6 }}>
            {ACCENT_OPTIONS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setCountry(key)}
                style={{
                  padding: '10px 8px',
                  borderRadius: 12,
                  border: `2px solid ${country === key ? '#2BB5AC' : '#E2E8F0'}`,
                  background: country === key ? '#E8F7FF' : '#fff',
                  color: country === key ? '#2BB5AC' : '#64748B',
                  fontFamily: 'var(--font-zh)',
                  fontSize: 12,
                  fontWeight: country === key ? 700 : 400,
                  cursor: 'pointer',
                  transition: 'all .15s',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── 戰鬥模式選擇 ── */}
        <div className="daily-mode-select" style={{ marginTop: 12 }}>
          <label className="daily-mode-label">選擇戰鬥模式</label>
          <select value={mode} onChange={e => setMode(e.target.value as BattleMode)}>
            <option value="flip">🃏 翻牌模式 — 翻牌記憶，輕鬆上手</option>
            <option value="choice">🎯 選擇題 — 四選一，考驗記憶</option>
            <option value="fill">✍️ 填空模式 — 填入單字，加深印象</option>
            <option value="mix">🌀 混合模式 — 三種混合，最強挑戰</option>
          </select>
        </div>

        {/* ── 開始 / 再戰 按鈕 ── */}
        {isDailyDone ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
            <div style={{
              background: 'var(--green-light)', border: '2px solid var(--green)',
              borderRadius: 'var(--r-md)', padding: '12px 16px',
              textAlign: 'center', fontSize: 14, color: '#166534', fontWeight: 600,
            }}>
              🎉 今日任務已完成！可繼續練習或前往地圖挑戰更多
            </div>
            <button
              className="daily-start-btn"
              style={{ background: 'var(--ocean-dark)' }}
              onClick={() => onStartBattle(mode, dailyWords, cat, country)}
            >
              再戰一次 🔄
            </button>
          </div>
        ) : (
          <button
            className="daily-start-btn"
            style={{ marginTop: 16 }}
            onClick={() => onStartBattle(mode, dailyWords, cat, country)}
          >
            開始今日戰鬥 ⚔️
          </button>
        )}
      </div>
    </div>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
      <button
        onClick={onClick}
        style={{
          background: '#F1F5F9', border: 'none', borderRadius: 8,
          padding: '8px 14px', fontFamily: 'var(--font-zh)',
          cursor: 'pointer', fontSize: 13, color: '#475569',
        }}
      >
        ← 返回首頁
      </button>
    </div>
  );
}
