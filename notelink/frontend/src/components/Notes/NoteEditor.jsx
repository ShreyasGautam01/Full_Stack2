import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useNotes } from '../../hooks/useNotes';
import NoteService   from '../../api/NoteService';
import ImageUploader from './ImageUploader';

export default function NoteEditor() {
  const { id }     = useParams();           // undefined on /notes/new
  const isEdit     = Boolean(id);
  const navigate   = useNavigate();
  const { createNote, updateNote, fetchNotes, syncNoteImages } = useNotes();

  const [form,    setForm]    = useState({ title: '', content: '' });
  const [images,  setImages]  = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');

  // Load existing note when editing
  useEffect(() => {
    if (!isEdit) return;
    NoteService.getById(id)
      .then(note => {
        setForm({ title: note.title, content: note.content ?? '' });
        setImages(note.images ?? []);
      })
      .catch(() => setError('Note not found.'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  /**
   * Called by ImageUploader on every upload or delete.
   * Update local state AND patch NoteContext so the homepage
   * card reflects the new image count without a full re-fetch.
   */
  const handleImagesChange = useCallback((updatedImages) => {
    setImages(updatedImages);
    if (isEdit) {
      syncNoteImages(Number(id), updatedImages);
    }
  }, [isEdit, id, syncNoteImages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required.'); return; }

    setSaving(true);
    setError('');
    try {
      if (isEdit) {
        await updateNote(id, form);
      } else {
        const note = await createNote(form);
        // Redirect to edit view so ImageUploader gets the new note id
        navigate(`/notes/${note.id}/edit`, { replace: true });
        return;
      }
      await fetchNotes();
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="page-state">Loading…</div>;

  return (
    <div className="editor-page">
      <header className="page-header">
        <h1>{isEdit ? 'Edit note' : 'New note'}</h1>
      </header>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="editor-form">
        <div className="field">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            maxLength={255}
            required
            value={form.title}
            onChange={handleChange}
            placeholder="Note title"
          />
        </div>

        <div className="field">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            rows={12}
            value={form.content}
            onChange={handleChange}
            placeholder="Write your note here…"
          />
        </div>

        {/* Images only available after the note has been saved and has an id */}
        {isEdit && (
          <div className="field">
            <label>Images</label>
            <ImageUploader
              noteId={Number(id)}
              initialImages={images}
              onChange={handleImagesChange}
            />
          </div>
        )}

        {!isEdit && (
          <p className="hint">Save the note first, then you can attach images.</p>
        )}

        <div className="editor-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => navigate(-1)}
          >
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