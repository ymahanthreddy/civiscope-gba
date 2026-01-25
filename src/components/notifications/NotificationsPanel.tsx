import { Bell, Heart, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useIssues } from '@/contexts/IssueContext';
import { useAuth } from '@/contexts/AuthContext';

export function NotificationsPanel() {
  const { issues } = useIssues();
  const { user } = useAuth();

  const userIssues = issues.filter(i => i.user_id === user?.id);
  
  const notifications = [
    ...userIssues.filter(i => i.status === 'assigned').map(i => ({
      id: i.id,
      type: 'assigned',
      message: `Your issue ${i.tracking_id} has been assigned`,
      time: i.updated_at,
      icon: CheckCircle,
      color: 'text-blue-500'
    })),
    ...userIssues.filter(i => i.status === 'in_progress').map(i => ({
      id: i.id,
      type: 'progress',
      message: `Work started on ${i.tracking_id}`,
      time: i.updated_at,
      icon: Clock,
      color: 'text-amber-500'
    })),
    ...userIssues.filter(i => i.status === 'closed').map(i => ({
      id: i.id,
      type: 'resolved',
      message: `Issue ${i.tracking_id} has been resolved!`,
      time: i.closed_at || i.updated_at,
      icon: CheckCircle,
      color: 'text-green-500'
    })),
    ...userIssues.filter(i => (i.likes_count || 0) > 0).map(i => ({
      id: `like-${i.id}`,
      type: 'like',
      message: `${i.likes_count} people support your issue ${i.tracking_id}`,
      time: i.updated_at,
      icon: Heart,
      color: 'text-red-500'
    })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notifications
          {notifications.length > 0 && (
            <Badge variant="secondary">{notifications.length}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No notifications yet</p>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div key={n.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <n.icon className={`w-5 h-5 mt-0.5 ${n.color}`} />
                <div className="flex-1">
                  <p className="text-sm">{n.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(n.time).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
