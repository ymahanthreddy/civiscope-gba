import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useIssues } from '@/contexts/IssueContext';
import { Navigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserReports } from '@/components/reports/UserReports';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  Plus,
  TrendingUp,
  Calendar,
  ArrowRight,
  User,
  Settings,
  Bell,
  Search,
  Download,
  LayoutDashboard
} from 'lucide-react';
import { CATEGORY_CONFIG, STATUS_CONFIG } from '@/lib/constants';
import { useMemo } from 'react';

export default function UserDashboard() {
  const { user, isLoading } = useAuth();
  const { issues } = useIssues();
  const issuesLoading = false; // Issues are already loaded

  // Filter issues by current user's id
  const userIssues = useMemo(() => {
    return issues.filter(issue => issue.user_id === user?.id);
  }, [issues, user?.id]);

  const stats = useMemo(() => ({
    total: userIssues.length,
    pending: userIssues.filter(i => i.status === 'reported' || i.status === 'assigned').length,
    inProgress: userIssues.filter(i => i.status === 'in_progress').length,
    resolved: userIssues.filter(i => i.status === 'closed').length,
  }), [userIssues]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const quickActions = [
    { icon: Plus, label: 'Report New Issue', to: '/report', color: 'from-blue-500 to-cyan-500' },
    { icon: Search, label: 'Track an Issue', to: '/track', color: 'from-violet-500 to-purple-500' },
    { icon: MapPin, label: 'View Map', to: '/#map', color: 'from-emerald-500 to-green-500' },
    { icon: Bell, label: 'Notifications', to: '#', color: 'from-orange-500 to-amber-500' },
  ];

  const statCards = [
    { title: 'Total Reports', value: stats.total, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Pending', value: stats.pending, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { title: 'In Progress', value: stats.inProgress, icon: AlertCircle, color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { title: 'Resolved', value: stats.resolved, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold font-display">
                Welcome back, <span className="text-gradient">{user.user_metadata?.full_name || 'Citizen'}</span>!
              </h1>
              <p className="text-muted-foreground mt-1">
                Track your civic contributions and manage your reports
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/settings">
                <Button variant="outline" size="sm" className="gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </Button>
              </Link>
              <Link to="/report">
                <Button size="sm" className="gap-2 primary-gradient">
                  <Plus className="w-4 h-4" />
                  Report Issue
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Main Content with Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="overview" className="gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-2">
              <Download className="w-4 h-4" />
              Download Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {quickActions.map((action, i) => (
                <Link key={action.label} to={action.to}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    className="group cursor-pointer"
                  >
                    <Card className="glass-card overflow-hidden">
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                          <action.icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-medium text-sm">{action.label}</span>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Link>
              ))}
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {statCards.map((stat, i) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="glass-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                          <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                      </div>
                      <p className="text-3xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Recent Issues */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="glass-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      Recent Reports
                    </CardTitle>
                    <CardDescription>Your latest civic issue reports</CardDescription>
                  </div>
                  <Link to="/track">
                    <Button variant="outline" size="sm" className="gap-2">
                      View All
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {issuesLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : userIssues.length === 0 ? (
                    <div className="text-center py-12">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4"
                      >
                        <FileText className="w-10 h-10 text-muted-foreground" />
                      </motion.div>
                      <h3 className="font-semibold text-lg mb-2">No reports yet</h3>
                      <p className="text-muted-foreground mb-4">Start contributing to your community by reporting an issue</p>
                      <Link to="/report">
                        <Button className="primary-gradient">
                          <Plus className="w-4 h-4 mr-2" />
                          Report Your First Issue
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {userIssues.map((issue, i) => {
                        const categoryConfig = CATEGORY_CONFIG[issue.category];
                        const statusConfig = STATUS_CONFIG[issue.status];
                        
                        return (
                          <motion.div
                            key={issue.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ x: 5, backgroundColor: 'hsl(var(--muted) / 0.5)' }}
                            className="flex items-center gap-4 p-4 rounded-xl border border-border/50 transition-colors cursor-pointer"
                          >
                            <div className="text-3xl">{categoryConfig?.icon || '📋'}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono text-xs text-primary font-bold">{issue.tracking_id}</span>
                                <Badge 
                                  variant="secondary"
                                  className={`${statusConfig?.bgColor} ${statusConfig?.color} text-xs`}
                                >
                                  {statusConfig?.label}
                                </Badge>
                              </div>
                              <p className="text-sm font-medium truncate">{issue.description}</p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                <MapPin className="w-3 h-3" />
                                {issue.location}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(issue.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted-foreground" />
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="reports">
            <UserReports />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
