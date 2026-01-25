import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useMemo } from 'react';
import { MapPin, Navigation, Layers, ZoomIn, ZoomOut, Locate, TrendingUp, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CATEGORY_CONFIG } from '@/lib/constants';
import { BENGALURU_AREAS } from '@/lib/bengaluruAreas';
import { useIssues } from '@/contexts/IssueContext';
import { Link } from 'react-router-dom';

const severityColors = {
  high: 'bg-red-500',
  medium: 'bg-amber-500',
  low: 'bg-emerald-500',
};

const getSeverity = (count: number) => {
  if (count >= 20) return 'high';
  if (count >= 10) return 'medium';
  return 'low';
};

export function MapSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { issues } = useIssues();
  const [selectedHotspot, setSelectedHotspot] = useState<any>(null);
  const [zoom, setZoom] = useState(1);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.9, 1]);

  // Generate hotspots from real issues data
  const hotspots = useMemo(() => {
    const areaCounts: Record<string, { count: number; categories: Record<string, number> }> = {};
    
    issues.forEach(issue => {
      const area = issue.area || 'Unknown';
      if (!areaCounts[area]) {
        areaCounts[area] = { count: 0, categories: {} };
      }
      areaCounts[area].count++;
      areaCounts[area].categories[issue.category] = 
        (areaCounts[area].categories[issue.category] || 0) + 1;
    });

    return Object.entries(areaCounts).map(([areaName, data]) => {
      const areaInfo = BENGALURU_AREAS.find(a => a.name === areaName);
      const topCategory = Object.entries(data.categories)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'garbage';
      
      return {
        id: areaName,
        name: areaName,
        issues: data.count,
        category: topCategory,
        lat: areaInfo?.coords.lat || 12.9716,
        lng: areaInfo?.coords.lng || 77.5946,
        severity: getSeverity(data.count),
      };
    }).sort((a, b) => b.issues - a.issues);
  }, [issues]);

  // Total stats
  const totalIssues = issues.length;
  const resolvedIssues = issues.filter(i => i.status === 'closed').length;
  const activeAreas = hotspots.length;

  return (
    <section id="map" ref={containerRef} className="py-24 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
      <motion.div 
        className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-1/4 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <motion.div 
        style={{ opacity, scale }}
        className="container mx-auto relative z-10"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4"
          >
            <MapPin className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium">Live Issue Map</span>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </motion.div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Real-Time</span> Issue Hotspots
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Track civic issues across Greater Bengaluru Area with our interactive map
          </p>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 mt-6"
          >
            <Badge variant="outline" className="px-4 py-2 text-base">
              <TrendingUp className="w-4 h-4 mr-2 text-primary" />
              {totalIssues} Total Issues
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-base border-green-500/30 text-green-600">
              ✓ {resolvedIssues} Resolved
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-base border-amber-500/30 text-amber-600">
              <MapPin className="w-4 h-4 mr-2" />
              {activeAreas} Active Areas
            </Badge>
          </motion.div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map Container */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="glass-card p-4 relative overflow-hidden" style={{ height: '500px' }}>
              {/* Map Controls */}
              <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className="backdrop-blur-sm bg-background/80"
                  onClick={() => setZoom(z => Math.min(z + 0.2, 2))}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className="backdrop-blur-sm bg-background/80"
                  onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))}
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="secondary" className="backdrop-blur-sm bg-background/80">
                  <Locate className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="secondary" className="backdrop-blur-sm bg-background/80">
                  <Layers className="w-4 h-4" />
                </Button>
              </div>

              {/* Live indicator */}
              <div className="absolute top-4 left-4 z-20">
                <Badge className="bg-green-500/90 text-white animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-white mr-2 animate-ping" />
                  LIVE
                </Badge>
              </div>

              {/* Map Visual */}
              <motion.div 
                className="absolute inset-4 rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900"
                style={{ scale: zoom }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                {/* City Grid Pattern */}
                <div className="absolute inset-0" style={{
                  backgroundImage: `
                    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
                  `,
                  backgroundSize: '40px 40px'
                }} />
                
                {/* Main Roads - Animated */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                  <motion.path
                    d="M10 50 L90 50"
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="0.5"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 2 }}
                  />
                  <motion.path
                    d="M50 10 L50 90"
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="0.5"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 2, delay: 0.3 }}
                  />
                  {/* Ring road */}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="30"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="0.4"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 3, delay: 0.5 }}
                  />
                  <motion.path
                    d="M20 20 L80 80"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="0.3"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 2, delay: 0.5 }}
                  />
                  <motion.path
                    d="M80 20 L20 80"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="0.3"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 2, delay: 0.7 }}
                  />
                </svg>

                {/* Hotspot Markers */}
                {hotspots.slice(0, 12).map((hotspot, i) => {
                  const x = ((hotspot.lng - 77.5) / 0.35) * 80 + 10;
                  const y = ((13.1 - hotspot.lat) / 0.35) * 80 + 10;
                  
                  return (
                    <motion.div
                      key={hotspot.id}
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, type: 'spring' }}
                      className="absolute cursor-pointer group"
                      style={{ left: `${Math.min(Math.max(x, 5), 95)}%`, top: `${Math.min(Math.max(y, 5), 95)}%`, transform: 'translate(-50%, -50%)' }}
                      onClick={() => setSelectedHotspot(hotspot)}
                    >
                      {/* Pulse effect */}
                      <motion.div
                        className={`absolute inset-0 rounded-full ${severityColors[hotspot.severity as keyof typeof severityColors]}`}
                        animate={{ scale: [1, 2.5, 1], opacity: [0.6, 0, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                        style={{ width: 28, height: 28, marginLeft: -6, marginTop: -6 }}
                      />
                      
                      {/* Marker */}
                      <motion.div
                        whileHover={{ scale: 1.4 }}
                        className={`relative w-4 h-4 rounded-full ${severityColors[hotspot.severity as keyof typeof severityColors]} 
                          shadow-lg flex items-center justify-center z-10 ring-2 ring-white/30`}
                      >
                        <span className="text-white text-[8px] font-bold">{hotspot.issues}</span>
                      </motion.div>

                      {/* Tooltip */}
                      <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0.9 }}
                        whileHover={{ opacity: 1, y: 0, scale: 1 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 
                          bg-background/95 backdrop-blur-sm rounded-lg border border-border shadow-xl
                          whitespace-nowrap pointer-events-none z-30 min-w-[120px]"
                      >
                        <p className="font-semibold text-sm">{hotspot.name}</p>
                        <p className="text-xs text-muted-foreground">{hotspot.issues} active issues</p>
                        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rotate-45 
                          bg-background border-r border-b border-border`} />
                      </motion.div>
                    </motion.div>
                  );
                })}

                {/* City Label */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="absolute bottom-4 left-4 text-white/60"
                >
                  <p className="font-display text-lg font-bold">Greater Bengaluru</p>
                  <p className="text-xs flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Live Issue Tracking
                  </p>
                </motion.div>
              </motion.div>
            </Card>
          </motion.div>

          {/* Hotspot Details Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {/* Top Hotspots */}
            <Card className="glass-card p-4">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-primary" />
                Top Hotspots
                {hotspots.length > 0 && (
                  <Badge variant="destructive" className="ml-auto text-xs">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {hotspots[0]?.name}
                  </Badge>
                )}
              </h3>
              <div className="space-y-2 max-h-[280px] overflow-y-auto">
                {hotspots.length > 0 ? (
                  hotspots.slice(0, 6).map((hotspot, i) => {
                    const config = CATEGORY_CONFIG[hotspot.category as keyof typeof CATEGORY_CONFIG];
                    return (
                      <motion.div
                        key={hotspot.id}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ x: 5, backgroundColor: 'hsl(var(--muted) / 0.5)' }}
                        onClick={() => setSelectedHotspot(hotspot)}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors
                          ${selectedHotspot?.id === hotspot.id ? 'bg-primary/10 border border-primary/30' : 'border border-transparent'}`}
                      >
                        <div className={`w-8 h-8 rounded-full ${severityColors[hotspot.severity as keyof typeof severityColors]} 
                          flex items-center justify-center text-white text-xs font-bold`}>
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{hotspot.name}</p>
                          <p className="text-xs text-muted-foreground">{config?.label || 'Various'}</p>
                        </div>
                        <Badge variant="secondary">
                          {hotspot.issues}
                        </Badge>
                      </motion.div>
                    );
                  })
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No active issues reported yet
                  </p>
                )}
              </div>
            </Card>

            {/* Legend */}
            <Card className="glass-card p-4">
              <h3 className="font-bold mb-3">Severity Legend</h3>
              <div className="space-y-2">
                {[
                  { level: 'Critical', color: 'bg-red-500', desc: '20+ issues' },
                  { level: 'Moderate', color: 'bg-amber-500', desc: '10-20 issues' },
                  { level: 'Low', color: 'bg-emerald-500', desc: '<10 issues' },
                ].map((item, i) => (
                  <motion.div 
                    key={item.level} 
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <motion.div 
                      className={`w-4 h-4 rounded-full ${item.color}`}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    />
                    <span className="text-sm font-medium">{item.level}</span>
                    <span className="text-xs text-muted-foreground">({item.desc})</span>
                  </motion.div>
                ))}
              </div>
            </Card>

            <Link to="/report">
              <Button className="w-full primary-gradient group relative overflow-hidden">
                <motion.span
                  className="absolute inset-0 bg-white/20"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
                <span className="relative flex items-center">
                  Report Issue in Your Area
                  <MapPin className="w-4 h-4 ml-2 group-hover:animate-bounce" />
                </span>
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
