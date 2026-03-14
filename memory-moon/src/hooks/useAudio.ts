import { useEffect, useRef, useState } from 'react';
import { Howl } from 'howler';
import { useStore } from '../store/useStore';

/**
 * Custom hook to manage background audio playback.
 * Syncs with the global store's isPlaying and volume state.
 * Only plays if isActive is true.
 * Provides position and duration for progress tracking.
 */
export const useAudio = (src: string, isActive = true) => {
  const { isPlaying, volume, loopMode, nextTrack } = useStore();
  const howlRef = useRef<Howl | null>(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    // Initialize Howl instance
    const howl = new Howl({
      src: [src],
      html5: true,
      loop: loopMode === 'single',
      volume: volume,
      onplay: () => {
        console.log('Audio playing');
        startPositionLoop();
      },
      onpause: () => {
        console.log('Audio paused');
        cancelPositionLoop();
      },
      onstop: () => {
        cancelPositionLoop();
      },
      onend: () => {
        console.log('Audio ended');
        if (loopMode !== 'single') {
          nextTrack();
        }
      },
      onload: () => {
        setDuration(howl.duration());
      },
      onloaderror: (_id, err) => console.error('Audio load error:', err),
      onplayerror: (_id, err) => {
        console.error('Audio play error:', err);
        howl.once('unlock', () => {
          howl.play();
        });
      }
    });

    howlRef.current = howl;

    return () => {
      cancelPositionLoop();
      howl.unload();
    };
  }, [src]);

  // Sync loop state
  useEffect(() => {
    if (howlRef.current) {
      howlRef.current.loop(loopMode === 'single');
    }
  }, [loopMode]);

  const startPositionLoop = () => {
    const loop = () => {
      if (howlRef.current) {
        setPosition(howlRef.current.seek() as number);
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  };

  const cancelPositionLoop = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
  };

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

  const seek = (pos: number) => {
    if (howlRef.current) {
      howlRef.current.seek(pos);
      setPosition(pos);
    }
  };

  return {
    position,
    duration,
    seek
  };
};
