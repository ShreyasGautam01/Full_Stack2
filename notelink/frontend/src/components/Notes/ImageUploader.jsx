import { useRef, useState } from 'react';
import ImageService from '../../api/ImageService';

/**
 * Controlled component – the parent owns the images array.
 * Props:
 *   noteId         Long     – the note being edited
 *   images         Array    – current images (controlled, from parent state)
 *   onImagesChange Function – called with the updated array after upload/delete
 */
export default function ImageUploader({ noteId, images = [], onImagesChange }) {
  const inputRef    = useRef();
  const [dragging,  setDragging]  = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId,setDeletingId]= useState(null); // id being deleted
  const [error,     setError]     = useState('');
  const [lightbox,  setLightbox]  = useState(null); // { url, name }

  const ALLOWED = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  // ── Upload ──────────────────────────────────────────────────────────────
  const handleFiles = async (files) => {
    const file = files?.[0];
    if (!file) return;
    if (!ALLOWED.includes(file.type)) {
      setError('Unsupported type. Use JPEG, PNG, GIF or WEBP.'); return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File is too large (max 5 MB).'); return;
    }
    setError('');
    setUploading(true);
    try {
      const uploaded = await ImageService.upload(noteId, file);
      onImagesChange?.([...images, uploaded]);
    } catch (err) {
      console.error('[ImageUploader] upload:', err.response || err);
      setError(
        err.response?.data?.message ||
        `Upload failed (HTTP ${err.response?.status ?? 'no response'}). Check the console.`
      );
    } finally {
      setUploading(false);
    }
  };

  // ── Delete ──────────────────────────────────────────────────────────────
  const handleDelete = async (img) => {
    setError('');
    setDeletingId(img.id);
    try {
      await ImageService.delete(noteId, img.id);
      onImagesChange?.(images.filter(i => i.id !== img.id));
    } catch (err) {
      console.error('[ImageUploader] delete:', err.response || err);
      setError(
        err.response?.data?.message ||
        `Delete failed (HTTP ${err.response?.status ?? 'no response'}). Check the console.`
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="image-uploader">

      {/* ── Drop zone ──────────────────────────────────────────────────── */}
      <div
        className={`drop-zone${dragging ? ' dragging' : ''}${uploading ? ' uploading' : ''}`}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => !uploading && inputRef.current?.click()}
        role="button" tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && !uploading && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          style={{ display: 'none' }}
          onChange={e => { handleFiles(e.target.files); e.target.value = ''; }}
        />
        <span className="drop-label">
          {uploading ? '⏳ Uploading…' : <><span className="drop-icon">📎</span> Drop image or <u>browse</u></>}
        </span>
      </div>

      {/* ── Error banner ───────────────────────────────────────────────── */}
      {error && (
        <div className="alert alert-error uploader-error">
          <span>{error}</span>
          <button type="button" className="alert-dismiss" onClick={() => setError('')}>×</button>
        </div>
      )}

      {/* ── Thumbnails ─────────────────────────────────────────────────── */}
      {images.length > 0 && (
        <div className="image-grid">
          {images.map(img => {
            const isDeleting = deletingId === img.id;
            return (
              <div key={img.id} className={`image-thumb${isDeleting ? ' deleting' : ''}`}>
                {/* The image itself */}
                <img
                  src={img.url}
                  alt=""
                  loading="lazy"
                  style={{ cursor: 'zoom-in' }}
                  onClick={() => setLightbox({ url: img.url, name: img.fileName })}
                  onError={e => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextSibling.style.display = 'flex';
                  }}
                />
                {/* Shown when the URL fails to resolve */}
                <div
                  className="image-placeholder"
                  style={{ display: 'none' }}
                  title={img.fileName}
                >🖼</div>

                {/* Permanent delete button – no hover required */}
                <button
                  type="button"
                  className="image-delete"
                  disabled={isDeleting}
                  onClick={() => handleDelete(img)}
                  title={isDeleting ? 'Deleting…' : 'Remove image'}
                >
                  {isDeleting ? '…' : '×'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Inline lightbox for the uploader context ────────────────────── */}
      {lightbox && (
        <div
          className="lightbox"
          role="dialog"
          onClick={() => setLightbox(null)}
        >
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightbox(null)}>×</button>
            <img src={lightbox.url} alt={lightbox.name} className="lightbox-img" />
            <p className="lightbox-caption">{lightbox.name}</p>
          </div>
        </div>
      )}
    </div>
  );
}