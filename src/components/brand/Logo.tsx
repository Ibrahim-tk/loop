import { cn } from '@/lib/utils';

/** Fasana Homes mark (high-res raster of the brand icon). Size it with a height class. */
export function LogoMark({ className, title }: { className?: string; title?: string }) {
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src="/brand/logo-icon.png"
            alt={title ?? ''}
            aria-hidden={title ? undefined : true}
            draggable={false}
            className={cn('shrink-0 w-auto object-contain', className)}
        />
    );
}

/** Mark + "Fasana Homes" wordmark. Height drives the size; the text inherits color. */
export default function Logo({ className, markClassName }: { className?: string; markClassName?: string }) {
    return (
        <span className={cn('inline-flex items-center gap-2 h-[26px]', className)}>
            <LogoMark className={cn('h-full w-auto', markClassName)} />
            <span className="font-[family-name:var(--font-bricolage-loaded)] font-semibold tracking-[-0.02em] leading-none text-[length:1em] whitespace-nowrap">
                Fasana Homes
            </span>
        </span>
    );
}
