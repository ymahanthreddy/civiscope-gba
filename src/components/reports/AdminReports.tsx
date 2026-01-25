import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIssues } from '@/contexts/IssueContext';
import { CATEGORY_CONFIG, STATUS_CONFIG } from '@/lib/constants';
import { Download, FileText, MapPin, PieChart, BarChart3, Sparkles, TrendingUp } from 'lucide-react';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const COLORS = ['#8b5cf6', '#06b6d4', '#f59e0b', '#10b981', '#ef4444', '#ec4899'];

export function AdminReports() {
  const { issues } = useIssues();
  const [reportType, setReportType] = useState<'area' | 'category'>('area');

  // Process data by area
  const areaData = useMemo(() => {
    const map = new Map<string, { total: number; resolved: number; pending: number; escalated: number }>();
    issues.forEach(issue => {
      const area = issue.area || 'Unknown';
      if (!map.has(area)) {
        map.set(area, { total: 0, resolved: 0, pending: 0, escalated: 0 });
      }
      const data = map.get(area)!;
      data.total++;
      if (issue.status === 'closed') data.resolved++;
      else if (issue.status === 'escalated') data.escalated++;
      else data.pending++;
    });
    return Array.from(map.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.total - a.total);
  }, [issues]);

  // Process data by category
  const categoryData = useMemo(() => {
    const map = new Map<string, number>();
    issues.forEach(issue => {
      const label = CATEGORY_CONFIG[issue.category as keyof typeof CATEGORY_CONFIG]?.label || issue.category;
      map.set(label, (map.get(label) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [issues]);

  // Get issues by category for detailed list
  const issuesByCategory = useMemo(() => {
    const map = new Map<string, typeof issues>();
    issues.forEach(issue => {
      const category = issue.category;
      if (!map.has(category)) {
        map.set(category, []);
      }
      map.get(category)!.push(issue);
    });
    return map;
  }, [issues]);

  const generateAreaPDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFillColor(99, 102, 241);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Area-wise Issue Report', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 105, 32, { align: 'center' });

    // Summary
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary by Area', 14, 55);

    const tableData = areaData.map(area => [
      area.name,
      area.total.toString(),
      area.resolved.toString(),
      area.pending.toString(),
      area.escalated.toString(),
      area.total > 0 ? `${Math.round((area.resolved / area.total) * 100)}%` : '0%',
    ]);

    autoTable(doc, {
      startY: 60,
      head: [['Area', 'Total', 'Resolved', 'Pending', 'Escalated', 'Resolution Rate']],
      body: tableData,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [99, 102, 241] },
      alternateRowStyles: { fillColor: [245, 247, 250] },
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text('CiviScope Admin Report', 105, 290, { align: 'center' });

    doc.save('CiviScope_Area_Report.pdf');
  };

  const generateCategoryPDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFillColor(6, 182, 212);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Category-wise Issue Report', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 105, 32, { align: 'center' });

    // Category Summary
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Issue Distribution by Category', 14, 55);

    const summaryData = categoryData.map(cat => [
      cat.name,
      cat.value.toString(),
      `${Math.round((cat.value / issues.length) * 100)}%`,
    ]);

    autoTable(doc, {
      startY: 60,
      head: [['Category', 'Count', 'Percentage']],
      body: summaryData,
      styles: { fontSize: 11 },
      headStyles: { fillColor: [6, 182, 212] },
    });

    // Detailed Issues per Category
    let yPos = (doc as any).lastAutoTable.finalY + 15;

    issuesByCategory.forEach((categoryIssues, category) => {
      const config = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG];
      
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`${config?.icon || ''} ${config?.label || category} (${categoryIssues.length} issues)`, 14, yPos);
      yPos += 5;

      const issueData = categoryIssues.map(issue => [
        issue.tracking_id,
        issue.location.substring(0, 25),
        STATUS_CONFIG[issue.status as keyof typeof STATUS_CONFIG]?.label || issue.status,
        new Date(issue.created_at).toLocaleDateString('en-IN'),
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [['ID', 'Location', 'Status', 'Date']],
        body: issueData,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [139, 92, 246] },
        margin: { left: 14, right: 14 },
      });

      yPos = (doc as any).lastAutoTable.finalY + 10;
    });

    // Footer on all pages
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(`CiviScope Admin Report | Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
    }

    doc.save('CiviScope_Category_Report.pdf');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="glass-card overflow-hidden">
        <CardHeader className="relative">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-cyan-500/20 to-violet-500/20 rounded-full blur-3xl" />
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <span>Admin Reports</span>
            <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
          </CardTitle>
          <CardDescription className="text-base">
            Generate comprehensive reports with charts and detailed issue breakdowns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="area" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2 h-12">
              <TabsTrigger value="area" className="gap-2 text-sm">
                <MapPin className="w-4 h-4" />
                By Area
              </TabsTrigger>
              <TabsTrigger value="category" className="gap-2 text-sm">
                <PieChart className="w-4 h-4" />
                By Category
              </TabsTrigger>
            </TabsList>

            {/* Area Report */}
            <TabsContent value="area" className="space-y-6">
              <div className="flex justify-end">
                <Button
                  onClick={generateAreaPDF}
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Area Report
                </Button>
              </div>

              {/* Area Bar Chart */}
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={areaData.slice(0, 10)} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 11 }} />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="total" fill="#8b5cf6" name="Total" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="resolved" fill="#10b981" name="Resolved" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="escalated" fill="#ef4444" name="Escalated" radius={[4, 4, 0, 0]} />
                    <Legend />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Area Table */}
              <div className="rounded-xl border overflow-hidden">
                <div className="bg-muted/50 px-4 py-3 border-b">
                  <h4 className="font-semibold flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Area Summary
                  </h4>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-background border-b">
                      <tr className="text-left text-sm text-muted-foreground">
                        <th className="px-4 py-3">Area</th>
                        <th className="px-4 py-3 text-center">Total</th>
                        <th className="px-4 py-3 text-center">Resolved</th>
                        <th className="px-4 py-3 text-center">Pending</th>
                        <th className="px-4 py-3 text-center">Escalated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {areaData.map((area, i) => (
                        <motion.tr
                          key={area.name}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                        >
                          <td className="px-4 py-3 font-medium">{area.name}</td>
                          <td className="px-4 py-3 text-center">
                            <Badge variant="secondary">{area.total}</Badge>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Badge className="bg-emerald-100 text-emerald-700">{area.resolved}</Badge>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Badge className="bg-amber-100 text-amber-700">{area.pending}</Badge>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Badge className="bg-red-100 text-red-700">{area.escalated}</Badge>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* Category Report */}
            <TabsContent value="category" className="space-y-6">
              <div className="flex justify-end">
                <Button
                  onClick={generateCategoryPDF}
                  className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 shadow-lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Category Report
                </Button>
              </div>

              {/* Category Pie Chart */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {categoryData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>

                {/* Category Stats */}
                <div className="space-y-3">
                  {categoryData.map((cat, i) => (
                    <motion.div
                      key={cat.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50"
                    >
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: COLORS[i % COLORS.length] }}
                      />
                      <span className="flex-1 font-medium">{cat.name}</span>
                      <Badge variant="secondary" className="text-lg font-bold">
                        {cat.value}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        ({Math.round((cat.value / issues.length) * 100)}%)
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Issues by Category */}
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Issues by Category
                </h4>
                {Array.from(issuesByCategory.entries()).map(([category, categoryIssues]) => {
                  const config = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG];
                  return (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl border overflow-hidden"
                    >
                      <div className="bg-muted/50 px-4 py-3 border-b flex items-center gap-3">
                        <span className="text-2xl">{config?.icon}</span>
                        <span className="font-semibold">{config?.label}</span>
                        <Badge>{categoryIssues.length}</Badge>
                      </div>
                      <div className="max-h-40 overflow-y-auto divide-y">
                        {categoryIssues.slice(0, 5).map(issue => (
                          <div key={issue.id} className="px-4 py-2 flex items-center justify-between hover:bg-muted/30 transition-colors">
                            <div className="flex-1 min-w-0">
                              <span className="font-mono text-sm text-primary">{issue.tracking_id}</span>
                              <p className="text-sm text-muted-foreground truncate">{issue.location}</p>
                            </div>
                            <Badge
                              className={`${STATUS_CONFIG[issue.status as keyof typeof STATUS_CONFIG]?.bgColor} ${STATUS_CONFIG[issue.status as keyof typeof STATUS_CONFIG]?.color}`}
                            >
                              {STATUS_CONFIG[issue.status as keyof typeof STATUS_CONFIG]?.label}
                            </Badge>
                          </div>
                        ))}
                        {categoryIssues.length > 5 && (
                          <div className="px-4 py-2 text-sm text-muted-foreground text-center">
                            + {categoryIssues.length - 5} more in PDF
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}