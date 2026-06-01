// GlossaryPage.tsx
import { useState, useMemo } from 'react';
import type { Word, WordMastery, GameState } from '../../types';
import WordCard from './WordCard';
import WordDetail from './WordDetail';
import DangerZone from './DangerZone';

interface GlossaryPageProps {
  words: Word[];
  state: GameState;
  onToggleFluent: (wordId: number) => void;
}

const CAT_FILTERS = [
  { id: 'all',      label: '全部',     icon: '📚' },
  { id: 'business', label: '商務英文',  icon: '💼' },
  { id: 'travel',   label: '旅遊英文',  icon: '✈️' },
  { id: 'tech',     label: '科技英文',  icon: '💻' },
  { id: 'hr',       label: 'HR',       icon: '👥' },
  { id: 'boss',     label: 'Boss 單字', icon: '👑' },
];

const STATUS_FILTERS = [
  { id: 'all',      label: '全部' },
  { id: 'new',      label: '未學習' },
  { id: 'learning', label: '學習中' },
  { id: 'weak',     label: '⚠ 危險' },
  { id: 'mastered', label: '精通' },
  { id: 'fluent',   label: '🌟 滾瓜爛熟' },
];

const ACCENT_OPTIONS = [
  { id: 'au', label: '澳洲', flag: '🇦🇺', lang: 'en-AU' },
  { id: 'uk', label: '英國', flag: '🇬🇧', lang: 'en-GB' },
  { id: 'us', label: '美國', flag: '🇺🇸', lang: 'en-US' },
  { id: 'ca', label: '加拿大', flag: '🇨🇦', lang: 'en-CA' },
];

const PAGE_SIZE = 10;

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
    setTimeout(doSpeak, 50); // Chrome cancel 後需要短暫 delay
  }
}

export default function GlossaryPage({ words, state, onToggleFluent }: GlossaryPageProps) {
  const { masteryMap, fluentWords = [] } = state;
  const fluentSet = new Set(fluentWords);

  const [searchQuery, setSearchQuery] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [showDanger, setShowDanger] = useState(true);
  const [selectedAccent, setSelectedAccent] = useState('us'); // 口音選擇
  const [currentPage, setCurrentPage] = useState(1);         // 分頁

  const selectedLang = ACCENT_OPTIONS.find(a => a.id === selectedAccent)?.lang ?? 'en-US';

  // 切換 filter 時重置頁碼
  function handleCatFilter(id: string) { setCatFilter(id); setCurrentPage(1); }
  function handleStatusFilter(id: string) { setStatusFilter(id); setCurrentPage(1); }
  function handleSearch(q: string) { setSearchQuery(q); setCurrentPage(1); }

  // ── 統計 ──────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total    = words.length;
    const unlocked = words.filter(w => (masteryMap[w.id]?.level ?? 0) > 0 || fluentSet.has(w.id)).length;
    const mastered = words.filter(w => masteryMap[w.id]?.status === 'mastered').length;
    const weak     = words.filter(w => masteryMap[w.id]?.status === 'weak').length;
    const fluent   = fluentWords.length;
    return { total, unlocked, mastered, weak, fluent };
  }, [words, masteryMap, fluentWords]);

  // ── 過濾 ──────────────────────────────────────────────────
  const filteredWords = useMemo(() => {
    return words.filter(w => {
      if (catFilter !== 'all' && w.cat !== catFilter) return false;
      if (statusFilter !== 'all') {
        const isFluent = fluentSet.has(w.id);
        const s = isFluent ? 'fluent' : (masteryMap[w.id]?.status ?? 'new');
        if (s !== statusFilter) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        return w.word.toLowerCase().includes(q) || w.meaning.toLowerCase().includes(q);
      }
      return true;
    });
  }, [words, masteryMap, fluentSet, catFilter, statusFilter, searchQuery]);

  // ── 分頁 ──────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filteredWords.length / PAGE_SIZE));
  const pagedWords = filteredWords.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const progressPct = stats.total > 0
    ? Math.round((stats.unlocked / stats.total) * 100) : 0;

  return (
    <div style={{ padding: '16px', paddingBottom: 100, maxWidth: 600, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1f2937', margin: 0, marginBottom: 4 }}>
          📖 單字圖鑑
        </h1>
        <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>
          解鎖單字，累積精通！長按卡片可標記「滾瓜爛熟」
        </p>
      </div>

      {/* 統計卡片 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 16 }}>
        <StatCard icon="📚" label="已解鎖" value={stats.unlocked} color="#6366f1" />
        <StatCard icon="✅" label="精通"   value={stats.mastered} color="#10b981" />
        <StatCard icon="⚠️" label="危險"   value={stats.weak}    color="#ef4444" />
        <StatCard icon="🌟" label="爛熟"   value={stats.fluent}  color="#8b5cf6" />
        <StatCard icon="📊" label="總計"   value={stats.total}   color="#6b7280" />
      </div>

      {/* 學習進度條 */}
      <div style={{ background: '#f3f4f6', borderRadius: 12, padding: '12px 16px', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>學習進度</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#6366f1' }}>
            {stats.unlocked} / {stats.total} ({progressPct}%)
          </span>
        </div>
        <div style={{ background: '#e5e7eb', borderRadius: 20, height: 10, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${progressPct}%`,
            background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
            borderRadius: 20, transition: 'width 0.5s ease',
          }} />
        </div>
      </div>

      {/* 口音選擇列 */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 8 }}>
          🔊 發音口音
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {ACCENT_OPTIONS.map(a => (
            <button
              key={a.id}
              onClick={() => setSelectedAccent(a.id)}
              style={{
                flex: 1, padding: '8px 4px',
                borderRadius: 12,
                border: `2px solid ${selectedAccent === a.id ? '#6366f1' : '#e5e7eb'}`,
                background: selectedAccent === a.id ? '#ede9fe' : '#fff',
                cursor: 'pointer', transition: 'all 0.15s',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              }}
            >
              <span style={{ fontSize: 20 }}>{a.flag}</span>
              <span style={{
                fontSize: 10, fontWeight: 700,
                color: selectedAccent === a.id ? '#6366f1' : '#6b7280',
              }}>{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 搜尋列 */}
      <div style={{ position: 'relative', marginBottom: 14 }}>
        <span style={{
          position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
          fontSize: 16, pointerEvents: 'none',
        }}>🔍</span>
        <input
          value={searchQuery}
          onChange={e => handleSearch(e.target.value)}
          placeholder="搜尋英文或中文…（例如：neg → negotiate）"
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: '10px 12px 10px 38px',
            border: '1.5px solid #e5e7eb', borderRadius: 12,
            fontSize: 14, outline: 'none', background: '#fff', color: '#1f2937',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => (e.target.style.borderColor = '#6366f1')}
          onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
        />
        {searchQuery && (
          <button
            onClick={() => handleSearch('')}
            style={{
              position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#9ca3af',
            }}
          >✕</button>
        )}
      </div>

      {/* 分類 Filter */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 10, paddingBottom: 4, scrollbarWidth: 'none' }}>
        {CAT_FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => handleCatFilter(f.id)}
            style={{
              flexShrink: 0, padding: '6px 14px', borderRadius: 20, border: 'none',
              fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
              background: catFilter === f.id ? '#6366f1' : '#f3f4f6',
              color: catFilter === f.id ? '#fff' : '#6b7280',
            }}
          >
            {f.icon} {f.label}
          </button>
        ))}
      </div>

      {/* 狀態 Filter */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 16, paddingBottom: 4, scrollbarWidth: 'none' }}>
        {STATUS_FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => handleStatusFilter(f.id)}
            style={{
              flexShrink: 0, padding: '4px 12px', borderRadius: 20,
              border: `1.5px solid ${statusFilter === f.id ? (f.id === 'fluent' ? '#8b5cf6' : '#6366f1') : '#e5e7eb'}`,
              fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
              background: statusFilter === f.id ? '#ede9fe' : '#fff',
              color: statusFilter === f.id ? (f.id === 'fluent' ? '#8b5cf6' : '#6366f1') : '#6b7280',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* 危險單字快覽 */}
      {showDanger && statusFilter === 'all' && searchQuery === '' && (
        <div>
          <div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4, cursor: 'pointer' }}
            onClick={() => setShowDanger(v => !v)}
          >
            <span style={{ fontSize: 13, fontWeight: 700, color: '#ef4444' }}>⚠️ 危險單字快覽</span>
            <span style={{ fontSize: 12, color: '#9ca3af' }}>{showDanger ? '收起 ▲' : '展開 ▼'}</span>
          </div>
          <DangerZone words={words} masteryMap={masteryMap} onWordClick={setSelectedWord} />
        </div>
      )}

      {/* 滾瓜爛熟提示 */}
      {statusFilter === 'fluent' && (
        <div style={{
          background: 'linear-gradient(135deg, #faf5ff, #ede9fe)',
          border: '1.5px solid #c4b5fd',
          borderRadius: 12, padding: '12px 16px', marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ fontSize: 20 }}>🌟</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#6d28d9' }}>滾瓜爛熟的單字</div>
            <div style={{ fontSize: 12, color: '#7c3aed' }}>這些單字不會出現在出題中，長按卡片可取消設定</div>
          </div>
        </div>
      )}

      {/* 搜尋結果提示 + 分頁資訊 */}
      {filteredWords.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 13, color: '#6b7280' }}>
            {searchQuery
              ? <>找到 <strong style={{ color: '#6366f1' }}>{filteredWords.length}</strong> 個結果</>
              : <><strong style={{ color: '#6366f1' }}>{filteredWords.length}</strong> 個單字</>
            }
          </span>
          {totalPages > 1 && (
            <span style={{ fontSize: 12, color: '#9ca3af' }}>
              第 {currentPage} / {totalPages} 頁
            </span>
          )}
        </div>
      )}

      {/* 單字卡片列表 */}
      {filteredWords.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af', fontSize: 14 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>
            {statusFilter === 'fluent' ? '🌟' : '🔍'}
          </div>
          <div>
            {statusFilter === 'fluent'
              ? '還沒有滾瓜爛熟的單字，長按卡片來標記！'
              : '找不到符合的單字'}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {pagedWords.map(w => (
            <WordCard
              key={w.id}
              word={w}
              mastery={masteryMap[w.id] ?? null}
              isFluent={fluentSet.has(w.id)}
              accentLang={selectedLang}
              onClick={() => setSelectedWord(w)}
              onToggleFluent={() => onToggleFluent(w.id)}
            />
          ))}
        </div>
      )}

      {/* 分頁控制器 */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 6, marginTop: 20, flexWrap: 'wrap',
        }}>
          {/* 上一頁 */}
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            style={{
              padding: '7px 14px', borderRadius: 10, border: 'none',
              background: currentPage === 1 ? '#f3f4f6' : '#e0e7ff',
              color: currentPage === 1 ? '#d1d5db' : '#6366f1',
              fontWeight: 700, fontSize: 13,
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            }}
          >← 上頁</button>

          {/* 頁碼按鈕 */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => {
            // 顯示規則：第1頁、最後一頁、目前頁±1，其餘顯示…
            const show = p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1;
            const showDotBefore = p === currentPage - 2 && currentPage > 3;
            const showDotAfter  = p === currentPage + 2 && currentPage < totalPages - 2;
            if (!show) return null;
            return (
              <span key={p} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {showDotBefore && <span style={{ color: '#9ca3af', fontSize: 13 }}>…</span>}
                <button
                  onClick={() => setCurrentPage(p)}
                  style={{
                    width: 34, height: 34, borderRadius: 10, border: 'none',
                    background: p === currentPage ? '#6366f1' : '#f3f4f6',
                    color: p === currentPage ? '#fff' : '#6b7280',
                    fontWeight: p === currentPage ? 800 : 500,
                    fontSize: 13, cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >{p}</button>
                {showDotAfter && <span style={{ color: '#9ca3af', fontSize: 13 }}>…</span>}
              </span>
            );
          })}

          {/* 下一頁 */}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            style={{
              padding: '7px 14px', borderRadius: 10, border: 'none',
              background: currentPage === totalPages ? '#f3f4f6' : '#e0e7ff',
              color: currentPage === totalPages ? '#d1d5db' : '#6366f1',
              fontWeight: 700, fontSize: 13,
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            }}
          >下頁 →</button>
        </div>
      )}

      {/* 單字詳情 Modal */}
      {selectedWord && (
        <WordDetail
          word={selectedWord}
          mastery={masteryMap[selectedWord.id] ?? null}
          isFluent={fluentSet.has(selectedWord.id)}
          accentLang={selectedLang}
          onClose={() => setSelectedWord(null)}
          onToggleFluent={() => {
            onToggleFluent(selectedWord.id);
            setSelectedWord(null);
          }}
        />
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }: {
  icon: string; label: string; value: number; color: string;
}) {
  return (
    <div style={{
      background: '#fff', border: `1.5px solid ${color}30`,
      borderRadius: 12, padding: '10px 4px', textAlign: 'center',
    }}>
      <div style={{ fontSize: 16, marginBottom: 2 }}>{icon}</div>
      <div style={{ fontSize: 16, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 500 }}>{label}</div>
    </div>
  );
}