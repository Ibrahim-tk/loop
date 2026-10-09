'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export interface ServiceItem {
    title: string;
    image: string;
    description: string;
    bullets: string[];
}

interface ServicesTimelineProps {
    services: ServiceItem[];
}

export default function ServicesTimeline({ services }: ServicesTimelineProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Track scroll progress of the entire timeline container
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    });

    // Smooth the progress bar
    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div className="w-full relative py-4" ref={containerRef}>
            {/* The Timeline Line Background */}
            <div className="absolute left-[11px] sm:left-[15px] top-6 bottom-6 w-[2px] bg-[var(--border-subtle)]"></div>
            
            {/* The Animated Timeline Line */}
            <motion.div 
                className="absolute left-[11px] sm:left-[15px] top-6 bottom-6 w-[2px] bg-[var(--action-primary)] origin-top"
                style={{ scaleY }}
            />

            <div className="flex flex-col gap-16 sm:gap-24">
                {services.map((service, index) => (
                    <TimelineItem key={service.title} service={service} index={index} />
                ))}
            </div>
        </div>
    );
}

function TimelineItem({ service, index }: { service: ServiceItem, index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        // Start animation slightly before the item enters view
        offset: ["start end", "center center"]
    });

    // Active state for the dot
    const dotColor = useTransform(scrollYProgress, [0.6, 1], ["#d9d9d9", "#000000"]);

    return (
        <motion.div 
            ref={ref}
            className="relative pl-[32px] sm:pl-[60px]"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            {/* Timeline Dot */}
            <motion.div 
                className="absolute left-[5px] sm:left-[9px] top-[10px] w-[10px] h-[10px] rounded-full z-10 box-content border-[3px] border-white"
                style={{
                    backgroundColor: dotColor
                }}
            />

            <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-3">
                    <h3 className="text-[length:var(--typeface-heading-h4)] sm:text-[length:var(--typeface-heading-h3)] font-normal leading-normal text-[color:var(--on-surface-default)]">
                        {service.title}
                    </h3>
                    <p className="font-light text-[length:var(--typeface-paragraph-text-s)] sm:text-[length:var(--typeface-paragraph-text)] leading-6 text-[color:var(--on-surface-variant)] max-w-[600px]">
                        {service.description}
                    </p>
                    <ul className="flex flex-col gap-1.5 mt-2">
                        {service.bullets.map((bullet) => (
                            <li
                                key={bullet}
                                className="flex items-start gap-3 text-[length:var(--typeface-paragraph-text-s)] font-light leading-5 text-[color:var(--on-surface-variant)]"
                            >
                                <span className="mt-[8px] w-[3px] h-[3px] rounded-full bg-[var(--action-primary)] shrink-0" />
                                {bullet}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Image */}
                <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] overflow-hidden rounded-md mt-2">
                    <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 800px"
                    />
                </div>
            </div>
        </motion.div>
    );
}

