# Page Transitions Spec – Next.js 15 App Router

## Requirements
- Smooth fade + slide on every route change  
- No flicker, no scroll-jump  
- Bundle impact: < 40 KB gzipped for motion  
- Works with SSR, client-side nav  
- Reusable across app  

## Variants
- Enter: opacity 0 → 1, y: 20 → 0  
- Exit: opacity 1 → 0, y: 0 → -20  
- Duration: 400ms, ease: 'easeOut'  

## Fallback
If View Transitions enabled, use native first—else Framer  

## Constraints
- Lazy-load motion (LazyMotion + domAnimation)  
- No global styles overriding transitions  
- Keep initial load under 100 KB total  

## Success criteria
- Lighthouse perf score > 95  
- Bundle analyzer shows motion < 30 KB  
- Transitions feel like Framer prototypes