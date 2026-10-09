# Hero Video Spec – Property App

Goal: Zero blank screen, < 2s load, mobile-friendly.

- Poster: /images/hero-poster.webp (optimized, 1200x800)
- Video: /videos/hero.webm + .mp4 (< 3 MB total)
- Behavior:
  - Desktop: autoPlay muted loop, poster first
  - Mobile: poster only (save 4G data)
  - Fallback: image after 3s timeout
- UX: subtle fade-in when video ready
- Perf: fetchpriority high, preload metadata