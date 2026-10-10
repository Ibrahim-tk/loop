import React from 'react';
import { X } from '@phosphor-icons/react';
import Dropdown from '@/components/ui/Dropdown';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
export const PublicInput = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', ...props }, ref) => {
        return (
            <input
                ref={ref}
                className={`w-full p-3 border border-[var(--outline-default,#D1D5DB)] rounded-[6px] text-[length:var(--typeface-paragraph-text)] text-[color:var(--on-surface-default)] placeholder-black/40 outline-none focus:border-[var(--on-surface-primary)] hover:border-[var(--outline-default)] transition-colors bg-white ${className}`}
                {...props}
            />
        );
    }
);
PublicInput.displayName = 'PublicInput';

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;
export const PublicTextarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className = '', ...props }, ref) => {
        return (
            <textarea
                ref={ref}
                className={`w-full p-3 border border-[var(--outline-default,#D1D5DB)] rounded-[6px] text-[length:var(--typeface-paragraph-text)] text-[color:var(--on-surface-default)] placeholder-black/40 outline-none focus:border-[var(--on-surface-primary)] hover:border-[var(--outline-default)] transition-colors bg-white resize-y ${className}`}
                {...props}
            />
        );
    }
);
PublicTextarea.displayName = 'PublicTextarea';

type SelectProps = {
    options: { label: string; value: string }[];
    placeholder?: string;
    onClear?: () => void;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    className?: string;
    id?: string;
    name?: string;
    disabled?: boolean;
    required?: boolean;
    'aria-label'?: string;
    'aria-invalid'?: boolean;
    'aria-describedby'?: string;
};
export const PublicSelect = React.forwardRef<HTMLButtonElement, SelectProps>(
    ({ className = '', options, placeholder = 'Select an option', value, onClear, ...props }, ref) => {
        const isPlaceholder = !value;
        return (
            <div className="relative w-full">
                <Dropdown
                    ref={ref}
                    value={value ?? ''}
                    className={`w-full p-3 border border-[var(--outline-default,#D1D5DB)] rounded-[6px] text-[length:var(--typeface-paragraph-text)] text-[color:var(--on-surface-default)] hover:border-[var(--outline-default)] data-[state=open]:border-[var(--on-surface-primary)] transition-colors bg-white ${!isPlaceholder && onClear ? 'pr-12' : ''} ${className}`}
                    {...props}
                >
                    <option value="" disabled hidden>{placeholder}</option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </Dropdown>
                {!isPlaceholder && onClear && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onClear();
                        }}
                        className="absolute right-9 top-1/2 -translate-y-1/2 w-[22px] h-[22px] rounded-[var(--radius-sm)] bg-[var(--surface-variant)] flex items-center justify-center text-[color:var(--on-surface-variant)] hover:text-[color:var(--on-surface-default)] transition-colors"
                        aria-label="Clear selection"
                    >
                        <X size={12} weight="bold" />
                    </button>
                )}
            </div>
        );
    }
);
PublicSelect.displayName = 'PublicSelect';
