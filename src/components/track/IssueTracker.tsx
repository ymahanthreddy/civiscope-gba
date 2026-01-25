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
  MessageSquare,
  AlertTriangle,
  Flame
} from 'lucide-react';

export function IssueTracker() {
  const [searchParams] = useSearchParams();
  const { getIssueByTrackingId, escalateIssue } = useIssues();
  const [trackingId, setTrackingId] = useState(searchParams.get('id') || '');
  const [issue, setIssue] = useState<Issue | null>(null);
  const [searched, setSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isEscalating, setIsEscalating] = useState(false);

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

  const handleEscalate = async () => {
    if (!issue) return;
    setIsEscalating(true);
    const success = await escalateIssue(issue.id);
    if (success) {
      // Refresh the issue
      const updated = await getIssueByTrackingId(issue.tracking_id);
      setIssue(updated);
    }
    setIsEscalating(false);
  };

  const getStatusIndex = (status: string) => {
    if (status === 'escalated') return -1; // Escalated is separate
    return WORKFLOW_STEPS.findIndex(s => s.status === status);
  };

  const getDaysElapsed = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const isPendingLong = (issue: Issue) => {
    return issue.status !== 'closed' && issue.status !== 'escalated' && getDaysElapsed(issue.created_at) > 3;
  };

  const categoryKey = issue?.category as keyof typeof CATEGORY_CONFIG;
  const statusKey = issue?.status as keyof typeof STATUS_CONFIG;
  const isEscalated = issue?.status === 'escalated';

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
            <Card className={`shadow-xl ${isEscalated ? 'border-2 border-destructive ring-2 ring-destructive/20' : isPendingLong(issue) ? 'border-2 border-amber-500/50' : ''}`}>
              <CardContent className="pt-6">
                {/* Escalated Status */}
                {isEscalated && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-destructive/30 rounded-xl p-5 mb-6"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center">
                        <Flame className="w-6 h-6 text-destructive animate-pulse" />
                      </div>
                      <div>
                        <p className="font-bold text-destructive text-lg">Issue Escalated</p>
                        <p className="text-sm text-destructive/80">
                          This issue has been escalated for urgent attention by authorities
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Pending Long Warning */}
                {isPendingLong(issue) && !isEscalated && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-6 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                      <div>
                        <p className="font-medium text-amber-700">Issue Pending for {getDaysElapsed(issue.created_at)} Days</p>
                        <p className="text-sm text-amber-600/80">
                          Consider escalating if you need urgent attention
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={handleEscalate}
                      disabled={isEscalating}
                      className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-lg"
                    >
                      {isEscalating ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Flame className="w-4 h-4 mr-2" />
                          Escalate
                        </>
                      )}
                    </Button>
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

                {/* Progress Workflow - Hide if escalated */}
                {!isEscalated && (
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
                )}

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

                {/* Escalate Button for non-escalated issues */}
                {!isEscalated && issue.status !== 'closed' && !isPendingLong(issue) && (
                  <div className="mt-6 pt-6 border-t border-border/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Not getting attention?</p>
                        <p className="text-sm font-medium">Escalate to mark as urgent</p>
                      </div>
                      <Button
                        onClick={handleEscalate}
                        disabled={isEscalating}
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        {isEscalating ? (
                          <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                        ) : (
                          <>
                            <Flame className="w-4 h-4 mr-2" />
                            Escalate Issue
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Closure Status */}
                {issue.status === 'closed' && issue.closed_at && (
                  <div className="mt-6 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span className="font-medium text-emerald-600">Issue Resolved</span>
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
