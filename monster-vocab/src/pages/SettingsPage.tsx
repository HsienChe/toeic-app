import { useState } from 'react';
import { CAT_INFO, DAYS, DAY_NAMES } from '../data/gameData';
import type { GameState, WeeklyGoals } from '../types';
import type { FirebaseUser } from '../hooks/useFirebaseAuth';

interface SettingsPageProps {
  state: GameState;
  user: FirebaseUser | null;
  onUpdate: (partial: Partial<GameState>) => void;
  onSignIn: () => void;
  onSignOut: () => void;
  onToast: (msg: string) => void;
}

export default function SettingsPage({
  state, user, onUpdate, onSignIn, onSignOut, onToast,
}: SettingsPageProps) {
  const [localGoals, setLocalGoals] = useState<WeeklyGoals>({ ...state.weeklyGoals });

  // 今天是哪天（方便高亮顯示）
  const todayIdx = new Date().getDay();
  const todayKey = DAYS[todayIdx];

  function saveWeeklyGoals() {
    onUpdate({ weeklyGoals: { ...localGoals, lastSetDate: new Date().toISOString() } });
    onToast('✅ 週目標已儲存！');
  }

  function resetWeeklyGoals() {
    if (!window.confirm('確定要重設所有週目標嗎？')) return;
    const reset: WeeklyGoals = {
      sunday: null, monday: null, tuesday: null,
      wednesday: null, thursday: null, friday: null, saturday: null,
      lastSetDate: null,
    };
    setLocalGoals(reset);
    onUpdate({ weeklyGoals: reset });
    onToast('週目標已重設');
  }

  return (
    <div className="page" id="page-settings">
      <div className="settings-container">

        {/* ── 帳號 ── */}
        <div className="settings-section">
          <div className="settings-section-title">帳號</div>
          <div className="settings-card">
            <div className="settings-row">
              <div className="sr-icon">👤</div>
              <div className="sr-label">{user?.displayName || '冒險者'}</div>
            </div>
            <div className="settings-row">
              <div className="sr-icon">✉️</div>
              <div className="sr-label" style={{ fontSize: 12, color: 'var(--gray-400)' }}>
                {user?.email || '登入後可跨裝置同步'}
              </div>
            </div>
          </div>
        </div>

        {/* ── 每日設定 ── */}
        <div className="settings-section">
          <div className="settings-section-title">每日設定</div>
          <div className="settings-card">
            <div className="settings-row">
              <div className="sr-icon">🎯</div>
              <div className="sr-label">每日目標單字數</div>
              <input
                type="number" className="settings-input"
                value={state.goal} min={5} max={50}
                onChange={e => {
                  onUpdate({ goal: parseInt(e.target.value) || 10 });
                  onToast('每日目標已更新！');
                }}
              />
            </div>
            <div className="settings-row">
              <div className="sr-icon">🔔</div>
              <div className="sr-label">提醒時間</div>
              <input
                type="time" className="settings-input"
                value={state.remindTime}
                onChange={e => {
                  onUpdate({ remindTime: e.target.value });
                  onToast('提醒時間已儲存！');
                }}
              />
            </div>
          </div>
        </div>

        {/* ── 每週學習目標 ── */}
        <div className="settings-section">
          <div className="settings-section-title">📅 每週學習目標</div>
          <div style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 8 }}>
            為每天指定學習類別，系統會在「今日任務」自動準備對應單字
          </div>
          <div className="settings-card">
            {DAYS.map((day, idx) => {
              const isToday = day === todayKey;
              const selectedCat = localGoals[day] || '';
              const catInfo = selectedCat ? CAT_INFO[selectedCat] : null;
              return (
                <div
                  key={day}
                  style={{
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    borderBottom: idx < DAYS.length - 1 ? '1px solid var(--gray-100)' : 'none',
                    background: isToday ? 'var(--ocean-light)' : 'transparent',
                    borderRadius: isToday ? 'var(--r-sm)' : 0,
                  }}
                >
                  {/* 今天標記 */}
                  <div style={{ width: 64, flexShrink: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: isToday ? 700 : 400, color: isToday ? 'var(--ocean-dark)' : 'var(--gray-800)' }}>
                      {DAY_NAMES[idx]}
                    </div>
                    {isToday && (
                      <div style={{ fontSize: 10, color: 'var(--ocean-dark)', fontFamily: 'var(--font-game)' }}>今天</div>
                    )}
                  </div>

                  {/* 類別選擇 */}
                  <select
                    style={{
                      flex: 1,
                      border: `2px solid ${isToday ? 'var(--ocean)' : 'var(--gray-200)'}`,
                      borderRadius: 'var(--r-sm)',
                      padding: '7px 10px',
                      fontSize: 13,
                      fontFamily: 'var(--font-zh)',
                      outline: 'none',
                      background: '#fff',
                      cursor: 'pointer',
                    }}
                    value={selectedCat}
                    onChange={e => setLocalGoals(g => ({ ...g, [day]: e.target.value || null }))}
                  >
                    <option value="">— 休息日 —</option>
                    {Object.entries(CAT_INFO).map(([k, v]) => (
                      <option key={k} value={k}>{v.icon} {v.name}</option>
                    ))}
                  </select>

                  {/* 已選類別圖示 */}
                  {catInfo && (
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: catInfo.bg, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: 16, flexShrink: 0,
                    }}>
                      {catInfo.icon}
                    </div>
                  )}
                </div>
              );
            })}

            {/* 儲存 / 重設 */}
            <div style={{ display: 'flex', gap: 10, padding: '14px 16px' }}>
              <button
                className="settings-btn"
                onClick={saveWeeklyGoals}
                style={{ flex: 1 }}
              >
                💾 儲存週目標
              </button>
              <button
                className="settings-btn"
                onClick={resetWeeklyGoals}
                style={{ flex: 1, background: '#94A3B8' }}
              >
                🔄 全部重設
              </button>
            </div>
          </div>

          {/* 上次儲存時間 */}
          {localGoals.lastSetDate && (
            <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 6, textAlign: 'right' }}>
              上次儲存：{new Date(localGoals.lastSetDate).toLocaleString('zh-TW', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
        </div>

        {/* ── 帳號操作 ── */}
        <div className="settings-section">
          <div className="settings-section-title">帳號操作</div>
          <div className="settings-card" style={{ marginBottom: 10 }}>
            <div className="settings-row" style={{ cursor: 'pointer' }} onClick={onSignIn}>
              <div className="sr-icon">🔗</div>
              <div className="sr-label">Google 登入 / 同步資料</div>
              <div style={{ fontSize: 12, color: 'var(--ocean-dark)' }}>→</div>
            </div>
          </div>
          <button className="logout-btn" onClick={onSignOut}>登出</button>
        </div>

      </div>
    </div>
  );
}
