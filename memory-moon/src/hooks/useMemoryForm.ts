import { useState, useEffect, useRef } from 'react';
import { compressImage } from '../utils/image';

export const MAX_PHOTOS = 9;
export const MAX_DESC_WORDS = 200;

/** Counts CJK characters + English words (the project's "length" heuristic). */
export const countMemoryChars = (text: string): number => {
  const chineseChars = (text.match(/[一-龥]/g) || []).length;
  const englishWords = text.trim().split(/\s+/).filter(w => /[a-zA-Z]/.test(w)).length;
  return chineseChars + englishWords;
};

const todayISO = () => new Date().toISOString().split('T')[0];

export interface MemoryFormInitial {
  date?: string;
  title?: string;
  description?: string;
  emoji?: string;
  photos?: string[];
}

/**
 * useMemoryForm — shared state + handlers for the Add/Edit memory modals.
 *
 * Pass `initial` (a memory) to edit, or omit it to start blank. The form
 * resets/repopulates whenever it (re)opens or the source memory changes.
 * `values` holds the trimmed, ready-to-persist fields.
 */
export function useMemoryForm(isOpen: boolean, initial?: MemoryFormInitial | null) {
  const [date, setDate] = useState(initial?.date ?? todayISO());
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [icon, setIcon] = useState(initial?.emoji ?? '🐾');
  const [photos, setPhotos] = useState<string[]>(initial?.photos ?? []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setDate(initial?.date ?? todayISO());
    setTitle(initial?.title ?? '');
    setDescription(initial?.description ?? '');
    setIcon(initial?.emoji ?? '🐾');
    setPhotos(initial?.photos ?? []);
  }, [isOpen, initial]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (countMemoryChars(text) <= MAX_DESC_WORDS) setDescription(text);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const remainingSlots = MAX_PHOTOS - photos.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);
    filesToProcess.forEach(file => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          try {
            const compressed = await compressImage(event.target.result as string);
            setPhotos(prev => [...prev, compressed]);
          } catch (error) {
            console.error('Failed to compress image:', error);
            setPhotos(prev => [...prev, event.target!.result as string]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => setPhotos(prev => prev.filter((_, i) => i !== index));

  return {
    date, setDate,
    title,
    description,
    icon, setIcon,
    photos,
    fileInputRef,
    charCount: countMemoryChars(description),
    handleTitleChange,
    handleDescriptionChange,
    handleFileSelect,
    removePhoto,
    /** Trimmed values ready to persist. */
    values: { date, title: title.trim(), description: description.trim(), photos, emoji: icon },
  };
}

export type MemoryForm = ReturnType<typeof useMemoryForm>;
