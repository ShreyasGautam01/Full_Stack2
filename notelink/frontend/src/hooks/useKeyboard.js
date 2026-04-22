import { useEffect } from 'react';

/**
 * useKeyboard(bindings)
 *
 * bindings: array of { key, ctrl?, shift?, alt?, handler }
 *
 * Example:
 *   useKeyboard([
 *     { key: 'Escape', handler: handleEscape },
 *     { key: 's', ctrl: true, handler: handleSave },
 *   ]);
 *
 * Prevents default for all matched bindings so the browser does not
 * interfere (e.g. Ctrl+S triggering "Save page").
 */
export function useKeyboard(bindings) {
  useEffect(() => {
    if (!bindings?.length) return;

    const handle = (e) => {
      for (const b of bindings) {
        const keyMatch   = e.key === b.key;
        const ctrlMatch  = b.ctrl  ? (e.ctrlKey || e.metaKey) : (!b.ctrl && !e.ctrlKey && !e.metaKey);
        const shiftMatch = b.shift ? e.shiftKey  : !b.shift;
        const altMatch   = b.alt   ? e.altKey    : !b.alt;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          e.preventDefault();
          b.handler(e);
          return;
        }
      }
    };

    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [bindings]);
}