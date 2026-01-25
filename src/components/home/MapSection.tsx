import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useMemo } from 'react';
import { MapPin, Navigation, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CATEGORY_CONFIG } from '@/lib/constants';
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

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.9, 1]);

  // Generate hotspots
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

    return Object.entries(areaCounts)
      .map(([areaName, data]) => {
        const topCategory =
          Object.entries(data.categories).sort(([, a], [, b]) => b - a)[0]?.[0] || 'garbage';

        return {
          id: areaName,
          name: areaName,
          issues: data.count,
          category: topCategory,
          severity: getSeverity(data.count),
        };
      })
      .sort((a, b) => b.issues - a.issues);
  }, [issues]);

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

      <motion.div style={{ opacity, scale }} className="container mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <MapPin className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium">Live Issue Map</span>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </div>

          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Real-Time</span> Issue Hotspots
          </h2>

          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Track civic issues across Greater Bengaluru Area with our interactive map
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
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
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* MAP */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="glass-card rounded-3xl overflow-hidden h-[500px] w-full border border-primary/10 shadow-lg">
              <iframe
                title="GBA Civic Map"
                className="w-full h-full"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps/d/edit?mid=1wbZmIzbQ5rkwZfzs2cOl3CpguMbn2SU&usp=sharing"
              />
            </div>
          </motion.div>

          {/* Sidebar */}
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
                {hotspots.length > 0 && (
                  <Badge variant="destructive" className="ml-auto text-xs">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {hotspots[0].name}
                  </Badge>
                )}
              </h3>

              <div className="space-y-2 max-h-[280px] overflow-y-auto">
                {hotspots.slice(0, 6).map((hotspot, i) => {
                  const config = CATEGORY_CONFIG[hotspot.category as keyof typeof CATEGORY_CONFIG];
                  return (
                    <div
                      key={hotspot.id}
                      className="flex items-center gap-3 p-3 rounded-lg border hover:border-primary/20"
                    >
                      <div
                        className={`w-8 h-8 rounded-full ${severityColors[hotspot.severity]} flex items-center justify-center text-white text-xs font-bold`}
                      >
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{hotspot.name}</p>
                        <p className="text-xs text-muted-foreground">{config?.label}</p>
                      </div>
                      <Badge variant="secondary">{hotspot.issues}</Badge>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Link to="/report">
              <Button className="w-full primary-gradient">
                Report Issue in Your Area
                <MapPin className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
