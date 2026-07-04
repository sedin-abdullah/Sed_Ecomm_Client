import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Subtle, GPU-friendly floating loop for decorative elements, hero art, and
 * icons. Uses only transform (y/rotate) so it stays at 60fps. Honors
 * prefers-reduced-motion by rendering statically.
 */
export function Float({
  children,
  className,
  distance = 8,
  duration = 4,
  delay = 0,
  rotate = 0,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
  duration?: number;
  delay?: number;
  rotate?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      animate={{ y: [-distance, distance, -distance], rotate: rotate ? [-rotate, rotate, -rotate] : 0 }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
      style={{ willChange: 'transform' }}
    >
      {children}
    </motion.div>
  );
}
