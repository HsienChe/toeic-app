import { useState, useCallback } from 'react';
import BattleHeader from './BattleHeader';
import MonsterArea from './MonsterArea';
import ModeFlip from './ModeFlip';
import ModeChoice from './ModeChoice';
import ModeFill from './ModeFill';
import VictoryScreen from './VictoryScreen';
import FailureScreen from './FailureScreen';
import { WORDS, CAT_INFO, MONSTERS } from '../../data/gameData';
import type { Word, BattleMode, WordMastery } from '../../types';

interface BattlePageProps {
  mode: BattleMode;
  cat: string;
  preloadedWords?: Word[];
  country: string;
  isDailyBattle: boolean;
  customWords: Word[];
  maxCombo: number;
  masteryMap?: Record<number, WordMastery>;
  fluentWords?: number[];   // ← 新增：滾瓜爛熟 id 清單
  onCorrectAnswer: (word: Word, xp: number) => void;
  onWrongAnswer: (word: Word) => void;
  onVictory: (xpGained: number) => void;
  onExit: () => void;
  onRestart: () => void;
}

type ShakeType = 'shake' | 'heal' | null;
type BattlePhase = 'battle' | 'victory' | 'failure';

const ACCENT_LANG: Record<string, string> = {
  au: 'en-AU', uk: 'en-GB', us: 'en-US', ca: 'en-CA',
};

function speakWord(word: string, country: string) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = ACCENT_LANG[country] ?? 'en-US';
  utterance.rate = 0.9;
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}

function getModeForIdx(mode: BattleMode, idx: number): Exclude<BattleMode, 'mix'> {
  if (mode !== 'mix') return mode as Exclude<BattleMode, 'mix'>;
  return (['flip', 'choice', 'fill'] as const)[idx % 3];
}

function getWordWeight(mastery: WordMastery | undefined): number {
  if (!mastery || mastery.status === 'new') return 40;
  if (mastery.status === 'learning') return 35;
  if (mastery.status === 'weak') return 20;
  if (mastery.status === 'mastered') return 5;
  return 35;
}

function weightedSample(
  pool: Word[],
  masteryMap: Record<number, WordMastery>,
  count: number
): Word[] {
  if (pool.length === 0) return [];
  if (pool.length <= count) return pool.sort(() => Math.random() - 0.5);

  const weighted = pool.map(w => ({ word: w, weight: getWordWeight(masteryMap[w.id]) }));
  const selected: Word[] = [];
  const usedIds = new Set<number>();

  for (let i = 0; i < count; i++) {
    const available = weighted.filter(x => !usedIds.has(x.word.id));
    if (available.length === 0) break;
    const totalWeight = available.reduce((s, x) => s + x.weight, 0);
    let rand = Math.random() * totalWeight;
    for (const item of available) {
      rand -= item.weight;
      if (rand <= 0) {
        selected.push(item.word);
        usedIds.add(item.word.id);
        break;
      }
    }
  }
  return selected;
}

export default function BattlePage({
  mode, cat, country, isDailyBattle,
  preloadedWords, customWords, maxCombo,
  masteryMap = {},
  fluentWords = [],
  onCorrectAnswer, onWrongAnswer, onVictory, onExit, onRestart,
}: BattlePageProps) {
  const allWords = [...WORDS, ...customWords];
  const fluentSet = new Set(fluentWords);

  const [words] = useState<Word[]>(() => {
    if (preloadedWords && preloadedWords.length > 0) {
      // preloadedWords 也需要過濾滾瓜爛熟
      return preloadedWords.filter(w => !fluentSet.has(w.id));
    }
    // 過濾滾瓜爛熟後再加權抽樣
    const filtered = allWords.filter(w => (!cat || w.cat === cat) && !fluentSet.has(w.id));
    return weightedSample(filtered, masteryMap, 10);
  });

  const ci = CAT_INFO[cat] || { monster: 'book' };
  const monster = MONSTERS[ci.monster] || MONSTERS.book;

  const [idx, setIdx] = useState(0);
  const [monsterHP, setMonsterHP] = useState(monster.hp);
  const [correct, setCorrect] = useState(0);
  const [xpGained, setXpGained] = useState(0);
  const [combo, setCombo] = useState(0);
  const [failed, setFailed] = useState(false);
  const [phase, setPhase] = useState<BattlePhase>('battle');
  const [shakeType, setShakeType] = useState<ShakeType>(null);
  const [damageText, setDamageText] = useState<string | null>(null);

  const dmgPerQ = Math.ceil(monster.hp / Math.max(words.length, 1));
  const speak = useCallback((word: string) => speakWord(word, country), [country]);

  function triggerShake(type: ShakeType) {
    setShakeType(type);
    setTimeout(() => setShakeType(null), 400);
  }

  function triggerDamage(text: string) {
    setDamageText(text);
    setTimeout(() => setDamageText(null), 800);
  }

// 替換為：支援 fill 模式的提示扣分
const handleCorrect = useCallback((word: Word, usedHint = false, usedSpeak = false) => {
  const newCombo = combo + 1;
  setCombo(newCombo);
  setCorrect(c => c + 1);
  const dmg = dmgPerQ + (newCombo > 2 ? 3 : 0);
  setMonsterHP(hp => Math.max(1, hp - dmg));
  triggerShake('shake');
  triggerDamage(`-${dmg}`);
  let xp = (mode === 'fill' ? 15 : mode === 'choice' ? 10 : 7) + (newCombo > 2 ? 5 : 0);
  if (usedHint) xp = Math.max(0, xp - 5);
  if (usedSpeak) xp = Math.max(0, xp - 3);
  setXpGained(x => x + xp);
  onCorrectAnswer(word, xp);
}, [combo, dmgPerQ, mode, onCorrectAnswer]);

  const handleWrong = useCallback((word: Word) => {
    setCombo(0);
    setFailed(true);
    const heal = Math.min(15, Math.round(monster.hp * 0.1));
    setMonsterHP(hp => Math.min(monster.hp, hp + heal));
    triggerShake('heal');
    onWrongAnswer(word);
  }, [monster.hp, onWrongAnswer]);

  function handleNext() {
    const next = idx + 1;
    if (next >= words.length) {
      if (failed || correct !== words.length) {
        setPhase('failure');
      } else {
        onVictory(xpGained);
        setPhase('victory');
      }
    } else {
      setIdx(next);
    }
  }

  // 若全部單字都是滾瓜爛熟（words 為空），直接顯示提示
  if (words.length === 0) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        height: '100vh', padding: 32, textAlign: 'center',
        background: '#f8fafc',
      }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>🌟</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: '#1f2937', marginBottom: 8 }}>
          全部都滾瓜爛熟了！
        </div>
        <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 28 }}>
          這個類別的單字都已標記為「滾瓜爛熟」，<br/>無法出題。
        </div>
        <button
          onClick={onExit}
          style={{
            padding: '12px 32px', borderRadius: 14, border: 'none',
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            color: '#fff', fontSize: 16, fontWeight: 800, cursor: 'pointer',
          }}
        >
          返回地圖
        </button>
      </div>
    );
  }

  const progress = (idx / words.length) * 100;
  const currentWord = words[idx];
  const currentMode = getModeForIdx(mode, idx);

  if (phase === 'victory') {
    return (
      <VictoryScreen
        monsterEmoji={monster.emoji}
        correct={correct}
        total={words.length}
        xpGained={xpGained}
        maxCombo={maxCombo}
        country={country}
        onBack={onExit}
        onRestart={onRestart}
      />
    );
  }

  if (phase === 'failure') {
    return (
      <FailureScreen
        correct={correct}
        total={words.length}
        onBack={onExit}
        onRestart={onRestart}
      />
    );
  }

  return (
    <div className="battle-screen" style={{ display: 'flex' }}>
      <BattleHeader
        progress={progress}
        progText={`${idx} / ${words.length}`}
        combo={combo}
        onExit={onExit}
      />
      <MonsterArea
        monsterType={ci.monster}
        monsterName={monster.name}
        hp={monsterHP}
        maxHp={monster.hp}
        shakeType={shakeType}
        damageText={damageText}
      />
      <div className="battle-card-area">
        {currentMode === 'flip' && (
          <ModeFlip
            key={idx} word={currentWord}
            onCorrect={() => handleCorrect(currentWord)}
            onWrong={() => handleWrong(currentWord)}
            onNext={handleNext}
            onSpeak={speak}
          />
        )}
        {currentMode === 'choice' && (
          <ModeChoice
            key={idx} word={currentWord} allWords={allWords}
            onCorrect={() => handleCorrect(currentWord)}
            onWrong={() => handleWrong(currentWord)}
            onNext={handleNext}
            onSpeak={speak}
          />
        )}
        {currentMode === 'fill' && (
         <ModeFill
          key={idx} word={currentWord}
          onCorrect={(usedHint, usedSpeak) => handleCorrect(currentWord, usedHint, usedSpeak)}
          onWrong={() => handleWrong(currentWord)}
          onNext={handleNext}
          onSpeak={speak}
  />
)}
      </div>
    </div>
  );
}
