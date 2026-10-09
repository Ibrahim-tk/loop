"use client";

const POSTER_SRC = "/landing-page/hero.jpg";
const WEBM_SRC = "/landing-page/hero-video.webm";
const MP4_SRC = "/landing-page/hero-video.mp4";

export default function HeroVideo() {
    return (
        <div className="absolute inset-0 z-0 bg-black">
            <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster={POSTER_SRC}
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover"
                // @ts-expect-error -- fetchPriority is valid HTML but not yet in React types
                fetchPriority="high"
            >
                <source src={WEBM_SRC} type="video/webm" />
                <source src={MP4_SRC} type="video/mp4" />
            </video>

            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/40" />
        </div>
    );
}
