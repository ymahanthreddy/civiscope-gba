import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { MapPin, Navigation, Layers, ZoomIn, ZoomOut, Locate } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CATEGORY_CONFIG } from '@/lib/constants';
import { Link } from 'react-router-dom';

// Mock hotspot data for Greater Bengaluru Area
const hotspots = [
  { id: 1, name: 'Koramangala', issues: 24, category: 'garbage', lat: 12.9352, lng: 77.6245, severity: 'high' },
  { id: 2, name: 'Indiranagar', issues: 18, category: 'roads', lat: 12.9716, lng: 77.6412, severity: 'medium' },
  { id: 3, name: 'Whitefield', issues: 32, category: 'drainage', lat: 12.9698, lng: 77.7500, severity: 'high' },
  { id: 4, name: 'Electronic City', issues: 15, category: 'streetlights', lat: 12.8399, lng: 77.6770, severity: 'low' },
  { id: 5, name: 'Jayanagar', issues: 21, category: 'parks', lat: 12.9250, lng: 77.5938, severity: 'medium' },
  { id: 6, name: 'Malleshwaram', issues: 12, category: 'stray_dogs', lat: 13.0067, lng: 77.5713, severity: 'low' },
  { id: 7, name: 'HSR Layout', issues: 28, category: 'garbage', lat: 12.9121, lng: 77.6446, severity: 'high' },
  { id: 8, name: 'BTM Layout', issues: 19, category: 'roads', lat: 12.9166, lng: 77.6101, severity: 'medium' },
];

const severityColors = {
  high: 'bg-red-500',
  medium: 'bg-amber-500',
  low: 'bg-emerald-500',
};

export function MapSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedHotspot, setSelectedHotspot] = useState<typeof hotspots[0] | null>(null);
  const [zoom, setZoom] = useState(1);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.9, 1]);

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
          </motion.div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Real-Time</span> Issue Hotspots
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            View civic issues across Greater Bengaluru Area with our interactive map
          </p>
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
                  className="backdrop-blur-sm"
                  onClick={() => setZoom(z => Math.min(z + 0.2, 2))}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className="backdrop-blur-sm"
                  onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))}
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="secondary" className="backdrop-blur-sm">
                  <Locate className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="secondary" className="backdrop-blur-sm">
                  <Layers className="w-4 h-4" />
                </Button>
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
                
                {/* Main Roads */}
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
                {hotspots.map((hotspot, i) => {
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
                      style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                      onClick={() => setSelectedHotspot(hotspot)}
                    >
                      {/* Pulse effect */}
                      <motion.div
                        className={`absolute inset-0 rounded-full ${severityColors[hotspot.severity]}`}
                        animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                        style={{ width: 24, height: 24, marginLeft: -4, marginTop: -4 }}
                      />
                      
                      {/* Marker */}
                      <motion.div
                        whileHover={{ scale: 1.3 }}
                        className={`relative w-4 h-4 rounded-full ${severityColors[hotspot.severity]} 
                          shadow-lg shadow-${hotspot.severity === 'high' ? 'red' : hotspot.severity === 'medium' ? 'amber' : 'emerald'}-500/50
                          flex items-center justify-center z-10`}
                      >
                        <span className="text-white text-[8px] font-bold">{hotspot.issues}</span>
                      </motion.div>

                      {/* Tooltip */}
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        whileHover={{ opacity: 1, y: 0 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 
                          bg-background/95 backdrop-blur-sm rounded-lg border border-border shadow-xl
                          whitespace-nowrap pointer-events-none z-20"
                      >
                        <p className="font-semibold text-sm">{hotspot.name}</p>
                        <p className="text-xs text-muted-foreground">{hotspot.issues} issues</p>
                      </motion.div>
                    </motion.div>
                  );
                })}

                {/* City Label */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="absolute bottom-4 left-4 text-white/40"
                >
                  <p className="font-display text-lg font-bold">Greater Bengaluru</p>
                  <p className="text-xs">Interactive Issue Map</p>
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
            <Card className="glass-card p-4">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-primary" />
                Top Hotspots
              </h3>
              <div className="space-y-2">
                {hotspots
                  .sort((a, b) => b.issues - a.issues)
                  .slice(0, 5)
                  .map((hotspot, i) => {
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
                        <span className="text-xl">{config?.icon || '📍'}</span>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{hotspot.name}</p>
                          <p className="text-xs text-muted-foreground">{config?.label}</p>
                        </div>
                        <Badge variant="secondary" className={`${severityColors[hotspot.severity]} text-white`}>
                          {hotspot.issues}
                        </Badge>
                      </motion.div>
                    );
                  })}
              </div>
            </Card>

            {/* Legend */}
            <Card className="glass-card p-4">
              <h3 className="font-bold mb-3">Severity Legend</h3>
              <div className="space-y-2">
                {[
                  { level: 'High', color: 'bg-red-500', desc: '20+ issues' },
                  { level: 'Medium', color: 'bg-amber-500', desc: '10-20 issues' },
                  { level: 'Low', color: 'bg-emerald-500', desc: '<10 issues' },
                ].map((item) => (
                  <div key={item.level} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-sm font-medium">{item.level}</span>
                    <span className="text-xs text-muted-foreground">({item.desc})</span>
                  </div>
                ))}
              </div>
            </Card>

            <Link to="/report">
              <Button className="w-full primary-gradient group">
                Report Issue in Your Area
                <MapPin className="w-4 h-4 ml-2 group-hover:animate-bounce" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
