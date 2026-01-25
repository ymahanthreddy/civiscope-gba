import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MapPin, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useIssues, Issue } from '@/contexts/IssueContext';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const categoryColors: Record<string, string> = {
  garbage: 'bg-amber-500',
  roads: 'bg-gray-500',
  drainage: 'bg-blue-500',
  streetlights: 'bg-yellow-500',
  parks: 'bg-green-500',
  stray_dogs: 'bg-orange-500',
};

export function LiveIssuesSection() {
  const { issues, refetch } = useIssues();
  const { user } = useAuth();
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  const recentIssues = issues
    .filter(i => i.status !== 'closed')
    .slice(0, 6);

  const handleLike = async (issueId: string) => {
    // Instant optimistic update
    setLikedIds(prev => new Set(prev).add(issueId));
    toast({ title: '❤️ Thanks for your support!' });

    // Background save - don't wait
    supabase.from('issue_likes').insert({
      issue_id: issueId,
      user_id: user?.id || null,
      user_name: user?.email?.split('@')[0] || 'Anonymous'
    }).then(({ error }) => {
      if (error?.code === '23505') {
        toast({ title: 'Already supported', variant: 'destructive' });
        setLikedIds(prev => { const n = new Set(prev); n.delete(issueId); return n; });
      }
    });

    supabase.from('issues').update({ 
      likes_count: (issues.find(i => i.id === issueId)?.likes_count || 0) + 1 
    }).eq('id', issueId);
    
    setTimeout(() => refetch(), 500);
  };

  if (recentIssues.length === 0) return null;

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold mb-2">Live Community Issues</h2>
          <p className="text-muted-foreground">Support issues that matter to you</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentIssues.map((issue, idx) => {
            const isLiked = likedIds.has(issue.id);
            const displayCount = (issue.likes_count || 0) + (isLiked ? 1 : 0);
            
            return (
              <motion.div
                key={issue.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <Badge className={`${categoryColors[issue.category]} text-white`}>
                        {issue.category.replace('_', ' ')}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {issue.tracking_id}
                      </span>
                    </div>
                    
                    <p className="text-sm mb-3 line-clamp-2">{issue.description}</p>
                    
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{issue.area || issue.location}</span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                    </div>

                    <Button
                      variant={isLiked ? "default" : "outline"}
                      size="sm"
                      className="w-full gap-2"
                      onClick={() => !isLiked && handleLike(issue.id)}
                      disabled={isLiked}
                    >
                      <Heart className={`w-4 h-4 ${isLiked || displayCount > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                      <span>{isLiked ? 'Supported!' : `Support (${displayCount})`}</span>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
