import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminStore {
    statusFilter: string;
    setStatusFilter: (filter: string) => void;
    leadTypeFilter: string;
    setLeadTypeFilter: (filter: string) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    sidebarOpen: boolean;
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
    statusFilter: 'ALL',
    setStatusFilter: (filter) => set({ statusFilter: filter }),
    leadTypeFilter: 'ALL',
    setLeadTypeFilter: (filter) => set({ leadTypeFilter: filter }),
    searchQuery: '',
    setSearchQuery: (query) => set({ searchQuery: query }),
    sidebarOpen: false,
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));

/* ── Display preferences: currency + area unit (remembered per browser) ── */

export type Currency = 'PKR' | 'USD' | 'AED' | 'GBP' | 'SAR';
export type AreaUnit = 'MARLA' | 'KANAL' | 'SQFT';

interface PrefsStore {
    currency: Currency;
    areaUnit: AreaUnit;
    setCurrency: (c: Currency) => void;
    setAreaUnit: (u: AreaUnit) => void;
}

// skipHydration keeps the server render (PKR / Marla) and the first client render identical;
// UnitSwitcher rehydrates from localStorage after mount.
export const usePrefs = create<PrefsStore>()(
    persist(
        (set) => ({
            currency: 'PKR',
            areaUnit: 'MARLA',
            setCurrency: (currency) => set({ currency }),
            setAreaUnit: (areaUnit) => set({ areaUnit }),
        }),
        { name: 'fasana-prefs', skipHydration: true },
    ),
);
