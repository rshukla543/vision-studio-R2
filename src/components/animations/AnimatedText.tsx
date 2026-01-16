import { motion, cubicBezier, Variants } from 'framer-motion';

type AnimatedTextProps = {
  text: string;
  delay?: number;
  className?: string;
};

/* ✔ Typed easing */
const EASE = cubicBezier(0.22, 1, 0.36, 1);

const container: Variants = {
  hidden: {},
  visible: (delay = 0) => ({
    transition: {
      staggerChildren: 0.035,
      delayChildren: delay,
    },
  }),
};

const char: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: EASE,
    },
  },
};

export function AnimatedText({
  text,
  delay = 0,
  className,
}: AnimatedTextProps) {
  return (
    <motion.span
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={delay}
      aria-label={text}
    >
      {text.split('').map((charValue, index) => (
        <motion.span
          key={index}
          variants={char}
          style={{ display: 'inline-block' }}
        >
          {charValue === ' ' ? '\u00A0' : charValue}
        </motion.span>
      ))}
    </motion.span>
  );
}



