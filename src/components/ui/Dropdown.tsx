'use client';

import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { CaretDown, Check } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

/*
 * Drop-in replacement for a native <select>, styled with our design tokens.
 * Takes the same props as <select> (value, onChange with e.target.value, <option> children,
 * className, disabled, id, aria-*) so swapping is just a tag rename.
 * Radix forbids empty-string item values, so '' is mapped to a sentinel internally.
 */

const EMPTY = '__empty__';
const toItem = (v: string) => (v === '' ? EMPTY : v);
const fromItem = (v: string) => (v === EMPTY ? '' : v);

interface Opt {
    value: string;
    label: React.ReactNode;
    disabled?: boolean;
    hidden?: boolean;
}

function collectOptions(children: React.ReactNode, out: Opt[] = []): Opt[] {
    React.Children.forEach(children, (child) => {
        if (!React.isValidElement(child)) return;
        const props = child.props as {
            value?: string | number;
            children?: React.ReactNode;
            disabled?: boolean;
            hidden?: boolean;
        };
        if (child.type === 'option') {
            out.push({
                value: String(props.value ?? (typeof props.children === 'string' ? props.children : '')),
                label: props.children,
                disabled: props.disabled,
                hidden: props.hidden,
            });
        } else if (props.children) {
            collectOptions(props.children, out); // fragments, optgroups, wrappers
        }
    });
    return out;
}

export interface DropdownProps
    extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'onChange' | 'defaultValue'> {
    value?: string | number | readonly string[];
    defaultValue?: string | number;
    /** Called with a select-like event; only target.value / target.name are populated */
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    disabled?: boolean;
    required?: boolean;
    name?: string;
    placeholder?: string;
    /** Classes for the open menu panel */
    contentClassName?: string;
    children: React.ReactNode;
}

const Dropdown = React.forwardRef<HTMLButtonElement, DropdownProps>(
    ({ value, defaultValue, onChange, disabled, required, name, placeholder, className, contentClassName, children, ...rest }, ref) => {
        const options = collectOptions(children);
        const current = value !== undefined ? String(value) : undefined; // arrays unsupported (no multi-select)
        const selected = options.find((o) => o.value === (current ?? String(defaultValue ?? '')));
        // A hidden/disabled '' option acts as the placeholder, like a native select
        const placeholderOpt = options.find((o) => o.value === '' && (o.hidden || o.disabled));
        const showPlaceholder = !selected || selected === placeholderOpt;

        return (
            <SelectPrimitive.Root
                value={current !== undefined ? toItem(current) : undefined}
                defaultValue={defaultValue !== undefined ? toItem(String(defaultValue)) : undefined}
                onValueChange={(v) =>
                    onChange?.({ target: { value: fromItem(v), name: name ?? '' } } as unknown as React.ChangeEvent<HTMLSelectElement>)
                }
                disabled={disabled}
                required={required}
                name={name}
            >
                <SelectPrimitive.Trigger
                    ref={ref}
                    {...rest}
                    className={cn(
                        'group inline-flex w-full items-center justify-between gap-2 text-left cursor-pointer outline-none',
                        'focus-visible:ring-2 focus-visible:ring-[var(--color-green-500)] focus-visible:ring-offset-1',
                        'disabled:cursor-not-allowed',
                        className,
                    )}
                >
                    <span className={cn('truncate', showPlaceholder && 'text-[color:var(--text-tertiary)]')}>
                        {showPlaceholder ? (placeholderOpt?.label ?? placeholder ?? 'Select') : selected?.label}
                    </span>
                    <SelectPrimitive.Icon asChild>
                        <CaretDown
                            size={16}
                            aria-hidden="true"
                            className="shrink-0 text-[color:var(--on-surface-variant)] transition-transform duration-200 group-data-[state=open]:rotate-180"
                        />
                    </SelectPrimitive.Icon>
                </SelectPrimitive.Trigger>

                <SelectPrimitive.Portal>
                    <SelectPrimitive.Content
                        position="popper"
                        sideOffset={6}
                        className={cn(
                            'dropdown-content z-[200] min-w-[var(--radix-select-trigger-width)] max-h-[min(320px,var(--radix-select-content-available-height))] overflow-hidden',
                            'rounded-[8px] border border-[var(--outline-default)] bg-[var(--surface-default)] p-1',
                            'shadow-[0_12px_32px_rgba(10,13,18,0.14)]',
                            contentClassName,
                        )}
                    >
                        <SelectPrimitive.Viewport>
                            {options
                                .filter((o) => !o.hidden)
                                .map((o) => (
                                    <SelectPrimitive.Item
                                        key={o.value}
                                        value={toItem(o.value)}
                                        disabled={o.disabled}
                                        className={cn(
                                            'relative flex items-center gap-2 rounded-[6px] py-2.5 pl-3 pr-9 cursor-pointer select-none outline-none',
                                            'text-[length:var(--typeface-paragraph-text-s)] text-[color:var(--on-surface-default)]',
                                            'data-[highlighted]:bg-[var(--surface-variant)]',
                                            'data-[state=checked]:text-[color:var(--color-green-600)] data-[state=checked]:font-medium',
                                            'data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed',
                                        )}
                                    >
                                        <SelectPrimitive.ItemText>{o.label}</SelectPrimitive.ItemText>
                                        <SelectPrimitive.ItemIndicator className="absolute right-3 inline-flex">
                                            <Check size={14} weight="bold" />
                                        </SelectPrimitive.ItemIndicator>
                                    </SelectPrimitive.Item>
                                ))}
                        </SelectPrimitive.Viewport>
                    </SelectPrimitive.Content>
                </SelectPrimitive.Portal>
            </SelectPrimitive.Root>
        );
    },
);
Dropdown.displayName = 'Dropdown';

export default Dropdown;
