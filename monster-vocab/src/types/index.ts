export interface Word {
  id: number;
  word: string;
  phonetic: string;
  meaning: string;
  example?: string;
  cat: string;
  country: string;
  monster: string;
  day: number;
}

export interface CountryInfo {
  name: string;
  flag: string;
  accent: string;
  days: number;
  cardClass: string;
  chipClass: string;
}

export interface CatInfo {
  name: string;
  icon: string;
  monster: string;
  monsterName: string;
  color: string;
  bg: string;
}

export interface MonsterInfo {
  name: string;
  emoji: string;
  hp: number;
}

export interface TitleInfo {
  name: string;
  level: number;
}

export type BattleMode = 'flip' | 'choice' | 'fill' | 'mix';
export type TabName = 'home' | 'map' | 'daily' | 'review' | 'add' | 'settings' | 'glossary';

export interface WeeklyGoals {
  sunday: string | null;
  monday: string | null;
  tuesday: string | null;
  wednesday: string | null;
  thursday: string | null;
  friday: string | null;
  saturday: string | null;
  lastSetDate: string | null;
}

// 0 = 未解鎖, 1 = 學習中 ★☆☆, 2 = 熟悉 ★★☆, 3 = 精通 ★★★
export type MasteryLevel = 0 | 1 | 2 | 3;

// fluent = 滾瓜爛熟，不參與出題
export type WordStatus = 'new' | 'learning' | 'weak' | 'mastered' | 'fluent';

export interface WordMastery {
  wordId: number;
  level: MasteryLevel;
  correctCount: number;
  wrongCount: number;
  consecutiveCorrect: number;
  lastReview: string | null;
  status: WordStatus;
}

export interface GameState {
  xp: number;
  streak: number;
  lastLogin: string | null;
  lastActiveDate: string | null;
  todayKilled: number;
  goal: number;
  combo: number;
  maxCombo: number;
  wrongWords: Word[];
  customWords: Word[];
  learnedWords: number[];
  remindTime: string;
  progress: Record<string, number>;
  weeklyGoals: WeeklyGoals;
  dailyCompleted: Record<string, boolean>;
  masteryMap: Record<number, WordMastery>;
  // 滾瓜爛熟單字 id 集合（不參與出題）
  fluentWords: number[];
  // 體力值 (daily 挑戰消耗，每天回復)
  stamina: number;
  lastStaminaReset: string | null;
}

export interface BattleState {
  words: Word[];
  idx: number;
  mode: BattleMode;
  monster: MonsterInfo | null;
  monsterHP: number;
  monsterMaxHP: number;
  correct: number;
  xpGained: number;
  combo: number;
  answered: boolean;
  flipped: boolean;
  failed: boolean;
  isDailyBattle: boolean;
  currentCountry: string;
  currentCat: string;
}
