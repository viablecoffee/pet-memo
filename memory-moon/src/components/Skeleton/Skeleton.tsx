import React from 'react';

/**
 * Skeleton — a shimmering loading placeholder.
 *
 * Styling lives in the global `.skeleton` rule (index.css) so this stays a
 * thin wrapper. Reusable across any async surface (insight lists, image
 * loads, future data views).
 */
interface SkeletonProps {
  /** Width — number → px, string → used as-is. Defaults to 100%. */
  width?: string | number;
  /** Height — number → px, string → used as-is. */
  height?: string | number;
  /** Border radius override — number → px, string → used as-is. */
  radius?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

const toCss = (v?: string | number) =>
  typeof v === 'number' ? `${v}px` : v;

const Skeleton: React.FC<SkeletonProps> = ({ width = '100%', height, radius, className, style }) => (
  <div
    className={`skeleton${className ? ` ${className}` : ''}`}
    style={{
      width: toCss(width),
      height: toCss(height),
      ...(radius !== undefined ? { borderRadius: toCss(radius) } : {}),
      ...style,
    }}
  />
);

export default Skeleton;
