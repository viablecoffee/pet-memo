import { useEffect, useRef, useState } from 'react';
import { Howl } from 'howler';
import { useStore } from '../store/useStore';

/**
 * Custom hook to manage background audio playback.
 * Syncs with the global store's isPlaying and volume state.
 * Only plays if isActive is true.
 * Provides position and duration for progress tracking.
 */
export const useAudio = (src: string) => {
  const { isPlaying, volume, loopMode, nextTrack } = useStore();
  const howlRef = useRef<Howl | null>(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // Initialize Howl instance
    const howlOptions: any = {
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
      onload: function(this: Howl) {
        setDuration(this.duration());
      },
      onloaderror: (_id: any, err: any) => console.error('Audio load error:', err),
      onplayerror: function(this: Howl, _id: any, err: any) {
        console.error('Audio play error:', err);
        this.once('unlock', () => {
          this.play();
        });
      }
    };

    const howl = new Howl(howlOptions);

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

  // Sync isPlaying state
  useEffect(() => {
    if (!howlRef.current) return;

    if (isPlaying) {
      if (!howlRef.current.playing()) {
        howlRef.current.play();
      }
    } else {
      if (howlRef.current.playing()) {
        howlRef.current.pause();
      }
    }
  }, [isPlaying, src]);

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
