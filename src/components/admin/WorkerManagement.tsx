import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWorkers } from '@/hooks/useWorkers';
import { useAuth } from '@/contexts/AuthContext';
import { useIssues } from '@/contexts/IssueContext';
import { CheckCircle2, XCircle, Clock, UserCheck, UserX, Users, Shield, Download } from 'lucide-react';
import { useMemo } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function WorkerManagement() {
  const { workers, loading, approveWorker, rejectWorker } = useWorkers();
  const { user } = useAuth();
  const { issues } = useIssues();

  const pendingWorkers = workers.filter(w => w.status === 'pending');
  const approvedWorkers = workers.filter(w => w.status === 'approved');
  const rejectedWorkers = workers.filter(w => w.status === 'rejected');

  const workerPerformance = useMemo(() => {
    return approvedWorkers.map(w => {
      const assigned = issues.filter(i => i.assigned_to === w.full_name);
      const resolved = assigned.filter(i => i.status === 'closed');
      const escalated = assigned.filter(i => i.status === 'escalated');
      return {
        ...w,
        totalAssigned: assigned.length,
        totalResolved: resolved.length,
        totalEscalated: escalated.length,
        rate: assigned.length > 0 ? Math.round((resolved.length / assigned.length) * 100) : 0,
      };
    });
  }, [approvedWorkers, issues]);

  const downloadWorkerReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Worker Performance Report', 14, 22);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 14, 30);

    autoTable(doc, {
      startY: 38,
      head: [['Worker', 'Department', 'Assigned', 'Resolved', 'Escalated', 'Rate']],
      body: workerPerformance.map(w => [
        w.full_name || 'Unknown',
        w.skills?.join(', ') || 'N/A',
        w.totalAssigned,
        w.totalResolved,
        w.totalEscalated,
        `${w.rate}%`,
      ]),
    });

    doc.save('worker-performance-report.pdf');
  };

  if (loading) {
    return <div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">Worker Management</h2>
          <p className="text-muted-foreground">{approvedWorkers.length} active workers, {pendingWorkers.length} pending</p>
        </div>
        <Button variant="outline" size="sm" onClick={downloadWorkerReport}>
          <Download className="w-4 h-4 mr-2" />Worker Report
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending Approval', value: pendingWorkers.length, icon: Clock, color: 'text-amber-600' },
          { label: 'Active Workers', value: approvedWorkers.length, icon: UserCheck, color: 'text-emerald-600' },
          { label: 'Rejected', value: rejectedWorkers.length, icon: UserX, color: 'text-destructive' },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <s.icon className={`w-8 h-8 ${s.color}`} />
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending Applications */}
      {pendingWorkers.length > 0 && (
        <Card className="border-amber-500/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="w-5 h-5 text-amber-500" />
              Pending Applications ({pendingWorkers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingWorkers.map(w => (
              <motion.div key={w.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex items-center justify-between p-3 rounded-lg border bg-card">
                <div>
                  <p className="font-medium">{w.full_name || 'Unknown'}</p>
                  <p className="text-sm text-muted-foreground">{w.skills?.join(', ') || 'General'}</p>
                  {w.phone && <p className="text-xs text-muted-foreground">📞 {w.phone}</p>}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => user && approveWorker(w.id, user.id)}>
                    <CheckCircle2 className="w-4 h-4 mr-1" />Approve
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => rejectWorker(w.id)}>
                    <XCircle className="w-4 h-4 mr-1" />Reject
                  </Button>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Active Workers Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="w-5 h-5 text-primary" />
            Worker Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Worker</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Skills</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Assigned</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Resolved</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Escalated</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Rate</th>
                </tr>
              </thead>
              <tbody>
                {workerPerformance.map(w => (
                  <tr key={w.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{w.full_name || 'Unknown'}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{w.skills?.join(', ') || 'General'}</td>
                    <td className="py-3 px-4">{w.totalAssigned}</td>
                    <td className="py-3 px-4 font-bold text-emerald-600">{w.totalResolved}</td>
                    <td className="py-3 px-4 text-destructive">{w.totalEscalated}</td>
                    <td className="py-3 px-4">
                      <Badge variant={w.rate >= 80 ? 'default' : w.rate >= 50 ? 'secondary' : 'destructive'}>{w.rate}%</Badge>
                    </td>
                  </tr>
                ))}
                {workerPerformance.length === 0 && (
                  <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">No active workers yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
