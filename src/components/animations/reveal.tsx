import { motion, cubicBezier } from 'framer-motion';
import { ReactNode } from 'react';

/* ======================================================
   ANIMATION TYPES
====================================================== */
export type RevealDirection =
  | 'left'
  | 'right'
  | 'up'
  | 'down'
  | 'fade';

/* ======================================================
   BASE CONFIG
====================================================== */
const OFFSET = 64;
const EASE = cubicBezier(0.22, 1, 0.36, 1);

/* ======================================================
   STATE FACTORIES
====================================================== */
function getInitial(direction: RevealDirection) {
  switch (direction) {
    case 'left':
      return { opacity: 0, x: -OFFSET };
    case 'right':
      return { opacity: 0, x: OFFSET };
    case 'up':
      return { opacity: 0, y: OFFSET };
    case 'down':
      return { opacity: 0, y: -OFFSET };
    case 'fade':
    default:
      return { opacity: 0 };
  }
}

function getAnimate(direction: RevealDirection) {
  switch (direction) {
    case 'left':
    case 'right':
      return { opacity: 1, x: 0 };
    case 'up':
    case 'down':
      return { opacity: 1, y: 0 };
    case 'fade':
    default:
      return { opacity: 1 };
  }
}

/* ======================================================
   REVEAL COMPONENT
====================================================== */
type RevealProps = {
  children: ReactNode;
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  className?: string;
};

export function Reveal({
  children,
  direction = 'fade',
  delay = 0,
  duration = 1,
  className,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={getInitial(direction)}
      whileInView={getAnimate(direction)}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}


/* ======================================================
   🚧 FUTURE EXTENSION ZONE 🚧
   ------------------------------------------------------
   Paste new reveal variants below:
   - scale
   - rotate
   - blur
   - mask
   - clip-path
====================================================== */


