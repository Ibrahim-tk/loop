'use client';

import { useState } from 'react';
import { MagnifyingGlass, X } from '@phosphor-icons/react';
import { PublicSelect } from '@/components/ui/public-inputs';

interface FilterBarProps {
    onFilterChange: (filters: {
        search: string;
        bedrooms: string;
        bathrooms: string;
    }) => void;
}

export default function FilterBar({ onFilterChange }: FilterBarProps) {
    const [search, setSearch] = useState('');
    const [bedrooms, setBedrooms] = useState('');
    const [bathrooms, setBathrooms] = useState('');

    const handleSearch = () => {
        onFilterChange({ search, bedrooms, bathrooms });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch();
    };

    return (
        <div className="flex flex-row gap-3 lg:gap-4">
            {/* Search Input */}
            <div className="flex-1 relative flex items-center bg-[var(--surface-default)] border border-[var(--outline-default)] rounded-[var(--radius-sm)] h-[48px] min-w-0">
                <MagnifyingGlass size={24} className="absolute left-3 text-[color:var(--on-surface-variant)] shrink-0 pointer-events-none" />
                <input
                    type="text"
                    placeholder="What are looking for"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full h-full pl-11 pr-10 text-base font-light text-[color:var(--on-surface-default)] placeholder:text-[color:var(--on-surface-variant)] bg-transparent outline-none"
                />
                {search && (
                    <button
                        onClick={() => {
                            setSearch('');
                            onFilterChange({ search: '', bedrooms, bathrooms });
                        }}
                        className="absolute right-3 w-[22px] h-[22px] rounded-[var(--radius-sm)] bg-[var(--surface-variant)] flex items-center justify-center text-[color:var(--on-surface-variant)] hover:text-[color:var(--on-surface-default)] transition-colors"
                        aria-label="Clear search"
                    >
                        <X size={12} weight="bold" />
                    </button>
                )}
            </div>

            {/* Beds Dropdown — hidden on mobile */}
            <div className="hidden lg:block w-[150px]">
                <PublicSelect
                    value={bedrooms}
                    onChange={(e) => {
                        setBedrooms(e.target.value);
                        onFilterChange({ search, bedrooms: e.target.value, bathrooms });
                    }}
                    onClear={() => {
                        setBedrooms('');
                        onFilterChange({ search, bedrooms: '', bathrooms });
                    }}
                    options={[
                        { label: '1+', value: '1' },
                        { label: '2+', value: '2' },
                        { label: '3+', value: '3' },
                        { label: '4+', value: '4' },
                        { label: '5+', value: '5' },
                    ]}
                    placeholder="Beds"
                    className="h-[48px]"
                />
            </div>

            {/* Baths Dropdown — hidden on mobile */}
            <div className="hidden lg:block w-[150px]">
                <PublicSelect
                    value={bathrooms}
                    onChange={(e) => {
                        setBathrooms(e.target.value);
                        onFilterChange({ search, bedrooms, bathrooms: e.target.value });
                    }}
                    onClear={() => {
                        setBathrooms('');
                        onFilterChange({ search, bedrooms, bathrooms: '' });
                    }}
                    options={[
                        { label: '1+', value: '1' },
                        { label: '2+', value: '2' },
                        { label: '3+', value: '3' },
                        { label: '4+', value: '4' },
                    ]}
                    placeholder="Baths"
                    className="h-[48px]"
                />
            </div>

            {/* Search Button */}
            <button
                onClick={handleSearch}
                className="bg-[var(--on-surface-primary)] text-white text-sm font-medium px-5 lg:px-[22.5px] h-[48px] rounded-[6px] whitespace-nowrap hover:bg-[var(--foundation-blue-blue-7)] transition-colors shrink-0"
            >
                Search
            </button>
        </div>
    );
}
