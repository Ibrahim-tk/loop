'use client';

import { useEffect, useState } from 'react';
import { MessageSquare, Mail, Phone, Building, Calendar, Eye, Trash2, Clock, Search, Copy } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { deleteLead } from '@/lib/actions/leads';
import { useAdminTheme } from '@/components/admin/AdminThemeProvider';

function getTypeBadge(type: string) {
    const colors: Record<string, string> = { 
        OWNER: 'bg-blue-100/80 text-blue-800 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20', 
        TENANT: 'bg-green-100/80 text-green-800 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20', 
        RENOVATION: 'bg-amber-100/80 text-amber-800 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
        ANALYSIS: 'bg-purple-100/80 text-purple-800 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20',
        MAINTENANCE: 'bg-rose-100/80 text-rose-800 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20',
        GENERAL: 'bg-slate-100/80 text-slate-800 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20',
    };
    const className = colors[type] || 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20';
    return <Badge variant="outline" className={className}>{type.replace(/_/g, ' ')}</Badge>;
}

function getPropertyDisplay(lead: any) {
    if (lead.property?.title) return lead.property.title;
    if (lead.type === 'ANALYSIS' && lead.message) {
        const match = lead.message.match(/Property Address:\s*(.*)/);
        if (match && match[1]) return match[1];
    }
    return '—';
}

export default function AdminLeadsPage() {
    const { resolvedTheme } = useAdminTheme();
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [typeFilter, setTypeFilter] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLead, setSelectedLead] = useState<any>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    useEffect(() => {
        async function fetchLeads() {
            setLoading(true);
            try {
                const supabase = createClient();
                let query = supabase
                    .from('leads')
                    .select('*, property:properties(id, title)')
                    .order('created_at', { ascending: false });
                if (typeFilter !== 'ALL') query = query.eq('type', typeFilter);
                const { data, error } = await query;
                if (error) throw error;
                setLeads(data || []);
            } catch {
                toast.error('Failed to load leads.');
            } finally {
                setLoading(false);
            }
        }
        fetchLeads();
    }, [typeFilter]);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this lead?')) return;
        try {
            await deleteLead(id);
            setLeads(leads.filter(l => l.id !== id));
            toast.success('Lead deleted');
            if (selectedLead?.id === id) {
                setIsSheetOpen(false);
            }
        } catch {
            toast.error('Failed to delete lead');
        }
    };

    const handleView = (lead: any) => {
        setSelectedLead(lead);
        setIsSheetOpen(true);
    };

    const filteredLeads = leads.filter(lead => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
            lead.name?.toLowerCase().includes(q) ||
            lead.email?.toLowerCase().includes(q) ||
            lead.phone?.toLowerCase().includes(q) ||
            lead.message?.toLowerCase().includes(q) ||
            getPropertyDisplay(lead)?.toLowerCase().includes(q)
        );
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
                    <p className="text-muted-foreground text-sm">{filteredLeads.length} total inquiries</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search leads..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-background pl-8"
                        />
                    </div>
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="h-9 w-full sm:w-auto rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                        <option value="ALL">All Types</option>
                        <option value="OWNER">Owner</option>
                        <option value="TENANT">Tenant</option>
                        <option value="RENOVATION">Renovation</option>
                        <option value="ANALYSIS">Rental Analysis</option>
                    </select>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="h-1.5 w-32 overflow-hidden rounded-full bg-muted relative"><div className="absolute inset-y-0 left-0 bg-primary rounded-full animate-loading-bar" /></div>
                        </div>
                    ) : filteredLeads.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-30" />
                            <p>No leads found</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Message</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredLeads.map((lead) => (
                                    <TableRow key={lead.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback className="text-xs">
                                                        {lead.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium text-sm">{lead.name}</p>
                                                    <a href={`mailto:${lead.email}`} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                                                        {lead.email}
                                                    </a>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{getTypeBadge(lead.type)}</TableCell>
                                        <TableCell className="text-sm">
                                            {lead.phone ? (
                                                <a href={`tel:${lead.phone}`} className="hover:text-foreground transition-colors">{lead.phone}</a>
                                            ) : '—'}
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-sm text-muted-foreground max-w-[200px] truncate">{lead.message || '—'}</p>
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                            {formatDate(lead.created_at)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleView(lead)} title="View Detail">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(lead.id)} title="Delete Lead">
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className={`overflow-y-auto w-full sm:max-w-md admin-theme border-l border-border bg-card text-card-foreground shadow-2xl ${resolvedTheme === 'dark' ? 'dark' : ''}`}>
                    {selectedLead && (
                        <div className="flex flex-col h-full">
                            <SheetHeader className="pb-6">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-14 w-14 border border-border">
                                        <AvatarFallback className="text-xl font-medium bg-muted text-muted-foreground">
                                            {selectedLead.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <SheetTitle className="text-xl font-semibold tracking-tight text-foreground">
                                            {selectedLead.name}
                                        </SheetTitle>
                                        <SheetDescription className="text-sm mt-0.5 text-muted-foreground">
                                            Inquiry on {formatDate(selectedLead.created_at)}
                                        </SheetDescription>
                                    </div>
                                </div>
                            </SheetHeader>
                            
                            <div className="py-8 flex-1 space-y-10">
                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold tracking-wider uppercase border-b border-border pb-2 text-muted-foreground">
                                        Contact Info
                                    </h4>
                                    <div className="grid gap-4">
                                        <div>
                                            <p className="text-xs mb-1.5 font-medium text-muted-foreground">Email</p>
                                            <div className="flex items-center justify-between p-3 rounded-lg border border-border text-sm bg-muted/50 text-foreground">
                                                <div className="flex items-center gap-3">
                                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                                    <a href={`mailto:${selectedLead.email}`} className="font-medium hover:underline">
                                                        {selectedLead.email}
                                                    </a>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(selectedLead.email);
                                                        toast.success('Email copied to clipboard');
                                                    }}
                                                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                                                >
                                                    <Copy className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs mb-1.5 font-medium text-muted-foreground">Phone</p>
                                            <div className="flex items-center justify-between p-3 rounded-lg border border-border text-sm bg-muted/50 text-foreground">
                                                <div className="flex items-center gap-3">
                                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                                    {selectedLead.phone ? (
                                                        <a href={`tel:${selectedLead.phone}`} className="font-medium hover:underline">
                                                            {selectedLead.phone}
                                                        </a>
                                                    ) : (
                                                        <span className="italic text-muted-foreground">No phone provided</span>
                                                    )}
                                                </div>
                                                {selectedLead.phone && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(selectedLead.phone);
                                                            toast.success('Phone copied to clipboard');
                                                        }}
                                                        className="h-6 w-6 text-muted-foreground hover:text-foreground"
                                                    >
                                                        <Copy className="h-3 w-3" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold tracking-wider uppercase border-b border-border pb-2 text-muted-foreground">
                                        Inquiry Details
                                    </h4>
                                    <div className="grid gap-6">
                                        <div>
                                            <p className="text-xs mb-1.5 font-medium text-muted-foreground">Type</p>
                                            <div>{getTypeBadge(selectedLead.type)}</div>
                                        </div>
                                        
                                        {(selectedLead.property || selectedLead.type === 'ANALYSIS') && (
                                            <div>
                                                <p className="text-xs mb-1.5 font-medium text-muted-foreground">Property</p>
                                                <div className="flex items-start gap-3 p-3 rounded-lg border border-border text-sm bg-muted/50 text-foreground">
                                                    <Building className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground" />
                                                    <span className="font-medium leading-relaxed">{getPropertyDisplay(selectedLead)}</span>
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <p className="text-xs mb-1.5 font-medium text-muted-foreground">Message</p>
                                            <div className="relative group p-4 rounded-lg text-sm whitespace-pre-wrap border border-border leading-relaxed bg-muted/30 text-foreground">
                                                <div className="pr-6">
                                                    {selectedLead.message || 'No additional message provided.'}
                                                </div>
                                                {selectedLead.message && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(selectedLead.message);
                                                            toast.success('Message copied to clipboard');
                                                        }}
                                                        className="absolute top-3 right-3 h-6 w-6 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm border border-border/50 shadow-sm"
                                                    >
                                                        <Copy className="h-3 w-3" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-border flex items-center justify-between gap-3 bg-transparent mt-auto pb-2">
                                <div className="flex items-center gap-3">
                                    <Button variant="outline" asChild>
                                        <a href={`mailto:${selectedLead.email}`}>Email</a>
                                    </Button>
                                </div>
                                <Button 
                                    variant="destructive" 
                                    onClick={() => handleDelete(selectedLead.id)}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </Button>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}
