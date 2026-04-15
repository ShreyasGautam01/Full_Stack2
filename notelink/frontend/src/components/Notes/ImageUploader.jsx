import { useState, useRef } from 'react';
import ImageService from '../../api/ImageService';

export default function ImageUploader({ noteId, initialImages = [], onChange }) {
  const [images,    setImages]    = useState(initialImages);
  const [dragging,  setDragging]  = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error,     setError]     = useState('');
  const inputRef = useRef();

  const ALLOWED = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  const handleFiles = async (files) => {
    const file = files[0];
    if (!file) return;
    if (!ALLOWED.includes(file.type)) {
      setError('Only JPEG, PNG, GIF and WEBP images are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File must be under 5 MB.');
      return;
    }
    setError('');
    setUploading(true);
    try {
      const uploaded = await ImageService.upload(noteId, file);
      const next = [...images, uploaded];
      setImages(next);
      onChange?.(next);
    } catch (err) {
      console.error('[ImageUploader] upload error:', err);
      setError(err.response?.data?.message || `Upload failed (${err.message}). See console.`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId) => {
    if (!window.confirm('Remove this image?')) return;
    setError('');
    try {
      await ImageService.delete(noteId, imageId);
      const next = images.filter(i => i.id !== imageId);
      setImages(next);
      onChange?.(next);
    } catch (err) {
      console.error('[ImageUploader] delete error:', err);
      setError(err.response?.data?.message || `Delete failed (${err.message}). See console.`);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="image-uploader">
      {/* Drop zone */}
      <div
        className={`drop-zone${dragging ? ' dragging' : ''}${uploading ? ' uploading' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && !uploading && inputRef.current?.click()}
        aria-label="Upload image"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          style={{ display: 'none' }}
          onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }}
        />
        <span className="drop-label">
          {uploading ? '⏳ Uploading…' : '📎 Drop an image here or '}
          {!uploading && <u>browse</u>}
        </span>
      </div>

      {/* Error banner */}
      {error && (
        <div className="alert alert-error uploader-error">
          {error}
          <button type="button" className="alert-dismiss" onClick={() => setError('')}>×</button>
        </div>
      )}

      {/* Thumbnails */}
      {images.length > 0 && (
        <div className="image-grid">
          {images.map(img => (
            <div key={img.id} className="image-thumb">
              <img
                src={img.url}
                alt={img.fileName}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling.style.display = 'flex';
                }}
              />
              {/* Shown when the image URL fails to load */}
              <div className="image-placeholder">🖼</div>
              {/* Delete is always visible – no hover required */}
              <button
                type="button"
                className="image-delete"
                onClick={(e) => { e.stopPropagation(); handleDelete(img.id); }}
                aria-label={`Remove ${img.fileName}`}
                title="Remove image"
              >×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}