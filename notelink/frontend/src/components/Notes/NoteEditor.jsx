import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useParams, useBlocker } from 'react-router-dom';
import { useNotes } from '../../hooks/useNotes';
import { useKeyboard } from '../../hooks/useKeyboard';
import NoteService       from '../../api/NoteService';
import ImageUploader     from './ImageUploader';
import CategoryTagInput  from './CategoryTagInput';
import { allCategories } from '../../utils/categoryHelper';

const PRESET_COLORS = [
  '#7F77DD','#1D9E75','#EF9F27','#E24B4A',
  '#378ADD','#D85A30','#D45380','#6B3FA0',
];

export default function NoteEditor() {
  const { id }   = useParams();
  const isEdit   = Boolean(id);
  const navigate = useNavigate();
  const { notes, createNote, updateNote, fetchNotes, syncNoteImages } = useNotes();

  const [form,     setForm]     = useState({ title: '', content: '', category: '', nodeColor: '' });
  const [images,   setImages]   = useState([]);
  const [loading,  setLoading]  = useState(isEdit);
  const [saving,   setSaving]   = useState(false);
  const [dirty,    setDirty]    = useState(false); // unsaved changes
  const [error,    setError]    = useState('');
  const [savedMsg, setSavedMsg] = useState('');

  // Track original form for dirty detection
  const originalRef = useRef(null);

  const existingCategories = useMemo(() => allCategories(notes), [notes]);

  // ── Load ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isEdit) return;
    NoteService.getById(id)
      .then(note => {
        const loaded = {
          title:     note.title,
          content:   note.content  ?? '',
          category:  note.category ?? '',
          nodeColor: note.nodeColor ?? '',
        };
        setForm(loaded);
        originalRef.current = JSON.stringify(loaded);
        setImages(note.images ?? []);
        setDirty(false);
      })
      .catch(() => setError('Note not found.'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  // ── Dirty tracking ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!originalRef.current) return;
    setDirty(JSON.stringify(form) !== originalRef.current);
  }, [form]);

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleCategoryChange = (val) =>
    setForm(prev => ({ ...prev, category: val }));

  const handleImagesChange = useCallback((updated) => {
    setImages(updated);
    if (isEdit) syncNoteImages(Number(id), updated);
  }, [isEdit, id, syncNoteImages]);

  // ── Save ──────────────────────────────────────────────────────────────────
  const doSave = useCallback(async ({ quiet = false } = {}) => {
    if (!form.title.trim()) { setError('Title is required.'); return false; }
    setSaving(true);
    setError('');
    try {
      const payload = {
        title:     form.title.trim(),
        content:   form.content,
        category:  form.category  || null,
        nodeColor: form.nodeColor || null,
      };
      if (isEdit) {
        await updateNote(id, payload);
        await fetchNotes();
        originalRef.current = JSON.stringify(form);
        setDirty(false);
        if (!quiet) {
          setSavedMsg('Saved ✓');
          setTimeout(() => setSavedMsg(''), 2000);
        }
        return true;
      } else {
        const note = await createNote(payload);
        navigate(`/notes/${note.id}/edit`, { replace: true });
        return true;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed.');
      return false;
    } finally {
      setSaving(false);
    }
  }, [form, isEdit, id, updateNote, createNote, fetchNotes, navigate]);

  // Escape: auto-save then go back
  const handleEscape = useCallback(async () => {
    if (!dirty) { navigate(-1); return; }
    const ok = await doSave({ quiet: true });
    if (ok) navigate(-1);
  }, [dirty, doSave, navigate]);

  // Ctrl+S: save in place
  const handleCtrlS = useCallback(async () => {
    await doSave();
  }, [doSave]);

  useKeyboard([
    { key: 'Escape', handler: handleEscape },
    { key: 's', ctrl: true, handler: handleCtrlS },
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await doSave();
    if (ok && isEdit) navigate(`/notes/${id}`);
  };

  if (loading) return <div className="page-state">Loading…</div>;

  return (
    <div className="editor-page">
      <header className="page-header">
        <h1>
          {isEdit ? 'Edit note' : 'New note'}
          {dirty && <span className="dirty-indicator" title="Unsaved changes"> •</span>}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          {savedMsg && <span className="saved-msg">{savedMsg}</span>}
          <span className="hint kbd-hint">
            <kbd>Esc</kbd> save &amp; back &nbsp;·&nbsp; <kbd>Ctrl+S</kbd> save
          </span>
        </div>
      </header>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="editor-form">
        {/* Title */}
        <div className="field">
          <label htmlFor="title">Title</label>
          <input
            id="title" name="title" type="text"
            maxLength={255} required
            value={form.title} onChange={handleChange}
            placeholder="Note title"
          />
        </div>

        {/* Content */}
        <div className="field">
          <label htmlFor="content">Content</label>
          <textarea
            id="content" name="content" rows={12}
            value={form.content} onChange={handleChange}
            placeholder="Write your note here…"
          />
        </div>

        {/* Category + colour on same row */}
        <div className="editor-meta-row">
          <div className="field" style={{ flex: 1 }}>
            <label>
              Categories
              <span className="hint" style={{ marginLeft: '.4rem' }}>
                (Enter or comma to add · used as graph filter)
              </span>
            </label>
            <CategoryTagInput
              value={form.category}
              onChange={handleCategoryChange}
              suggestions={existingCategories}
            />
          </div>

          <div className="field">
            <label>
              Node colour
              <span className="hint" style={{ marginLeft: '.4rem' }}>(graph)</span>
            </label>
            <div className="color-picker-row">
              {PRESET_COLORS.map(c => (
                <button
                  key={c} type="button"
                  className={`color-swatch${form.nodeColor === c ? ' active' : ''}`}
                  style={{ background: c }}
                  onClick={() => setForm(p => ({ ...p, nodeColor: p.nodeColor === c ? '' : c }))}
                  title={c}
                />
              ))}
              <input
                type="color"
                value={form.nodeColor || '#534AB7'}
                onChange={e => setForm(p => ({ ...p, nodeColor: e.target.value }))}
                className="color-custom-input"
                title="Custom colour"
              />
              {form.nodeColor && (
                <button type="button" className="btn btn-ghost btn-xs"
                  onClick={() => setForm(p => ({ ...p, nodeColor: '' }))}>
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Images */}
        {isEdit ? (
          <div className="field">
            <label>Images</label>
            <ImageUploader
              noteId={Number(id)}
              images={images}
              onImagesChange={handleImagesChange}
            />
          </div>
        ) : (
          <p className="hint">💡 Save the note first to attach images.</p>
        )}

        <div className="editor-actions">
          <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create note'}
          </button>
        </div>
      </form>
    </div>
  );
}