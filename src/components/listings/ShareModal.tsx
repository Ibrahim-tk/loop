'use client';

import { useEffect, useState } from 'react';
import { Check, Copy, EnvelopeSimple, FacebookLogo, LinkedinLogo, XLogo } from '@phosphor-icons/react';
import Modal from '@/components/ui/Modal';
import WhatsappIcon from '@/components/ui/WhatsappIcon';

/** Public origin for shared links: the deployed site when configured, otherwise wherever we're running. */
function siteOrigin() {
    const configured = process.env.NEXT_PUBLIC_SITE_URL;
    if (configured && !configured.includes('localhost')) return configured.replace(/\/$/, '');
    return typeof window !== 'undefined' ? window.location.origin : '';
}

export default function ShareModal({ open, onOpenChange, path, title }: { open: boolean; onOpenChange: (o: boolean) => void; path: string; title: string }) {
    const [copied, setCopied] = useState(false);
    const [url, setUrl] = useState('');

    useEffect(() => {
        if (open) {
            setUrl(`${siteOrigin()}${path}`);
            setCopied(false);
        }
    }, [open, path]);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            /* clipboard blocked: the field is still selectable */
        }
    };

    const text = encodeURIComponent(`${title} on Fasana Homes`);
    const link = encodeURIComponent(url);
    const socials = [
        { label: 'WhatsApp', href: `https://wa.me/?text=${text}%20${link}`, icon: <WhatsappIcon size={20} />, tint: 'hover:bg-[#25d366] hover:text-white' },
        { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${link}`, icon: <FacebookLogo size={20} weight="fill" />, tint: 'hover:bg-[#1877f2] hover:text-white' },
        { label: 'X', href: `https://twitter.com/intent/tweet?text=${text}&url=${link}`, icon: <XLogo size={20} weight="bold" />, tint: 'hover:bg-black hover:text-white' },
        { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${link}`, icon: <LinkedinLogo size={20} weight="fill" />, tint: 'hover:bg-[#0a66c2] hover:text-white' },
        { label: 'Email', href: `mailto:?subject=${text}&body=${link}`, icon: <EnvelopeSimple size={20} />, tint: 'hover:bg-[var(--action-primary)] hover:text-white' },
    ];

    return (
        <Modal open={open} onOpenChange={onOpenChange} title="Share" size="sm">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <p className="text-[length:var(--typeface-paragraph-text-s)] text-[color:var(--text-secondary)]">Copy link</p>
                    <button type="button" onClick={copy} aria-label="Copy link"
                        className="inline-flex items-center gap-1.5 text-[length:var(--typeface-paragraph-text-s)] font-medium text-[color:var(--text-primary)] hover:text-[color:var(--action-primary-hover)] transition-colors">
                        {copied ? <><Check size={16} weight="bold" className="text-[color:var(--action-primary-hover)]" /> Copied</> : <Copy size={18} />}
                    </button>
                </div>
                <input
                    readOnly
                    value={url}
                    onFocus={(e) => e.currentTarget.select()}
                    aria-label="Link to this property"
                    className="w-full h-11 px-3 rounded-[8px] bg-[var(--bg-gray-block)] text-[length:var(--typeface-paragraph-text-s)] text-[color:var(--text-secondary)] outline-none focus:ring-2 focus:ring-[var(--action-primary-hover)]/30"
                />
                <div className="flex items-center gap-2">
                    {socials.map((s) => (
                        <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`Share on ${s.label}`} title={s.label}
                            className={`flex items-center justify-center size-11 rounded-full bg-[var(--bg-gray-block)] text-[color:var(--text-primary)] transition-colors ${s.tint}`}>
                            {s.icon}
                        </a>
                    ))}
                </div>
            </div>
        </Modal>
    );
}
