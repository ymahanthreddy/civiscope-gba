import { useState, useEffect, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useIssues } from '@/contexts/IssueContext';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CATEGORY_CONFIG, STATUS_CONFIG } from '@/lib/constants';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, ClipboardList, Trophy, CheckCircle2, Clock, AlertTriangle,
  MapPin, Calendar, Flame, Timer, Download
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend
} from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const COLORS = ['#3b82f6', '#10b981', '#f97316', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function WorkerPortal() {
  const { user, isLoading: authLoading } = useAuth();
  const { issues, updateIssueStatus, closeIssue } = useIssues();
  const [workerStatus, setWorkerStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [closingId, setClosingId] = useState<string | null>(null);
  const [closureNote, setClosureNote] = useState('');

  useEffect(() => {
    if (!user) return;
    const checkWorker = async () => {
      const { data } = await supabase
        .from('worker_profiles')
        .select('status')
        .eq('user_id', user.id)
        .maybeSingle();
      setWorkerStatus(data?.status || null);
      setLoading(false);
    };
    checkWorker();
  }, [user]);

  const myIssues = useMemo(() => 
    issues.filter(i => i.assigned_worker_id === user?.id || i.assigned_to === user?.user_metadata?.full_name),
    [issues, user]
  );

  const stats = useMemo(() => ({
    total: myIssues.length,
    resolved: myIssues.filter(i => i.status === 'closed').length,
    inProgress: myIssues.filter(i => i.status === 'in_progress').length,
    pending: myIssues.filter(i => i.status === 'assigned' || i.status === 'reported').length,
    escalated: myIssues.filter(i => i.status === 'escalated').length,
  }), [myIssues]);

  const categoryBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    myIssues.forEach(i => { counts[i.category] = (counts[i.category] || 0) + 1; });
    return Object.entries(counts).map(([key, value]) => ({
      name: CATEGORY_CONFIG[key as keyof typeof CATEGORY_CONFIG]?.label || key,
      value,
    }));
  }, [myIssues]);

  const handleClose = async (issueId: string) => {
    if (!closureNote) return;
    const success = await closeIssue(issueId, closureNote);
    if (success) { setClosingId(null); setClosureNote(''); }
  };

  const downloadReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Worker Performance Report', 14, 22);
    doc.setFontSize(11);
    doc.text(`Worker: ${user?.user_metadata?.full_name || 'N/A'}`, 14, 32);
    doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 14, 39);
    doc.text(`Total Assigned: ${stats.total} | Resolved: ${stats.resolved} | Pending: ${stats.pending} | Escalated: ${stats.escalated}`, 14, 46);
    doc.text(`Resolution Rate: ${stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%`, 14, 53);

    autoTable(doc, {
      startY: 60,
      head: [['Tracking ID', 'Category', 'Status', 'Location', 'Created']],
      body: myIssues.map(i => [
        i.tracking_id,
        CATEGORY_CONFIG[i.category as keyof typeof CATEGORY_CONFIG]?.label || i.category,
        i.status,
        i.location.substring(0, 30),
        new Date(i.created_at).toLocaleDateString('en-IN'),
      ]),
    });

    doc.save('worker-report.pdf');
  };

  if (authLoading || loading) {
    return <Layout><div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div></Layout>;
  }

  if (!user) return <Navigate to="/auth" replace />;

  if (workerStatus === 'pending') {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <Clock className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Application Pending</h2>
          <p className="text-muted-foreground">Your worker application is awaiting admin approval. You'll get access once approved.</p>
        </div>
      </Layout>
    );
  }

  if (workerStatus === 'rejected') {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Application Rejected</h2>
          <p className="text-muted-foreground">Your worker application was not approved. Please contact admin for details.</p>
        </div>
      </Layout>
    );
  }

  if (workerStatus !== 'approved') {
    return <Navigate to="/auth" replace />;
  }

  const getSLAStatus = (issue: any) => {
    if (!issue.sla_deadline) return null;
    const remaining = new Date(issue.sla_deadline).getTime() - Date.now();
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    if (remaining < 0) return { label: 'SLA Breached', color: 'text-destructive', urgent: true };
    if (hours < 12) return { label: `${hours}h left`, color: 'text-amber-600', urgent: true };
    return { label: `${hours}h left`, color: 'text-muted-foreground', urgent: false };
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold">Worker Portal</h1>
              <p className="text-muted-foreground">Welcome, {user.user_metadata?.full_name || 'Worker'}</p>
            </div>
            <Button variant="outline" size="sm" onClick={downloadReport}>
              <Download className="w-4 h-4 mr-2" /> Download Report
            </Button>
          </div>
          
          <TabsList className="bg-muted/50">
            <TabsTrigger value="dashboard"><LayoutDashboard className="w-4 h-4 mr-2" />Dashboard</TabsTrigger>
            <TabsTrigger value="assignments"><ClipboardList className="w-4 h-4 mr-2" />My Assignments</TabsTrigger>
            <TabsTrigger value="leaderboard"><Trophy className="w-4 h-4 mr-2" />Leaderboard</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              {[
                { label: 'Total Assigned', value: stats.total, icon: ClipboardList, gradient: 'from-blue-500 to-cyan-400' },
                { label: 'Resolved', value: stats.resolved, icon: CheckCircle2, gradient: 'from-emerald-500 to-green-400' },
                { label: 'In Progress', value: stats.inProgress, icon: Clock, gradient: 'from-violet-500 to-purple-400' },
                { label: 'Pending', value: stats.pending, icon: Timer, gradient: 'from-amber-500 to-yellow-400' },
                { label: 'Escalated', value: stats.escalated, icon: Flame, gradient: 'from-red-500 to-orange-400' },
              ].map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center mx-auto mb-2`}>
                        <s.icon className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-2xl font-bold">{s.value}</p>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle className="text-lg">Issue Categories</CardTitle></CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={categoryBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" paddingAngle={5}>
                          {categoryBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip /><Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-lg">Resolution Rate</CardTitle></CardHeader>
                <CardContent className="flex items-center justify-center h-[250px]">
                  <div className="text-center">
                    <p className="text-6xl font-bold text-primary">{stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%</p>
                    <p className="text-muted-foreground mt-2">Issues Resolved</p>
                    <p className="text-sm text-muted-foreground">{stats.resolved} of {stats.total} assigned</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="assignments">
            <div className="space-y-4">
              {myIssues.length === 0 && (
                <Card className="text-center py-12"><CardContent><p className="text-muted-foreground">No issues assigned to you yet.</p></CardContent></Card>
              )}
              {myIssues.map((issue) => {
                const sla = getSLAStatus(issue);
                const catKey = issue.category as keyof typeof CATEGORY_CONFIG;
                const statKey = issue.status as keyof typeof STATUS_CONFIG;
                return (
                  <Card key={issue.id} className={issue.status === 'escalated' ? 'border-2 border-destructive' : ''}>
                    <CardContent className="p-4">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <span className="text-lg">{CATEGORY_CONFIG[catKey]?.icon}</span>
                            <span className="font-mono font-bold text-primary">{issue.tracking_id}</span>
                            <Badge className={`${STATUS_CONFIG[statKey]?.bgColor} ${STATUS_CONFIG[statKey]?.color} border ${STATUS_CONFIG[statKey]?.borderColor}`}>
                              {STATUS_CONFIG[statKey]?.label}
                            </Badge>
                            {issue.priority && (
                              <Badge variant={issue.priority === 'critical' ? 'destructive' : 'outline'}>
                                {(issue.priority as string).toUpperCase()}
                              </Badge>
                            )}
                            {sla && <span className={`text-xs font-medium ${sla.color}`}><Timer className="w-3 h-3 inline mr-1" />{sla.label}</span>}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{issue.description}</p>
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{issue.location}</span>
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(issue.created_at).toLocaleDateString('en-IN')}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {issue.status !== 'closed' && issue.status !== 'escalated' && (
                            <>
                              {issue.status !== 'in_progress' && (
                                <Button size="sm" variant="outline" onClick={() => updateIssueStatus(issue.id, 'in_progress')}>
                                  Start Work
                                </Button>
                              )}
                              {closingId === issue.id ? (
                                <div className="flex gap-2">
                                  <Textarea placeholder="Resolution notes..." value={closureNote} onChange={e => setClosureNote(e.target.value)} className="w-60" rows={2} />
                                  <Button size="sm" onClick={() => handleClose(issue.id)} disabled={!closureNote}>
                                    <CheckCircle2 className="w-4 h-4 mr-1" />Submit
                                  </Button>
                                </div>
                              ) : (
                                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setClosingId(issue.id)}>
                                  <CheckCircle2 className="w-4 h-4 mr-1" />Resolve
                                </Button>
                              )}
                            </>
                          )}
                          {issue.status === 'closed' && (
                            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 border"><CheckCircle2 className="w-3 h-3 mr-1" />Resolved</Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard">
            <WorkerLeaderboard currentUserId={user.id} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

function WorkerLeaderboard({ currentUserId }: { currentUserId: string }) {
  const { issues } = useIssues();
  const [workers, setWorkers] = useState<any[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data: workerProfiles } = await supabase
        .from('worker_profiles')
        .select('*')
        .eq('status', 'approved');
      
      if (!workerProfiles) return;

      const userIds = workerProfiles.map(w => w.user_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('user_id', userIds);

      const nameMap = new Map(profiles?.map(p => [p.user_id, p.full_name]) || []);

      const leaderboard = workerProfiles.map(w => {
        const assigned = issues.filter(i => i.assigned_worker_id === w.user_id);
        const resolved = assigned.filter(i => i.status === 'closed');
        return {
          user_id: w.user_id,
          name: nameMap.get(w.user_id) || 'Unknown',
          department: w.department,
          total: assigned.length,
          resolved: resolved.length,
          rate: assigned.length > 0 ? Math.round((resolved.length / assigned.length) * 100) : 0,
        };
      }).sort((a, b) => b.resolved - a.resolved);

      setWorkers(leaderboard);
    };
    fetchLeaderboard();
  }, [issues]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Trophy className="w-5 h-5 text-amber-500" />Worker Leaderboard</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b"><th className="text-left py-3 px-4">#</th><th className="text-left py-3 px-4">Worker</th><th className="text-left py-3 px-4">Department</th><th className="text-left py-3 px-4">Resolved</th><th className="text-left py-3 px-4">Total</th><th className="text-left py-3 px-4">Rate</th></tr>
              </thead>
              <tbody>
                {workers.map((w, i) => (
                  <tr key={w.user_id} className={`border-b hover:bg-muted/50 ${w.user_id === currentUserId ? 'bg-primary/5' : ''}`}>
                    <td className="py-3 px-4 font-bold">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</td>
                    <td className="py-3 px-4 font-medium">{w.name} {w.user_id === currentUserId && <Badge variant="outline" className="ml-2 text-xs">You</Badge>}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{w.department}</td>
                    <td className="py-3 px-4 font-bold text-emerald-600">{w.resolved}</td>
                    <td className="py-3 px-4">{w.total}</td>
                    <td className="py-3 px-4"><Badge variant={w.rate >= 80 ? 'default' : 'secondary'}>{w.rate}%</Badge></td>
                  </tr>
                ))}
                {workers.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">No worker data yet</td></tr>}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
