'use server';

import { createClient, requireAdmin } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { MaintenanceFormData } from '@/lib/types';

export async function getMaintenanceOrders(filters?: {
    status?: string;
    propertyId?: string;
}) {
    await requireAdmin();
    const supabase = await createClient();

    let query = supabase
        .from('maintenance_orders')
        .select('*, property:properties(id, title, address)')
        .order('created_at', { ascending: false });

    if (filters?.status && filters.status !== 'ALL') {
        query = query.eq('status', filters.status);
    }
    if (filters?.propertyId) {
        query = query.eq('property_id', filters.propertyId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
}

export async function createMaintenanceOrder(formData: MaintenanceFormData) {
    const { supabase } = await requireAdmin();
    const { data, error } = await supabase
        .from('maintenance_orders')
        .insert([{ ...formData, status: 'PENDING' }])
        .select()
        .single();

    if (error) throw error;
    revalidatePath('/admin/maintenance');
    return data;
}

export async function updateMaintenanceOrder(
    id: string,
    updates: Partial<MaintenanceFormData & { status: string }>
) {
    const { supabase } = await requireAdmin();
    const { data, error } = await supabase
        .from('maintenance_orders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    revalidatePath('/admin/maintenance');
    return data;
}

export async function completeMaintenanceOrder(id: string) {
    return updateMaintenanceOrder(id, { status: 'COMPLETED' });
}

export async function deleteMaintenanceOrder(id: string) {
    const { supabase } = await requireAdmin();
    const { error } = await supabase
        .from('maintenance_orders')
        .delete()
        .eq('id', id);

    if (error) throw error;
    revalidatePath('/admin/maintenance');
}

export async function getMaintenanceStats() {
    await requireAdmin();
    const supabase = await createClient();

    const today = new Date().toISOString().split('T')[0];

    const [
        { count: totalOrders },
        { count: pendingOrders },
        { count: inProgressOrders },
        { count: completedOrders },
        { count: overdueOrders },
        { data: recentOrders },
    ] = await Promise.all([
        supabase
            .from('maintenance_orders')
            .select('*', { count: 'exact', head: true }),
        supabase
            .from('maintenance_orders')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'PENDING'),
        supabase
            .from('maintenance_orders')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'IN_PROGRESS'),
        supabase
            .from('maintenance_orders')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'COMPLETED'),
        supabase
            .from('maintenance_orders')
            .select('*', { count: 'exact', head: true })
            .lt('due_date', today)
            .neq('status', 'COMPLETED'),
        supabase
            .from('maintenance_orders')
            .select('*, property:properties(id, title, address)')
            .order('created_at', { ascending: false })
            .limit(5),
    ]);

    return {
        totalOrders: totalOrders || 0,
        pendingOrders: pendingOrders || 0,
        inProgressOrders: inProgressOrders || 0,
        completedOrders: completedOrders || 0,
        overdueOrders: overdueOrders || 0,
        recentOrders: recentOrders || [],
    };
}
