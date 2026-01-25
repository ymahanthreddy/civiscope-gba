import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useIssues, IssueCategory } from '@/contexts/IssueContext';
import { CATEGORY_CONFIG } from '@/lib/constants';
import { toast } from '@/hooks/use-toast';
import { Send, MapPin, User, Mail, ImagePlus, CheckCircle2 } from 'lucide-react';

export function ReportForm() {
  const navigate = useNavigate();
  const { addIssue } = useIssues();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState('');

  const [formData, setFormData] = useState({
    category: '' as IssueCategory | '',
    description: '',
    location: '',
    reporterName: '',
    reporterContact: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category || !formData.description || !formData.location || !formData.reporterName || !formData.reporterContact) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    const id = await addIssue({
      category: formData.category as IssueCategory,
      description: formData.description,
      location: formData.location,
      reporterName: formData.reporterName,
      reporterContact: formData.reporterContact,
    });

    if (id) {
      setTrackingId(id);
      setSubmitted(true);
    }
    
    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="shadow-xl border-2 border-success/20">
          <CardContent className="pt-12 pb-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 className="w-10 h-10 text-success" />
            </motion.div>
            
            <h2 className="font-display text-3xl font-bold text-foreground mb-2">
              Issue Reported Successfully!
            </h2>
            <p className="text-muted-foreground mb-6">
              Thank you for helping us improve your community
            </p>

            <div className="bg-muted rounded-xl p-6 mb-6">
              <p className="text-sm text-muted-foreground mb-2">Your Tracking ID</p>
              <p className="font-mono text-2xl font-bold text-primary">{trackingId}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Save this ID to track your issue status
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => navigate(`/track?id=${trackingId}`)} className="primary-gradient">
                Track Your Issue
              </Button>
              <Button variant="outline" onClick={() => {
                setSubmitted(false);
                setFormData({
                  category: '',
                  description: '',
                  location: '',
                  reporterName: '',
                  reporterContact: '',
                });
              }}>
                Report Another Issue
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="shadow-xl">
        <CardHeader className="text-center pb-2">
          <CardTitle className="font-display text-2xl">Report a Civic Issue</CardTitle>
          <CardDescription>
            Help us make your community better. No login required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Selection */}
            <div className="space-y-2">
              <Label htmlFor="category">Issue Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as IssueCategory }))}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select issue type" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {(Object.entries(CATEGORY_CONFIG) as [IssueCategory, typeof CATEGORY_CONFIG[IssueCategory]][]).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <span>{config.icon}</span>
                        <span>{config.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.category && (
                <p className="text-sm text-muted-foreground">
                  {CATEGORY_CONFIG[formData.category as IssueCategory].description}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the issue in detail..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="resize-none"
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="Enter the location or landmark"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Image Upload (Placeholder) */}
            <div className="space-y-2">
              <Label>Attach Photo (Optional)</Label>
              <div className="border-2 border-dashed rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <ImagePlus className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG up to 5MB
                </p>
              </div>
            </div>

            {/* Reporter Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={formData.reporterName}
                    onChange={(e) => setFormData(prev => ({ ...prev, reporterName: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Email or Phone *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="contact"
                    placeholder="For status updates"
                    value={formData.reporterContact}
                    onChange={(e) => setFormData(prev => ({ ...prev, reporterContact: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full primary-gradient text-lg py-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Submit Report
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
