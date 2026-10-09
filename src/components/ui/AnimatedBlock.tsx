'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

// Global cache to prevent React from remounting the component on every re-render
const motionComponentCache = new Map<string, any>();

function getMotionComponent(as: string) {
  if (!motionComponentCache.has(as)) {
    motionComponentCache.set(as, motion.create(as as any));
  }
  return motionComponentCache.get(as);
}

interface AnimatedBlockProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
  once?: boolean;
  as?: 'div' | 'section' | 'article' | 'span' | 'p' | 'li' | 'ul' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  animateOnMount?: boolean;
}

export default function AnimatedBlock({
  children,
  className = '',
  delay = 0,
  duration = 0.8,
  yOffset = 40,
  once = true,
  as: Component = 'div',
  animateOnMount = false,
}: AnimatedBlockProps) {
  const MotionComponent = getMotionComponent(Component);

  if (animateOnMount) {
    return (
      <MotionComponent
        initial={{ y: yOffset, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
        className={className}
      >
        {children}
      </MotionComponent>
    );
  }

  return (
    <MotionComponent
      initial={{ y: yOffset, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once, margin: '-10% 0px -10% 0px' }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </MotionComponent>
  );
}
