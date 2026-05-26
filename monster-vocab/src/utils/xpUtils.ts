import { XP_TABLE, TITLES } from '../data/gameData';

export function getLevel(xp: number): number {
  for (let i = XP_TABLE.length - 1; i >= 0; i--) {
    if (xp >= XP_TABLE[i]) return i + 1;
  }
  return 1;
}

export function getLvXP(xp: number): { cur: number; max: number; pct: number } {
  const lv = getLevel(xp);
  const cur = XP_TABLE[lv - 1] || 0;
  const next = XP_TABLE[lv] || XP_TABLE[XP_TABLE.length - 1] + 500;
  return {
    cur: xp - cur,
    max: next - cur,
    pct: Math.round(((xp - cur) / (next - cur)) * 100),
  };
}

export function getTitle(lv: number): string {
  let t = TITLES[0];
  for (const ti of TITLES) {
    if (lv >= ti.level) t = ti;
  }
  return t.name;
}
