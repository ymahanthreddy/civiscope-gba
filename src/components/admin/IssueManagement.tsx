import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useIssues, Issue, IssueStatus } from '@/contexts/IssueContext';
import { CATEGORY_CONFIG, STATUS_CONFIG } from '@/lib/constants';
import { toast } from '@/hooks/use-toast';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  User,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ImagePlus,
  Flame
} from 'lucide-react';

export function IssueManagement() {
  const { issues, officials, loading, assignIssue, updateIssueStatus, closeIssue } = useIssues();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [closureNote, setClosureNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = 
      issue.tracking_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || issue.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getDaysElapsed = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const isOldPending = (issue: Issue) => {
    return issue.status !== 'closed' && issue.status !== 'escalated' && getDaysElapsed(issue.created_at) > 3;
  };

  const handleAssign = async (issueId: string, officialName: string) => {
    await assignIssue(issueId, officialName);
  };

  const handleStatusUpdate = async (issueId: string, status: IssueStatus) => {
    await updateIssueStatus(issueId, status);
  };

  const handleCloseIssue = async () => {
    if (selectedIssue && closureNote) {
      setIsSubmitting(true);
      const success = await closeIssue(selectedIssue.id, closureNote);
      if (success) {
        setIsClosing(false);
        setSelectedIssue(null);
        setClosureNote('');
      }
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Issue Management</h1>
        <p className="text-muted-foreground">Manage and resolve civic issues</p>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID, location, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px] bg-background">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="all">All Status</SelectItem>
                  {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                    <SelectItem key={key} value={key}>{config.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[150px] bg-background">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="all">All Categories</SelectItem>
                  {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.icon} {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Issues List */}
      <div className="space-y-4">
        {filteredIssues.map((issue, i) => {
          const isOld = isOldPending(issue);
          const isEscalated = issue.status === 'escalated';
          const days = getDaysElapsed(issue.created_at);
          const categoryKey = issue.category as keyof typeof CATEGORY_CONFIG;
          const statusKey = issue.status as keyof typeof STATUS_CONFIG;
          
          return (
            <motion.div
              key={issue.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className={`shadow-card hover:shadow-card-hover transition-all ${
                isEscalated 
                  ? 'border-2 border-destructive ring-2 ring-destructive/20 bg-destructive/5' 
                  : isOld 
                    ? 'border-2 border-amber-500/50 bg-amber-500/5' 
                    : ''
              }`}>
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Issue Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`w-12 h-12 rounded-xl ${CATEGORY_CONFIG[categoryKey]?.bgColor || 'bg-muted'} flex items-center justify-center text-2xl`}>
                          {CATEGORY_CONFIG[categoryKey]?.icon || '📋'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-bold text-primary">{issue.tracking_id}</span>
                            <Badge 
                              className={`${STATUS_CONFIG[statusKey]?.bgColor} ${STATUS_CONFIG[statusKey]?.color} ${STATUS_CONFIG[statusKey]?.borderColor} border`}
                            >
                              {STATUS_CONFIG[statusKey]?.label || issue.status}
                            </Badge>
                            {isEscalated && (
                              <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 animate-pulse">
                                <Flame className="w-3 h-3 mr-1" />
                                ESCALATED
                              </Badge>
                            )}
                            {isOld && !isEscalated && (
                              <Badge variant="outline" className="border-amber-500 text-amber-600">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Pending {days} days
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                            {issue.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {issue.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(issue.created_at).toLocaleDateString('en-IN')}
                        </span>
                        <span className={`flex items-center gap-1 ${isEscalated ? 'text-destructive font-medium' : isOld ? 'text-amber-600 font-medium' : ''}`}>
                          <Clock className="w-4 h-4" />
                          {days} days
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2 lg:w-auto">
                      {/* Escalated - Show prominent message, no actions */}
                      {isEscalated && (
                        <div className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-red-500/15 to-orange-500/15 border-2 border-destructive/40 rounded-xl shadow-lg">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-md">
                            <Flame className="w-5 h-5 text-white animate-pulse" />
                          </div>
                          <div>
                            <p className="font-bold text-destructive text-sm">Issue Escalated to Supervisor</p>
                            <p className="text-xs text-destructive/80">Urgent attention required • Admin notified</p>
                          </div>
                        </div>
                      )}

                      {/* Normal workflow for non-escalated, non-closed issues */}
                      {issue.status !== 'closed' && !isEscalated && (
                        <>
                          {/* Assign Dropdown */}
                          <Select
                            value={issue.assigned_to || ''}
                            onValueChange={(value) => handleAssign(issue.id, value)}
                          >
                            <SelectTrigger className="w-full sm:w-[160px] bg-background">
                              <User className="w-4 h-4 mr-2" />
                              <SelectValue placeholder="Assign to..." />
                            </SelectTrigger>
                            <SelectContent className="bg-popover">
                              {officials.map((official) => (
                                <SelectItem key={official.id} value={official.name}>
                                  {official.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {/* Status Update */}
                          <Select
                            value={issue.status}
                            onValueChange={(value) => handleStatusUpdate(issue.id, value as IssueStatus)}
                          >
                            <SelectTrigger className="w-full sm:w-[140px] bg-background">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-popover">
                              <SelectItem value="reported">Reported</SelectItem>
                              <SelectItem value="assigned">Assigned</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                            </SelectContent>
                          </Select>

                          {/* Close Issue */}
                          <Button
                            variant="outline"
                            className="border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white"
                            onClick={() => {
                              setSelectedIssue(issue);
                              setIsClosing(true);
                            }}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Close
                          </Button>
                        </>
                      )}
                      
                      {issue.status === 'closed' && (
                        <div className="flex items-center gap-2 text-emerald-600">
                          <CheckCircle2 className="w-5 h-5" />
                          <span className="font-medium">Resolved</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}

        {filteredIssues.length === 0 && (
          <Card className="shadow-card text-center py-12">
            <CardContent>
              <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No issues found matching your filters</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Close Issue Dialog */}
      <Dialog open={isClosing} onOpenChange={setIsClosing}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>Close Issue</DialogTitle>
            <DialogDescription>
              Mark this issue as resolved. Please add a closure note and photo proof.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Issue: {selectedIssue?.tracking_id}</p>
              <p className="text-sm text-muted-foreground">{selectedIssue?.description}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Closure Note *</label>
              <Textarea
                placeholder="Describe how the issue was resolved..."
                value={closureNote}
                onChange={(e) => setClosureNote(e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Photo Proof</label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50">
                <ImagePlus className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Upload resolution photo</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsClosing(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-success hover:bg-success/90"
              onClick={handleCloseIssue}
              disabled={!closureNote || isSubmitting}
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              ) : (
                <CheckCircle2 className="w-4 h-4 mr-2" />
              )}
              Mark as Resolved
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
