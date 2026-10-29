import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface WorkerProfile {
  id: string;
  user_id: string;
  full_name: string;
  phone: string | null;
  skills: string[] | null;
  city_id: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
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
      setLoading(false);
      return;
    }

    if (data && data.length > 0) {
      const enriched = data.map(w => ({
        ...w,
        status: w.status as 'pending' | 'approved' | 'rejected',
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
      .update({ status: 'approved' })
      .eq('id', workerId);

    if (error) {
      toast({ title: 'Error', description: 'Failed to approve worker', variant: 'destructive' });
      return false;
    }

    const worker = workers.find(w => w.id === workerId);
    if (worker) {
      await supabase.from('user_roles').upsert({ 
        user_id: worker.user_id, 
        role: 'worker' as any
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
