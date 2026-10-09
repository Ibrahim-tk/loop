import React from 'react';
import { CaretDown, X } from '@phosphor-icons/react';

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

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
    options: { label: string; value: string }[];
    placeholder?: string;
    onClear?: () => void;
};
export const PublicSelect = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className = '', options, placeholder = 'Select an option', value, onClear, ...props }, ref) => {
        const isPlaceholder = !value || value === '';

        return (
            <div className="relative w-full">
                <select
                    ref={ref}
                    value={value}
                    className={`w-full p-3 pr-10 border border-[var(--outline-default,#D1D5DB)] rounded-[6px] text-[length:var(--typeface-paragraph-text)] ${isPlaceholder ? 'text-black/40' : 'text-[color:var(--on-surface-default)]'} outline-none focus:border-[var(--on-surface-primary)] hover:border-[var(--outline-default)] transition-colors bg-white appearance-none cursor-pointer ${className}`}
                    {...props}
                >
                    {placeholder && <option value="" disabled hidden className="text-black/40">{placeholder}</option>}
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value} className="text-[color:var(--on-surface-default)]">
                            {opt.label}
                        </option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center z-10">
                    {!isPlaceholder && onClear ? (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onClear();
                            }}
                            className="w-[22px] h-[22px] rounded-[var(--radius-sm)] bg-[var(--surface-variant)] flex items-center justify-center text-[color:var(--on-surface-variant)] hover:text-[color:var(--on-surface-default)] transition-colors"
                            aria-label="Clear selection"
                        >
                            <X size={12} weight="bold" />
                        </button>
                    ) : (
                        <CaretDown
                            size={20}
                            weight="regular"
                            className="text-[color:var(--on-surface-variant)] pointer-events-none"
                        />
                    )}
                </div>
            </div>
        );
    }
);
PublicSelect.displayName = 'PublicSelect';
