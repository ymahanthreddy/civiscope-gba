import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface WorkerProfile {
  id: string;
  user_id: string;
  department: string;
  phone: string | null;
  specialization: string | null;
  status: 'pending' | 'approved' | 'rejected';
  approved_at: string | null;
  approved_by: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  full_name?: string;
  email?: string;
}

export function useWorkers() {
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkers = useCallback(async () => {
    const { data, error } = await supabase
      .from('worker_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching workers:', error);
      return;
    }

    // Get profile names for workers
    if (data && data.length > 0) {
      const userIds = data.map(w => w.user_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('user_id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p.full_name]) || []);
      
      const enriched = data.map(w => ({
        ...w,
        status: w.status as 'pending' | 'approved' | 'rejected',
        full_name: profileMap.get(w.user_id) || 'Unknown',
      }));
      
      setWorkers(enriched);
    } else {
      setWorkers([]);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchWorkers();

    const channel = supabase
      .channel('worker-profiles-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'worker_profiles' }, () => {
        fetchWorkers();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchWorkers]);

  const approveWorker = async (workerId: string, approverId: string) => {
    const { error } = await supabase
      .from('worker_profiles')
      .update({ 
        status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: approverId,
      })
      .eq('id', workerId);

    if (error) {
      toast({ title: 'Error', description: 'Failed to approve worker', variant: 'destructive' });
      return false;
    }

    // Also set worker role
    const worker = workers.find(w => w.id === workerId);
    if (worker) {
      await supabase.from('user_roles').upsert({ 
        user_id: worker.user_id, 
        role: 'worker' 
      }, { onConflict: 'user_id,role' });
    }

    toast({ title: 'Worker Approved ✅', description: 'Worker can now access their portal' });
    return true;
  };

  const rejectWorker = async (workerId: string) => {
    const { error } = await supabase
      .from('worker_profiles')
      .update({ status: 'rejected' })
      .eq('id', workerId);

    if (error) {
      toast({ title: 'Error', description: 'Failed to reject worker', variant: 'destructive' });
      return false;
    }

    toast({ title: 'Worker Rejected', description: 'Application has been declined' });
    return true;
  };

  const getApprovedWorkers = () => workers.filter(w => w.status === 'approved');

  return { workers, loading, fetchWorkers, approveWorker, rejectWorker, getApprovedWorkers };
}
