import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useIssues } from '@/contexts/IssueContext';
import { CATEGORY_CONFIG, STATUS_CONFIG } from '@/lib/constants';
import { Download, FileText, Calendar, CheckCircle2, Clock, AlertTriangle, Sparkles } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function UserReports() {
  const { issues } = useIssues();
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  // Get available months from issues
  const availableMonths = useMemo(() => {
    const months = new Map<string, { label: string; count: number }>();
    issues.forEach(issue => {
      const date = new Date(issue.created_at);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
      if (!months.has(key)) {
        months.set(key, { label, count: 0 });
      }
      months.get(key)!.count++;
    });
    return Array.from(months.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [issues]);

  // Filter issues for selected month
  const monthlyIssues = useMemo(() => {
    if (!selectedMonth) return [];
    return issues.filter(issue => {
      const date = new Date(issue.created_at);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      return key === selectedMonth;
    });
  }, [issues, selectedMonth]);

  // Stats for selected month
  const monthlyStats = useMemo(() => ({
    total: monthlyIssues.length,
    resolved: monthlyIssues.filter(i => i.status === 'closed').length,
    pending: monthlyIssues.filter(i => i.status !== 'closed' && i.status !== 'escalated').length,
    escalated: monthlyIssues.filter(i => i.status === 'escalated').length,
  }), [monthlyIssues]);

  const generatePDF = () => {
    if (!selectedMonth || monthlyIssues.length === 0) return;

    const doc = new jsPDF();
    const monthLabel = availableMonths.find(([key]) => key === selectedMonth)?.[1].label || selectedMonth;

    // Header with gradient effect
    doc.setFillColor(99, 102, 241);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('CiviScope Monthly Report', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(monthLabel, 105, 32, { align: 'center' });

    // Summary Stats
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary', 14, 55);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const statsY = 65;
    doc.text(`Total Issues Reported: ${monthlyStats.total}`, 14, statsY);
    doc.text(`Resolved: ${monthlyStats.resolved}`, 14, statsY + 8);
    doc.text(`Pending: ${monthlyStats.pending}`, 14, statsY + 16);
    doc.text(`Escalated: ${monthlyStats.escalated}`, 14, statsY + 24);
    doc.text(`Resolution Rate: ${monthlyStats.total > 0 ? Math.round((monthlyStats.resolved / monthlyStats.total) * 100) : 0}%`, 14, statsY + 32);

    // Issues Table
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Issue Details', 14, statsY + 50);

    const tableData = monthlyIssues.map(issue => [
      issue.tracking_id,
      CATEGORY_CONFIG[issue.category as keyof typeof CATEGORY_CONFIG]?.label || issue.category,
      issue.location.substring(0, 30) + (issue.location.length > 30 ? '...' : ''),
      STATUS_CONFIG[issue.status as keyof typeof STATUS_CONFIG]?.label || issue.status,
      new Date(issue.created_at).toLocaleDateString('en-IN'),
      issue.status === 'closed' && issue.closed_at 
        ? new Date(issue.closed_at).toLocaleDateString('en-IN') 
        : '-',
    ]);

    autoTable(doc, {
      startY: statsY + 55,
      head: [['Tracking ID', 'Category', 'Location', 'Status', 'Reported', 'Resolved']],
      body: tableData,
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [99, 102, 241], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 247, 250] },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 28 },
        1: { cellWidth: 30 },
        2: { cellWidth: 45 },
        3: { cellWidth: 25 },
        4: { cellWidth: 25 },
        5: { cellWidth: 25 },
      },
    });

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        `Generated on ${new Date().toLocaleDateString('en-IN')} | CiviScope - Smart Civic Issue Tracker | Page ${i} of ${pageCount}`,
        105,
        290,
        { align: 'center' }
      );
    }

    doc.save(`CiviScope_Report_${selectedMonth}.pdf`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/10 rounded-full blur-3xl"
        />
      </div>

      <Card className="glass-card overflow-hidden">
        <CardHeader className="relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-violet-500/20 rounded-full blur-2xl" />
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span>My Monthly Reports</span>
            <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
          </CardTitle>
          <CardDescription className="text-base">
            Download a detailed PDF summary of your reported issues by month
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Month Selector */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-full sm:w-64 h-12 text-base">
                <Calendar className="w-5 h-5 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Select a month" />
              </SelectTrigger>
              <SelectContent>
                {availableMonths.map(([key, { label, count }]) => (
                  <SelectItem key={key} value={key}>
                    <span className="flex items-center justify-between gap-4">
                      {label}
                      <Badge variant="secondary" className="ml-2">{count} issues</Badge>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={generatePDF}
              disabled={!selectedMonth || monthlyIssues.length === 0}
              className="h-12 px-6 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
            >
              <Download className="w-5 h-5 mr-2" />
              Download PDF Report
            </Button>
          </div>

          {/* Preview Stats */}
          {selectedMonth && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-muted-foreground">Total</span>
                </div>
                <p className="text-3xl font-bold text-blue-600">{monthlyStats.total}</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm text-muted-foreground">Resolved</span>
                </div>
                <p className="text-3xl font-bold text-emerald-600">{monthlyStats.resolved}</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                  <span className="text-sm text-muted-foreground">Pending</span>
                </div>
                <p className="text-3xl font-bold text-amber-600">{monthlyStats.pending}</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <span className="text-sm text-muted-foreground">Escalated</span>
                </div>
                <p className="text-3xl font-bold text-red-600">{monthlyStats.escalated}</p>
              </div>
            </motion.div>
          )}

          {/* Issue List Preview */}
          {selectedMonth && monthlyIssues.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3 max-h-64 overflow-y-auto"
            >
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Preview ({monthlyIssues.length} issues)
              </h4>
              {monthlyIssues.slice(0, 5).map((issue, i) => (
                <motion.div
                  key={issue.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50"
                >
                  <span className="text-2xl">
                    {CATEGORY_CONFIG[issue.category as keyof typeof CATEGORY_CONFIG]?.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-sm font-bold text-primary">{issue.tracking_id}</p>
                    <p className="text-sm text-muted-foreground truncate">{issue.description}</p>
                  </div>
                  <Badge
                    className={`${STATUS_CONFIG[issue.status as keyof typeof STATUS_CONFIG]?.bgColor} ${STATUS_CONFIG[issue.status as keyof typeof STATUS_CONFIG]?.color}`}
                  >
                    {STATUS_CONFIG[issue.status as keyof typeof STATUS_CONFIG]?.label}
                  </Badge>
                </motion.div>
              ))}
              {monthlyIssues.length > 5 && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  + {monthlyIssues.length - 5} more issues in PDF
                </p>
              )}
            </motion.div>
          )}

          {selectedMonth && monthlyIssues.length === 0 && (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No issues found for this month</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}