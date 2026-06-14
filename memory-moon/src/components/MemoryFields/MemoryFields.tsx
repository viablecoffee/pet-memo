import React from 'react';
import '../AddMemoryModal/AddMemoryModal.css';
import { MAX_PHOTOS, MAX_DESC_WORDS } from '../../hooks/useMemoryForm';
import type { MemoryForm } from '../../hooks/useMemoryForm';

const ICONS = ['🐾', '🎂', '✈️', '🦮', '❄️', '☀️', '🌙', '✦'];

/**
 * MemoryFields — the shared form body for the Add/Edit memory modals.
 * Renders the fields; each modal wraps it in its own <form> and submit.
 */
const MemoryFields: React.FC<{ f: MemoryForm }> = ({ f }) => (
  <>
    <div className="form-group">
      <label>Date</label>
      <input type="date" value={f.date} onChange={e => f.setDate(e.target.value)} required />
    </div>

    <div className="form-group">
      <label>Title</label>
      <input
        type="text"
        placeholder="e.g. Adoption Day"
        value={f.title}
        onChange={f.handleTitleChange}
        required
      />
    </div>

    <div className="form-group">
      <label>Icon</label>
      <div className="icon-selector">
        {ICONS.map(emoji => (
          <button
            key={emoji}
            type="button"
            className={`icon-btn ${f.icon === emoji ? 'active' : ''}`}
            onClick={() => f.setIcon(emoji)}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>

    <div className="form-group">
      <label>Photos <span className="char-count">({f.photos.length}/{MAX_PHOTOS})</span></label>
      <div className="photo-upload">
        <input
          ref={f.fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={f.handleFileSelect}
          style={{ display: 'none' }}
        />
        <button
          type="button"
          className="photo-add-btn"
          onClick={() => f.fileInputRef.current?.click()}
          disabled={f.photos.length >= MAX_PHOTOS}
        >
          + Add Photos
        </button>
        {f.photos.length > 0 && (
          <div className="photo-preview-grid">
            {f.photos.map((photo, index) => (
              <div key={index} className="photo-preview">
                <img src={photo} alt="" />
                <button
                  type="button"
                  className="photo-remove"
                  onClick={() => f.removePhoto(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

    <div className="form-group">
      <label>Memory Description <span className="char-count">({f.charCount}/{MAX_DESC_WORDS} chars)</span></label>
      <textarea
        rows={4}
        placeholder="Write something beautiful..."
        value={f.description}
        onChange={f.handleDescriptionChange}
        required
      />
    </div>
  </>
);

export default MemoryFields;
