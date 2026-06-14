/**
 * Motion constants — the JS/R3F mirror of the CSS motion tokens in index.css.
 *
 * Anything animated in JavaScript (the 3D scene's useFrame loops, the camera
 * intro, pointer parallax) reads its numbers from here instead of hardcoding
 * magic values inline. Keeping CSS (`--ease-*`, `--dur-*`) and JS in sync means
 * future features tune motion in one mental model.
 */

/** Cubic-bezier control points, matching the `--ease-*` CSS tokens. */
export const EASE = {
  standard: [0.4, 0, 0.2, 1],
  entrance: [0.16, 1, 0.3, 1],
  spring: [0.19, 1, 0.22, 1],
  exit: [0.4, 0, 1, 1],
} as const;

/** Durations in **seconds** (GSAP/three use seconds), matching `--dur-*`. */
export const DUR = {
  fast: 0.2,
  base: 0.35,
  slow: 0.6,
  cinematic: 1.5,
} as const;

/** Camera framing for the MoonScene. */
export const CAMERA = {
  zDesktop: 6,
  zMobile: 10,
  fov: 50,
  /** Pulled-back start for the opening dolly-in. */
  introZ: 9,
} as const;

/** Memory-star animation tuning. */
export const STAR = {
  /** Per-frame easing toward target scale (0–1; higher = snappier). */
  lerpFactor: 0.12,
  pulseSpeed: 2,
  selectedScale: 1.5,
  hoverScale: 1.3,
  /** Base mesh radius multiplier (was the inline 0.04 in MoonScene). */
  baseRadius: 0.04,
  /** Glow plane radius multiplier (was the inline 0.25). */
  glowRadius: 0.25,
  /** Camera stand-off distance from a focused star (world units). */
  focusGap: 1.2,
  /** Per-frame easing for the fly-to / fly-back camera move. */
  focusLerp: 0.06,
} as const;

/** Whole-scene ambient motion. */
export const SCENE = {
  /** Group auto-rotation speed (rad·s, was the inline 0.015). */
  groupRotateSpeed: 0.015,
  /** Max pointer-parallax tilt of the scene group (radians). */
  parallaxAmount: 0.08,
  /** Per-frame easing for the parallax tilt. */
  parallaxLerp: 0.04,
  /** Atmospheric depth fog — fades the distant solar system into the bg. */
  fogColor: '#0d0818',
  fogDensity: 0.012,
} as const;

/** Frame-rate-independent-ish linear interpolation. */
export const lerp = (current: number, target: number, factor: number): number =>
  current + (target - current) * factor;

/** Ease-out cubic — decelerating; good for an arrival/dolly. */
export const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

/** True when the OS requests reduced motion (one-shot check). */
export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Cached + live-updating reduced-motion flag. One listener is registered at
   module load so per-frame useFrame loops can read it cheaply. */
let _reduced = prefersReducedMotion();
if (typeof window !== 'undefined') {
  try {
    window
      .matchMedia('(prefers-reduced-motion: reduce)')
      .addEventListener('change', (e) => {
        _reduced = e.matches;
      });
  } catch {
    /* Safari < 14 lacks addEventListener on MediaQueryList — fine, stay one-shot. */
  }
}

/** Cheap reduced-motion read for hot paths (e.g. useFrame). */
export const isReducedMotion = (): boolean => _reduced;
