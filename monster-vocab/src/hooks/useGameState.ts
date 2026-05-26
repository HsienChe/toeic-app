import { useState, useCallback, useEffect } from 'react';
import type { GameState, Word, WordMastery, MasteryLevel, WordStatus } from '../types';

const DEFAULT_STATE: GameState = {
  xp: 0,
  streak: 1,
  lastLogin: null,
  lastActiveDate: null,
  todayKilled: 0,
  goal: 10,
  combo: 0,
  maxCombo: 0,
  wrongWords: [],
  customWords: [],
  learnedWords: [],
  remindTime: '20:00',
  progress: {},
  dailyCompleted: {},
  weeklyGoals: {
    sunday: null,
    monday: null,
    tuesday: null,
    wednesday: null,
    thursday: null,
    friday: null,
    saturday: null,
    lastSetDate: null,
  },
  masteryMap: {},
  fluentWords: [],
  stamina: 5,
  lastStaminaReset: null,
};

function loadLocalState(): GameState {
  try {
    const r = localStorage.getItem('monsterGameState');
    if (r) {
      const parsed = JSON.parse(r);
      const today = new Date().toDateString();
      // 每天重置體力
      const shouldResetStamina = parsed.lastStaminaReset !== today;
      return {
        ...DEFAULT_STATE,
        ...parsed,
        stamina: shouldResetStamina ? 5 : (parsed.stamina ?? DEFAULT_STATE.stamina),
        lastStaminaReset: shouldResetStamina ? today : parsed.lastStaminaReset,
        weeklyGoals: { ...DEFAULT_STATE.weeklyGoals, ...(parsed.weeklyGoals || {}) },
        dailyCompleted: parsed.dailyCompleted || {},
        masteryMap: parsed.masteryMap || {},
        fluentWords: parsed.fluentWords || [],
      };
    }
  } catch (e) {}
  return { ...DEFAULT_STATE };
}

function computeStatus(m: WordMastery, isFluentWord: boolean): WordStatus {
  if (isFluentWord) return 'fluent';
  if (m.level === 3) return 'mastered';
  if (m.wrongCount >= 3) return 'weak';
  if (m.level === 0) return 'new';
  return 'learning';
}

function computeLevel(
  current: MasteryLevel,
  consecutiveCorrect: number,
  isCorrect: boolean
): MasteryLevel {
  if (!isCorrect) return Math.max(0, current - 1) as MasteryLevel;
  if (consecutiveCorrect >= 3 && current < 3) return Math.min(3, current + 1) as MasteryLevel;
  if (consecutiveCorrect >= 2 && current < 3) return Math.min(3, current + 1) as MasteryLevel;
  if (current === 0) return 1;
  return current;
}

export function useGameState() {
  const [state, setState] = useState<GameState>(loadLocalState);

  const saveState = useCallback(async (newState: GameState) => {
    setState(newState);
    localStorage.setItem('monsterGameState', JSON.stringify(newState));
    const w = window as any;
    if (w.currentUser && w.db && w.fbSetDoc && w.fbDoc) {
      try {
        await w.fbSetDoc(w.fbDoc(w.db, 'users', w.currentUser.uid), newState, { merge: true });
      } catch (e) {}
    }
  }, []);

  const updateState = useCallback(
    async (partial: Partial<GameState> | ((prevState: GameState) => Partial<GameState>)) => {
      const newPartial = typeof partial === 'function' ? partial(state) : partial;
      const newState = { ...state, ...newPartial };
      await saveState(newState);
    },
    [state, saveState]
  );

  useEffect(() => {
    const today = new Date().toDateString();
    if (state.lastActiveDate !== today) {
      updateState({ todayKilled: 0, combo: 0, lastActiveDate: today });
    }
  }, []); // eslint-disable-line

  const addXP = useCallback(
    async (amt: number) => {
      const newXP = state.xp + amt;
      await updateState({ xp: newXP });
      return newXP;
    },
    [state, updateState]
  );

  const addWrongWord = useCallback(
    async (word: Word) => {
      const existing = state.wrongWords && state.wrongWords.find(w => w.id === word.id);
      if (!existing) {
        const newWrongWords = (state.wrongWords || []).concat([word]);
        await updateState({ wrongWords: newWrongWords });
      }
    },
    [state, updateState]
  );

  const removeWrongWord = useCallback(
    async (id: number) => {
      await updateState({ wrongWords: state.wrongWords.filter(w => w.id !== id) });
    },
    [state, updateState]
  );

  const claimReward = useCallback(async () => {
    const today = new Date().toDateString();
    if (state.lastLogin === today) return false;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const newStreak = state.lastLogin === yesterday ? (state.streak || 1) + 1 : 1;
    const newXP = state.xp + 15;
    await updateState({ lastLogin: today, streak: newStreak, xp: newXP });
    return true;
  }, [state, updateState]);

  const addCustomWord = useCallback(
    async (word: Word) => {
      await updateState({ customWords: [...state.customWords, word] });
    },
    [state, updateState]
  );

  const markDailyDone = useCallback(async () => {
    const today = new Date().toDateString();
    await updateState({
      dailyCompleted: { ...state.dailyCompleted, [today]: true },
    });
  }, [state, updateState]);

  const isDailyDone = (): boolean => {
    const today = new Date().toDateString();
    return !!(state.dailyCompleted && state.dailyCompleted[today]);
  };

  // ── 更新單字熟練度 ────────────────────────────────────────
  // 1. 純計算，只 return，不存
const getMasteryUpdate = useCallback(
  (wordId: number, isCorrect: boolean) => {
    const isFluent = (state.fluentWords || []).includes(wordId);
    const prev = state.masteryMap[wordId] || {
      wordId,
      level: 0 as MasteryLevel,
      correctCount: 0,
      wrongCount: 0,
      consecutiveCorrect: 0,
      lastReview: null,
      status: 'new' as WordStatus,
    };

    const consecutiveCorrect = isCorrect ? prev.consecutiveCorrect + 1 : 0;
    const correctCount = isCorrect ? prev.correctCount + 1 : prev.correctCount;
    const wrongCount = isCorrect ? prev.wrongCount : prev.wrongCount + 1;
    const newLevel = computeLevel(prev.level, consecutiveCorrect, isCorrect);

    const updated: WordMastery = {
      ...prev,
      level: newLevel,
      correctCount,
      wrongCount,
      consecutiveCorrect,
      lastReview: new Date().toISOString().slice(0, 10),
      status: 'new',
    };
    updated.status = computeStatus(updated, isFluent);

    return { ...state.masteryMap, [wordId]: updated };
  },
  [state]
);

// 2. 計算 + 存檔
const updateMastery = useCallback(
  async (wordId: number, isCorrect: boolean) => {
    const newMasteryMap = getMasteryUpdate(wordId, isCorrect);
    await updateState({ masteryMap: newMasteryMap });
  },
  [getMasteryUpdate, updateState]
);


  // ── 切換滾瓜爛熟狀態 ─────────────────────────────────────
  // isFluent=true → 加入；false → 移除
  const toggleFluent = useCallback(
    async (wordId: number) => {
      const current = state.fluentWords || [];
      const isCurrentlyFluent = current.includes(wordId);
      const newFluentWords = isCurrentlyFluent
        ? current.filter(id => id !== wordId)
        : [...current, wordId];

      // 同步更新 masteryMap 裡的 status
      const prevMastery = state.masteryMap[wordId];
      let newMasteryMap = { ...state.masteryMap };
      if (prevMastery) {
        const updated: WordMastery = {
          ...prevMastery,
          status: computeStatus(prevMastery, !isCurrentlyFluent),
        };
        newMasteryMap = { ...newMasteryMap, [wordId]: updated };
      } else if (!isCurrentlyFluent) {
        // 尚未有 mastery 紀錄，建立一筆 fluent 的
        const newEntry: WordMastery = {
          wordId,
          level: 3,
          correctCount: 0,
          wrongCount: 0,
          consecutiveCorrect: 0,
          lastReview: new Date().toISOString().slice(0, 10),
          status: 'fluent',
        };
        newMasteryMap = { ...newMasteryMap, [wordId]: newEntry };
      }

      await updateState({ fluentWords: newFluentWords, masteryMap: newMasteryMap });
      return !isCurrentlyFluent; // 回傳新狀態
    },
    [state, updateState]
  );

  const syncFromFirebase = useCallback(
    async (data: Partial<GameState>) => {
      const newState = { ...state, ...data };
      setState(newState);
      localStorage.setItem('monsterGameState', JSON.stringify(newState));
    },
    [state]
  );

return {
  state,
  updateState,
  addXP,
  addWrongWord,
  removeWrongWord,
  claimReward,
  addCustomWord,
  markDailyDone,
  isDailyDone,
  updateMastery,
  getMasteryUpdate,
  toggleFluent,
  syncFromFirebase,
};
}  // ← 加這行