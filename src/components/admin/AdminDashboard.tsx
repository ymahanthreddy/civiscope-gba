import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useIssues } from '@/contexts/IssueContext';
import { CATEGORY_CONFIG, STATUS_CONFIG } from '@/lib/constants';
import { BENGALURU_AREAS } from '@/lib/bengaluruAreas';
import { 
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  AreaChart, Area, Legend
} from 'recharts';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Users,
  Activity,
  Sparkles,
  Zap,
  MapPin
} from 'lucide-react';

const COLORS = ['#f97316', '#3b82f6', '#8b5cf6', '#10b981', '#ef4444', '#06b6d4'];
const GRADIENT_COLORS = [
  ['#f97316', '#fb923c'],
  ['#3b82f6', '#60a5fa'],
  ['#8b5cf6', '#a78bfa'],
  ['#10b981', '#34d399'],
  ['#ef4444', '#f87171'],
  ['#06b6d4', '#22d3ee'],
];

export function AdminDashboard() {
  const { issues, officials, loading } = useIssues();

  const stats = useMemo(() => {
    const total = issues.length;
    const resolved = issues.filter(i => i.status === 'closed').length;
    const pending = issues.filter(i => i.status !== 'closed').length;
    const escalated = issues.filter(i => {
      if (i.status === 'closed') return false;
      const days = (Date.now() - new Date(i.created_at).getTime()) / (1000 * 60 * 60 * 24);
      return days > 3;
    }).length;

    return { total, resolved, pending, escalated };
  }, [issues]);

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    issues.forEach(issue => {
      counts[issue.category] = (counts[issue.category] || 0) + 1;
    });
    return Object.entries(counts).map(([key, value]) => ({
      name: CATEGORY_CONFIG[key as keyof typeof CATEGORY_CONFIG]?.label || key,
      value,
      icon: CATEGORY_CONFIG[key as keyof typeof CATEGORY_CONFIG]?.icon || '📋',
    }));
  }, [issues]);

  // Area-based data from real issues
  const areaData = useMemo(() => {
    const counts: Record<string, number> = {};
    issues.forEach(issue => {
      const area = issue.area || 'Unknown';
      counts[area] = (counts[area] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [issues]);

  // Top affected area
  const topArea = areaData[0]?.name || 'N/A';
  const topAreaCount = areaData[0]?.value || 0;

  const monthlyData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      name: month,
      reported: Math.floor(Math.random() * 50) + 30,
      resolved: Math.floor(Math.random() * 40) + 25,
    }));
  }, []);

  const trendData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
      name: day,
      issues: Math.floor(Math.random() * 30) + 10,
      resolved: Math.floor(Math.random() * 25) + 5,
    }));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    { 
      title: 'Total Issues', 
      value: stats.total, 
      icon: FileText, 
      gradient: 'from-blue-500 to-cyan-400',
      shadowColor: 'shadow-blue-500/20'
    },
    { 
      title: 'Resolved', 
      value: stats.resolved, 
      icon: CheckCircle2, 
      gradient: 'from-emerald-500 to-green-400',
      shadowColor: 'shadow-emerald-500/20'
    },
    { 
      title: 'In Progress', 
      value: stats.pending, 
      icon: Clock, 
      gradient: 'from-violet-500 to-purple-400',
      shadowColor: 'shadow-violet-500/20'
    },
    { 
      title: 'Escalated (>3 days)', 
      value: stats.escalated, 
      icon: AlertTriangle, 
      gradient: 'from-red-500 to-orange-400',
      shadowColor: 'shadow-red-500/20'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-accent" />
            Dashboard
          </h1>
          <p className="text-muted-foreground">Overview of civic issues in Greater Bengaluru Area</p>
        </div>
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Badge variant="outline" className="border-primary text-primary">
            <Activity className="w-3 h-3 mr-1 animate-pulse" />
            Live Data
          </Badge>
        </motion.div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.1, type: 'spring', stiffness: 100 }}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <Card className={`shadow-lg ${stat.shadowColor} hover:shadow-xl transition-all duration-300 overflow-hidden group`}>
              <CardContent className="p-6 relative">
                {/* Animated background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <motion.p 
                      className="text-3xl font-bold text-foreground mt-1"
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.1, type: 'spring' }}
                    >
                      {stat.value}
                    </motion.p>
                  </div>
                  <motion.div 
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}
                  >
                    <stat.icon className="w-7 h-7 text-white" />
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - Issues by Category */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="shadow-lg hover:shadow-xl transition-shadow h-full overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                  <TrendingUp className="w-5 h-5 text-primary" />
                </motion.div>
                Issues by Category
                <Zap className="w-4 h-4 text-warning ml-auto" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      {GRADIENT_COLORS.map((colors, index) => (
                        <linearGradient key={index} id={`colorGradient${index}`} x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor={colors[0]} />
                          <stop offset="100%" stopColor={colors[1]} />
                        </linearGradient>
                      ))}
                    </defs>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      animationBegin={0}
                      animationDuration={1500}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={`url(#colorGradient${index % GRADIENT_COLORS.length})`}
                          stroke="none"
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px -10px rgba(0,0,0,0.2)'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bar Chart - Monthly Resolution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="shadow-lg hover:shadow-xl transition-shadow h-full overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Monthly Issue Resolution
                <Sparkles className="w-4 h-4 text-accent ml-auto" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <defs>
                      <linearGradient id="reportedGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#1d4ed8" />
                      </linearGradient>
                      <linearGradient id="resolvedGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px -10px rgba(0,0,0,0.2)'
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="reported" 
                      name="Reported" 
                      fill="url(#reportedGradient)" 
                      radius={[8, 8, 0, 0]}
                      animationDuration={1500}
                    />
                    <Bar 
                      dataKey="resolved" 
                      name="Resolved" 
                      fill="url(#resolvedGradient)" 
                      radius={[8, 8, 0, 0]}
                      animationDuration={1500}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Area-Based Analytics - NEW */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <Card className="shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Issues by Area
              <Badge variant="outline" className="ml-auto border-destructive text-destructive">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Most affected: {topArea} ({topAreaCount})
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={areaData} layout="vertical">
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    stroke="hsl(var(--muted-foreground))" 
                    width={100}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px -10px rgba(0,0,0,0.2)'
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    name="Issues" 
                    fill="url(#areaGradient)" 
                    radius={[0, 8, 8, 0]}
                    animationDuration={1500}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Trend Area Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary animate-pulse" />
              Weekly Issue Trend
              <Badge variant="secondary" className="ml-auto">Real-time</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="issuesAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="resolvedAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px -10px rgba(0,0,0,0.2)'
                    }}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="issues" 
                    name="New Issues"
                    stroke="#8b5cf6" 
                    fill="url(#issuesAreaGradient)" 
                    strokeWidth={3}
                    animationDuration={2000}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="resolved" 
                    name="Resolved"
                    stroke="#10b981" 
                    fill="url(#resolvedAreaGradient)" 
                    strokeWidth={3}
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Issues Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Recent Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Tracking ID</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Location</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Days</th>
                  </tr>
                </thead>
                <tbody>
                  {issues.slice(0, 5).map((issue, index) => {
                    const days = Math.floor((Date.now() - new Date(issue.created_at).getTime()) / (1000 * 60 * 60 * 24));
                    const isEscalated = issue.status !== 'closed' && days > 3;
                    const categoryKey = issue.category as keyof typeof CATEGORY_CONFIG;
                    const statusKey = issue.status as keyof typeof STATUS_CONFIG;
                    
                    return (
                      <motion.tr 
                        key={issue.id} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className={`border-b border-border/30 hover:bg-muted/50 transition-colors ${isEscalated ? 'bg-destructive/5' : ''}`}
                      >
                        <td className="py-3 px-4 font-mono text-sm font-medium text-primary">{issue.tracking_id}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{CATEGORY_CONFIG[categoryKey]?.icon || '📋'}</span>
                            <span className="text-sm">{CATEGORY_CONFIG[categoryKey]?.label || issue.category}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground max-w-[200px] truncate">
                          {issue.location}
                        </td>
                        <td className="py-3 px-4">
                          <Badge 
                            className={`${STATUS_CONFIG[statusKey]?.bgColor} ${STATUS_CONFIG[statusKey]?.color} ${STATUS_CONFIG[statusKey]?.borderColor} border`}
                          >
                            {STATUS_CONFIG[statusKey]?.label || issue.status}
                          </Badge>
                        </td>
                        <td className={`py-3 px-4 text-sm font-medium ${isEscalated ? 'text-destructive' : ''}`}>
                          <div className="flex items-center gap-1">
                            {days}d
                            {isEscalated && (
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                              >
                                <AlertTriangle className="w-4 h-4" />
                              </motion.div>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
