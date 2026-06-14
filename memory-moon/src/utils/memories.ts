/** Chronological sort shared by the 3D stars, the camera focus index, and the tour. */
export const sortMemoriesByDate = <T extends { date: string }>(items: T[]): T[] =>
  [...items].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
