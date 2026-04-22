/**
 * Categories are stored in the DB as a comma-separated string,
 * e.g. "Backend,Security,Java".
 *
 * These helpers are the single source of truth for parsing and
 * serialising that format throughout the app.
 */

/** "Backend, Security , Java" → ["Backend", "Security", "Java"] */
export function parseCategories(raw) {
  if (!raw || !raw.trim()) return [];
  return raw
    .split(',')
    .map(c => c.trim())
    .filter(Boolean);
}

/** ["Backend", "Security"] → "Backend,Security" (for DB storage) */
export function serializeCategories(arr) {
  return arr.filter(Boolean).join(',');
}

/**
 * Returns true when a note matches a search term.
 * Checks title, content, and every individual category.
 */
export function noteMatchesSearch(note, term) {
  if (!term) return true;
  const t = term.toLowerCase();
  if (note.title.toLowerCase().includes(t))            return true;
  if ((note.content ?? '').toLowerCase().includes(t))  return true;
  return parseCategories(note.category).some(c => c.toLowerCase().includes(t));
}

/**
 * Returns true when a note has at least one category that overlaps
 * with the active category set (OR logic across multiple selections).
 */
export function noteMatchesCategories(note, activeSet) {
  if (activeSet.size === 0) return true;
  return parseCategories(note.category).some(c => activeSet.has(c));
}

/**
 * Returns a sorted deduplicated list of all categories across all notes.
 */
export function allCategories(notes) {
  const set = new Set();
  notes.forEach(n => parseCategories(n.category).forEach(c => set.add(c)));
  return [...set].sort();
}

/**
 * Deterministic colour derived from a category string.
 * Same input always returns the same colour.
 */
const PALETTE = [
  '#7F77DD','#1D9E75','#EF9F27','#E24B4A',
  '#378ADD','#D85A30','#D45380','#6B3FA0',
];
export function categoryColor(str, notes = []) {
  // If any note using this category has a nodeColor, use that
  const sample = notes.find(n =>
    n.nodeColor && parseCategories(n.category).includes(str)
  );
  if (sample?.nodeColor) return sample.nodeColor;

  // Deterministic hash
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return PALETTE[Math.abs(h) % PALETTE.length];
}