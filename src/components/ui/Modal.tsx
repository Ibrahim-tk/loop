'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

interface ModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    /** Optional one-liner under the title. */
    description?: string;
    /** sm: share-style slim dialogs · lg: pickers · xl: multi-pane flows like booking */
    size?: 'sm' | 'lg' | 'xl';
    children: React.ReactNode;
    className?: string;
}

const WIDTHS = { sm: 'max-w-[520px]', lg: 'max-w-[960px]', xl: 'max-w-[1080px]' };

/** Centered dialog on a soft blurred backdrop; rises in with the blur-rise motion. */
export default function Modal({ open, onOpenChange, title, description, size = 'lg', children, className }: ModalProps) {
    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="modal-overlay fixed inset-0 z-[60] bg-[rgb(10_13_18/0.35)] backdrop-blur-[6px]" />
                <Dialog.Content
                    className={cn(
                        'modal-content fixed z-[61] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-32px)] max-h-[calc(100dvh-32px)] overflow-y-auto',
                        'rounded-[16px] bg-[var(--bg-block)] shadow-[0_24px_64px_rgba(10,13,18,0.18)] focus:outline-none',
                        WIDTHS[size],
                        className,
                    )}
                >
                    <div className="flex items-start justify-between gap-4 px-6 pt-5">
                        <div className="flex flex-col gap-1">
                            <Dialog.Title className="text-[length:var(--typeface-heading-h5)] leading-7 [font-family:var(--font-heading)]">{title}</Dialog.Title>
                            {description ? (
                                <Dialog.Description className="text-[length:var(--typeface-paragraph-text-s)] text-[color:var(--text-secondary)]">
                                    {description}
                                </Dialog.Description>
                            ) : (
                                <Dialog.Description className="sr-only">{title}</Dialog.Description>
                            )}
                        </div>
                        <Dialog.Close
                            aria-label="Close"
                            className="flex items-center justify-center size-9 -mr-2 rounded-full text-[color:var(--text-secondary)] hover:bg-[var(--bg-gray-block)] hover:text-[color:var(--text-primary)] transition-colors"
                        >
                            <X size={18} />
                        </Dialog.Close>
                    </div>
                    <div className="px-6 pt-4 pb-6">{children}</div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
