import { useState, useEffect, useMemo } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useIssues, IssueCategory } from '@/contexts/IssueContext';
import { useCity } from '@/contexts/CityContext';
import { CATEGORY_CONFIG } from '@/lib/constants';
import { toast } from '@/hooks/use-toast';
import { Send, MapPin, User, Mail, CheckCircle2, Navigation, Sparkles, LocateFixed, Globe, Zap, Brain, Shield, Clock, TrendingUp } from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import { SpeechToText } from './SpeechToText';

// AI-powered category suggestion based on keywords
const CATEGORY_KEYWORDS: Record<IssueCategory, string[]> = {
  garbage: ['garbage', 'trash', 'waste', 'dump', 'litter', 'dustbin', 'rubbish', 'dirty', 'smell', 'stink', 'overflowing', 'debris', 'kachra', 'kuda'],
  roads: ['road', 'pothole', 'crack', 'broken road', 'pavement', 'footpath', 'sidewalk', 'asphalt', 'tar', 'construction', 'speed bump', 'divider'],
  drainage: ['drain', 'water', 'flood', 'sewage', 'clog', 'overflow', 'manhole', 'gutter', 'waterlog', 'pipeline', 'leak', 'nala', 'naala'],
  streetlights: ['light', 'lamp', 'dark', 'bulb', 'pole', 'electric', 'power', 'wire', 'voltage', 'street light', 'streetlight', 'not working'],
  parks: ['park', 'garden', 'tree', 'bench', 'playground', 'grass', 'swing', 'fence', 'green', 'plant', 'maintenance'],
  stray_dogs: ['dog', 'stray', 'bite', 'bark', 'animal', 'aggressive', 'rabies', 'puppy', 'pack', 'menace'],
};

function suggestCategory(text: string): { category: IssueCategory; confidence: number } | null {
  if (!text || text.length < 5) return null;
  const lower = text.toLowerCase();
  let bestCategory: IssueCategory | null = null;
  let bestScore = 0;

  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS) as [IssueCategory, string[]][]) {
    let score = 0;
    for (const kw of keywords) {
      if (lower.includes(kw)) score += kw.length; // longer keyword matches = higher confidence
    }
    if (score > bestScore) {
      bestScore = score;
      bestCategory = cat;
    }
  }

  if (!bestCategory || bestScore < 3) return null;
  const confidence = Math.min(95, 40 + bestScore * 5);
  return { category: bestCategory, confidence };
}

function LocationPulse() {
  return (
    <span className="relative flex h-3 w-3">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
      <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
    </span>
  );
}

export function ReportForm() {
  const navigate = useNavigate();
  const { addIssue } = useIssues();
  const { cities, selectedCity, setSelectedCity, cityAreas, detectedArea, detectedAreaDistance, setDetectedArea, locationDetected, locationError, detectLocation, userCoords, accuracy, reverseAddress } = useCity();
  const [autoFilledLocation, setAutoFilledLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [aiSuggestionApplied, setAiSuggestionApplied] = useState(false);

  const [formData, setFormData] = useState({
    category: '' as IssueCategory | '',
    description: '',
    area: '',
    exactLocation: '',
    reporterName: '',
    reporterContact: '',
    imageUrl: '',
  });

  // Auto-fill area when detected
  useEffect(() => {
    if (detectedArea && !formData.area) {
      setFormData(prev => ({ ...prev, area: detectedArea.name }));
    }
  }, [detectedArea, formData.area]);

  // Auto-fill exact location once with reverse-geocoded street/landmark
  useEffect(() => {
    if (reverseAddress && !formData.exactLocation && !autoFilledLocation) {
      setFormData(prev => ({ ...prev, exactLocation: reverseAddress }));
      setAutoFilledLocation(true);
    }
  }, [reverseAddress, formData.exactLocation, autoFilledLocation]);

  // AI category suggestion
  const aiSuggestion = useMemo(() => suggestCategory(formData.description), [formData.description]);

  const applyAiSuggestion = () => {
    if (aiSuggestion) {
      setFormData(prev => ({ ...prev, category: aiSuggestion.category }));
      setAiSuggestionApplied(true);
      toast({ title: '🧠 AI Applied!', description: `Category set to ${CATEGORY_CONFIG[aiSuggestion.category].label}` });
    }
  };

  // Completion progress
  const completionProgress = useMemo(() => {
    let filled = 0;
    const total = 6;
    if (selectedCity) filled++;
    if (formData.category) filled++;
    if (formData.description.length > 10) filled++;
    if (formData.area) filled++;
    if (formData.reporterName) filled++;
    if (formData.reporterContact) filled++;
    return Math.round((filled / total) * 100);
  }, [selectedCity, formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCity || !formData.category || !formData.description || !formData.area || !formData.exactLocation || !formData.reporterName || !formData.reporterContact) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields including city.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    const fullLocation = `${formData.exactLocation}, ${formData.area}, ${selectedCity.name}`;

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
                setAiSuggestionApplied(false);
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
      <Card className="shadow-xl overflow-hidden">
        {/* Smart Progress Bar */}
        <div className="relative">
          <Progress value={completionProgress} className="h-1.5 rounded-none" />
          <AnimatePresence>
            {completionProgress === 100 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute right-3 -bottom-6 text-xs text-primary font-medium flex items-center gap-1"
              >
                <Zap className="w-3 h-3" /> Ready to submit!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Badge variant="outline" className="text-xs border-primary/30 text-primary gap-1">
              <Shield className="w-3 h-3" /> AI-Powered
            </Badge>
            <Badge variant="outline" className="text-xs border-primary/30 text-primary gap-1">
              <Clock className="w-3 h-3" /> ~2 min
            </Badge>
          </div>
          <CardTitle className="font-display text-2xl">Report a Civic Issue</CardTitle>
          <CardDescription>
            Help us make your community better. AI assists you every step.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* City + Area Detection */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                Your Location *
                {userCoords && <LocationPulse />}
              </Label>
              {selectedCity ? (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <LocateFixed className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <span className="font-medium">{selectedCity.name}</span>
                      <span className="text-muted-foreground text-sm ml-2">({selectedCity.state})</span>
                      {detectedArea && (
                        <span className="text-primary text-sm ml-1">• {detectedArea.name}</span>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                      Auto-detected
                    </Badge>
                    <Button type="button" variant="ghost" size="sm" onClick={() => { setSelectedCity(null); setDetectedArea(null); setFormData(prev => ({ ...prev, area: '', exactLocation: '' })); setAutoFilledLocation(false); }}>
                      Change
                    </Button>
                  </div>
                  {userCoords && (
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground px-1">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{userCoords.lat.toFixed(4)}°N, {userCoords.lng.toFixed(4)}°E</span>
                      {accuracy && <><span className="text-primary/50">•</span><span>±{Math.round(accuracy)}m accuracy</span></>}
                      {detectedAreaDistance !== null && detectedArea && (
                        <><span className="text-primary/50">•</span><span>{detectedAreaDistance.toFixed(1)}km from {detectedArea.name} center</span></>
                      )}
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="space-y-2">
                  {locationError && (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-sm text-amber-700 dark:text-amber-400">
                      <Globe className="w-4 h-4 flex-shrink-0" />
                      <span>{locationError}</span>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Select
                      value={selectedCity?.id || ''}
                      onValueChange={(id) => {
                        const city = cities.find(c => c.id === id);
                        if (city) setSelectedCity(city);
                      }}
                    >
                      <SelectTrigger className="bg-background flex-1">
                        <SelectValue placeholder="Select your city" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        {cities.map((city) => (
                          <SelectItem key={city.id} value={city.id}>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-primary" />
                              <span>{city.name}</span>
                              <span className="text-muted-foreground text-xs">({city.state})</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button type="button" variant="outline" size="icon" onClick={detectLocation} title="Detect my location">
                      <LocateFixed className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Description with AI Suggestion */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="description">Description *</Label>
                <SpeechToText onTranscript={(text) => setFormData(prev => ({ ...prev, description: prev.description ? prev.description + ' ' + text : text }))} />
              </div>
              <Textarea
                id="description"
                placeholder="Describe the issue in detail — our AI will suggest a category..."
                value={formData.description}
                onChange={(e) => { setFormData(prev => ({ ...prev, description: e.target.value })); setAiSuggestionApplied(false); }}
                rows={4}
                className="resize-none"
              />
              {/* AI Category Suggestion Card */}
              <AnimatePresence>
                {aiSuggestion && !aiSuggestionApplied && !formData.category && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-violet-500/20">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                        <Brain className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">
                          AI suggests: <span className="text-primary">{CATEGORY_CONFIG[aiSuggestion.category].icon} {CATEGORY_CONFIG[aiSuggestion.category].label}</span>
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress value={aiSuggestion.confidence} className="h-1.5 flex-1" />
                          <span className="text-xs text-muted-foreground">{aiSuggestion.confidence}% match</span>
                        </div>
                      </div>
                      <Button type="button" size="sm" variant="secondary" onClick={applyAiSuggestion} className="flex-shrink-0">
                        <Sparkles className="w-3 h-3 mr-1" /> Apply
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Category Selection */}
            <div className="space-y-2">
              <Label htmlFor="category">Issue Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => { setFormData(prev => ({ ...prev, category: value as IssueCategory })); setAiSuggestionApplied(true); }}
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
                        {aiSuggestion?.category === key && (
                          <Badge className="text-[10px] px-1.5 py-0 ml-1 bg-violet-500/20 text-violet-600 border-violet-500/30">AI pick</Badge>
                        )}
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

            {/* Area Selection - with auto-detect */}
            <AnimatePresence>
              {selectedCity && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <Label htmlFor="area">Area in {selectedCity.name} *</Label>
                    {detectedArea && formData.area === detectedArea.name && (
                      <Badge variant="outline" className="text-[10px] border-primary/30 text-primary gap-1">
                        <LocateFixed className="w-2.5 h-2.5" /> GPS matched
                      </Badge>
                    )}
                  </div>
                  <Select
                    value={formData.area}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, area: value }))}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select your area" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover max-h-[300px]">
                      {cityAreas.map((area) => (
                        <SelectItem key={area.id} value={area.name}>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span>{area.name}</span>
                            {detectedArea?.id === area.id && (
                              <Badge className="text-[10px] px-1.5 py-0 bg-primary/20 text-primary border-primary/30">nearest</Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                      {cityAreas.length === 0 && (
                        <div className="px-3 py-2 text-sm text-muted-foreground">Loading areas...</div>
                      )}
                    </SelectContent>
                  </Select>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Exact Location */}
            <AnimatePresence>
              {formData.area && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <Label htmlFor="exactLocation">Exact Location / Landmark *</Label>
                    <SpeechToText onTranscript={(text) => setFormData(prev => ({ ...prev, exactLocation: prev.exactLocation ? prev.exactLocation + ' ' + text : text }))} />
                  </div>
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
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    {autoFilledLocation && formData.exactLocation === reverseAddress ? (
                      <><Sparkles className="w-3 h-3 text-primary" /> Auto-filled from GPS — feel free to edit</>
                    ) : (
                      <>E.g., Near XYZ School, Opposite ABC Hospital, etc.</>
                    )}
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

            {/* Smart Summary before submit */}
            <AnimatePresence>
              {completionProgress >= 80 && formData.description && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-3 rounded-lg bg-muted/50 border border-border/50 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <TrendingUp className="w-3 h-3" /> Quick Summary
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">{formData.category ? CATEGORY_CONFIG[formData.category as IssueCategory]?.icon : '📋'}</span>
                      {' '}{formData.category ? CATEGORY_CONFIG[formData.category as IssueCategory]?.label : 'Issue'} in{' '}
                      <span className="font-medium">{formData.area || '...'}, {selectedCity?.name || '...'}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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
