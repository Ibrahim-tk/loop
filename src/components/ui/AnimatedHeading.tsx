'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

// Global cache to prevent React from remounting the component on every re-render
const motionComponentCache = new Map<string, any>();

function getMotionComponent(as: string) {
  if (!motionComponentCache.has(as)) {
    motionComponentCache.set(as, motion.create(as as any));
  }
  return motionComponentCache.get(as);
}

export interface AnimatedHeadingProps {
  /**
   * The text to animate word by word.
   */
  children?: string;
  /**
   * The HTML tag to render. Defaults to 'h1'.
   */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  /**
   * Additional CSS classes to apply to the container.
   */
  className?: string;
  /**
   * The delay between each word animation. Defaults to 0.08.
   */
  stagger?: number;
  /**
   * The delay before the first word animates. Defaults to 0.
   */
  delay?: number;
  /**
   * The duration of each word's animation. Defaults to 0.8.
   */
  duration?: number;
  /**
   * The easing function for the animation. Defaults to [0.25, 0.1, 0.25, 1].
   */
  ease?: number[] | string;
  /**
   * The initial vertical offset for each word. Defaults to 60.
   */
  yOffset?: number;
  /**
   * Whether to animate only once when scrolled into view. Defaults to true.
   */
  once?: boolean;
}

/**
 * Reusable animated text component for scroll-triggered, staggered word-by-word reveal animations.
 */
export default function AnimatedHeading({
  children,
  as: Component = 'h1',
  className = '',
  stagger = 0.08,
  delay = 0,
  duration = 0.8,
  ease = [0.25, 0.1, 0.25, 1],
  yOffset = 60,
  once = true,
}: AnimatedHeadingProps) {
  const ref = useRef<HTMLElement>(null);
  
  // Handle empty or missing children
  if (!children || typeof children !== 'string') {
    return <Component className={className}>{children}</Component>;
  }

  // Split text into words, preserving spaces
  // The regex splits by spaces but keeps them in the array so we can render them
  // This helps maintain correct layout without needing margins on words
  const words = children.split(/(\s+)/);

  // Define variants outside the render cycle if possible, but here we need props
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: {
      y: yOffset,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration,
        ease,
      },
    },
  };

  // Fetch the cached dynamic motion component
  const MotionComponent = getMotionComponent(Component);

  return (
    <MotionComponent
      ref={ref}
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-10% 0px -10% 0px' }}
      // Use aria-label for screen readers as we are splitting the text
      aria-label={children}
    >
      {words.map((word, index) => {
        // If it's just whitespace, render it directly without animation
        if (word.trim() === '') {
          return (
            <span key={index} className="inline-block whitespace-pre">
              {word}
            </span>
          );
        }

        // Wrap the animated word in a localized overflow-hidden container
        // This ensures the word appears from "nowhere" instead of bleeding out
        return (
          <span key={index} className="inline-block overflow-hidden align-top pb-1">
            <motion.span
              className="inline-block"
              variants={wordVariants}
              aria-hidden="true" // Hide from screen readers
            >
              {word}
            </motion.span>
          </span>
        );
      })}
    </MotionComponent>
  );
}

/* 
================ EXAMPLE USAGES ================

1. Basic Hero Title (Default h1, fast stagger):
```tsx
import AnimatedHeading from '@/components/ui/AnimatedHeading';

export default function HeroSection() {
  return (
    <section className="py-20">
      <AnimatedHeading className="text-5xl font-extrabold tracking-tight text-gray-900">
        Transform Your Property Management Experience
      </AnimatedHeading>
    </section>
  );
}
```

2. Subtitle (h2, larger offset, longer delay):
```tsx
import AnimatedHeading from '@/components/ui/AnimatedHeading';

export default function ServicesSection() {
  return (
    <section className="py-20">
      <AnimatedHeading 
        as="h2" 
        className="text-3xl text-gray-600 font-medium"
        yOffset={80}
        delay={0.2}
        stagger={0.1}
      >
        Discover our comprehensive suite of real estate services
      </AnimatedHeading>
    </section>
  );
}
```

3. Animating an entire section together:
To animate a section where multiple headings or paragraphs stagger together, 
you would create a parent motion.div with a container variant, and ensure 
AnimatedHeading elements are children that inherit the "hidden" and "visible" state.
However, since AnimatedHeading has its own stagger children logic, you might just 
rely on delay prop spacing for simplicity:

```tsx
import AnimatedHeading from '@/components/ui/AnimatedHeading';
import { motion } from 'framer-motion';

export default function AboutSection() {
  return (
    <section className="py-20 space-y-6">
      <AnimatedHeading as="h1" className="text-4xl font-bold">
        About Fasana Homes
      </AnimatedHeading>
      
      <AnimatedHeading as="p" className="text-lg text-gray-700 max-w-2xl" delay={0.4} duration={0.6}>
        We are a dedicated team of professionals committed to maximizing your property's potential.
      </AnimatedHeading>
      
      <AnimatedHeading as="p" className="text-lg text-gray-700 max-w-2xl" delay={0.8} duration={0.6}>
        With years of experience in the market, we provide unparalleled service and expertise.
      </AnimatedHeading>
    </section>
  );
}
```
*/