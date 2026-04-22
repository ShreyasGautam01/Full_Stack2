import { useState, useRef, useId } from 'react';
import { parseCategories } from '../../utils/categoryHelper';

/**
 * A tag-style multi-category input.
 *
 * Props:
 *   value      string   – comma-separated category string (controlled)
 *   onChange   fn(str)  – called with new comma-separated string
 *   suggestions string[] – existing categories to suggest in the datalist
 */
export default function CategoryTagInput({ value, onChange, suggestions = [] }) {
  const tags    = parseCategories(value);
  const [draft, setDraft] = useState('');
  const inputRef = useRef();
  const listId   = useId();

  const commit = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;

    // Split on commas so pasting "A, B, C" adds all three at once
    const incoming = trimmed.split(',').map(t => t.trim()).filter(Boolean);
    const next = [...new Set([...tags, ...incoming])]; // deduplicate
    onChange(next.join(','));
    setDraft('');
  };

  const removeTag = (tag) => {
    onChange(tags.filter(t => t !== tag).join(','));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      commit();
    } else if (e.key === 'Backspace' && draft === '' && tags.length > 0) {
      // Delete last tag on Backspace when input is empty
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div
      className="tag-input-wrap"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Rendered tags */}
      {tags.map(tag => (
        <span key={tag} className="tag-chip">
          {tag}
          <button
            type="button"
            className="tag-remove"
            onClick={e => { e.stopPropagation(); removeTag(tag); }}
            aria-label={`Remove category ${tag}`}
          >×</button>
        </span>
      ))}

      {/* Draft input */}
      <input
        ref={inputRef}
        type="text"
        className="tag-draft-input"
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commit}
        placeholder={tags.length === 0 ? 'Type a category, press Enter…' : ''}
        list={listId}
        aria-label="Add category"
      />

      {/* Datalist for autocomplete */}
      <datalist id={listId}>
        {suggestions
          .filter(s => !tags.includes(s))
          .map(s => <option key={s} value={s} />)
        }
      </datalist>
    </div>
  );
}