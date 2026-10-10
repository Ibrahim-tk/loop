import type { LeadType } from '@/lib/types';

export interface InquiryOption {
    label: string;
    leadType: LeadType;
    badgeColor: string;
    badgeBg: string;
}

export const INQUIRY_OPTIONS: InquiryOption[] = [
    { label: 'Property Management', leadType: 'OWNER', badgeColor: '#0A3161', badgeBg: '#E8EDF4' },
    { label: 'Leasing Inquiry', leadType: 'TENANT', badgeColor: '#15803d', badgeBg: '#E8F5EC' },
    { label: 'Renovation Services', leadType: 'RENOVATION', badgeColor: '#d97706', badgeBg: '#FEF3E2' },
    { label: 'List Your Property', leadType: 'OWNER', badgeColor: '#0369a1', badgeBg: '#f0f9ff' },
    { label: 'General Question', leadType: 'GENERAL', badgeColor: '#4A4F54', badgeBg: '#EDEEF0' },
];

export function getInquiryOption(helpType: string): InquiryOption {
    return (
        INQUIRY_OPTIONS.find((o) => o.label === helpType) ||
        INQUIRY_OPTIONS[INQUIRY_OPTIONS.length - 1] // Default to General Question
    );
}

export function getLeadTypeFromHelpType(helpType: string): LeadType {
    return getInquiryOption(helpType).leadType;
}
