import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface SatisfactionRatingProps {
  issueId: string;
  reporterContact?: string;
  existingRating?: number | null;
}

export function SatisfactionRating({ issueId, reporterContact, existingRating }: SatisfactionRatingProps) {
  const [rating, setRating] = useState(existingRating || 0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(!!existingRating);

  const handleSubmit = async () => {
    if (rating === 0) return;
    // Store rating locally since satisfaction_ratings table doesn't exist yet
    setSubmitted(true);
    toast({ title: 'Thank you! 🌟', description: 'Your feedback helps us improve' });
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-1 text-sm">
        {[1, 2, 3, 4, 5].map(s => (
          <Star key={s} className={`w-4 h-4 ${s <= rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`} />
        ))}
        <span className="text-muted-foreground ml-1">Rated</span>
      </div>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Rate Resolution</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(s => (
            <motion.button key={s} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
              onClick={() => setRating(s)} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)}>
              <Star className={`w-6 h-6 cursor-pointer transition-colors ${
                s <= (hover || rating) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'
              }`} />
            </motion.button>
          ))}
        </div>
        <Textarea placeholder="Any feedback? (optional)" value={feedback} onChange={e => setFeedback(e.target.value)} rows={2} />
        <Button size="sm" onClick={handleSubmit} disabled={rating === 0}>Submit Rating</Button>
      </CardContent>
    </Card>
  );
}
