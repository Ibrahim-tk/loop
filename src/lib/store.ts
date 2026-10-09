import { create } from 'zustand';

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
