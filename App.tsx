import { useState, useCallback, useEffect } from 'react';
import LoadingScreen from './src/components/LoadingScreen';
import Navbar from './src/components/Navbar';
import Tabbar from './src/components/Tabbar';
import XpGainAnimation from './src/components/XpGainAnimation';
import HomePage from './src/pages/HomePage/HomePage';
import MapPage from './src/pages/MapPage/MapPage';
import ReviewPage from './src/pages/ReviewPage';
import AddWordPage from './src/pages/AddWordPage';
import SettingsPage from './src/pages/SettingsPage';
import DailyPage from './src/pages/DailyPage';
import GlossaryPage from './src/pages/GlossaryPage/GlossaryPage';
import ModeSelectModal from './src/pages/BattlePage/ModeSelectModal';
import BattlePage from './src/pages/BattlePage/BattlePage';
import { useGameState } from './src/hooks/useGameState';
import { useFirebaseAuth } from './src/hooks/useFirebaseAuth';
import { useToast } from './src/hooks/useToast';
import { getLevel } from './src/utils/xpUtils';
import { CAT_INFO, COUNTRIES, WORDS } from './src/data/gameData';
import type { TabName, BattleMode, Word } from './src/types';
import StartScreen from './src/components/StartScreen';

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
  if (data?.length > 0) {
    setWordBankWords(data);
    return;
  }
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

  // ── 管理加載進度 ─────────────────────────────────────────────
  useEffect(() => {
    if (authLoading) {
      setLoadProgress(30);
      setLoadMessage('認證中...');
    } else {
      setLoadProgress(70);
      setLoadMessage('載入遊戲資料...');
      // 模擬資料加載延遲
      const timer = setTimeout(() => {
        setLoadProgress(100);
        setLoadMessage('準備完成！');
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [authLoading]);

  // 強制 fallback：最多 4 秒後一定完成載入
useEffect(() => {
  const fallback = setTimeout(() => {
    setLoadProgress(100);
  }, 4000);
  return () => clearTimeout(fallback);
}, []);

useEffect(() => {
  const data = (window as any).wordBankData;
  console.log('useEffect 跑了，wordBankData 筆數:', data?.length);
  if (data?.length > 0) {
    setWordBankWords(data);
    return;
  }
  const handler = () => setWordBankWords((window as any).wordBankData || []);
  window.addEventListener('wordBankReady', handler, { once: true });
  return () => window.removeEventListener('wordBankReady', handler);
}, []);

// 放在 App.tsx，useGameState 解構之後
useEffect(() => {
  const handleSync = (e: CustomEvent) => {
    if (e.detail) syncFromFirebase(e.detail);
  };
  window.addEventListener('firestoreSync' as any, handleSync);
  return () => window.removeEventListener('firestoreSync' as any, handleSync);
}, [syncFromFirebase]);

  function handleSelectAccent(cat: string, country: string) {
    setPendingCat(cat);
    setPendingCountry(country);
    setShowModePanel(true);
  }

  function handleStartBattleFromMap(mode: BattleMode) {
    setBattleMode(mode);
    setBattleCat(pendingCat);
    setBattleCountry(pendingCountry);
    setBattleIsDaily(false);
    setBattlePreloadedWords(undefined);
    setShowModePanel(false);
    setBattleActive(true);
  }

  function handleStartBattleFromDaily(mode: BattleMode, words: Word[], cat: string) {
    // 檢查體力是否足夠
    if (state.stamina <= 0) {
      showToast('❌ 體力不足，請明天再來挑戰！');
      return;
    }
    
    // 扣除 1 點體力，使用函數式更新確保獲得最新狀態，同時更新 lastStaminaReset
    const today = new Date().toDateString();
    updateState((prevState) => ({ 
      stamina: prevState.stamina - 1,
      lastStaminaReset: prevState.lastStaminaReset || today
    }));
    
    setBattleMode(mode);
    setBattleCat(cat);
    setBattleCountry('');
    setBattleIsDaily(true);
    setBattleFromReview(false);
    setBattlePreloadedWords(words);
    setBattleActive(true);
  }

  function handleStartBattleFromReview(words: Word[]) {
    setBattleMode('flip');
    setBattleCat(words[0]?.cat || '');
    setBattleCountry('');
    setBattleIsDaily(false);
    setBattleFromReview(true);
    setBattlePreloadedWords(words);
    setBattleActive(true);
  }

  function handleExitBattle() {
    setBattleActive(false);
    if (battleFromReview) setActiveTab('review');
    else if (battleIsDaily) setActiveTab('daily');
    else setActiveTab('map');
  }

  function handleRestartBattle() {
    setBattleActive(false);
    setTimeout(() => setBattleActive(true), 50);
  }

  const handleCorrectAnswer = useCallback(async (word: Word, xp: number) => {
    await addXP(xp);
    setXpPopup(xp);
    const lw = state.learnedWords || [];
    if (!lw.includes(word.id)) {
      await updateState({ learnedWords: [...lw, word.id] });
    }
    await updateMastery(word.id, true);
  }, [state, addXP, updateState, updateMastery]);

const handleWrongAnswer = useCallback(async (word: Word) => {
  const newWrongWords = state.wrongWords.find(w => w.id === word.id)
    ? state.wrongWords
    : [...state.wrongWords, word];
  const newMasteryMap = getMasteryUpdate(word.id, false);
  await updateState({
    wrongWords: newWrongWords,
    combo: 0,
    masteryMap: newMasteryMap,
  });
}, [state, updateState, getMasteryUpdate]);

  const handleVictory = useCallback(async (xpGained: number) => {
    await updateState({ todayKilled: (state.todayKilled || 0) + 1 });
    if (battleIsDaily) {
      await markDailyDone();
      showToast('🎉 今日任務完成！獲得 +' + xpGained + ' EXP');
    } else if (battleFromReview) {
      if (battlePreloadedWords && battlePreloadedWords.length > 0) {
        const selectedIds = new Set(battlePreloadedWords.map(w => w.id));
        const newWrongWords = (state.wrongWords || []).filter(w => !selectedIds.has(w.id));
        await updateState({ wrongWords: newWrongWords });
        showToast(`🎉 太棒了！已移除 ${battlePreloadedWords.length} 個單詞 🚀`);
      }
    } else {
      const prog = { ...state.progress };
      const key = `${battleCountry}_${battleCat}`;
      prog[key] = (prog[key] || 0) + 1;
      await updateState({ progress: prog });
      showToast('🎉 戰鬥勝利！獲得 +' + xpGained + ' EXP');
    }
  }, [state, battleIsDaily, battleFromReview, battleCountry, battleCat, battlePreloadedWords, updateState, markDailyDone, showToast]);

  // ── 滾瓜爛熟切換 ─────────────────────────────────────────────
  const handleToggleFluent = useCallback(async (wordId: number) => {
    const isNowFluent = await toggleFluent(wordId);
    showToast(isNowFluent
      ? '🌟 已標記為滾瓜爛熟，不再出題！'
      : '📖 已取消滾瓜爛熟，重新加入練習'
    );
  }, [toggleFluent, showToast]);

  const handleClaim = async () => {
    const success = await claimReward();
    if (success) { setXpPopup(15); showToast('🎁 領取成功！+15 EXP'); }
    else showToast('今天已經領取過了！');
  };

  

if (loadProgress < 100) {
  return <LoadingScreen progress={loadProgress} message={loadMessage} />;
}

// ← 加這行
console.log('loadProgress=100, showStartScreen=', showStartScreen);

if (showStartScreen) {
  return <StartScreen onStart={() => setShowStartScreen(false)} />;
}
  if (battleActive) {
    return (
      <>
        <BattlePage
          mode={battleMode}
          cat={battleCat}
          country={battleCountry}
          preloadedWords={battlePreloadedWords}
          isDailyBattle={battleIsDaily}
          customWords={state.customWords || []}
          maxCombo={state.maxCombo}
          masteryMap={state.masteryMap}
          fluentWords={state.fluentWords || []}
          onCorrectAnswer={handleCorrectAnswer}
          onWrongAnswer={handleWrongAnswer}
          onVictory={handleVictory}
          onExit={handleExitBattle}
          onRestart={handleRestartBattle}
        />
        <XpGainAnimation amount={xpPopup} onDone={() => setXpPopup(null)} />
      </>
    );
  }

  const level = getLevel(state.xp);
  const dailyDone = isDailyDone();
  const allWords = [...WORDS, ...wordBankWords, ...(state.customWords || [])];

  return (
    <div className="app" style={{ display: 'flex', flexDirection: 'column' }}>
      <Navbar
        streak={state.streak || 1}
        level={level}
        user={user}
        onAvatarClick={() => setActiveTab('settings')}
      />

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {activeTab === 'home' && (
          <HomePage
            state={state}
            isDailyDone={dailyDone}
            onClaim={handleClaim}
            onSwitchTab={setActiveTab}
          />
        )}
        {activeTab === 'map' && (
          <MapPage
            customWords={state.customWords || []}
            state={state}
            onSelectAccent={handleSelectAccent}
          />
        )}
        {activeTab === 'daily' && (
          <DailyPage
            state={state}
            isDailyDone={dailyDone}
            onSwitchToHome={() => setActiveTab('home')}
            onSwitchToSettings={() => setActiveTab('settings')}
            onStartBattle={handleStartBattleFromDaily}
          />
        )}
        {activeTab === 'glossary' && (
          <GlossaryPage
            words={allWords}
            state={state}
            onToggleFluent={handleToggleFluent}
          />
        )}
        {activeTab === 'review' && (
          <ReviewPage
            wrongWords={state.wrongWords || []}
            onChallenge={handleStartBattleFromReview}
            onRemove={async (id) => {
              await removeWrongWord(id);
              showToast('已移除！繼續加油 💪');
            }}
          />
        )}
        {activeTab === 'add' && (
          <AddWordPage
            onAdd={async (word) => { await addCustomWord(word); }}
            onToast={showToast}
          />
        )}
        {activeTab === 'settings' && (
          <SettingsPage
            state={state}
            user={user}
            onUpdate={updateState}
            onSignIn={signIn}
            onSignOut={signOut}
            onToast={showToast}
          />
        )}
      </div>

      <Tabbar activeTab={activeTab} onSwitch={setActiveTab} />

      {showModePanel && (
        <ModeSelectModal
          title={`${COUNTRIES[pendingCountry]?.flag || ''} ${COUNTRIES[pendingCountry]?.name || ''} × ${CAT_INFO[pendingCat]?.icon || ''} ${CAT_INFO[pendingCat]?.name || ''}`}
          subtitle={`選擇戰鬥模式，準備迎戰 ${CAT_INFO[pendingCat]?.monsterName || '怪獸'}！`}
          onSelect={handleStartBattleFromMap}
          onClose={() => setShowModePanel(false)}
        />
      )}

      <XpGainAnimation amount={xpPopup} onDone={() => setXpPopup(null)} />
    </div>
  );
}

