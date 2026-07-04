import type { ReactNode } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

export type RevealVariant = 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade' | 'blur';

const OFFSET = 28;

function hiddenState(variant: RevealVariant) {
  switch (variant) {
    case 'up':
      return { opacity: 0, y: OFFSET };
    case 'down':
      return { opacity: 0, y: -OFFSET };
    case 'left':
      return { opacity: 0, x: OFFSET };
    case 'right':
      return { opacity: 0, x: -OFFSET };
    case 'scale':
      return { opacity: 0, scale: 0.94 };
    case 'blur':
      return { opacity: 0, filter: 'blur(10px)' };
    case 'fade':
    default:
      return { opacity: 0 };
  }
}

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Scroll-triggered reveal. Animates once when the element scrolls into view,
 * using transform/opacity (GPU-friendly). Respects prefers-reduced-motion by
 * rendering statically. Purely additive — wraps existing markup without
 * changing layout.
 */
export function Reveal({
  children,
  variant = 'up',
  delay = 0,
  duration = 0.6,
  className,
  as = 'div',
  amount = 0.2,
}: {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  className?: string;
  as?: keyof typeof motion;
  amount?: number;
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;

  if (reduce) {
    const StaticTag = as as 'div';
    return <StaticTag className={className}>{children}</StaticTag>;
  }

  return (
    <MotionTag
      className={className}
      initial={hiddenState(variant)}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, amount, margin: '0px 0px -80px 0px' }}
      transition={{ duration, ease: EASE, delay }}
    >
      {children}
    </MotionTag>
  );
}

const groupContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

/**
 * Staggered container: children wrapped in <RevealItem> reveal in sequence as
 * the group scrolls into view. Use for card grids / category rows.
 */
export function RevealGroup({
  children,
  className,
  amount = 0.15,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={groupContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount, margin: '0px 0px -60px 0px' }}
    >
      {children}
    </motion.div>
  );
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

export function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
