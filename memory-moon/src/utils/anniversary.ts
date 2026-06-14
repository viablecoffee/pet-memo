import type { Memory, Letter } from '../types';

/** Local date as "YYYY-MM-DD" (matches the Memory.date / Letter.openDate format). */
export const todayYMD = (d: Date = new Date()): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export interface OnThisDayMatch extends Memory {
  yearsAgo: number;
}

/**
 * Memories whose month-day matches `refDate`, from earlier years (yearsAgo >= 1),
 * oldest first. "X years ago today".
 */
export const getOnThisDay = (memories: Memory[], refDate: Date = new Date()): OnThisDayMatch[] => {
  const mmdd = `${String(refDate.getMonth() + 1).padStart(2, '0')}-${String(refDate.getDate()).padStart(2, '0')}`;
  const refYear = refDate.getFullYear();
  return memories
    .filter(m => m.date.slice(5) === mmdd)
    .map(m => ({ ...m, yearsAgo: refYear - Number(m.date.slice(0, 4)) }))
    .filter(m => m.yearsAgo >= 1)
    .sort((a, b) => b.yearsAgo - a.yearsAgo);
};

/** Letters that have reached their open date and haven't been opened yet. */
export const getDueLetters = (letters: Letter[] = [], today: string = todayYMD()): Letter[] =>
  letters.filter(l => !l.opened && l.openDate <= today);

/** True if a "YYYY-MM-DD" date's month-day matches refDate. */
export const isAnniversaryToday = (dateStr: string | undefined | null, refDate: Date = new Date()): boolean => {
  if (!dateStr) return false;
  const mmdd = `${String(refDate.getMonth() + 1).padStart(2, '0')}-${String(refDate.getDate()).padStart(2, '0')}`;
  return dateStr.slice(5) === mmdd;
};

/** Whole years between a "YYYY-MM-DD" date and refDate. */
export const yearsSince = (dateStr: string, refDate: Date = new Date()): number =>
  refDate.getFullYear() - Number(dateStr.slice(0, 4));
