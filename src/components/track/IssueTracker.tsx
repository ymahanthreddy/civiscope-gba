import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useIssues, Issue } from '@/contexts/IssueContext';
import { CATEGORY_CONFIG, STATUS_CONFIG, WORKFLOW_STEPS } from '@/lib/constants';
import { 
  Search, 
  MapPin, 
  Calendar, 
  User, 
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare
} from 'lucide-react';

export function IssueTracker() {
  const [searchParams] = useSearchParams();
  const { getIssueByTrackingId } = useIssues();
  const [trackingId, setTrackingId] = useState(searchParams.get('id') || '');
  const [issue, setIssue] = useState<Issue | null>(null);
  const [searched, setSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const idFromParams = searchParams.get('id');
    if (idFromParams) {
      setTrackingId(idFromParams);
      handleSearchById(idFromParams);
    }
  }, [searchParams]);

  const handleSearchById = async (id: string) => {
    if (!id.trim()) return;
    
    setIsSearching(true);
    const foundIssue = await getIssueByTrackingId(id.trim());
    setIssue(foundIssue);
    setSearched(true);
    setIsSearching(false);
  };

  const handleSearch = async () => {
    await handleSearchById(trackingId);
  };

  const getStatusIndex = (status: string) => {
    return WORKFLOW_STEPS.findIndex(s => s.status === status);
  };

  const getDaysElapsed = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const isEscalated = (issue: Issue) => {
    return issue.status !== 'closed' && getDaysElapsed(issue.created_at) > 3;
  };

  const categoryKey = issue?.category as keyof typeof CATEGORY_CONFIG;
  const statusKey = issue?.status as keyof typeof STATUS_CONFIG;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Search Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="shadow-xl mb-8">
          <CardHeader className="text-center pb-2">
            <CardTitle className="font-display text-2xl">Track Your Issue</CardTitle>
            <p className="text-muted-foreground">
              Enter your tracking ID to check the status
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Enter tracking ID (e.g., CIV-XXXXXXXX)"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 text-lg h-12"
                />
              </div>
              <Button 
                onClick={handleSearch} 
                className="primary-gradient px-8 h-12"
                disabled={isSearching}
              >
                {isSearching ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Track'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Results */}
      {searched && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {issue ? (
            <Card className={`shadow-xl ${isEscalated(issue) ? 'border-2 border-destructive/50' : ''}`}>
              <CardContent className="pt-6">
                {/* Escalation Warning */}
                {isEscalated(issue) && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-destructive" />
                    <div>
                      <p className="font-medium text-destructive">Issue Escalated</p>
                      <p className="text-sm text-destructive/80">
                        This issue has been pending for more than 3 days
                      </p>
                    </div>
                  </div>
                )}

                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{CATEGORY_CONFIG[categoryKey]?.icon || '📋'}</span>
                      <div>
                        <p className="text-sm text-muted-foreground">Tracking ID</p>
                        <p className="font-mono text-xl font-bold text-primary">{issue.tracking_id}</p>
                      </div>
                    </div>
                  </div>
                  <Badge 
                    className={`${STATUS_CONFIG[statusKey]?.bgColor} ${STATUS_CONFIG[statusKey]?.color} ${STATUS_CONFIG[statusKey]?.borderColor} border text-sm px-3 py-1`}
                  >
                    {STATUS_CONFIG[statusKey]?.label || issue.status}
                  </Badge>
                </div>

                {/* Progress Workflow */}
                <div className="mb-8">
                  <div className="flex justify-between relative">
                    {/* Progress Line */}
                    <div className="absolute top-4 left-0 right-0 h-1 bg-muted">
                      <div 
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: `${(getStatusIndex(issue.status) / (WORKFLOW_STEPS.length - 1)) * 100}%` }}
                      />
                    </div>
                    
                    {WORKFLOW_STEPS.map((step, i) => {
                      const isComplete = i <= getStatusIndex(issue.status);
                      const isCurrent = i === getStatusIndex(issue.status);
                      
                      return (
                        <div key={step.status} className="flex flex-col items-center relative z-10">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            isComplete 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted text-muted-foreground'
                          } ${isCurrent ? 'ring-4 ring-primary/20' : ''}`}>
                            {isComplete ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : (
                              <span className="text-sm">{i + 1}</span>
                            )}
                          </div>
                          <p className={`text-xs mt-2 font-medium ${isComplete ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {step.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">{issue.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Reported On</p>
                      <p className="font-medium">{new Date(issue.created_at).toLocaleDateString('en-IN', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric' 
                      })}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Time Elapsed</p>
                      <p className="font-medium">{getDaysElapsed(issue.created_at)} days</p>
                    </div>
                  </div>
                  {issue.assigned_to && (
                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Assigned To</p>
                        <p className="font-medium">{issue.assigned_to}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-muted-foreground">{issue.description}</p>
                </div>

                {/* Resolution Notes */}
                {issue.resolution_notes && (
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Resolution Notes
                    </h4>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm">{issue.resolution_notes}</p>
                    </div>
                  </div>
                )}

                {/* Closure Status */}
                {issue.status === 'closed' && issue.closed_at && (
                  <div className="mt-6 p-4 bg-success/5 border border-success/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                      <span className="font-medium text-success">Issue Resolved</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Closed on {new Date(issue.closed_at).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-xl text-center py-12">
              <CardContent>
                <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Issue Not Found</h3>
                <p className="text-muted-foreground">
                  No issue found with tracking ID "{trackingId}". Please check and try again.
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  );
}
