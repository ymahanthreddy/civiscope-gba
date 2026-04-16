import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { BENGALURU_AREAS } from '@/lib/bengaluruAreas';
import { toast } from '@/hooks/use-toast';
import { Send, MapPin, User, Mail, CheckCircle2, Navigation, Sparkles } from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import { SpeechToText } from './SpeechToText';

export function ReportForm() {
  const navigate = useNavigate();
  const { addIssue } = useIssues();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState('');

  const [formData, setFormData] = useState({
    category: '' as IssueCategory | '',
    description: '',
    area: '',
    exactLocation: '',
    reporterName: '',
    reporterContact: '',
    imageUrl: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category || !formData.description || !formData.area || !formData.exactLocation || !formData.reporterName || !formData.reporterContact) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    // Combine area and exact location
    const fullLocation = `${formData.exactLocation}, ${formData.area}`;

    const id = await addIssue({
      category: formData.category as IssueCategory,
      description: formData.description,
      location: fullLocation,
      area: formData.area,
      reporterName: formData.reporterName,
      reporterContact: formData.reporterContact,
      imageUrl: formData.imageUrl || undefined,
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
            <p className="text-muted-foreground mb-2">
              Thank you for helping us improve your community
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 mb-4">
              <Sparkles className="w-4 h-4 text-violet-500" />
              <span className="text-sm font-medium text-violet-600 dark:text-violet-400">Agentic AI is auto-assigning your issue</span>
            </div>

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
                  area: '',
                  exactLocation: '',
                  reporterName: '',
                  reporterContact: '',
                  imageUrl: '',
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
              <div className="flex items-center justify-between">
                <Label htmlFor="description">Description *</Label>
                <SpeechToText onTranscript={(text) => setFormData(prev => ({ ...prev, description: prev.description ? prev.description + ' ' + text : text }))} />
              </div>
              <Textarea
                id="description"
                placeholder="Describe the issue in detail or use the mic to speak..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="resize-none"
              />
            </div>

            {/* Area Selection */}
            <div className="space-y-2">
              <Label htmlFor="area">Area in Bengaluru *</Label>
              <Select
                value={formData.area}
                onValueChange={(value) => setFormData(prev => ({ ...prev, area: value }))}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select your area" />
                </SelectTrigger>
                <SelectContent className="bg-popover max-h-[300px]">
                  {BENGALURU_AREAS.map((area) => (
                    <SelectItem key={area.name} value={area.name}>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{area.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Exact Location - appears after area selection */}
            <AnimatePresence>
              {formData.area && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <Label htmlFor="exactLocation">Exact Location / Landmark *</Label>
                  <div className="relative">
                    <Navigation className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="exactLocation"
                      placeholder={`Enter specific location in ${formData.area}`}
                      value={formData.exactLocation}
                      onChange={(e) => setFormData(prev => ({ ...prev, exactLocation: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    E.g., Near XYZ School, Opposite ABC Hospital, etc.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Attach Photo (Optional)</Label>
              <ImageUpload 
                onImageUploaded={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                currentImage={formData.imageUrl}
              />
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
