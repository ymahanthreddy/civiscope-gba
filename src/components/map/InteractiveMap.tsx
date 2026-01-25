import { useState, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ZoomIn, ZoomOut, Locate, Maximize2, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BENGALURU_AREAS } from '@/lib/bengaluruAreas';
import { useIssues } from '@/contexts/IssueContext';
import { CATEGORY_CONFIG } from '@/lib/constants';

interface Hotspot {
  id: string;
  name: string;
  issues: number;
  category: string;
  lat: number;
  lng: number;
  severity: 'high' | 'medium' | 'low';
}

interface InteractiveMapProps {
  onSelectArea?: (area: string) => void;
  selectedArea?: string;
  height?: string;
  showControls?: boolean;
}

const severityColors = {
  high: 'bg-red-500',
  medium: 'bg-amber-500',
  low: 'bg-emerald-500',
};

const getSeverity = (count: number): 'high' | 'medium' | 'low' => {
  if (count >= 20) return 'high';
  if (count >= 10) return 'medium';
  return 'low';
};

export function InteractiveMap({ 
  onSelectArea, 
  selectedArea, 
  height = '500px',
  showControls = true 
}: InteractiveMapProps) {
  const { issues } = useIssues();
  const mapRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const dragStart = useRef({ x: 0, y: 0 });

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

  // All available areas for the map
  const allAreas = useMemo(() => {
    return BENGALURU_AREAS.map(area => {
      const hotspot = hotspots.find(h => h.id === area.name);
      return {
        ...area,
        issues: hotspot?.issues || 0,
        category: hotspot?.category || 'none',
        severity: hotspot?.severity || 'low',
      };
    });
  }, [hotspots]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  }, [position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.current.x;
    const newY = e.clientY - dragStart.current.y;
    
    // Limit panning based on zoom
    const maxPan = 200 * zoom;
    setPosition({
      x: Math.max(-maxPan, Math.min(maxPan, newX)),
      y: Math.max(-maxPan, Math.min(maxPan, newY)),
    });
  }, [isDragging, zoom]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleZoomIn = () => setZoom(z => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.25, 0.5));
  const handleReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleAreaClick = (area: typeof allAreas[0]) => {
    setSelectedHotspot({
      id: area.name,
      name: area.name,
      issues: area.issues,
      category: area.category,
      lat: area.coords.lat,
      lng: area.coords.lng,
      severity: area.severity as 'high' | 'medium' | 'low',
    });
    onSelectArea?.(area.name);
  };

  return (
    <div 
      ref={mapRef}
      className="relative w-full rounded-xl overflow-hidden border border-border bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      style={{ height }}
    >
      {/* Map Controls */}
      {showControls && (
        <div className="absolute top-4 right-4 z-30 flex flex-col gap-2">
          <Button 
            size="icon" 
            variant="secondary" 
            className="backdrop-blur-sm bg-background/80 shadow-lg"
            onClick={handleZoomIn}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button 
            size="icon" 
            variant="secondary" 
            className="backdrop-blur-sm bg-background/80 shadow-lg"
            onClick={handleZoomOut}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button 
            size="icon" 
            variant="secondary" 
            className="backdrop-blur-sm bg-background/80 shadow-lg"
            onClick={handleReset}
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
          <Button 
            size="icon" 
            variant="secondary" 
            className="backdrop-blur-sm bg-background/80 shadow-lg"
          >
            <Locate className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Live indicator */}
      <div className="absolute top-4 left-4 z-30">
        <Badge className="bg-green-500/90 text-white shadow-lg">
          <span className="w-2 h-2 rounded-full bg-white mr-2 animate-ping" />
          LIVE
        </Badge>
      </div>

      {/* Zoom indicator */}
      <div className="absolute bottom-4 right-4 z-30">
        <Badge variant="secondary" className="backdrop-blur-sm">
          {Math.round(zoom * 100)}%
        </Badge>
      </div>

      {/* Draggable Map Container */}
      <div
        className={`absolute inset-0 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            x: position.x,
            y: position.y,
            scale: zoom,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Grid Pattern */}
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
              `,
              backgroundSize: '30px 30px'
            }} 
          />

          {/* Road Network SVG */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Main highways */}
            <motion.path
              d="M5 50 L95 50"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="0.6"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5 }}
            />
            <motion.path
              d="M50 5 L50 95"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="0.6"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.2 }}
            />
            
            {/* Outer ring road */}
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="0.4"
              fill="none"
              strokeDasharray="3 2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.4 }}
            />
            
            {/* Inner ring road */}
            <motion.circle
              cx="50"
              cy="50"
              r="25"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="0.5"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.8, delay: 0.6 }}
            />

            {/* Diagonal roads */}
            <motion.path
              d="M15 15 L85 85"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="0.3"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.8 }}
            />
            <motion.path
              d="M85 15 L15 85"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="0.3"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 1 }}
            />

            {/* Secondary roads */}
            <path d="M25 20 L25 80" stroke="rgba(255,255,255,0.06)" strokeWidth="0.2" fill="none" />
            <path d="M75 20 L75 80" stroke="rgba(255,255,255,0.06)" strokeWidth="0.2" fill="none" />
            <path d="M20 25 L80 25" stroke="rgba(255,255,255,0.06)" strokeWidth="0.2" fill="none" />
            <path d="M20 75 L80 75" stroke="rgba(255,255,255,0.06)" strokeWidth="0.2" fill="none" />
          </svg>

          {/* Area markers */}
          {allAreas.map((area, i) => {
            const x = ((area.coords.lng - 77.45) / 0.45) * 80 + 10;
            const y = ((13.15 - area.coords.lat) / 0.4) * 80 + 10;
            const isSelected = selectedArea === area.name || selectedHotspot?.id === area.name;
            const hasIssues = area.issues > 0;

            return (
              <motion.div
                key={area.name}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.02, type: 'spring' }}
                className="absolute cursor-pointer group"
                style={{ 
                  left: `${Math.min(Math.max(x, 5), 95)}%`, 
                  top: `${Math.min(Math.max(y, 5), 95)}%`, 
                  transform: 'translate(-50%, -50%)',
                  zIndex: isSelected ? 20 : hasIssues ? 10 : 5
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAreaClick(area);
                }}
              >
                {/* Pulse effect for areas with issues */}
                {hasIssues && (
                  <motion.div
                    className={`absolute inset-0 rounded-full ${severityColors[area.severity as keyof typeof severityColors]}`}
                    animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                    style={{ width: 24, height: 24, marginLeft: -4, marginTop: -4 }}
                  />
                )}

                {/* Marker */}
                <motion.div
                  whileHover={{ scale: 1.5 }}
                  whileTap={{ scale: 0.9 }}
                  className={`relative w-4 h-4 rounded-full shadow-lg flex items-center justify-center 
                    ring-2 transition-all duration-200
                    ${isSelected 
                      ? 'ring-primary bg-primary w-6 h-6' 
                      : hasIssues 
                        ? `${severityColors[area.severity as keyof typeof severityColors]} ring-white/40`
                        : 'bg-slate-600/50 ring-slate-500/30'
                    }`}
                >
                  {hasIssues && (
                    <span className="text-white text-[8px] font-bold">{area.issues}</span>
                  )}
                </motion.div>

                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-40">
                  <div className="px-3 py-2 bg-background/95 backdrop-blur-sm rounded-lg border border-border shadow-xl whitespace-nowrap">
                    <p className="font-semibold text-sm">{area.name}</p>
                    {hasIssues ? (
                      <p className="text-xs text-muted-foreground">{area.issues} active issues</p>
                    ) : (
                      <p className="text-xs text-muted-foreground">No active issues</p>
                    )}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rotate-45 bg-background border-r border-b border-border" />
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* City center marker */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          >
            <div className="w-3 h-3 rounded-full bg-primary/30 ring-2 ring-primary/50" />
          </motion.div>
        </motion.div>
      </div>

      {/* City Label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-4 left-4 text-white/80 z-20"
      >
        <p className="font-display text-lg font-bold">Greater Bengaluru</p>
        <p className="text-xs flex items-center gap-1 text-white/60">
          <MapPin className="w-3 h-3" />
          Interactive Issue Map
        </p>
      </motion.div>

      {/* Selected hotspot info */}
      {selectedHotspot && selectedHotspot.issues > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-16 left-4 z-30 bg-background/95 backdrop-blur-sm rounded-lg border border-border p-4 shadow-xl max-w-[200px]"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-3 h-3 rounded-full ${severityColors[selectedHotspot.severity]}`} />
            <span className="font-semibold text-sm">{selectedHotspot.name}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {selectedHotspot.issues} active issue{selectedHotspot.issues > 1 ? 's' : ''}
          </p>
          <p className="text-xs text-muted-foreground">
            Primary: {CATEGORY_CONFIG[selectedHotspot.category as keyof typeof CATEGORY_CONFIG]?.label || 'Various'}
          </p>
          <Button 
            size="sm" 
            variant="ghost" 
            className="mt-2 h-7 text-xs"
            onClick={() => setSelectedHotspot(null)}
          >
            <Minus className="w-3 h-3 mr-1" /> Close
          </Button>
        </motion.div>
      )}

      {/* Instructions */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
        <Badge variant="outline" className="bg-background/80 backdrop-blur-sm text-xs">
          Drag to pan • Scroll to zoom • Click markers for details
        </Badge>
      </div>
    </div>
  );
}
