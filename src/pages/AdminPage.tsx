import { Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { IssueManagement } from '@/components/admin/IssueManagement';
import { AdminReports } from '@/components/reports/AdminReports';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, ListTodo, Download } from 'lucide-react';

export default function AdminPage() {
  const { isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="issues" className="flex items-center gap-2">
              <ListTodo className="w-4 h-4" />
              Manage Issues
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Reports
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <AdminDashboard />
          </TabsContent>
          
          <TabsContent value="issues">
            <IssueManagement />
          </TabsContent>

          <TabsContent value="reports">
            <AdminReports />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
