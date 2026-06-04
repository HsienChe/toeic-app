import { useState, useCallback, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Tabbar from './components/Tabbar';
import XpGainAnimation from './components/XpGainAnimation';
import HomePage from './pages/HomePage/HomePage';
import MapPage from './pages/MapPage/MapPage';
import ReviewPage from './pages/ReviewPage';
import AddWordPage from './pages/AddWordPage';
import SettingsPage from './pages/SettingsPage';
import DailyPage from './pages/DailyPage';
import GlossaryPage from './pages/GlossaryPage/GlossaryPage';
import ModeSelectModal from './pages/BattlePage/ModeSelectModal';
import BattlePage from './pages/BattlePage/BattlePage';
import { useGameState } from './hooks/useGameState';
import { useFirebaseAuth } from './hooks/useFirebaseAuth';
import { useToast } from './hooks/useToast';
import { getLevel } from './utils/xpUtils';
import { CAT_INFO, COUNTRIES, WORDS } from './data/gameData';
import type { TabName, BattleMode, Word } from './types';
import StartScreen from './components/StartScreen';

export default function App() {
  const { user, loading: authLoading, signIn, signOut } = useFirebaseAuth();
  const {
    state, updateState, addXP,
    addWrongWord, removeWrongWord,
    claimReward, addCustomWord,
    markDailyDone, isDailyDone,
    updateMastery,
    getMasteryUpdate,
    toggleFluent,
    syncFromFirebase,
  } = useGameState();
  const { showToast } = useToast();

  const [wordBankWords, setWordBankWords] = useState<Word[]>([]);

  useEffect(() => {
    const data = (window as any).wordBankData;
    if (data?.length > 0) { setWordBankWords(data); return; }
    const handler = () => setWordBankWords((window as any).wordBankData || []);
    window.addEventListener('wordBankReady', handler, { once: true });
    return () => window.removeEventListener('wordBankReady', handler);
  }, []);

  const [loadProgress, setLoadProgress] = useState(0);
  const [loadMessage, setLoadMessage] = useState('初始化中...');
  const [activeTab, setActiveTab] = useState<TabName>('home');
  const [showModePanel, setShowModePanel] = useState(false);
  const [pendingCat, setPendingCat] = useState('');
  const [pendingCountry, setPendingCountry] = useState('');
  const [battleActive, setBattleActive] = useState(false);
  const [battleMode, setBattleMode] = useState<BattleMode>('flip');
  const [battleCat, setBattleCat] = useState('');
  const [battleCountry, setBattleCountry] = useState('');
  const [battleIsDaily, setBattleIsDaily] = useState(false);
  const [battleFromReview, setBattleFromReview] = useState(false);
  const [battlePreloadedWords, setBattlePreloadedWords] = useState<Word[] | undefined>(undefined);
  const [xpPopup, setXpPopup] = useState<number | null>(null);
  const [showStartScreen, setShowStartScreen] = useState(true);

  useEffect(() => {
    if (authLoading) {
      setLoadProgress(30); setLoadMessage('認證中...');
    } else {
      setLoadProgress(70); setLoadMessage('載入遊戲資料...');
      const timer = setTimeout(() => { setLoadProgress(100); setLoadMessage('準備完成！'); }, 300);
      return () => clearTimeout(timer);
    }
  }, [authLoading]);

  useEffect(() => {
    const fallback = setTimeout(() => setLoadProgress(100), 4000);
    return () => clearTimeout(fallback);
  }, []);

  useEffect(() => {
    const handleSync = (e: CustomEvent) => { if (e.detail) syncFromFirebase(e.detail); };
    window.addEventListener('firestoreSync' as any, handleSync);
    return () => window.removeEventListener('firestoreSync' as any, handleSync);
  }, [syncFromFirebase]);

  function handleSelectAccent(cat: string, country: string) { setPendingCat(cat); setPendingCountry(country); setShowModePanel(true); }
  function handleStartBattleFromMap(mode: BattleMode) { setBattleMode(mode); setBattleCat(pendingCat); setBattleCountry(pendingCountry); setBattleIsDaily(false); setBattlePreloadedWords(undefined); setShowModePanel(false); setBattleActive(true); }

  function handleStartBattleFromDaily(mode: BattleMode, words: Word[], cat: string) {
    if (state.stamina <= 0) { showToast('❌ 體力不足，請明天再來挑戰！'); return; }
    const today = new Date().toDateString();
    updateState((prevState) => ({ stamina: prevState.stamina - 1, lastStaminaReset: prevState.lastStaminaReset || today }));
    setBattleMode(mode); setBattleCat(cat); setBattleCountry(''); setBattleIsDaily(true); setBattleFromReview(false); setBattlePreloadedWords(words); setBattleActive(true);
  }

  function handleStartBattleFromReview(words: Word[]) { setBattleMode('flip'); setBattleCat(words[0]?.cat || ''); setBattleCountry(''); setBattleIsDaily(false); setBattleFromReview(true); setBattlePreloadedWords(words); setBattleActive(true); }
  function handleExitBattle() { setBattleActive(false); if (battleFromReview) setActiveTab('review'); else if (battleIsDaily) setActiveTab('daily'); else setActiveTab('map'); }
  function handleRestartBattle() { setBattleActive(false); setTimeout(() => setBattleActive(true), 50); }

  const handleCorrectAnswer = useCallback(async (word: Word, xp: number) => {
    await addXP(xp); setXpPopup(xp);
    const lw = state.learnedWords || [];
    if (!lw.includes(word.id)) await updateState({ learnedWords: [...lw, word.id] });
    await updateMastery(word.id, true);
  }, [state, addXP, updateState, updateMastery]);

  const handleWrongAnswer = useCallback(async (word: Word) => {
    const newWrongWords = state.wrongWords.find(w => w.id === word.id) ? state.wrongWords : [...state.wrongWords, word];
    const newMasteryMap = getMasteryUpdate(word.id, false);
    await updateState({ wrongWords: newWrongWords, combo: 0, masteryMap: newMasteryMap });
  }, [state, updateState, getMasteryUpdate]);

  const handleVictory = useCallback(async (xpGained: number) => {
    await updateState({ todayKilled: (state.todayKilled || 0) + 1 });
    if (battleIsDaily) { await markDailyDone(); showToast('🎉 今日任務完成！獲得 +' + xpGained + ' EXP'); }
    else if (battleFromReview) {
      if (battlePreloadedWords && battlePreloadedWords.length > 0) {
        const selectedIds = new Set(battlePreloadedWords.map(w => w.id));
        const newWrongWords = (state.wrongWords || []).filter(w => !selectedIds.has(w.id));
        await updateState({ wrongWords: newWrongWords });
        showToast(`🎉 太棒了！已移除 ${battlePreloadedWords.length} 個單詞 🚀`);
      }
    } else {
      const prog = { ...state.progress };
      prog[`${battleCountry}_${battleCat}`] = (prog[`${battleCountry}_${battleCat}`] || 0) + 1;
      await updateState({ progress: prog });
      showToast('🎉 戰鬥勝利！獲得 +' + xpGained + ' EXP');
    }
  }, [state, battleIsDaily, battleFromReview, battleCountry, battleCat, battlePreloadedWords, updateState, markDailyDone, showToast]);

  const handleToggleFluent = useCallback(async (wordId: number) => {
    const isNowFluent = await toggleFluent(wordId);
    showToast(isNowFluent ? '🌟 已標記為滾瓜爛熟，不再出題！' : '📖 已取消滾瓜爛熟，重新加入練習');
  }, [toggleFluent, showToast]);

  const handleClaim = async () => {
    const success = await claimReward();
    if (success) { setXpPopup(15); showToast('🎁 領取成功！+15 EXP'); } else showToast('今天已經領取過了！');
  };

  if (loadProgress < 100) return <LoadingScreen progress={loadProgress} message={loadMessage} />;
  if (showStartScreen) return <StartScreen onStart={() => setShowStartScreen(false)} />;

  if (battleActive) return (
    <>
      <BattlePage mode={battleMode} cat={battleCat} country={battleCountry} preloadedWords={battlePreloadedWords} isDailyBattle={battleIsDaily} customWords={state.customWords || []} maxCombo={state.maxCombo} masteryMap={state.masteryMap} fluentWords={state.fluentWords || []} onCorrectAnswer={handleCorrectAnswer} onWrongAnswer={handleWrongAnswer} onVictory={handleVictory} onExit={handleExitBattle} onRestart={handleRestartBattle} />
      <XpGainAnimation amount={xpPopup} onDone={() => setXpPopup(null)} />
    </>
  );

  const level = getLevel(state.xp);
  const dailyDone = isDailyDone();
  const allWords = [...WORDS, ...wordBankWords, ...(state.customWords || [])];

  return (
    <div className="app" style={{ display: 'flex', flexDirection: 'column' }}>
      <Navbar streak={state.streak || 1} level={level} user={user} onAvatarClick={() => setActiveTab('settings')} />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {activeTab === 'map' && <MapPage customWords={state.customWords || []} wordBankWords={wordBankWords} state={state} onSelectAccent={handleSelectAccent} />
        }
        {activeTab === 'home' && <HomePage state={state} isDailyDone={dailyDone} onClaim={handleClaim} onSwitchTab={setActiveTab} />}
        {activeTab === 'daily' && <DailyPage state={state} isDailyDone={dailyDone} onSwitchToHome={() => setActiveTab('home')} onSwitchToSettings={() => setActiveTab('settings')} onStartBattle={handleStartBattleFromDaily} />}
        {activeTab === 'glossary' && <GlossaryPage words={allWords} state={state} onToggleFluent={handleToggleFluent} />}
        {activeTab === 'review' && <ReviewPage wrongWords={state.wrongWords || []} onChallenge={handleStartBattleFromReview} onRemove={async (id) => { await removeWrongWord(id); showToast('已移除！繼續加油 💪'); }} />}
        {activeTab === 'add' && <AddWordPage onAdd={async (word) => { await addCustomWord(word); }} onToast={showToast} />}
        {activeTab === 'settings' && <SettingsPage state={state} user={user} onUpdate={updateState} onSignIn={signIn} onSignOut={signOut} onToast={showToast} />}
      </div>
      <Tabbar activeTab={activeTab} onSwitch={setActiveTab} />
      {showModePanel && <ModeSelectModal title={`${COUNTRIES[pendingCountry]?.flag || ''} ${COUNTRIES[pendingCountry]?.name || ''} × ${CAT_INFO[pendingCat]?.icon || ''} ${CAT_INFO[pendingCat]?.name || ''}`} subtitle={`選擇戰鬥模式，準備迎戰 ${CAT_INFO[pendingCat]?.monsterName || '怪獸'}！`} onSelect={handleStartBattleFromMap} onClose={() => setShowModePanel(false)} />}
      <XpGainAnimation amount={xpPopup} onDone={() => setXpPopup(null)} />
    </div>
  );
}





