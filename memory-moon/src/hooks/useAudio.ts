import { useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { useStore } from '../store/useStore';

/**
 * Custom hook to manage background audio playback.
 * Syncs with the global store's isPlaying and volume state.
 * Only plays if isActive is true.
 */
export const useAudio = (src: string, isActive = true) => {
  const { isPlaying, volume } = useStore();
  const howlRef = useRef<Howl | null>(null);

  useEffect(() => {
    // Initialize Howl instance
    howlRef.current = new Howl({
      src: [src],
      html5: true, // Use HTML5 Audio for better streaming of large files
      loop: true,
      volume: volume,
      onplay: () => console.log('Audio playing'),
      onpause: () => console.log('Audio paused'),
      onloaderror: (_id, err) => console.error('Audio load error:', err),
      onplayerror: (_id, err) => {
        console.error('Audio play error:', err);
        howlRef.current?.once('unlock', () => {
          howlRef.current?.play();
        });
      }
    });

    return () => {
      if (howlRef.current) {
        howlRef.current.unload();
      }
    };
  }, [src]);

  // Sync isPlaying and isActive state
  useEffect(() => {
    if (!howlRef.current) return;

    if (isPlaying && isActive) {
      if (!howlRef.current.playing()) {
        howlRef.current.play();
      }
    } else {
      if (howlRef.current.playing()) {
        howlRef.current.pause();
      }
    }
  }, [isPlaying, isActive, src]);

  // Sync volume state
  useEffect(() => {
    if (howlRef.current) {
      howlRef.current.volume(volume);
    }
  }, [volume]);

  return howlRef.current;
};
